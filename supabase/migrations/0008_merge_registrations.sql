-- ============================================================================
-- 0008_merge_registrations.sql       Let a supervisor merge two applications
--
-- Two people sharing a phone, or one person applying twice, leaves the
-- committee with duplicates to resolve. Deleting one loses whatever it held
-- that the other lacked, so this merges instead: the kept record is filled in
-- from the dropped one wherever it was empty, and the dropped one's identity is
-- written into the supervisor notes before it goes.
--
-- SECURITY DEFINER bypasses RLS, so staff membership is checked explicitly
-- inside the function. Without that check any holder of the anon key could
-- call it.
-- ============================================================================

begin;

create or replace function public.merge_registrations(p_keep text, p_drop text)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_keep public.registrations;
  v_drop public.registrations;
  v_note text;
begin
  if not public.is_staff() then
    raise exception 'غير مصرح لك بدمج السجلات';
  end if;

  if p_keep is null or p_drop is null or p_keep = p_drop then
    raise exception 'يجب اختيار سجلين مختلفين للدمج';
  end if;

  select * into v_keep from public.registrations where id = p_keep;
  select * into v_drop from public.registrations where id = p_drop;

  if v_keep.id is null then
    raise exception 'السجل المراد الإبقاء عليه غير موجود';
  end if;
  if v_drop.id is null then
    raise exception 'السجل المراد دمجه غير موجود';
  end if;

  -- An audit line, because the merge deletes a row and the committee may need
  -- to answer for it later.
  v_note := 'دُمج معه السجل ' || v_drop.serial_number ||
            ' (الرقم الوطني: ' || v_drop.national_id ||
            ' — الهاتف: ' || v_drop.phone ||
            ' — الاسم: ' || v_drop.full_name ||
            ') بتاريخ ' || to_char(now() at time zone 'Africa/Tripoli', 'YYYY-MM-DD HH24:MI');

  update public.registrations set
    -- Take the dropped record's value only where the kept one has none.
    email             = coalesce(nullif(btrim(coalesce(v_keep.email, '')), ''), v_drop.email),
    address           = coalesce(nullif(btrim(coalesce(v_keep.address, '')), ''), v_drop.address),
    city              = coalesce(nullif(btrim(coalesce(v_keep.city, '')), ''), v_drop.city),
    educational_level = coalesce(nullif(btrim(coalesce(v_keep.educational_level, '')), ''), v_drop.educational_level),
    quran_memorization= coalesce(nullif(btrim(coalesce(v_keep.quran_memorization, '')), ''), v_drop.quran_memorization),
    notes             = coalesce(nullif(btrim(coalesce(v_keep.notes, '')), ''), v_drop.notes),

    -- Needing housing anywhere means housing is needed.
    housing_needed     = v_keep.housing_needed or v_drop.housing_needed,
    housing_commitment = v_keep.housing_commitment or v_drop.housing_commitment,

    supervisor_notes = btrim(
      coalesce(nullif(btrim(coalesce(v_keep.supervisor_notes, '')), '') || E'\n', '') ||
      coalesce(nullif(btrim(coalesce(v_drop.supervisor_notes, '')), '') || E'\n', '') ||
      v_note
    ),

    updated_at = now()
  where id = p_keep;

  delete from public.registrations where id = p_drop;

  select * into v_keep from public.registrations where id = p_keep;
  return v_keep;
end;
$fn$;

revoke all on function public.merge_registrations(text, text) from public;
grant execute on function public.merge_registrations(text, text) to authenticated;

commit;
