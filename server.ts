import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { Registration } from './src/types.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Setup Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Setup local data persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial sample data for demonstration
const initialRegistrations: Registration[] = [
  {
    id: 'reg-sample-1',
    serialNumber: 'KHT-1448-001',
    sequenceNumber: 1,
    fullName: 'عبد الرحمن محمد عبد الله السنوسي',
    nationalId: '119940123456',
    phone: '0912345678',
    email: 'abdurrahman.sn@example.com',
    birthDate: '1994-05-12',
    age: 32,
    city: 'طرابلس',
    address: 'حي الأندلس، بالقرب من مسجد القدس',
    educationalLevel: 'بكالوريوس دراسات إسلامية',
    quranMemorization: 'حافظ للقرآن الكريم كاملاً',
    isCurrentlyKhateeb: false,
    hasAttendedPreviousCourses: false,
    fluencyAndSpeechClear: true,
    agreedToBehaviorAndAppearance: true,
    attendanceCommitment: true,
    housingNeeded: false,
    notes: 'طالب علم مجاز بروايتي قالون وحفص وراغب في صقل مهارات الخطابة والإلقاء.',
    status: 'accepted_initial',
    supervisorNotes: 'مستوفٍ للشروط ومجاز في القراءات. تمت الموافقة المبدئية.',
    createdAt: '2026-08-10T10:15:00.000Z',
    updatedAt: '2026-08-11T14:20:00.000Z'
  },
  {
    id: 'reg-sample-2',
    serialNumber: 'KHT-1448-002',
    sequenceNumber: 2,
    fullName: 'أسامة خالد بشير الترهوني',
    nationalId: '120010987654',
    phone: '0925554321',
    email: 'osama.khaled@example.com',
    birthDate: '2001-08-20',
    age: 25,
    city: 'مصراتة',
    address: 'الرويسات، حي السلام',
    educationalLevel: 'طالب جامعي - كلية القانون والشريعة',
    quranMemorization: 'أكثر من 15 جزءاً',
    isCurrentlyKhateeb: false,
    hasAttendedPreviousCourses: false,
    fluencyAndSpeechClear: true,
    agreedToBehaviorAndAppearance: true,
    attendanceCommitment: true,
    housingNeeded: true,
    housingCommitment: true,
    notes: 'أحتاج للسكن الداخلي بالدورة لكوني قادماً من خارج المدينة.',
    status: 'under_review',
    supervisorNotes: 'طلب سكن، قيد التنسيق مع لجنة الإسكان.',
    createdAt: '2026-08-12T16:45:00.000Z',
    updatedAt: '2026-08-12T16:45:00.000Z'
  },
  {
    id: 'reg-sample-3',
    serialNumber: 'KHT-1448-003',
    sequenceNumber: 3,
    fullName: 'عمر المختار عثمان الفيتوري',
    nationalId: '119980654321',
    phone: '0948889900',
    email: 'omar.fitouri@example.com',
    birthDate: '1998-11-03',
    age: 27,
    city: 'الزاوية',
    address: 'الوسط، قرب المنارة العلمية',
    educationalLevel: 'خريج معهد العلوم الشرعية',
    quranMemorization: 'حافظ للقرآن الكريم كاملاً',
    isCurrentlyKhateeb: false,
    hasAttendedPreviousCourses: false,
    fluencyAndSpeechClear: true,
    agreedToBehaviorAndAppearance: true,
    attendanceCommitment: true,
    housingNeeded: true,
    housingCommitment: true,
    notes: 'مهتم بتطوير لغة الجسد وفن الإقناع في الخطبة المنبرية.',
    status: 'accepted_final',
    supervisorNotes: 'تم التحقق من الوثائق وحجز السكن.',
    createdAt: '2026-08-14T09:30:00.000Z',
    updatedAt: '2026-08-15T11:00:00.000Z'
  }
];

