import React from 'react';
import { Header } from './components/Header.js';
import { HeroSection } from './components/HeroSection.js';
import { AboutAndGoals } from './components/AboutAndGoals.js';
import { TermsAndConditions } from './components/TermsAndConditions.js';
import { RegistrationForm } from './components/RegistrationForm.js';
import { RegistrationCardModal } from './components/RegistrationCardModal.js';
import { LookupModal } from './components/LookupModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { Footer } from './components/Footer.js';
import { Registration } from './types.js';
import { FileText, Search, ShieldCheck } from 'lucide-react';

export default function App() {
  // Modal states
  const [selectedRegistration, setSelectedRegistration] = React.useState<Registration | null>(null);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#061526] text-slate-100 font-tajawal selection:bg-[#0284C7] selection:text-white" dir="rtl">
      
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
          className="p-3.5 bg-[#08192E] text-white rounded-2xl shadow-xl border border-[#C89B48]/50 hover:bg-[#0B2545] hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold"
          title="استعلام وطباعة استمارة التسجيل"
        >
          <Search className="w-5 h-5 text-[#38BDF8]" />
          <span className="hidden sm:inline">استعلام / طباعة استمارة</span>
        </button>

        <button
          id="floating-register-btn"
          onClick={() => scrollToSection('registration-form-section')}
          className="p-3.5 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] text-[#08192E] rounded-2xl shadow-2xl hover:brightness-110 hover:scale-105 transition-all flex items-center gap-2 text-xs font-black border-2 border-amber-300 ring-2 ring-[#DFB76C]/30"
          title="التسجيل في برنامج إعداد"
        >
          <FileText className="w-5 h-5 text-[#08192E]" />
          <span className="hidden sm:inline">سجل الآن بالبرنامج</span>
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
      />

    </div>
  );
}
