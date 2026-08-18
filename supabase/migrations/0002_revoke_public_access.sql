-- ============================================================================
-- 0002_revoke_public_access.sql        STEP 2 of 2 — THE LOCKDOWN
--
-- ⚠ RUN THIS ONLY AFTER THE NEW FRONTEND IS DEPLOYED AND VERIFIED.
--
-- Until now the anon key could read every applicant's national ID, phone,
-- birth date and home address. This removes that. Afterwards the anon key can
-- do exactly two things, both through the SECURITY DEFINER functions added in
-- 0001: submit one registration, and look up a record given national ID and
-- phone together. It gets no table access whatsoever.
--
-- The old deployed site WILL stop working the moment this runs, because it
-- talks to the table directly. That is the intended effect.
--
-- RUN IN: Supabase Dashboard -> SQL Editor.
-- ============================================================================

begin;

-- The two wide-open policies shipped with the original schema.
drop policy if exists "Allow public insert"                    on public.registrations;
drop policy if exists "Allow public select by serial or phone" on public.registrations;

-- Anything else left over from earlier experiments.
drop policy if exists "Enable read access for all users"   on public.registrations;
drop policy if exists "Enable insert for all users"        on public.registrations;

revoke all on public.registrations from anon;
revoke all on public.staff         from anon;
revoke all on sequence public.registration_serial_seq from anon;

commit;

-- ---------------------------------------------------------------------------
-- Verify: this should list ONLY the three staff policies.
--
--   select policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public' and tablename = 'registrations';
--
-- And this should return no rows for anon:
--
--   select grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_name = 'registrations' and grantee = 'anon';
-- ---------------------------------------------------------------------------