function mapToDb(r: Registration) {
  return {
    id: r.id,
    serial_number: r.serialNumber,
    sequence_number: r.sequenceNumber,
    full_name: r.fullName,
    national_id: r.nationalId,
    phone: r.phone,
    email: r.email || null,
    birth_date: r.birthDate,
    age: r.age,
    city: r.city,
    address: r.address,
    educational_level: r.educationalLevel,
    quran_memorization: r.quranMemorization,
    is_currently_khateeb: r.isCurrentlyKhateeb,
    has_attended_previous_courses: r.hasAttendedPreviousCourses,
    fluency_and_speech_clear: r.fluencyAndSpeechClear,
    agreed_to_behavior_and_appearance: r.agreedToBehaviorAndAppearance,
    attendance_commitment: r.attendanceCommitment,
    housing_needed: r.housingNeeded,
    housing_commitment: r.housingCommitment || false,
    notes: r.notes || null,
    status: r.status || 'pending',
    supervisor_notes: r.supervisorNotes || null,
    created_at: r.createdAt,
    updated_at: r.updatedAt
  };
}

function mapFromDb(row: any): Registration {
  return {
    id: row.id,
    serialNumber: row.serial_number,
    sequenceNumber: row.sequence_number,
    fullName: row.full_name,
    nationalId: row.national_id,
    phone: row.phone,
    email: row.email || '',
    birthDate: row.birth_date,
    age: row.age,
    city: row.city,
    address: row.address,
    educationalLevel: row.educational_level,
    quranMemorization: row.quran_memorization,
    isCurrentlyKhateeb: Boolean(row.is_currently_khateeb),
    hasAttendedPreviousCourses: Boolean(row.has_attended_previous_courses),
    fluencyAndSpeechClear: Boolean(row.fluency_and_speech_clear),
    agreedToBehaviorAndAppearance: Boolean(row.agreed_to_behavior_and_appearance),
    attendanceCommitment: Boolean(row.attendance_commitment),
    housingNeeded: Boolean(row.housing_needed),
    housingCommitment: Boolean(row.housing_commitment),
    notes: row.notes || '',
    status: row.status,
    supervisorNotes: row.supervisor_notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Sync from Supabase on startup
async function initSupabaseSync() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('registrations').select('*').order('sequence_number', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map(mapFromDb);
      fs.writeFileSync(DATA_FILE, JSON.stringify(mapped, null, 2), 'utf-8');
      console.log(`[Supabase] Synced ${mapped.length} records to local cache`);
    }
  } catch (err) {
    console.error('[Supabase] Initial sync error:', err);
  }
}

initSupabaseSync();

function getRegistrations(): Registration[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialRegistrations, null, 2), 'utf-8');
      return initialRegistrations;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading registrations file:', err);
    return initialRegistrations;
  }
}

function saveRegistrations(data: Registration[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving registrations file:', err);
  }
}

async function syncRecordToSupabase(record: Registration) {
  if (!supabase) return;
  try {
    await supabase.from('registrations').upsert(mapToDb(record), { onConflict: 'national_id' });
  } catch (err) {
    console.error('[Supabase] Upsert error:', err);
  }
}

async function deleteRecordFromSupabase(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('registrations').delete().or(`id.eq.${id},serial_number.eq.${id}`);
  } catch (err) {
    console.error('[Supabase] Delete error:', err);
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminSecret = process.env.ADMIN_PASSWORD || 'khateeb1448';
  if (password && password.trim() === adminSecret) {
    res.json({ success: true, token: 'admin_authenticated_' + Date.now() });
  } else {
    res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
  }
});

// Get all registrations (with search & filters)
app.get('/api/registrations', (req, res) => {
  const { q, status, housing } = req.query;
  let items = getRegistrations();

  if (status && typeof status === 'string' && status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  if (housing && typeof housing === 'string' && housing !== 'all') {
    items = items.filter((item) => (housing === 'yes' ? item.housingNeeded : !item.housingNeeded));
  }

  if (q && typeof q === 'string' && q.trim()) {
    const query = q.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.fullName.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query) ||
        item.nationalId.includes(query) ||
        item.phone.includes(query) ||
        item.city.toLowerCase().includes(query)
    );
  }

  res.json({ count: items.length, data: items });
});

