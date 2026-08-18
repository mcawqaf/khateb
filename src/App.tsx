import React from 'react';
import { Header } from './components/Header.js';
import { HeroSection } from './components/HeroSection.js';
import { AboutAndGoals } from './components/AboutAndGoals.js';
import { TermsAndConditions } from './components/TermsAndConditions.js';
import { RegistrationForm } from './components/RegistrationForm.js';
import { RegistrationCardModal } from './components/RegistrationCardModal.js';
import { LookupModal } from './components/LookupModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { SupabaseGuideModal } from './components/SupabaseGuideModal.js';
import { Footer } from './components/Footer.js';
import { Registration } from './types.js';
import { FileText, Search, ShieldCheck } from 'lucide-react';

export default function App() {
  // Modal states
  const [selectedRegistration, setSelectedRegistration] = React.useState<Registration | null>(null);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (newReg: Registration) => {
    setSelectedRegistration(newReg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f1ea] text-[#2d3436] font-tajawal selection:bg-[#1a4d2e] selection:text-white" dir="rtl">
      
      {/* Top Header */}
      <Header
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-8 lg:space-y-12 py-4">
        {/* 1. Hero Bento Grid Section */}
        <HeroSection
          onRegisterClick={() => scrollToSection('registration-form-section')}
          onTermsClick={() => scrollToSection('terms-section')}
          onLookupClick={() => setIsLookupOpen(true)}
        />

        {/* 2. About & Goals Bento Grid Section */}
        <AboutAndGoals />

        {/* 3. Clearly Written Terms & Conditions Section */}
        <TermsAndConditions
          onProceedToRegister={() => scrollToSection('registration-form-section')}
        />

        {/* 4. Registration Form Section */}
        <RegistrationForm
          onSuccess={handleRegistrationSuccess}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Floating Quick Action Buttons for Easy Access */}
      <div id="floating-quick-bar" className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5 no-print">
        <button
          id="floating-lookup-btn"
          onClick={() => setIsLookupOpen(true)}
          className="p-3.5 bg-white text-[#1a4d2e] rounded-2xl shadow-lg border border-[#d4af37]/30 hover:bg-[#e8e4d9] hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold"
          title="استعلام وطباعة استمارة التسجيل"
        >
          <Search className="w-5 h-5 text-[#1a4d2e]" />
          <span className="hidden sm:inline">استعلام / طباعة استمارة</span>
        </button>

        <button
          id="floating-register-btn"
          onClick={() => scrollToSection('registration-form-section')}
          className="p-3.5 bg-[#d4af37] text-[#1a4d2e] rounded-2xl shadow-2xl hover:bg-[#c49b2c] hover:scale-105 transition-all flex items-center gap-2 text-xs font-black border-2 border-amber-300 ring-2 ring-amber-400/30"
          title="التسجيل في الدورة"
        >
          <FileText className="w-5 h-5 text-[#1a4d2e]" />
          <span className="hidden sm:inline">سجل الآن بالدورة</span>
        </button>
      </div>

      {/* --- Modals & Overlays --- */}

      {/* 1. Official Printable Registration Review Card Modal */}
      <RegistrationCardModal
        registration={selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
      />

      {/* 2. Lookup Modal for Applicants */}
      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSelectRegistration={(reg) => setSelectedRegistration(reg)}
      />

      {/* 3. Supervisor Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onViewRegistrationCard={(reg) => setSelectedRegistration(reg)}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
      />

      {/* 4. Supabase SQL Guide & Setup Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
      />

    </div>
  );
}
