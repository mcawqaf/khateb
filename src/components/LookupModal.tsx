import React from 'react';
import { Search, X, User, Phone, IdCard, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Registration } from '../types.js';

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
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Registration[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/registrations/lookup?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'لم يتم العثور على أي استمارة مطابقة للبيانات المدخلة');
      }

      setResults(data.data || []);
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
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-[#d4af37]/40 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1a4d2e] text-white p-6 flex items-center justify-between border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1a4d2e] flex items-center justify-center border border-[#d4af37]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cairo text-lg font-bold text-white">
                استعلام وطباعة استمارة التسجيل
              </h3>
              <p className="text-xs text-white/80 font-tajawal">
                ابحث برقم المراجعة (KHT-1448-XXX) أو الرقم الوطني أو رقم الهاتف
              </p>
            </div>
          </div>
          <button
            id="close-lookup-btn"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-[#f4f1ea]/30">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                id="lookup-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل الرقم المتسلسل، أو الرقم الوطني، أو الهاتف..."
                required
                className="w-full pl-4 pr-11 py-3 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm font-medium bg-white"
              />
              <Search className="w-5 h-5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              id="lookup-search-submit-btn"
              disabled={loading || !query.trim()}
              className="w-full py-3.5 bg-[#1a4d2e] hover:bg-[#153e25] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 border border-[#d4af37]/40 disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <span>جارٍ البحث بالمنظومة...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#d4af37]" />
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
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                نتائج البحث ({results.length} مسجل):
              </div>

              {results.map((reg) => (
                <div
                  key={reg.id}
                  id={`lookup-result-${reg.id}`}
                  className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#1a4d2e] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-[#1a4d2e] text-[#d4af37] px-2.5 py-0.5 rounded-lg border border-[#d4af37]/30">
                        {reg.serialNumber}
                      </span>
                      <span className="font-bold text-[#2d3436] text-base">{reg.fullName}</span>
                    </div>
                    <div className="text-xs text-stone-600 flex flex-wrap items-center gap-3 font-tajawal">
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
                    className="px-4 py-2.5 bg-[#1a4d2e] hover:bg-[#153e25] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs border border-[#d4af37]/30"
                  >
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    <span>عرض وطباعة الاستمارة</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasSearched && results.length === 0 && !errorMsg && !loading && (
            <div className="text-center py-6 text-stone-500 text-sm font-tajawal bg-white rounded-2xl border border-stone-200">
              لم يتم العثور على أي طلب تسجيل يطابق بيانات البحث المدخلة.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#e8e4d9]/50 px-6 py-4 border-t border-stone-200 text-left">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
