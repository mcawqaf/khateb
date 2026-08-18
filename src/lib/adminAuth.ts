import { supabase } from './supabase.js';

// Supervisor authentication.
//
// Sign-in is performed by Supabase Auth against auth.users; no password or
// passcode exists anywhere in this bundle. Being signed in is not sufficient —
// the account must also appear in public.staff, which is what every RLS policy
// on the registrations table checks. The check below is a UX courtesy so an
// unauthorised account gets a clear message instead of an empty dashboard;
// the actual enforcement happens in the database.

export interface StaffIdentity {
  email: string;
}

/** True when the signed-in account is listed in public.staff. */
export async function isStaff(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('is_staff');
  return !error && data === true;
}

/** Returns the signed-in supervisor, or null. */
export async function getStaffIdentity(): Promise<StaffIdentity | null> {
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  const email = data.session?.user?.email;
  if (!email) return null;

  if (!(await isStaff())) return null;
  return { email };
}

export async function signIn(email: string, password: string): Promise<StaffIdentity> {
  if (!supabase) throw new Error('لم يتم إعداد الاتصال بقاعدة البيانات');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error || !data.session) {
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  if (!(await isStaff())) {
    // Authenticated but not authorised: end the session immediately so the
    // token cannot be reused against any other table.
    await supabase.auth.signOut();
    throw new Error('هذا الحساب غير مُصرَّح له بالدخول إلى لوحة التحكم');
  }

  return { email: data.session.user.email || email.trim() };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
