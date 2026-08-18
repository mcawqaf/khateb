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

function calculateAge(birthDateString: string): number {
  const birth = new Date(birthDateString);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return isNaN(age) ? 0 : age;
}

export async function submitRegistration(payload: Record<string, unknown>): Promise<Registration> {
  // 1. Direct Supabase Client (Online Live Cloud Sync)
  if (supabase) {
    const birthDate = String(payload.birthDate || '');
    const calculatedAge = calculateAge(birthDate);

    // Check national ID uniqueness
    const { data: existing } = await supabase
      .from('registrations')
      .select('id, serial_number')
      .eq('national_id', String(payload.nationalId))
      .maybeSingle();

    if (existing) {
      throw new Error(`الرقم الوطني مسجل مسبقاً برقم المراجعة (${existing.serial_number}). يرجى استخدام صفحة الاستعلام.`);
    }

    // Count total records to determine sequence number
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    const nextSeq = (count || 0) + 1;
    const serialNumber = `KHT-1448-${String(nextSeq).padStart(3, '0')}`;
    const recordId = `reg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const insertData = {
      id: recordId,
      serial_number: serialNumber,
      sequence_number: nextSeq,
      full_name: payload.fullName,
      national_id: payload.nationalId,
      phone: payload.phone,
      email: payload.email || null,
      birth_date: birthDate,
      age: calculatedAge,
      city: payload.city,
      address: payload.address,
      educational_level: payload.educationalLevel,
      quran_memorization: payload.quranMemorization,
      is_currently_khateeb: payload.isCurrentlyKhateeb,
      has_attended_previous_courses: payload.hasAttendedPreviousCourses,
      fluency_and_speech_clear: payload.fluencyAndSpeechClear,
      agreed_to_behavior_and_appearance: payload.agreedToBehaviorAndAppearance,
      attendance_commitment: payload.attendanceCommitment,
      housing_needed: payload.housingNeeded,
      housing_commitment: payload.housingCommitment,
      notes: payload.notes || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'حدث خطأ أثناء حفظ التسجيل في قاعدة البيانات');
    }

    return mapDbToRegistration(data);
  }

  // 2. Fallback to API endpoint if running with Node server
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
    }
  } catch {}

  throw new Error('تعذر الاتصال بقاعدة البيانات');
}

export async function lookupRegistrations(query: string): Promise<Registration[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // 1. Direct Supabase Query (Online Live)
  if (supabase) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .or(`serial_number.ilike.%${cleanQ}%,national_id.ilike.%${cleanQ}%,phone.ilike.%${cleanQ}%,full_name.ilike.%${cleanQ}%`)
      .limit(10);

    if (error) {
      throw new Error('لم يتم العثور على أي استمارة مطابقة للبيانات المدخلة');
    }

    return (data || []).map(mapDbToRegistration);
  }

  // 2. Fallback to local API
  try {
    const res = await fetch(`/api/registrations/lookup?q=${encodeURIComponent(cleanQ)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
    }
  } catch {}

  return [];
}

export async function fetchRegistrations(params: { q?: string; status?: string; housing?: string }): Promise<Registration[]> {
  // 1. Direct Supabase Query (Online Live)
  if (supabase) {
    let q = supabase.from('registrations').select('*').order('created_at', { ascending: false });

    if (params.q) {
      q = q.or(`full_name.ilike.%${params.q}%,national_id.ilike.%${params.q}%,phone.ilike.%${params.q}%,serial_number.ilike.%${params.q}%,city.ilike.%${params.q}%`);
    }
    if (params.status && params.status !== 'all') {
      q = q.eq('status', params.status);
    }
    if (params.housing === 'yes') {
      q = q.eq('housing_needed', true);
    } else if (params.housing === 'no') {
      q = q.eq('housing_needed', false);
    }

    const { data } = await q;
    return (data || []).map(mapDbToRegistration);
  }

  // 2. Fallback to local API
  try {
    let url = '/api/registrations?';
    if (params.q) url += `q=${encodeURIComponent(params.q)}&`;
    if (params.status && params.status !== 'all') url += `status=${params.status}&`;
    if (params.housing && params.housing !== 'all') url += `housing=${params.housing}&`;

    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {}

  return [];
}

export async function fetchAdminStats(): Promise<AdminStats> {
  // 1. Direct Supabase Query (Online Live)
  if (supabase) {
    const { data } = await supabase.from('registrations').select('*');
    const list = data || [];

    return {
      total: list.length,
      acceptedInitial: list.filter((r) => r.status === 'accepted_initial').length,
      acceptedFinal: list.filter((r) => r.status === 'accepted_final').length,
      underReview: list.filter((r) => r.status === 'under_review' || r.status === 'pending').length,
      rejected: list.filter((r) => r.status === 'rejected').length,
      housingRequested: list.filter((r) => r.housing_needed).length,
      fullQuranMemorizers: list.filter((r) => r.quran_memorization === 'كامل القرآن الكريم (30 جزء)' || r.quran_memorization === 'حافظ للقرآن الكريم كاملاً').length
    };
  }

  // 2. Fallback to local API
  try {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {}

  return {
    total: 0,
    acceptedInitial: 0,
    acceptedFinal: 0,
    underReview: 0,
    rejected: 0,
    housingRequested: 0,
    fullQuranMemorizers: 0
  };
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus, supervisorNotes?: string): Promise<boolean> {
  // 1. Direct Supabase Query (Online Live)
  if (supabase) {
    const { error } = await supabase
      .from('registrations')
      .update({
        status,
        supervisor_notes: supervisorNotes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return !error;
  }

  // 2. Fallback to local API
  try {
    const res = await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, supervisorNotes })
    });
    if (res.ok) return true;
  } catch {}

  return false;
}

export async function deleteRegistrationRecord(id: string): Promise<boolean> {
  // 1. Direct Supabase Query (Online Live)
  if (supabase) {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    return !error;
  }

  // 2. Fallback to local API
  try {
    const res = await fetch(`/api/registrations/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) return true;
  } catch {}

  return false;
}
