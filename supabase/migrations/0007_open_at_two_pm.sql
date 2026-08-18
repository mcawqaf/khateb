-- ============================================================================
-- 0007_open_at_two_pm.sql       Move the opening to 14:00
--
-- Registration opens Wednesday 19 August 2026 at 14:00 instead of 15:00.
-- The closing instant is unchanged: midnight ending Friday the 21st.
-- ============================================================================

begin;

update public.program_settings
   set registration_starts_at = '2026-08-19 14:00:00+02',
       updated_at             = now()
 where id;

do $$
declare v_from timestamptz; v_to timestamptz;
begin
  select registration_starts_at, registration_ends_at into v_from, v_to
  from public.program_settings where id;

  if v_from <> '2026-08-19 14:00:00+02'::timestamptz then
    raise exception 'لم يُضبط موعد الفتح على الساعة 14:00';
  end if;

  if v_to <> '2026-08-22 00:00:00+02'::timestamptz then
    raise exception 'تغيّر موعد الإغلاق عن المتوقع';
  end if;
end $$;

commit;
