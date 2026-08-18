import React from 'react';
import { BookOpen, Calendar, MapPin, Search, ShieldCheck, UserCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLookup,
  onOpenAdmin,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#f4f1ea]/95 backdrop-blur border-b border-[#d4af37]/20 shadow-xs no-print">
      {/* Top Islamic Banner Bar */}
      <div id="top-announcement-bar" className="bg-[#1a4d2e] text-[#f4f1ea] text-xs py-2 px-4 border-b border-[#d4af37]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span>إدارة الشؤون الثقافية والدعوية | دورة إعداد وتأهيل الخطباء - النسخة الخامسة</span>
          </div>
          <div className="flex items-center gap-4 text-[#e8e4d9]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              24 أغسطس 2026م (11 ربيع الأول 1448هـ)
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              مسجد حي دمشق
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Identity */}
          <div 
            id="brand-logo-button"
            onClick={() => onScrollToSection('hero-section')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1a4d2e] text-[#d4af37] flex items-center justify-center shadow-md border-2 border-[#d4af37]/40 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-amiri text-2xl font-bold text-[#1a4d2e] leading-tight">
                دورة إعداد وتأهيل الخطباء
              </div>
              <div className="text-xs text-[#1a4d2e]/80 font-semibold tracking-wide flex items-center gap-1.5">
                <span className="bg-[#1a4d2e] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">النسخة الخامسة</span>
                <span className="text-[#2d3436]/70">1448هـ - 2026م</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 font-medium text-sm text-[#2d3436]">
            <button
              id="nav-btn-about"
              onClick={() => onScrollToSection('about-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#1a4d2e] hover:bg-[#e8e4d9]/70 transition"
            >
              عن الدورة والأهداف
            </button>
            <button
              id="nav-btn-terms"
              onClick={() => onScrollToSection('terms-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#1a4d2e] hover:bg-[#e8e4d9]/70 transition font-bold text-[#1a4d2e]"
            >
              شروط القبول
            </button>
            <button
              id="nav-btn-details"
              onClick={() => onScrollToSection('details-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#1a4d2e] hover:bg-[#e8e4d9]/70 transition"
            >
              المكان والمواعيد
            </button>
            <button
              id="nav-btn-register"
              onClick={() => onScrollToSection('registration-form-section')}
              className="px-4 py-2 bg-[#d4af37] hover:bg-[#c49b2c] text-[#1a4d2e] rounded-xl transition shadow-md flex items-center gap-1.5 font-bold border border-amber-300"
            >
              <UserCheck className="w-4 h-4 text-[#1a4d2e]" />
              <span>استمارة التسجيل</span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="header-lookup-btn"
              onClick={onOpenLookup}
              className="px-3 py-2 text-sm font-medium text-[#1a4d2e] hover:text-[#153e25] bg-white hover:bg-[#e8e4d9] rounded-xl transition border border-[#d4af37]/30 flex items-center gap-1.5 shadow-2xs"
              title="طباعة أو استعلام عن رقم التسجيل"
            >
              <Search className="w-4 h-4 text-[#1a4d2e]" />
              <span>استعلام / طباعة استمارة</span>
            </button>

            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="px-3 py-2 text-sm font-medium text-[#2d3436]/80 hover:text-[#1a4d2e] hover:bg-[#e8e4d9]/60 rounded-xl transition flex items-center gap-1.5"
              title="دخول المشرفين لإدارة المسجلين"
            >
              <ShieldCheck className="w-4 h-4 text-[#1a4d2e]/70" />
              <span>لوحة المشرفين</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              id="mobile-lookup-quick-btn"
              onClick={onOpenLookup}
              className="p-2 text-[#1a4d2e] bg-[#e8e4d9] rounded-xl"
              aria-label="استعلام"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2d3436] hover:text-[#1a4d2e] hover:bg-[#e8e4d9] rounded-xl"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-[#d4af37]/20 bg-[#f4f1ea] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-2 font-medium text-[#2d3436]">
            <button
              id="m-nav-about"
              onClick={() => {
                onScrollToSection('about-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl hover:bg-[#e8e4d9]"
            >
              عن الدورة والأهداف
            </button>
            <button
              id="m-nav-terms"
              onClick={() => {
                onScrollToSection('terms-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl bg-[#e8e4d9] text-[#1a4d2e] font-bold"
            >
              شروط وضوابط القبول
            </button>
            <button
              id="m-nav-details"
              onClick={() => {
                onScrollToSection('details-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl hover:bg-[#e8e4d9]"
            >
              المكان والمواعيد
            </button>
            <button
              id="m-nav-register"
              onClick={() => {
                onScrollToSection('registration-form-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-3 bg-[#d4af37] hover:bg-[#c49b2c] text-[#1a4d2e] rounded-xl font-extrabold shadow-md flex items-center justify-center gap-2 border border-amber-300"
            >
              <UserCheck className="w-5 h-5 text-[#1a4d2e]" />
              <span>تسجيل جديد بالدورة</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#d4af37]/20 flex flex-col gap-2">
            <button
              id="m-nav-lookup"
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-3 py-2.5 text-sm font-semibold text-[#1a4d2e] bg-white rounded-xl border border-[#d4af37]/30 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>استعلام وطباعة رقم المراجعة</span>
            </button>
            <button
              id="m-nav-admin"
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-3 py-2.5 text-sm font-semibold text-[#2d3436] bg-[#e8e4d9] rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة دخول المشرفين</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
