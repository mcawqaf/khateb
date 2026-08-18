-- ============================================================================
-- 0002_bootstrap_staff.sql          Grant the first supervisor access
--
-- Adds the account created in the Supabase dashboard to public.staff, which is
-- what every RLS policy on registrations checks. Being able to sign in is not
-- enough on its own; without a row here the dashboard shows nothing.
--
-- The block asserts its own outcome: if the account does not exist, or the row
-- fails to land, the migration raises and nothing is committed. A successful
-- run is therefore proof the supervisor can now sign in.
--
-- To add more supervisors later, create the account in the dashboard and run
-- the same insert with their address.
-- ============================================================================

begin;

do $$
declare
  v_email     text := 'admin@khateb.com';
  v_uid       uuid;
  v_confirmed timestamptz;
begin
  select id, email_confirmed_at
    into v_uid, v_confirmed
  from auth.users
  where lower(email) = lower(v_email);

  if v_uid is null then
    raise exception
      'لا يوجد مستخدم بالبريد % في auth.users. أنشئه أولاً من Authentication > Users مع تفعيل Auto Confirm، ثم أعد تشغيل هذا الترحيل.',
      v_email;
  end if;

  insert into public.staff (user_id, full_name)
  values (v_uid, 'مشرف البرنامج')
  on conflict (user_id) do nothing;

  -- khateb.com is unlikely to receive mail, so a confirmation link would never
  -- arrive and the account could never sign in. Confirm it here instead.
  if v_confirmed is null then
    update auth.users set email_confirmed_at = now() where id = v_uid;
    raise notice 'تم تأكيد البريد % تلقائياً', v_email;
  end if;

  -- Assert the end state rather than assume it.
  if not exists (select 1 from public.staff where user_id = v_uid) then
    raise exception 'تعذر إضافة % إلى جدول المشرفين', v_email;
  end if;

  if not exists (
    select 1 from auth.users
    where id = v_uid and email_confirmed_at is not null
  ) then
    raise exception 'البريد % ما زال غير مؤكد، ولن يتمكن الحساب من الدخول', v_email;
  end if;
end $$;

commit;
