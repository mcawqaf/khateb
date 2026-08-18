import React from 'react';
import { Printer, Copy, Check, X, ShieldCheck, Calendar, MapPin, Sparkles, BookOpen, AlertCircle, Phone, IdCard, User, QrCode } from 'lucide-react';
import { Registration } from '../types.js';
import { formatArabicDateTime } from '../lib/supabase.js';

interface RegistrationCardModalProps {
  registration: Registration | null;
  onClose: () => void;
}

export const RegistrationCardModal: React.FC<RegistrationCardModalProps> = ({
  registration,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!registration) return null;

  const handleCopySerial = () => {
    navigator.clipboard.writeText(registration.serialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="registration-card-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="registration-card-container"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#d4af37]/40 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none"
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print bg-[#1a4d2e] text-white px-6 py-3.5 flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#d4af37]">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>بطاقة المراجعة والاستمارة الإلكترونية المعتمدة</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-modal-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#d4af37] border border-[#d4af37]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة (Print)</span>
            </button>
            <button
              id="close-card-modal-btn"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div id="printable-review-card" className="p-6 sm:p-8 bg-[#f4f1ea]/30 text-[#2d3436] print:p-6">
          
          {/* Header of the Official Certificate/Receipt */}
          <div className="border-b-2 border-[#1a4d2e]/30 pb-5 mb-6 text-center space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-right text-xs font-bold text-stone-600 font-tajawal">
                <div>إدارة الشؤون الثقافية والدعوية</div>
                <div>لجنة دورات إعداد وتأهيل الخطباء</div>
                <div className="text-[#1a4d2e] font-mono font-bold">النسخة الخامسة - 1448هـ</div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#1a4d2e] text-[#d4af37] flex items-center justify-center font-bold shadow-sm border border-[#d4af37]">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="text-left text-xs font-bold text-stone-600 font-tajawal">
                <div>تاريخ التسجيل:</div>
                <div className="font-mono text-stone-800">{formatArabicDateTime(registration.createdAt)}</div>
                <div className="text-[#1a4d2e] font-bold">حالة الطلب: قيد المراجعة</div>
              </div>
            </div>

            <div className="font-amiri text-xs text-[#1a4d2e] font-bold">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </div>

            <h2 className="font-amiri text-2xl sm:text-3xl font-extrabold text-[#1a4d2e]">
              بطاقة مراجعة واستمارة التسجيل الرسمية
            </h2>
            <div className="text-xs sm:text-sm text-stone-600 font-medium font-tajawal">
              دورة إعداد وتأهيل الخطباء لعام 1448هـ الموافق 2026م
            </div>
          </div>

          {/* Prominent Sequential Serial Number Banner */}
          <div className="bg-[#1a4d2e] text-white rounded-3xl p-6 mb-6 text-center relative overflow-hidden shadow-md border-2 border-[#d4af37] print:bg-[#1a4d2e] print:text-white">
            <div className="text-xs sm:text-sm text-[#d4af37] font-bold uppercase tracking-wider mb-1 font-tajawal">
              رقم المراجعة المتسلسل المعتمد (Serial Number)
            </div>
            
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-widest selection:bg-[#d4af37] selection:text-[#1a4d2e]">
                {registration.serialNumber}
              </span>
              
              <button
                id="copy-serial-number-btn"
                onClick={handleCopySerial}
                className="no-print p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d4af37] transition border border-white/20"
                title="نسخ الرقم المتسلسل"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-xs text-white/80 mt-2 font-tajawal">
              الرقم التسلسلي للمشارك: #{registration.sequenceNumber} | يرجى حفظ هذا الرقم وإبرازه عند المراجعة
            </div>
          </div>

          {/* Applicant Dossier Table */}
          <div className="space-y-4 mb-6">
            <div className="font-bold text-sm text-[#1a4d2e] pb-1 border-b border-stone-200 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1a4d2e]" />
              <span>بيانات المشارك المسجلة بالمنظومة:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-tajawal">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">الاسم الكامل:</span>
                <span className="font-bold text-[#2d3436] text-base">{registration.fullName}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">الرقم الوطني:</span>
                <span className="font-mono font-bold text-[#2d3436]">{registration.nationalId}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">رقم الهاتف:</span>
                <span className="font-mono font-bold text-[#2d3436]">{registration.phone}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">المدينة والعنوان:</span>
                <span className="font-bold text-[#2d3436]">{registration.city} - {registration.address}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">المؤهل العلمي:</span>
                <span className="font-bold text-[#2d3436]">{registration.educationalLevel}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">حفظ القرآن الكريم:</span>
                <span className="font-bold text-[#1a4d2e]">{registration.quranMemorization}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">العمر وتاريخ الميلاد:</span>
                <span className="font-bold text-[#2d3436]">{registration.age} سنة ({registration.birthDate})</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block font-medium">حالة طلب السكن الداخلي:</span>
                <span className={`font-bold ${registration.housingNeeded ? 'text-[#d4af37]' : 'text-stone-700'}`}>
                  {registration.housingNeeded ? 'مطلوب (ملتزم بالمبيت)' : 'غير مطلوب (سكن خارجي)'}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Reception Instructions */}
          <div className="bg-[#e8e4d9] border border-[#d4af37] rounded-2xl p-4 mb-6 text-[#2d3436] text-xs sm:text-sm font-tajawal space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1a4d2e] text-sm">
              <AlertCircle className="w-5 h-5 text-[#1a4d2e] shrink-0" />
              <span>تعليمات الحضور والمراجعة يوم الافتتاح:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-800 text-xs sm:text-sm leading-relaxed pr-2">
              <li>يرجى <strong>طباعة هذه الاستمارة</strong> وتقديمها مع المستندات المطلوبة للجنة الاستقبال.</li>
              <li><strong>تاريخ الحضور:</strong> يوم الاثنين 24 أغسطس 2026م (11 ربيع الأول 1448هـ) الساعة 8:00 صباحاً.</li>
              <li><strong>المقر:</strong> مسجد حي دمشق بمنطقة حي دمشق.</li>
              <li>سيخضع المتقدم لمقابلة التحقق من سلامة النطق ومطابقة الضوابط الشرعية المعتمدة.</li>
            </ul>
          </div>

          {/* Signatures & Seal Section for official printout */}
          <div className="border-t-2 border-stone-300 pt-4 grid grid-cols-3 gap-4 text-center text-xs text-stone-600 font-tajawal">
            <div>
              <div className="font-semibold text-stone-800 mb-6">توقيع المتقدم</div>
              <div className="border-b border-dotted border-stone-400 w-28 mx-auto"></div>
            </div>
            <div>
              <div className="font-semibold text-stone-800 mb-6">ختم وتوقيع لجنة الاستقبال</div>
              <div className="border-b border-dotted border-stone-400 w-28 mx-auto"></div>
            </div>
            <div>
              <div className="font-semibold text-stone-800 mb-6">اعتماد المشرف العام</div>
              <div className="border-b border-dotted border-stone-400 w-28 mx-auto"></div>
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="no-print bg-[#e8e4d9]/50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-600 font-tajawal">
            تم تسجيل البيانات بنجاح في قاعدة البيانات المركزية.
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="card-print-action-btn"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#1a4d2e] hover:bg-[#153e25] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition border border-[#d4af37]/40"
            >
              <Printer className="w-4 h-4 text-[#d4af37]" />
              <span>طباعة الاستمارة الآن</span>
            </button>
            <button
              id="card-close-action-btn"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-semibold text-sm transition"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
