import React from 'react';
import { Search, User, Phone, IdCard, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Registration } from '../types.js';
import { lookupRegistration } from '../lib/clientData.js';
import { statusOf } from '../lib/registrationStatus.js';

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegistration: (reg: Registration) => void;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  isOpen,
  onClose,
  onSelectRegistration
}) => {
  const [nationalId, setNationalId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [results, setResults] = React.useState<Registration[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId.trim() || !phone.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const found = await lookupRegistration(nationalId, phone);
      if (!found) {
        setResults([]);
        setErrorMsg('لم يتم العثور على استمارة مطابقة. تأكد من الرقم الوطني ورقم الهاتف كما أُدخلا عند التسجيل.');
      } else {
        setResults([found]);
      }
    } catch (err: unknown) {
      setResults([]);
      const message = err instanceof Error ? err.message : 'تعذر البحث';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="lookup-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="lookup-modal-container"
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-[#C89B48]/40 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#08192E] text-white p-6 flex items-center justify-between border-b-2 border-[#C89B48]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#38BDF8] flex items-center justify-center border border-[#C89B48]/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cairo text-lg font-bold text-white">
                استعلام وطباعة استمارة برنامج (إعداد)
              </h3>
              <p className="text-xs text-slate-300 font-tajawal">
                للاستعلام أدخل الرقم الوطني ورقم الهاتف المسجلَين بالاستمارة
              </p>
            </div>
          </div>
          <button
            id="close-lookup-btn"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg transition"
          >
            <span className="text-xs font-bold">إغلاق</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-slate-50/50">
          {/* Search Form — both values are required together, so that knowing
              a sequential serial number alone never reveals anyone's data. */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label htmlFor="lookup-national-id" className="block text-xs font-bold text-slate-700 mb-1">
                الرقم الوطني <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lookup-national-id"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="أدخل الرقم الوطني المسجل بالاستمارة"
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm font-medium bg-white"
                />
                <IdCard className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="lookup-phone" className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="lookup-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="نفس الرقم المدخل عند التسجيل"
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition text-slate-900 text-sm font-medium bg-white"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-tajawal leading-relaxed">
              حمايةً لخصوصية المتقدمين، يلزم إدخال الرقم الوطني ورقم الهاتف معاً لاستعراض البطاقة.
            </p>

            <button
              type="submit"
              id="lookup-search-submit-btn"
              disabled={loading || !nationalId.trim() || !phone.trim()}
              className="w-full py-3.5 bg-[#08192E] hover:bg-[#0B2545] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 border border-[#C89B48]/40 disabled:opacity-60 shadow-md"
            >
              {loading ? (
                <span>جارٍ البحث بالمنظومة...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#38BDF8]" />
                  <span>بحث واستعراض البطاقة</span>
                </>
              )}
            </button>
          </form>

          {/* Error / Not Found */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                نتيجة الاستعلام:
              </div>

              {results.map((reg) => (
                <div
                  key={reg.id}
                  id={`lookup-result-${reg.id}`}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#0284C7] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-[#08192E] text-[#DFB76C] px-2.5 py-0.5 rounded-lg border border-[#C89B48]/30">
                        {reg.serialNumber}
                      </span>
                      <span className="font-bold text-slate-900 text-base">{reg.fullName}</span>
                    </div>

                    {/* The applicant is here to find out where their
                        application stands, so lead with that. */}
                    {(() => {
                      const st = statusOf(reg.status);
                      return (
                        <div className={`rounded-xl border-2 p-3 ${st.tone.box}`}>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-slate-600 font-tajawal">
                              حالة الطلب:
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full border-2 text-xs font-black font-cairo ${st.tone.badge}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <p className={`text-[11px] font-tajawal leading-relaxed font-semibold ${st.tone.text}`}>
                            {st.applicantNote}
                          </p>
                        </div>
                      );
                    })()}

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 font-tajawal">
                      <span>الرقم الوطني: <strong className="font-mono">{reg.nationalId}</strong></span>
                      <span>الهاتف: <strong className="font-mono">{reg.phone}</strong></span>
                      <span>المدينة: {reg.city}</span>
                    </div>
                  </div>

                  <button
                    id={`open-card-for-${reg.id}`}
                    onClick={() => {
                      onSelectRegistration(reg);
                      onClose();
                    }}
                    className="px-4 py-2.5 bg-[#08192E] hover:bg-[#0B2545] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs border border-[#C89B48]/30"
                  >
                    <FileText className="w-4 h-4 text-[#38BDF8]" />
                    <span>عرض وطباعة الاستمارة</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasSearched && results.length === 0 && !errorMsg && !loading && (
            <div className="text-center py-6 text-slate-500 text-sm font-tajawal bg-white rounded-2xl border border-slate-200">
              لم يتم العثور على أي طلب تسجيل يطابق بيانات البحث المدخلة.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 text-left">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
