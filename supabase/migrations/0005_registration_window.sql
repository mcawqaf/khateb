-- ============================================================================
-- 0005_registration_window.sql      Refuse applications outside the window
--
-- The announcement states that applications are not considered after the
-- registration period ends, but nothing enforced it: the form accepted
-- submissions at any time, before the window opened and after it closed.
--
-- The bounds live in a settings row rather than inside the function, because
-- deadlines get extended. Moving one is an UPDATE, not a migration and deploy:
--
--   update public.program_settings
--      set registration_ends_at = '2026-08-23 23:59:59+02';
--
-- Times are stored with Libya's +02 offset so the window means the same thing
-- regardless of where the applicant or the server is.
-- ============================================================================

begin;

create table if not exists public.program_settings (
  id                      boolean primary key default true,
  registration_starts_at  timestamptz not null,
  registration_ends_at    timestamptz not null,
  updated_at              timestamptz not null default now(),
  constraint program_settings_single_row check (id),
  constraint program_settings_order check (registration_ends_at > registration_starts_at)
);

insert into public.program_settings (id, registration_starts_at, registration_ends_at)
values (true, '2026-08-19 00:00:00+02', '2026-08-21 23:59:59+02')
on conflict (id) do nothing;

alter table public.program_settings enable row level security;

-- Anyone may read the window, so the site can show the right message.
drop policy if exists "anyone reads settings" on public.program_settings;
create policy "anyone reads settings" on public.program_settings
  for select to anon, authenticated using (true);

drop policy if exists "staff updates settings" on public.program_settings;
create policy "staff updates settings" on public.program_settings
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

grant select on public.program_settings to anon, authenticated;
grant update on public.program_settings to authenticated;

-- ---------------------------------------------------------------------------
-- Gate the RPC on the window.
--
-- Only the two checks below are new; the rest of the body is unchanged from
-- 0004 and is repeated because CREATE OR REPLACE FUNCTION needs the whole body.
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
  v_age int;
  v_from timestamptz;
  v_to   timestamptz;
  v_row public.registrations;
begin
  select registration_starts_at, registration_ends_at
    into v_from, v_to
  from public.program_settings
  where id;

  if v_from is not null and now() < v_from then
    raise exception 'لم يُفتح باب التسجيل بعد. يبدأ التسجيل بتاريخ % بتوقيت ليبيا.',
      to_char(v_from at time zone 'Africa/Tripoli', 'YYYY-MM-DD HH24:MI');
  end if;

  if v_to is not null and now() > v_to then
    raise exception 'أُغلق باب التسجيل بتاريخ %، ولا يُنظر في الطلبات بعد انتهاء مدة التسجيل.',
      to_char(v_to at time zone 'Africa/Tripoli', 'YYYY-MM-DD HH24:MI');
  end if;

  if v_nid is null or nullif(trim(payload->>'fullName'), '') is null then
    raise exception 'يرجى تعبئة جميع الحقول الإلزامية';
  end if;

  if v_dob is null then
    raise exception 'يرجى إدخال تاريخ الميلاد';
  end if;

  if v_nid !~ '^[12][0-9]{11}$' then
    raise exception 'الرقم الوطني غير صحيح: يجب أن يتكون من 12 رقماً ويبدأ بالرقم 1 أو 2. المُدخل يحتوي % خانة.',
      length(v_nid);
  end if;

  v_nid_year := public.national_id_birth_year(v_nid);

  if v_nid_year <> to_char(v_dob, 'YYYY') then
    raise exception 'خطأ في التسجيل: الرقم الوطني لا يطابق تاريخ الميلاد. الرقم الوطني يشير إلى سنة ميلاد %، بينما تاريخ الميلاد المُدخل هو % (سنة %). يرجى مراجعة الحقلين وتصحيح الخطأ.',
      v_nid_year, to_char(v_dob, 'YYYY-MM-DD'), to_char(v_dob, 'YYYY');
  end if;

  v_age := date_part('year', age(v_dob))::int;

  if v_age < 18 or v_age > 30 then
    raise exception 'خطأ في التسجيل: يشترط ألا يقل عمر المتقدم عن 18 سنة وألا يزيد على 30 سنة. العمر المحسوب من تاريخ الميلاد هو % سنة.',
      v_age;
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
    v_age,
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

commit;
