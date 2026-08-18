-- ============================================================================
-- 0001_lock_down_registrations.sql
--
-- Fixes four issues in the current schema:
--   1. RLS "SELECT USING (true)" exposes every applicant's national ID,
--      phone, birth date and home address to anyone with the anon key.
--   2. Serial numbers are generated in the browser from COUNT(*)+1, which
--      collides after any delete and under concurrent submissions.
--   3. Eligibility rules are enforced only in React, so a direct anon-key
--      insert bypasses every course condition.
--   4. No UPDATE/DELETE policies exist, so supervisor status changes fail
--      silently (PostgREST returns no error and zero rows).
--
-- After this migration the anon key can do exactly two things, both through
-- SECURITY DEFINER functions: submit one registration, and look up its own
-- record given national ID + phone together. Direct table access is staff only.
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> paste -> Run.
--
-- BEFORE RUNNING, verify one thing: the SQL shipped in server.ts declares
-- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, but clientData.ts inserts
-- a string id like 'reg-1755...-x7k2p'. Those cannot both be true. Check the
-- live column type; if it is UUID, registration inserts are already failing
-- in production today.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Integrity + eligibility, enforced by the database
-- ---------------------------------------------------------------------------

-- NOT VALID applies the rule to new rows without rejecting existing ones.
-- Once you have confirmed the current table is clean, promote it with:
--   alter table public.registrations validate constraint chk_eligibility;

alter table public.registrations
  drop constraint if exists chk_status;
alter table public.registrations
  add constraint chk_status check (
    status in ('pending','under_review','accepted_initial','accepted_final','rejected')
  ) not valid;

alter table public.registrations
  drop constraint if exists chk_eligibility;
alter table public.registrations
  add constraint chk_eligibility check (
    is_currently_khateeb = false
    and has_attended_previous_courses = false
    and fluency_and_speech_clear
    and agreed_to_behavior_and_appearance
    and attendance_commitment
    and age >= 18
    and (housing_needed = false or housing_commitment)
  ) not valid;

create index if not exists idx_registrations_national_id on public.registrations (national_id);
create index if not exists idx_registrations_phone       on public.registrations (phone);
create index if not exists idx_registrations_status      on public.registrations (status);

-- ---------------------------------------------------------------------------
-- 2. Registration: one RPC, serial issued atomically from the sequence
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
  v_row public.registrations;
begin
  if v_nid is null or nullif(trim(payload->>'fullName'), '') is null then
    raise exception 'يرجى تعبئة جميع الحقول الإلزامية';
  end if;

  if exists (select 1 from public.registrations where national_id = v_nid) then
    raise exception 'الرقم الوطني مسجل مسبقاً. يرجى استخدام صفحة الاستعلام.'
      using errcode = 'unique_violation';
  end if;

  v_seq := nextval('public.registrations_sequence_number_seq');

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
    'pending',   -- status and supervisor_notes are never client-controlled
    now(), now()
  )
  returning * into v_row;

  return v_row;
end;
$fn$;

-- ---------------------------------------------------------------------------
-- 3. Applicant lookup: national ID AND phone together
--
-- Serial numbers run KHT-1448-001..NNN, so a serial alone is trivially
-- enumerable and must never unlock a full record on its own. Requiring two
-- values the applicant knows keeps the printable card available to them
-- without opening the register to everyone.
-- ---------------------------------------------------------------------------

create or replace function public.lookup_registration(p_national_id text, p_phone text)
returns public.registrations
language sql
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
-- 4. RLS: staff only on the table itself
-- ---------------------------------------------------------------------------

alter table public.registrations enable row level security;

drop policy if exists "Allow public insert"                    on public.registrations;
drop policy if exists "Allow public select by serial or phone" on public.registrations;
drop policy if exists "staff read all"                         on public.registrations;
drop policy if exists "staff update"                           on public.registrations;
drop policy if exists "staff delete"                           on public.registrations;

create policy "staff read all" on public.registrations
  for select to authenticated using (true);

create policy "staff update" on public.registrations
  for update to authenticated using (true) with check (true);

create policy "staff delete" on public.registrations
  for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------

revoke all on public.registrations from anon;
grant select, insert, update, delete on public.registrations to authenticated;

revoke all on function public.submit_registration(jsonb)      from public;
revoke all on function public.lookup_registration(text, text) from public;
grant execute on function public.submit_registration(jsonb)      to anon, authenticated;
grant execute on function public.lookup_registration(text, text) to anon, authenticated;

commit;
