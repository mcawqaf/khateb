-- ============================================================================
-- 0001_add_rpcs_and_staff.sql        STEP 1 of 2 — ADDITIVE, SAFE TO RUN NOW
--
-- This migration only ADDS things. The existing permissive policies stay in
-- place, so the currently deployed site keeps working while you run it.
-- Migration 0002 does the actual lockdown, and must run only AFTER the new
-- frontend is deployed.
--
-- What this adds:
--   * a staff registry, so being signed in is NOT enough — a user must be
--     explicitly listed to touch registration data
--   * submit_registration() so applicants never need table access
--   * lookup_registration() requiring national ID + phone together
--   * serial numbers issued atomically from a sequence
--   * eligibility rules enforced as CHECK constraints
--
-- RUN IN: Supabase Dashboard -> SQL Editor.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Staff registry
--
-- Policies below check membership in this table, not merely "is authenticated".
-- That matters: if signups are ever open on the project, a self-registered
-- account still gets nothing.
-- ---------------------------------------------------------------------------

create table if not exists public.staff (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

drop policy if exists "staff read own row" on public.staff;
create policy "staff read own row" on public.staff
  for select to authenticated using (user_id = auth.uid());

grant select on public.staff to authenticated;

-- SECURITY DEFINER so the check itself is not subject to staff-table RLS,
-- which would otherwise recurse.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (select 1 from public.staff s where s.user_id = auth.uid());
$fn$;

grant execute on function public.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Serial numbers from a sequence, seeded past whatever already exists
-- ---------------------------------------------------------------------------

create sequence if not exists public.registration_serial_seq;

select setval(
  'public.registration_serial_seq',
  coalesce((select max(sequence_number) from public.registrations), 0) + 1,
  false
);

-- ---------------------------------------------------------------------------
-- 3. Eligibility + integrity enforced by the database
--
-- NOT VALID applies these to new rows without rejecting rows already stored.
-- After confirming existing data is clean:
--   alter table public.registrations validate constraint chk_eligibility;
-- ---------------------------------------------------------------------------

alter table public.registrations drop constraint if exists chk_status;
alter table public.registrations
  add constraint chk_status check (
    status in ('pending','under_review','accepted_initial','accepted_final','rejected')
  ) not valid;

alter table public.registrations drop constraint if exists chk_eligibility;
alter table public.registrations
  add constraint chk_eligibility check (
    is_currently_khateeb = false
    and has_attended_previous_courses = false
    and fluency_and_speech_clear
    and agreed_to_behavior_and_appearance
    and attendance_commitment
    and age >= 18
  ) not valid;

create index if not exists idx_registrations_phone  on public.registrations (phone);
create index if not exists idx_registrations_status on public.registrations (status);

-- One person, one application. The original schema declares national_id UNIQUE,
-- but only the live database knows whether that survived; this makes it certain.
create unique index if not exists idx_registrations_national_id
  on public.registrations (national_id);

-- ---------------------------------------------------------------------------
-- 3c. The national ID must agree with the birth date
--
-- A Libyan national ID is 12 digits: the first encodes gender (1 or 2) and
-- digits 2-5 are the year of birth. Verified against every record currently in
-- the project's seed data:
--   119940123456 -> 1994, born 1994-05-12
--   120010987654 -> 2001, born 2001-08-20
--   119980654321 -> 1998, born 1998-11-03
--
-- A mismatch means one of the two fields was mistyped, so the applicant is told
-- which year each field claims rather than just "invalid input".
-- ---------------------------------------------------------------------------

create or replace function public.national_id_birth_year(p_national_id text)
returns text
language sql
immutable
as $fn$
  select case
           when trim(p_national_id) ~ '^[12][0-9]{11}$'
           then substring(trim(p_national_id) from 2 for 4)
         end;
$fn$;

grant execute on function public.national_id_birth_year(text) to anon, authenticated;

alter table public.registrations drop constraint if exists chk_national_id_format;
alter table public.registrations
  add constraint chk_national_id_format check (
    national_id ~ '^[12][0-9]{11}$'
  ) not valid;

alter table public.registrations drop constraint if exists chk_national_id_birth_year;
alter table public.registrations
  add constraint chk_national_id_birth_year check (
    public.national_id_birth_year(national_id) = to_char(birth_date, 'YYYY')
  ) not valid;

-- ---------------------------------------------------------------------------
-- 3b. Make sure the id column can fill itself in
--
-- The old browser code generated ids like 'reg-1755...-x7k2p' and sent them
-- with every insert, so the column may well have no default. The RPC no longer
-- sends one. This gives it a default matching whatever type it actually is,
-- instead of guessing which of uuid/text is live.
-- ---------------------------------------------------------------------------

do $$
declare
  v_type        text;
  v_has_default boolean;
begin
  select data_type, column_default is not null
    into v_type, v_has_default
  from information_schema.columns
  where table_schema = 'public'
    and table_name   = 'registrations'
    and column_name  = 'id';

  if v_type is null then
    raise exception 'public.registrations.id not found — check the table name';
  end if;

  if not v_has_default then
    if v_type = 'uuid' then
      alter table public.registrations alter column id set default gen_random_uuid();
    else
      alter table public.registrations alter column id set default ('reg-' || gen_random_uuid()::text);
    end if;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Registration RPC
--
-- SECURITY DEFINER, so applicants need no table privileges at all. Status and
-- supervisor notes are set here, never taken from the client.
-- ---------------------------------------------------------------------------

create or replace function public.submit_registration(payload jsonb)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_seq bigint;
  v_nid text := nullif(trim(payload->>'nationalId'), '');
  v_dob date := (payload->>'birthDate')::date;
  v_nid_year text;
  v_row public.registrations;
begin
  if v_nid is null or nullif(trim(payload->>'fullName'), '') is null then
    raise exception 'يرجى تعبئة جميع الحقول الإلزامية';
  end if;

  if v_dob is null then
    raise exception 'يرجى إدخال تاريخ الميلاد';
  end if;

  -- Shape first, so the year comparison below has something meaningful to read.
  if v_nid !~ '^[12][0-9]{11}$' then
    raise exception 'الرقم الوطني غير صحيح: يجب أن يتكون من 12 رقماً ويبدأ بالرقم 1 أو 2. المُدخل يحتوي % خانة.',
      length(v_nid);
  end if;

  v_nid_year := public.national_id_birth_year(v_nid);

  if v_nid_year <> to_char(v_dob, 'YYYY') then
    raise exception 'خطأ في التسجيل: الرقم الوطني لا يطابق تاريخ الميلاد. الرقم الوطني يشير إلى سنة ميلاد %، بينما تاريخ الميلاد المُدخل هو % (سنة %). يرجى مراجعة الحقلين وتصحيح الخطأ.',
      v_nid_year, to_char(v_dob, 'YYYY-MM-DD'), to_char(v_dob, 'YYYY');
  end if;

  if exists (select 1 from public.registrations where national_id = v_nid) then
    raise exception 'الرقم الوطني مسجل مسبقاً. يرجى استخدام صفحة الاستعلام.'
      using errcode = 'unique_violation';
  end if;

  v_seq := nextval('public.registration_serial_seq');

  insert into public.registrations (
    serial_number, sequence_number, full_name, national_id, phone, email,
    birth_date, age, city, address, educational_level, quran_memorization,
    is_currently_khateeb, has_attended_previous_courses, fluency_and_speech_clear,
    agreed_to_behavior_and_appearance, attendance_commitment,
    housing_needed, housing_commitment, notes, status, created_at, updated_at
  ) values (
    'KHT-1448-' || lpad(v_seq::text, 3, '0'),
    v_seq,
    trim(payload->>'fullName'),
    v_nid,
    trim(payload->>'phone'),
    nullif(trim(coalesce(payload->>'email', '')), ''),
    v_dob,
    date_part('year', age(v_dob))::int,   -- age computed here, not in the browser
    trim(payload->>'city'),
    trim(payload->>'address'),
    payload->>'educationalLevel',
    payload->>'quranMemorization',
    coalesce((payload->>'isCurrentlyKhateeb')::boolean, false),
    coalesce((payload->>'hasAttendedPreviousCourses')::boolean, false),
    coalesce((payload->>'fluencyAndSpeechClear')::boolean, false),
    coalesce((payload->>'agreedToBehaviorAndAppearance')::boolean, false),
    coalesce((payload->>'attendanceCommitment')::boolean, false),
    coalesce((payload->>'housingNeeded')::boolean, false),
    coalesce((payload->>'housingCommitment')::boolean, false),
    nullif(trim(coalesce(payload->>'notes', '')), ''),
    'pending',
    now(), now()
  )
  returning * into v_row;

  return v_row;
end;
$fn$;

-- ---------------------------------------------------------------------------
-- 5. Applicant lookup RPC — national ID AND phone together
--
-- Serials run KHT-1448-001..NNN and are trivially enumerable, so a serial
-- alone must never unlock a full record. Two values the applicant knows keeps
-- their printable card reachable without opening the register to everyone.
-- ---------------------------------------------------------------------------

create or replace function public.lookup_registration(p_national_id text, p_phone text)
returns public.registrations
language sql
stable
security definer
set search_path = public
as $fn$
  select *
  from public.registrations
  where national_id = trim(p_national_id)
    and regexp_replace(phone, '\s', '', 'g') = regexp_replace(trim(p_phone), '\s', '', 'g')
  limit 1;
$fn$;

-- ---------------------------------------------------------------------------
-- 6. Grants + staff policies
-- ---------------------------------------------------------------------------

revoke all on function public.submit_registration(jsonb)      from public;
revoke all on function public.lookup_registration(text, text) from public;
grant execute on function public.submit_registration(jsonb)      to anon, authenticated;
grant execute on function public.lookup_registration(text, text) to anon, authenticated;

alter table public.registrations enable row level security;
grant select, insert, update, delete on public.registrations to authenticated;

drop policy if exists "staff read all" on public.registrations;
create policy "staff read all" on public.registrations
  for select to authenticated using (public.is_staff());

drop policy if exists "staff update" on public.registrations;
create policy "staff update" on public.registrations
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff delete" on public.registrations;
create policy "staff delete" on public.registrations
  for delete to authenticated using (public.is_staff());

commit;
