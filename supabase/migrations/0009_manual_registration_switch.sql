-- ============================================================================
-- 0009_manual_registration_switch.sql   A manual override for the window
--
-- The committee needs to reopen registration after the deadline, or shut it
-- early, without editing dates. manual_state does that:
--
--   auto    follow registration_starts_at / registration_ends_at (default)
--   open    accept applications regardless of the dates
--   closed  refuse applications regardless of the dates
--
-- The dates are left untouched by the switch, so the announced period still
-- shows correctly on the site and returning to 'auto' restores it exactly.
-- ============================================================================

begin;

alter table public.program_settings
  add column if not exists manual_state text not null default 'auto';

alter table public.program_settings drop constraint if exists chk_manual_state;
alter table public.program_settings
  add constraint chk_manual_state check (manual_state in ('auto', 'open', 'closed'));

-- Reports the effective state without exposing the table's write side. Used by
-- the public site so the form matches what the database will actually accept.
create or replace function public.registration_state()
returns text
language sql
stable
security definer
set search_path = public
as $fn$
  select case
           when s.manual_state = 'open'   then 'open'
           when s.manual_state = 'closed' then 'closed'
           when now() < s.registration_starts_at then 'before'
           when now() > s.registration_ends_at   then 'closed'
           else 'open'
         end
  from public.program_settings s
  where s.id;
$fn$;

revoke all on function public.registration_state() from public;
grant execute on function public.registration_state() to anon, authenticated;

-- Staff-only switch. SECURITY DEFINER, so membership is checked explicitly.
create or replace function public.set_registration_state(p_state text)
returns text
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not public.is_staff() then
    raise exception 'غير مصرح لك بتغيير حالة التسجيل';
  end if;

  if p_state not in ('auto', 'open', 'closed') then
    raise exception 'حالة غير صالحة: %', p_state;
  end if;

  update public.program_settings
     set manual_state = p_state,
         updated_at   = now()
   where id;

  return public.registration_state();
end;
$fn$;

revoke all on function public.set_registration_state(text) from public;
grant execute on function public.set_registration_state(text) to authenticated;

-- ---------------------------------------------------------------------------
-- submit_registration now gates on the effective state rather than the dates,
-- so the manual switch actually governs what is accepted. Everything below the
-- first check is unchanged from 0005.
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
  v_state text;
  v_from timestamptz;
  v_row public.registrations;
begin
  v_state := public.registration_state();

  if v_state = 'before' then
    select registration_starts_at into v_from from public.program_settings where id;
    raise exception 'لم يُفتح باب التسجيل بعد. يبدأ التسجيل بتاريخ % بتوقيت ليبيا.',
      to_char(v_from at time zone 'Africa/Tripoli', 'YYYY-MM-DD HH24:MI');
  end if;

  if v_state = 'closed' then
    raise exception 'باب التسجيل مغلق حالياً، ولا يُنظر في الطلبات بعد انتهاء مدة التسجيل.';
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
