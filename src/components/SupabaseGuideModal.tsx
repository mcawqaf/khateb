import React from 'react';
import { Database, Copy, Check, X, Code, Sparkles } from 'lucide-react';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- كود إنشاء جدول التسجيل لدورة إعداد الخطباء في Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT UNIQUE NOT NULL, -- رقم المراجعة المتسلسل مثل KHT-1448-001
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
  status TEXT DEFAULT 'pending', -- pending, accepted_initial, accepted_final, rejected, under_review
  supervisor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل سياسات الأمان Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 1. السماح للزوار بتقديم طلب التسجيل
CREATE POLICY "Allow public insert to registrations" 
  ON public.registrations 
  FOR INSERT 
  WITH CHECK (true);

-- 2. السماح للزوار بالاستعلام عن استمارتهم
CREATE POLICY "Allow public select on registrations" 
  ON public.registrations 
  FOR SELECT 
  USING (true);

-- 3. السماح للمشرفين بتحديث حالة التسجيل والملاحظات
CREATE POLICY "Allow authenticated supervisor update" 
  ON public.registrations 
  FOR UPDATE 
  USING (true);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="supabase-guide-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="supabase-guide-container"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-[#d4af37]/40 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#1a4d2e] text-white p-6 flex items-center justify-between border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1a4d2e] flex items-center justify-center border border-[#d4af37]">
              <Database className="w-5 h-5 text-[#1a4d2e]" />
            </div>
            <div>
              <h3 className="font-cairo text-lg font-bold text-white flex items-center gap-2">
                <span>مخطط جدول التسجيل في Supabase (SQL Schema)</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-[#d4af37] border border-white/20">
                  جاهز للنسخ
                </span>
              </h3>
              <p className="text-xs text-white/80 font-tajawal">
                يمكنك نسخ هذا الكود ولصقه مباشرة في Supabase SQL Editor لإنشاء الجدول وسياسات الأمان
              </p>
            </div>
          </div>
          <button
            id="close-supabase-guide-btn"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-[#f4f1ea]/30">
          <div className="p-4 bg-[#e8e4d9]/70 border border-[#d4af37]/40 rounded-2xl text-[#2d3436] text-xs sm:text-sm font-tajawal leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#1a4d2e] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1a4d2e]">تكامل مرن مع Supabase:</strong> يقوم هذا النظام بتخزين البيانات تلقائياً وتوليد الأرقام المتسلسلة فورياً (<code className="font-mono bg-white text-[#1a4d2e] px-1.5 py-0.5 rounded-md border border-stone-300">KHT-1448-001</code>). وفي حال رغبت بربط مشروعك السحابي في Supabase، كل ما عليك هو نسخ الكود بالأسفل إلى لوحة Supabase وتعيين مفاتيح البيئة.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#2d3436] font-cairo flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#1a4d2e]" />
                <span>أمر إنشاء الجدول (SQL Schema):</span>
              </div>
              <button
                id="copy-supabase-sql-btn"
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-[#1a4d2e] hover:bg-[#153e25] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs border border-[#d4af37]/30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                <span>{copied ? 'تم النسخ للحافظة' : 'نسخ كود SQL'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-[#1a4d2e] text-[#d4af37] rounded-2xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed dir-ltr text-left border border-stone-800">
                {sqlCode}
              </pre>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs text-stone-600 font-tajawal">
            <div className="font-bold text-[#1a4d2e]">خطوات تشغيل الجدول في Supabase:</div>
            <ol className="list-decimal list-inside space-y-1 pr-2">
              <li>افتح مشروعك في لوحة تحكم <span className="font-mono font-bold text-[#1a4d2e]">Supabase.com</span>.</li>
              <li>توجه إلى تبويب <span className="font-bold text-[#2d3436]">SQL Editor</span>.</li>
              <li>ألصق الكود أعلاه واضغط على زر <span className="font-bold text-[#1a4d2e]">Run</span>.</li>
              <li>ستتم إضافة جدول <span className="font-mono text-[#1a4d2e]">registrations</span> مع مفاتيح التسلسل وسياسات RLS تلقائياً.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#e8e4d9]/50 px-6 py-4 border-t border-stone-200 flex justify-between items-center">
          <span className="text-xs text-stone-600 font-tajawal">
            المتغيرات المدعومة: SUPABASE_URL و SUPABASE_ANON_KEY
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
