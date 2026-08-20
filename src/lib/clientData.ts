import { Registration, RegistrationStatus, AdminStats } from '../types.js';
import { supabase } from './supabase.js';

// Convert DB row to TypeScript Registration model
function mapDbToRegistration(row: Record<string, unknown>): Registration {
  return {
    id: String(row.id),
    serialNumber: String(row.serial_number || ''),
    sequenceNumber: Number(row.sequence_number || 1),
    fullName: String(row.full_name || ''),
    nationalId: String(row.national_id || ''),
    phone: String(row.phone || ''),
    email: row.email ? String(row.email) : undefined,
    birthDate: String(row.birth_date || ''),
    age: Number(row.age || 0),
    city: String(row.city || ''),
    address: String(row.address || ''),
    educationalLevel: String(row.educational_level || ''),
    quranMemorization: String(row.quran_memorization || ''),
    isCurrentlyKhateeb: Boolean(row.is_currently_khateeb),
    hasAttendedPreviousCourses: Boolean(row.has_attended_previous_courses),
    fluencyAndSpeechClear: Boolean(row.fluency_and_speech_clear),
    agreedToBehaviorAndAppearance: Boolean(row.agreed_to_behavior_and_appearance),
    attendanceCommitment: Boolean(row.attendance_commitment),
    housingNeeded: Boolean(row.housing_needed),
    housingCommitment: Boolean(row.housing_commitment),
    notes: row.notes ? String(row.notes) : undefined,
    status: (row.status as RegistrationStatus) || 'pending',
    supervisorNotes: row.supervisor_notes ? String(row.supervisor_notes) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString())
  };
}

function notConfigured(): Error {
  return new Error('لم يتم إعداد الاتصال بقاعدة البيانات');
}

/**
 * Submit a registration.
 *
 * Goes through the submit_registration RPC rather than an INSERT: the anon key
 * has no table privileges. The database assigns the serial number, computes the
 * age, forces status to 'pending' and rejects duplicate national IDs, so none
 * of that can be tampered with from the browser.
 */
export async function submitRegistration(payload: Record<string, unknown>): Promise<Registration> {
  if (!supabase) throw notConfigured();

  const { data, error } = await supabase.rpc('submit_registration', { payload });

  if (error) {
    // Postgres raises our Arabic messages directly; surface them as-is.
    throw new Error(error.message || 'حدث خطأ أثناء حفظ التسجيل في قاعدة البيانات');
  }
  if (!data) {
    throw new Error('حدث خطأ أثناء حفظ التسجيل في قاعدة البيانات');
  }

  return mapDbToRegistration(data as Record<string, unknown>);
}

/**
 * Applicant self-service lookup.
 *
 * Requires national ID *and* phone together. Serial numbers are sequential and
 * therefore guessable, so they are deliberately not accepted as a lone key.
 */
export async function lookupRegistration(nationalId: string, phone: string): Promise<Registration | null> {
  if (!supabase) throw notConfigured();

  const { data, error } = await supabase.rpc('lookup_registration', {
    p_national_id: nationalId.trim(),
    p_phone: phone.trim()
  });

  if (error) {
    throw new Error('تعذر تنفيذ الاستعلام، يرجى المحاولة مرة أخرى');
  }
  if (!data) return null;

  return mapDbToRegistration(data as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Supervisor operations.
//
// These read and write the table directly. They only succeed for a signed-in
// user listed in public.staff — enforced by RLS, not by anything in this file.
// ---------------------------------------------------------------------------

export async function fetchRegistrations(params: { q?: string; status?: string; housing?: string }): Promise<Registration[]> {
  if (!supabase) return [];

  let q = supabase.from('registrations').select('*').order('created_at', { ascending: false });

  if (params.q) {
    const term = params.q.replace(/[,()]/g, ' ').trim();
    if (term) {
      q = q.or(
        `full_name.ilike.%${term}%,national_id.ilike.%${term}%,phone.ilike.%${term}%,serial_number.ilike.%${term}%,city.ilike.%${term}%`
      );
    }
  }
  if (params.status && params.status !== 'all') {
    q = q.eq('status', params.status);
  }
  if (params.housing === 'yes') {
    q = q.eq('housing_needed', true);
  } else if (params.housing === 'no') {
    q = q.eq('housing_needed', false);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  return (data || []).map(mapDbToRegistration);
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    total: 0,
    acceptedInitial: 0,
    acceptedFinal: 0,
    underReview: 0,
    rejected: 0,
    housingRequested: 0,
    fullQuranMemorizers: 0
  };

  if (!supabase) return empty;

  const { data, error } = await supabase.from('registrations').select('*');
  if (error || !data) return empty;

  return {
    total: data.length,
    acceptedInitial: data.filter((r) => r.status === 'accepted_initial').length,
    acceptedFinal: data.filter((r) => r.status === 'accepted_final').length,
    underReview: data.filter((r) => r.status === 'under_review' || r.status === 'pending').length,
    rejected: data.filter((r) => r.status === 'rejected').length,
    housingRequested: data.filter((r) => r.housing_needed).length,
    fullQuranMemorizers: data.filter(
      (r) =>
        r.quran_memorization === 'كامل القرآن الكريم (30 جزء)' ||
        r.quran_memorization === 'حافظ للقرآن الكريم كاملاً'
    ).length
  };
}

/**
 * Update status / supervisor notes.
 *
 * Returns the number of rows actually changed rather than "no error". Under
 * RLS a forbidden update reports success with zero rows touched, so checking
 * only `error` would silently report a save that never happened.
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  supervisorNotes?: string
): Promise<boolean> {
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('registrations')
    .update({
      status,
      supervisor_notes: supervisorNotes || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id');

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

/**
 * Merge two applications into one.
 *
 * The database does the whole thing in one statement pair so a failure cannot
 * leave the pair half-merged, and it refuses outright unless the caller is
 * listed in public.staff.
 */
export async function mergeRegistrations(keepId: string, dropId: string): Promise<Registration> {
  if (!supabase) throw notConfigured();

  const { data, error } = await supabase.rpc('merge_registrations', {
    p_keep: keepId,
    p_drop: dropId
  });

  if (error) throw new Error(error.message || 'تعذر دمج السجلين');
  if (!data) throw new Error('تعذر دمج السجلين');

  return mapDbToRegistration(data as Record<string, unknown>);
}

/** Every record, ignoring the dashboard filters — a duplicate pair could
 *  otherwise be missed because one of the two is filtered out of view. */
export async function fetchAllRegistrations(): Promise<Registration[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('sequence_number', { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(mapDbToRegistration);
}

export async function deleteRegistrationRecord(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}
