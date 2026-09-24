import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FindWorkersView } from './components/FindWorkersView';
import { FindJobsView } from './components/FindJobsView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PostJobModal } from './components/PostJobModal';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { JobDetailsModal } from './components/JobDetailsModal';
import { QuoteModal } from './components/QuoteModal';
import { ApplyModal } from './components/ApplyModal';
import { PaymentModal } from './components/PaymentModal';
import { RatingReviewModal } from './components/RatingReviewModal';
import { WorkerOnboardingModal } from './components/WorkerOnboardingModal';
import { MaskedCallModal } from './components/MaskedCallModal';
import { SafetyPolicyModal } from './components/SafetyPolicyModal';
import { ChatDrawer } from './components/ChatDrawer';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { CheckCircle2, MessageSquare } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage, openChatWith, workers } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HeroSearch />}
        {activeTab === 'find-workers' && <FindWorkersView />}
        {activeTab === 'find-jobs' && <FindJobsView />}
        {activeTab === 'customer-dashboard' && <CustomerDashboard />}
        {activeTab === 'worker-dashboard' && <WorkerDashboard />}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}

        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display">Conversations & Negotiations</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Directly chat with Pune technicians or customers with masked contact numbers.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              {workers.slice(0, 3).map(w => (
                <button
                  key={w.id}
                  onClick={() => openChatWith({ id: w.id, name: w.name, role: 'worker' })}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-xs font-semibold shadow-xs flex items-center gap-2"
                >
                  <img src={w.profilePhoto} alt={w.name} className="w-6 h-6 rounded-full object-cover" />
                  <span>Chat with {w.name} ({w.primaryCategory})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals & Slide-Overs */}
      <PostJobModal />
      <WorkerProfileModal />
      <JobDetailsModal />
      <QuoteModal />
      <ApplyModal />
      <PaymentModal />
      <RatingReviewModal />
      <WorkerOnboardingModal />
      <MaskedCallModal />
      <SafetyPolicyModal />
      <ChatDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
