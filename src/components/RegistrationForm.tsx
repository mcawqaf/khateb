import React from 'react';
import { PROGRAM } from '../lib/programInfo.js';
import confetti from 'canvas-confetti';
import { UserCheck, AlertCircle, CheckCircle2, Calendar, Phone, IdCard, MapPin, GraduationCap, BookOpen, BedDouble, FileText, Send } from 'lucide-react';
import { Registration } from '../types.js';
import { submitRegistration } from '../lib/clientData.js';

interface RegistrationFormProps {
  onSuccess: (registration: Registration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    birthDate: '',
    city: '',
    address: '',
    educationalLevel: 'بكالوريوس دراسات إسلامية / شريعة',
    quranMemorization: 'حافظ للقرآن الكريم كاملاً',
    isCurrentlyKhateeb: 'no', // 'yes' or 'no'
    hasAttendedPreviousCourses: 'no', // 'yes' or 'no'
    fluencyAndSpeechClear: false,
    agreedToBehaviorAndAppearance: false,
    attendanceCommitment: false,
    housingNeeded: false,
    housingCommitment: false,
    notes: ''
  });

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = React.useState<number | null>(null);

  // Age calculation
  React.useEffect(() => {
    if (formData.birthDate) {
      const bDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - bDate.getFullYear();
      const m = today.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.birthDate]);

  // The national ID carries the birth year in digits 2-5, so the two fields can
  // check each other. Shown live while typing; the database enforces the same
  // rule on submit, this is only to catch the typo earlier.
  const nationalIdIssue = React.useMemo(() => {
    const nid = formData.nationalId.trim();
    if (!nid) return null;

    if (!/^[12][0-9]{11}$/.test(nid)) {
      return `الرقم الوطني يجب أن يتكون من 12 رقماً ويبدأ بالرقم 1 أو 2 (المُدخل ${nid.length} خانة).`;
    }

    const birthYear = formData.birthDate.slice(0, 4);
    if (!birthYear) return null;

    const idYear = nid.slice(1, 5);
    if (idYear !== birthYear) {
      return `الرقم الوطني لا يطابق تاريخ الميلاد: الرقم الوطني يشير إلى سنة ${idYear}، وتاريخ الميلاد المُدخل سنة ${birthYear}. يرجى تصحيح أحد الحقلين.`;
    }

    return null;
  }, [formData.nationalId, formData.birthDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim() || !formData.nationalId.trim() || !formData.phone.trim() || !formData.birthDate || !formData.address.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول الأساسية المطلوبة.');
      return;
    }

    if (nationalIdIssue) {
      setErrorMsg(nationalIdIssue);
      return;
    }

    if (formData.isCurrentlyKhateeb === 'yes') {
      setErrorMsg('من شروط القبول ألا يكون المتقدم خطيباً حالياً.');
      return;
    }

    if (formData.hasAttendedPreviousCourses === 'yes') {
      setErrorMsg('من شروط القبول ألا يكون المتقدم قد شارك في دورات إعداد الخطيب السابقة.');
      return;
    }

    if (calculatedAge !== null && (calculatedAge < 18 || calculatedAge > 30)) {
      setErrorMsg(
        `يشترط ألا يقل عمر المتقدم عن 18 سنة وألا يزيد على 30 سنة. العمر المحسوب: ${calculatedAge} سنة.`
      );
      return;
    }

    if (
      !formData.fluencyAndSpeechClear ||
      !formData.agreedToBehaviorAndAppearance ||
      !formData.attendanceCommitment
    ) {
      setErrorMsg('يجب الموافقة والتأكيد على جميع الإقرارات والشروط الشرعية والإدارية بالأسفل.');
      return;
    }

    if (formData.housingNeeded && !formData.housingCommitment) {
      setErrorMsg('يرجى الموافقة على شرط الالتزام بالمبيت للسكن الداخلي.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        city: formData.city,
        address: formData.address,
        educationalLevel: formData.educationalLevel,
        quranMemorization: formData.quranMemorization,
        isCurrentlyKhateeb: formData.isCurrentlyKhateeb === 'yes',
        hasAttendedPreviousCourses: formData.hasAttendedPreviousCourses === 'yes',
        fluencyAndSpeechClear: formData.fluencyAndSpeechClear,
        agreedToBehaviorAndAppearance: formData.agreedToBehaviorAndAppearance,
        attendanceCommitment: formData.attendanceCommitment,
        housingNeeded: formData.housingNeeded,
        housingCommitment: formData.housingCommitment,
        notes: formData.notes
      };

      const savedRegistration = await submitRegistration(payload);

      // Fire confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess(savedRegistration);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'تعذر إرسال طلب التسجيل';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registration-form-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Bento Main Form Container */}
      <div className="bg-white rounded-3xl border border-[#d4af37]/30 shadow-sm overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#061526] via-[#0A1C30] to-[#061526] text-white p-6 sm:p-8 relative overflow-hidden border-b-4 border-[#C89B48]">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#38BDF8] text-xs font-bold border border-white/20">
                <UserCheck className="w-4 h-4 text-[#DFB76C]" />
                <span>استمارة التسجيل الرسمية - الدورة الخامسة (5)</span>
              </div>
              <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-white">
                طلب الالتحاق ببرنامج (إعداد) لتأهيل الخطباء
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-tajawal">
                سيتم منحك رقماً متسلسلاً فورياً (بطاقة مراجعة رسمية بباركود) لمراجعة لجنة القبول.
              </p>
            </div>

            <div className="bg-white/10 border border-[#C89B48]/40 p-3.5 rounded-2xl text-center shrink-0 backdrop-blur-xs">
              <div className="text-[11px] text-[#DFB76C] font-semibold">فترة القبول المعتمدة</div>
              <div className="text-base font-bold text-white">{PROGRAM.registration.short}</div>
              <div className="text-[11px] text-sky-300 font-mono">1448هـ</div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Error Notification */}
          {errorMsg && (
            <div id="form-error-alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed font-cairo">
                {errorMsg}
              </div>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-[#08192E] font-bold text-lg">
              <IdCard className="w-5 h-5 text-[#0284C7]" />
              <h4>البيانات الشخصية للمتقدم</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  الاسم الرباعي كاملاً <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="مثال: عبد الرحمن محمد عبد الله السنوسي"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
                />
              </div>

              {/* National ID */}
              <div>
                <label htmlFor="nationalId" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  الرقم الوطني / رقم الهوية <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="12 رقماً كما في بطاقة الرقم الوطني"
                  aria-invalid={Boolean(nationalIdIssue)}
                  className={`w-full px-4 py-2.5 rounded-xl border transition text-slate-900 text-sm font-mono bg-slate-50/50 focus:ring-2 ${
                    nationalIdIssue
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400'
                      : 'border-slate-300 focus:ring-[#0284C7] focus:border-[#0284C7]'
                  }`}
                />
                {nationalIdIssue && (
                  <p className="mt-1.5 text-[11px] text-rose-700 font-semibold leading-relaxed flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{nationalIdIssue}</span>
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  رقم الهاتف (الواتساب) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="09XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm font-mono bg-slate-50/50"
                />
              </div>

              {/* Birth date & Age calculation */}
              <div>
                <label htmlFor="birthDate" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  تاريخ الميلاد <span className="text-rose-600">* (من 18 إلى 30 سنة)</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
                />
                {calculatedAge !== null && (
                  <div className={`text-xs mt-1 font-semibold ${calculatedAge >= 18 && calculatedAge <= 30 ? 'text-[#0284C7]' : 'text-rose-600'}`}>
                    العمر المحسوب: {calculatedAge} سنة{' '}
                    {calculatedAge < 18
                      ? '(أقل من الحد الأدنى 18 سنة)'
                      : calculatedAge > 30
                        ? '(يتجاوز الحد الأعلى 30 سنة)'
                        : '✓ (مستوفٍ لشرط السن)'}
                  </div>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  المدينة / المنطقة <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="مثال: طرابلس / بنغازي / مصراتة / الزاوية"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
                />
              </div>

              {/* Detailed Address */}
              <div>
                <label htmlFor="address" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  العنوان التفصيلي ومكان السكن <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="مثال: قرب مسجد التقوى، المحلة الأولى"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Educational & Quranic Background */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-[#08192E] font-bold text-lg">
              <GraduationCap className="w-5 h-5 text-[#0284C7]" />
              <h4>المؤهل العلمي وحفظ القرآن الكريم</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="educationalLevel" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  المؤهل العلمي / الدراسي <span className="text-rose-600">*</span>
                </label>
                <select
                  id="educationalLevel"
                  name="educationalLevel"
                  value={formData.educationalLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-white"
                >
                  <option value="بكالوريوس دراسات إسلامية / شريعة">بكالوريوس دراسات إسلامية / شريعة</option>
                  <option value="طالب علم بمعهد العلوم الشرعية">طالب علم بمعهد العلوم الشرعية</option>
                  <option value="طالب جامعي (تخصصات أخرى)">طالب جامعي (تخصصات أخرى)</option>
                  <option value="بكالوريوس / ليسانس (تخصصات عامة)">بكالوريوس / ليسانس (تخصصات عامة)</option>
                  <option value="دراسات عليا (ماجستير / دكتوراه)">دراسات عليا (ماجستير / دكتوراه)</option>
                  <option value="ثانوية عامة / معهد متوسط">ثانوية عامة / معهد متوسط</option>
                </select>
              </div>

              <div>
                <label htmlFor="quranMemorization" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  مقدار حفظ القرآن الكريم <span className="text-rose-600">*</span>
                </label>
                <select
                  id="quranMemorization"
                  name="quranMemorization"
                  value={formData.quranMemorization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-white"
                >
                  <option value="حافظ للقرآن الكريم كاملاً">حافظ للقرآن الكريم كاملاً</option>
                  <option value="أكثر من 15 جزءاً">أكثر من 15 جزءاً</option>
                  <option value="أكثر من 5 أجزاء">أكثر من 5 أجزاء</option>
                  <option value="أقل من 5 أجزاء">أقل من 5 أجزاء</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Housing / Accommodation Option */}
          <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[#08192E] font-bold text-base">
              <BedDouble className="w-5 h-5 text-[#C89B48]" />
              <h4>خدمة السكن والإقامة الداخلية</h4>
            </div>

            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl">
              <BedDouble className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-900 font-semibold font-tajawal leading-relaxed">
                السكن الداخلي مكفول <strong className="font-black">لجميع الطلبة المقبولين بدون استثناء</strong>، ولا يقتصر على القادمين من مناطق بعيدة.
                والسؤال التالي لأغراض التنظيم وتجهيز الغرف فقط.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="housingNeeded"
                  checked={formData.housingNeeded}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#08192E] rounded border-slate-400 focus:ring-[#08192E]"
                />
                <span className="text-sm font-semibold text-slate-800">
                  نعم، سأستفيد من السكن الداخلي خلال أيام البرنامج.
                </span>
              </label>

              {formData.housingNeeded && (
                <div className="pr-8 space-y-2 border-r-2 border-[#C89B48] pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 text-xs sm:text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="housingCommitment"
                      checked={formData.housingCommitment}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#08192E] rounded border-slate-400 focus:ring-[#08192E]"
                    />
                    <span className="text-[#08192E] font-bold">
                      ألتزم التزاماً كاملاً بالمبيت في السكن طيلة أيام البرنامج والمحافظة على مرافق السكن ونظافته. <span className="text-rose-600">*</span>
                    </span>
                  </label>
                  <p className="text-xs text-slate-600 font-tajawal">
                    * ملاحظة: السكن مشروط بالالتزام التام بالمبيت اليومي وحضور صلاة الفجر والبرامج التدريبية المسائية.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Mandatory Conditions & Declarations */}
          <div className="space-y-4 bg-[#08192E]/5 border border-slate-200 p-5 sm:p-6 rounded-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-[#08192E] font-bold text-base">
              <FileText className="w-5 h-5 text-[#0284C7]" />
              <h4>الإقرارات وضوابط القبول الإلزامية</h4>
            </div>

            <div className="space-y-3.5 text-sm text-slate-800 font-tajawal">
              
              {/* Check: Not currently khateeb */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                <div className="font-semibold text-[#08192E]">
                  1. هل أنت خطيب جمعة ممارس حالياً في أي مسجد؟ <span className="text-rose-600">*</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isCurrentlyKhateeb"
                      value="no"
                      checked={formData.isCurrentlyKhateeb === 'no'}
                      onChange={handleChange}
                      className="text-[#0284C7] focus:ring-[#0284C7]"
                    />
                    <span className="font-bold text-[#0284C7]">لا، لست خطيباً (مستوفٍ للشرط)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isCurrentlyKhateeb"
                      value="yes"
                      checked={formData.isCurrentlyKhateeb === 'yes'}
                      onChange={handleChange}
                      className="text-rose-600 focus:ring-rose-600"
                    />
                    <span className="text-rose-700 font-medium">نعم، أنا خطيب حالياً</span>
                  </label>
                </div>
                {formData.isCurrentlyKhateeb === 'yes' && (
                  <p className="text-xs text-rose-600 font-bold">
                    * تنبيه: يشترط في برنامج إعداد ألا يكون المتقدم خطيباً لإتاحة المجال للكوادر الجديدة.
                  </p>
                )}
              </div>

              {/* Check: Previous participation */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                <div className="font-semibold text-[#08192E]">
                  2. هل شاركت في أي دورة من دورات إعداد الخطيب السابقة؟ <span className="text-rose-600">*</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAttendedPreviousCourses"
                      value="no"
                      checked={formData.hasAttendedPreviousCourses === 'no'}
                      onChange={handleChange}
                      className="text-[#0284C7] focus:ring-[#0284C7]"
                    />
                    <span className="font-bold text-[#0284C7]">لا، لم أشارك سابقاً (مستوفٍ للشرط)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAttendedPreviousCourses"
                      value="yes"
                      checked={formData.hasAttendedPreviousCourses === 'yes'}
                      onChange={handleChange}
                      className="text-rose-600 focus:ring-rose-600"
                    />
                    <span className="text-rose-700 font-medium">نعم، شاركت سابقاً</span>
                  </label>
                </div>
                {formData.hasAttendedPreviousCourses === 'yes' && (
                  <p className="text-xs text-rose-600 font-bold">
                    * تنبيه: يُشترط عدم المشاركة المسبقة لإعطاء الأولوية للوجوه الجديدة.
                  </p>
                )}
              </div>

              {/* Affirmation Checkboxes */}
              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  name="fluencyAndSpeechClear"
                  checked={formData.fluencyAndSpeechClear}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#0284C7] rounded border-slate-300 focus:ring-[#0284C7] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#08192E]">3. الإقرار بسلامة النطق والفصاحة:</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    أقر بأنني سليم النطق ومخارج الحروف وفصيح البيان وقادر على الأداء الخطابي دون عيوب كلامية مانعة.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  name="agreedToBehaviorAndAppearance"
                  checked={formData.agreedToBehaviorAndAppearance}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#0284C7] rounded border-slate-300 focus:ring-[#0284C7] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#08192E]">4. حسن السيرة والسلوك والمظهر اللائق:</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    أقر بالالتزام بالأخلاق والسمت الإسلامي القويم، وحسن المظهر بما يتوافق مع الأحكام والآداب الشرعية المرعية.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  name="attendanceCommitment"
                  checked={formData.attendanceCommitment}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#0284C7] rounded border-slate-300 focus:ring-[#0284C7] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#08192E]">5. الالتزام بالحضور والضوابط المعتمدة:</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ألتزم بحضور جميع الدروس والورش الميدانية، والالتزام بالمبيت لمن سجل بالسكن، وحفظ بطاقة المراجعة وتقديمها للجنة القبول.
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
              ملاحظات إضافية أو خبرات سابقة في طلب العلم <span className="text-slate-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="اذكر أي إجازات في القرآن الكريم أو متون علمية تم حفظها..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm bg-slate-50/50"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="submit-registration-btn"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] hover:brightness-110 text-[#08192E] font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border border-amber-300 ring-4 ring-amber-400/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-[#08192E]">
                  <span className="w-5 h-5 border-2 border-[#08192E] border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ معالجة وتوليد رقم المراجعة...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 text-[#08192E]" />
                  <span>تأكيد التسجيل واستخراج بطاقة المراجعة الرسمية</span>
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-3 font-tajawal">
              بمجرد الضغط على تأكيد التسجيل، ستظهر لك بطاقة المراجعة الرسمية المحتوية على رقمك المتسلسل ورابط الطباعة الفورية.
            </p>
          </div>

        </form>

      </div>

    </section>
  );
};