// Lookup registration for candidate by serial number, national ID, or phone
app.get('/api/registrations/lookup', (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'يرجى إدخال رقم المراجعة أو الرقم الوطني أو رقم الهاتف' });
  }

  const items = getRegistrations();
  const matched = items.filter(
    (item) =>
      item.serialNumber.toLowerCase() === query ||
      item.nationalId === query ||
      item.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
      item.fullName.toLowerCase().includes(query)
  );

  if (matched.length === 0) {
    return res.status(404).json({ error: 'لم يتم العثور على تسجيل مطابق لبيانات البحث' });
  }

  res.json({ data: matched });
});

// Get single registration
app.get('/api/registrations/:id', (req, res) => {
  const items = getRegistrations();
  const found = items.find((item) => item.id === req.params.id || item.serialNumber === req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'سجل غير موجود' });
  }
  res.json({ data: found });
});

// Create new registration
app.post('/api/registrations', (req, res) => {
  try {
    const body = req.body;
    const {
      fullName,
      nationalId,
      phone,
      email,
      birthDate,
      city,
      address,
      educationalLevel,
      quranMemorization,
      isCurrentlyKhateeb,
      hasAttendedPreviousCourses,
      fluencyAndSpeechClear,
      agreedToBehaviorAndAppearance,
      attendanceCommitment,
      housingNeeded,
      housingCommitment,
      notes
    } = body;

    // Basic Validation
    if (!fullName || !nationalId || !phone || !birthDate || !city || !address) {
      return res.status(400).json({ error: 'يرجى تعبئة جميع الحقول الإلزامية' });
    }

    // Strict Conditions validation based on course requirements
    if (isCurrentlyKhateeb === true) {
      return res.status(400).json({
        error: 'عذراً، من شروط القبول ألا يكون المتقدم خطيباً حالياً'
      });
    }

    if (hasAttendedPreviousCourses === true) {
      return res.status(400).json({
        error: 'عذراً، من شروط القبول ألا يكون المتقدم قد شارك في الدورات السابقة'
      });
    }

    // Calculate age
    const bDate = new Date(birthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 18) {
      return res.status(400).json({
        error: 'عذراً، يشترط ألا يقل عمر المتقدم عن 18 سنة'
      });
    }

    if (!fluencyAndSpeechClear || !agreedToBehaviorAndAppearance || !attendanceCommitment) {
      return res.status(400).json({
        error: 'يجب الموافقة والالتزام بجميع شروط وضوابط الدورة المذكورة'
      });
    }

    const items = getRegistrations();

    // Check duplicate nationalId
    const duplicate = items.find((i) => i.nationalId === nationalId.trim());
    if (duplicate) {
      return res.status(409).json({
        error: 'هذا الرقم الوطني مسجل مسبقاً برقم مراجعة: ' + duplicate.serialNumber,
        existing: duplicate
      });
    }

    // Generate serial number
    const maxSequence = items.reduce((max, item) => Math.max(max, item.sequenceNumber || 0), 0);
    const nextSeq = maxSequence + 1;
    const formattedSeq = String(nextSeq).padStart(3, '0');
    const serialNumber = `KHT-1448-${formattedSeq}`;

    const newRecord: Registration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      serialNumber,
      sequenceNumber: nextSeq,
      fullName: fullName.trim(),
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      birthDate,
      age: calculatedAge,
      city: city.trim(),
      address: address.trim(),
      educationalLevel: educationalLevel || 'جامعي',
      quranMemorization: quranMemorization || 'أكثر من 5 أجزاء',
      isCurrentlyKhateeb: Boolean(isCurrentlyKhateeb),
      hasAttendedPreviousCourses: Boolean(hasAttendedPreviousCourses),
      fluencyAndSpeechClear: Boolean(fluencyAndSpeechClear),
      agreedToBehaviorAndAppearance: Boolean(agreedToBehaviorAndAppearance),
      attendanceCommitment: Boolean(attendanceCommitment),
      housingNeeded: Boolean(housingNeeded),
      housingCommitment: housingNeeded ? Boolean(housingCommitment) : false,
      notes: notes?.trim() || '',
      status: 'pending',
      supervisorNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.unshift(newRecord);
    saveRegistrations(items);
    syncRecordToSupabase(newRecord);

    res.status(201).json({
      success: true,
      message: 'تم تسجيلك بنجاح في دورة إعداد وتأهيل الخطباء',
      data: newRecord
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة طلب التسجيل' });
  }
});

// Update registration status / supervisor notes
app.patch('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  const { status, supervisorNotes } = req.body;

  const items = getRegistrations();
  const index = items.findIndex((i) => i.id === id || i.serialNumber === id);

  if (index === -1) {
    return res.status(404).json({ error: 'السجل غير موجود' });
  }

  if (status) items[index].status = status;
  if (supervisorNotes !== undefined) items[index].supervisorNotes = supervisorNotes;
  items[index].updatedAt = new Date().toISOString();

  saveRegistrations(items);
  syncRecordToSupabase(items[index]);
  res.json({ success: true, data: items[index] });
});

// Delete registration
app.delete('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  let items = getRegistrations();
  const initialLen = items.length;
  items = items.filter((i) => i.id !== id && i.serialNumber !== id);

  if (items.length === initialLen) {
    return res.status(404).json({ error: 'السجل غير موجود' });
  }

  saveRegistrations(items);
  deleteRecordFromSupabase(id);
  res.json({ success: true, message: 'تم حذف السجل بنجاح' });
});

