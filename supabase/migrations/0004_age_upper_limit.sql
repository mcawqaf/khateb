-- ============================================================================
-- 0004_age_upper_limit.sql          Enforce the 18-30 age range
--
-- The published conditions cap the applicant's age at 30, but nothing enforced
-- it: the constraint only tested age >= 18 and the RPC did not test age at all,
-- so an applicant of any age above 18 was accepted.
--
-- Adds the ceiling to the constraint and gives submit_registration an explicit
-- check, so the applicant is told their computed age rather than receiving a
-- raw constraint violation.
-- ============================================================================

begin;

alter table public.registrations drop constraint if exists chk_eligibility;
alter table public.registrations
  add constraint chk_eligibility check (
    is_currently_khateeb = false
    and has_attended_previous_courses = false
    and fluency_and_speech_clear
    and agreed_to_behavior_and_appearance
    and attendance_commitment
    and age between 18 and 30
  ) not valid;

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
  v_row public.registrations;
begin
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
