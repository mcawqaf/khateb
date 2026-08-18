-- ============================================================================
-- 0006_registration_times.sql       Exact opening and closing times
--
-- Registration opens Wednesday 19 August 2026 at 15:00 and closes at midnight
-- at the end of Friday 21 August — expressed as 22 August 00:00, which is the
-- same instant and unambiguous about which side of Friday it falls on.
--
-- Libya's +02 offset is explicit, so the deadline is a fixed instant rather
-- than something that shifts with the reader's timezone.
-- ============================================================================

begin;

update public.program_settings
   set registration_starts_at = '2026-08-19 15:00:00+02',
       registration_ends_at   = '2026-08-22 00:00:00+02',
       updated_at             = now()
 where id;

do $$
declare v_from timestamptz; v_to timestamptz;
begin
  select registration_starts_at, registration_ends_at into v_from, v_to
  from public.program_settings where id;

  if v_from <> '2026-08-19 15:00:00+02'::timestamptz
     or v_to <> '2026-08-22 00:00:00+02'::timestamptz then
    raise exception 'لم تُضبط مواعيد التسجيل كما هو مطلوب';
  end if;
end $$;

commit;