// Supervisor Statistics
app.get('/api/admin/stats', (req, res) => {
  const items = getRegistrations();
  const stats = {
    total: items.length,
    acceptedInitial: items.filter((i) => i.status === 'accepted_initial').length,
    acceptedFinal: items.filter((i) => i.status === 'accepted_final').length,
    underReview: items.filter((i) => i.status === 'under_review' || i.status === 'pending').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
    housingRequested: items.filter((i) => i.housingNeeded).length,
    fullQuranMemorizers: items.filter((i) => i.quranMemorization.includes('كاملاً')).length
  };
  res.json(stats);
});

// Supabase SQL Schema endpoint (for easy copy-paste setup in Supabase SQL editor)
app.get('/api/admin/supabase-sql', (req, res) => {
  const sql = `-- كود إنشاء جدول التسجيل لدورة إعداد الخطباء في Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT UNIQUE NOT NULL,
  sequence_number SERIAL,
  full_name TEXT NOT NULL,
  national_id TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  educational_level TEXT NOT NULL,
  quran_memorization TEXT NOT NULL,
  is_currently_khateeb BOOLEAN DEFAULT FALSE,
  has_attended_previous_courses BOOLEAN DEFAULT FALSE,
  fluency_and_speech_clear BOOLEAN DEFAULT TRUE,
  agreed_to_behavior_and_appearance BOOLEAN DEFAULT TRUE,
  attendance_commitment BOOLEAN DEFAULT TRUE,
  housing_needed BOOLEAN DEFAULT FALSE,
  housing_commitment BOOLEAN DEFAULT FALSE,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  supervisor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- سياسات الأمان RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بالتسجيل
CREATE POLICY "Allow public insert" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- السماح بالاستعلام عن التسجيل
CREATE POLICY "Allow public select by serial or phone" ON public.registrations
  FOR SELECT USING (true);
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(sql);
});

// ---------------- VITE & STATIC SERVING ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khateeb Course Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
