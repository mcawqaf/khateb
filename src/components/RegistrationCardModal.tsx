import React from 'react';
import { PROGRAM } from '../lib/programInfo.js';
import { Printer, Copy, Check, ShieldCheck, Calendar, MapPin, BookOpen, AlertCircle, Phone, IdCard, User, QrCode, CheckCircle2, Ban, Clock } from 'lucide-react';
import { Registration } from '../types.js';
import { formatArabicDateTime } from '../lib/supabase.js';
import { statusOf } from '../lib/registrationStatus.js';

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

  const status = statusOf(registration.status);
  const StatusIcon =
    registration.status === 'accepted_final'
      ? CheckCircle2
      : registration.status === 'rejected'
        ? Ban
        : registration.status === 'accepted_initial'
          ? ShieldCheck
          : Clock;

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
        <div className="no-print bg-[#08192E] text-white px-6 py-3.5 flex items-center justify-between border-b border-[#C89B48]/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#DFB76C]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>بطاقة المراجعة والاستمارة الإلكترونية الرسمية</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-modal-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#C89B48] to-[#DFB76C] hover:brightness-110 text-[#08192E] rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm border border-amber-300"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة (Print)</span>
            </button>
            <button
              id="close-card-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition"
            >
              <span className="text-xs font-bold">إغلاق</span>
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div id="printable-review-card" className="p-6 sm:p-8 bg-slate-50 text-slate-900 print:p-6">
          
          {/* Header of the Official Certificate/Receipt */}
          <div className="border-b-2 border-[#08192E]/20 pb-5 mb-6 text-center space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-right text-xs font-bold text-slate-700 font-tajawal">
                <div>الهيئة العامة للأوقاف والشؤون الإسلامية</div>
                <div>إدارة الشؤون الثقافية والدعوية</div>
                <div className="text-[#0284C7] font-mono font-bold">الدورة الخامسة (5) - 1448هـ</div>
              </div>

              <div className="rounded-md overflow-hidden inline-flex shrink-0 bg-[#08192E] print-solid shadow-lg border-2 border-[#DFB76C] ring-2 ring-[#DFB76C]/20">
                <img 
                  src="./assets/program-logo.png" 
                  alt="شعار برنامج إعداد" 
                  className="h-14 sm:h-16 w-auto block"
                />
              </div>

              <div className="text-left text-xs font-bold text-slate-700 font-tajawal">
                <div>تاريخ التسجيل:</div>
                <div className="font-mono text-slate-900">{formatArabicDateTime(registration.createdAt)}</div>
                <div className="text-slate-500 font-normal">آخر تحديث للحالة:</div>
                <div className="font-mono text-slate-900">{formatArabicDateTime(registration.updatedAt)}</div>
              </div>
            </div>

            <div className="font-amiri text-xs text-[#C89B48] font-bold">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </div>

            <h2 className="font-amiri text-2xl sm:text-3xl font-extrabold text-[#08192E]">
              بطاقة مراجعة واستمارة التسجيل الرسمية
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 font-medium font-tajawal">
              برنامج (إعداد) لتأهيل الخطباء لعام 1448هـ / 2026م
            </div>
          </div>

          {/*
            Application status.

            This is the first thing the applicant looks for, so it sits above
            the serial number. It replaces a hardcoded "مسجل بالمنظومة" line
            that printed identically for every applicant, including rejected
            ones. Border and icon carry the meaning as well as the colour, so
            it still reads on a black-and-white printout.
          */}
          <div
            className={`rounded-3xl border-4 p-5 mb-5 print-keep-color print-break-inside-avoid ${status.tone.box}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <StatusIcon className={`w-7 h-7 shrink-0 ${status.tone.text}`} />
                <div>
                  <div className="text-[11px] font-bold text-slate-600 font-tajawal">حالة الطلب</div>
                  <div className={`font-cairo text-xl sm:text-2xl font-black ${status.tone.text}`}>
                    {status.label}
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full border-2 text-[11px] font-black font-tajawal ${status.tone.badge}`}
              >
                {status.isFinal ? 'قرار نهائي' : 'غير نهائي — يخضع للمراجعة'}
              </span>
            </div>

            <p className={`text-xs sm:text-sm font-tajawal leading-relaxed font-semibold ${status.tone.text}`}>
              {status.applicantNote}
            </p>
          </div>

          {/* Prominent Sequential Serial Number Banner */}
          <div className="bg-[#08192E] text-white rounded-3xl p-6 mb-6 text-center relative overflow-hidden shadow-lg border-2 border-[#C89B48] print:bg-[#08192E] print:text-white">
            <div className="text-xs sm:text-sm text-[#DFB76C] font-bold uppercase tracking-wider mb-1 font-tajawal">
              رقم المراجعة المتسلسل المعتمد (Serial Number)
            </div>
            
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-widest selection:bg-[#DFB76C] selection:text-[#08192E]">
                {registration.serialNumber}
              </span>
              
              <button
                id="copy-serial-number-btn"
                onClick={handleCopySerial}
                className="no-print p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#DFB76C] transition border border-white/20"
                title="نسخ الرقم المتسلسل"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-xs text-slate-300 mt-2 font-tajawal">
              الرقم التسلسلي للمشارك: #{registration.sequenceNumber} | يرجى حفظ هذا الرقم وإبرازه عند المراجعة
            </div>
          </div>

          {/* Applicant Dossier Table */}
          <div className="space-y-4 mb-6">
            <div className="font-bold text-sm text-[#08192E] pb-1 border-b border-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0284C7]" />
              <span>بيانات المشارك المسجلة بالمنظومة:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-tajawal">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">الاسم الكامل:</span>
                <span className="font-bold text-slate-900 text-base">{registration.fullName}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">الرقم الوطني:</span>
                <span className="font-mono font-bold text-slate-900">{registration.nationalId}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">رقم الهاتف:</span>
                <span className="font-mono font-bold text-slate-900">{registration.phone}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">المدينة والعنوان:</span>
                <span className="font-bold text-slate-900">{registration.city} - {registration.address}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">المؤهل العلمي:</span>
                <span className="font-bold text-slate-900">{registration.educationalLevel}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">حفظ القرآن الكريم:</span>
                <span className="font-bold text-[#0284C7]">{registration.quranMemorization}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">العمر وتاريخ الميلاد:</span>
                <span className="font-bold text-slate-900">{registration.age} سنة ({registration.birthDate})</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">الاستفادة من السكن الداخلي:</span>
                <span className={`font-bold ${registration.housingNeeded ? 'text-[#C89B48]' : 'text-slate-700'}`}>
                  {registration.housingNeeded ? 'نعم (ملتزم بالمبيت)' : 'لا (سكن خارجي)'}
                </span>
              </div>
            </div>
          </div>

          {/* The card is proof of registration, not of acceptance — say so before
              the applicant reads anything else on it. */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 mb-4 text-amber-950 text-xs sm:text-sm font-tajawal flex items-start gap-2.5 print-break-inside-avoid">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-0.5">تنبيه:</div>
              <p className="leading-relaxed">{PROGRAM.notice}</p>
            </div>
          </div>

          {/* Verification & Reception Instructions */}
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 mb-6 text-slate-800 text-xs sm:text-sm font-tajawal space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#08192E] text-sm">
              <AlertCircle className="w-5 h-5 text-[#0284C7] shrink-0" />
              <span>تعليمات الحضور والمراجعة للجنة القبول:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm leading-relaxed pr-2">
              <li>يرجى <strong>حفظ أو طباعة هذه الاستمارة</strong> وإبرازها عند المراجعة.</li>
              <li><strong>فترة التسجيل:</strong> من {PROGRAM.registration.from} إلى {PROGRAM.registration.to}.</li>
              <li><strong>المقابلة الشخصية:</strong> {PROGRAM.interview.date} — {PROGRAM.interview.place}.</li>
              <li><strong>انطلاق البرنامج:</strong> {PROGRAM.course.from} ولمدة {PROGRAM.course.duration} إلى {PROGRAM.course.to}.</li>
              <li><strong>مكان إقامة البرنامج:</strong> {PROGRAM.course.venue}.</li>
              <li><strong>الجهة المشرفة:</strong> الهيئة العامة للأوقاف والشؤون الإسلامية - إدارة الشؤون الثقافية والدعوية.</li>
              <li>سيخضع المتقدم لمقابلة التحقق من سلامة النطق ومطابقة الضوابط الشرعية المعتمدة.</li>
            </ul>
          </div>

          {/* Signatures & Seal Section for official printout */}
          <div className="border-t-2 border-slate-300 pt-4 grid grid-cols-3 gap-4 text-center text-xs text-slate-600 font-tajawal">
            <div>
              <div className="font-semibold text-slate-800 mb-6">توقيع المتقدم</div>
              <div className="border-b border-dotted border-slate-400 w-28 mx-auto"></div>
            </div>
            <div>
              <div className="font-semibold text-slate-800 mb-6">ختم وتوقيع لجنة القبول</div>
              <div className="border-b border-dotted border-slate-400 w-28 mx-auto"></div>
            </div>
            <div>
              <div className="font-semibold text-slate-800 mb-6">اعتماد إدارة الشؤون الثقافية والدعوية</div>
              <div className="border-b border-dotted border-slate-400 w-28 mx-auto"></div>
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="no-print bg-[#08192E] px-6 py-4 border-t border-[#C89B48]/30 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="text-xs text-slate-300 font-tajawal">
            تم تسجيل وحفظ البيانات بنجاح في قاعدة البيانات المركزية لبرنامج إعداد.
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="card-print-action-btn"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] hover:brightness-110 text-[#08192E] rounded-xl font-black text-sm flex items-center gap-2 shadow-sm transition border border-amber-300"
            >
              <Printer className="w-4 h-4 text-[#08192E]" />
              <span>طباعة الاستمارة الآن</span>
            </button>
            <button
              id="card-close-action-btn"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
