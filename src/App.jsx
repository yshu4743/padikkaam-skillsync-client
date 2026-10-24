import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import DiscoverView from './components/DiscoverView';
import WorkshopMap from './components/WorkshopMap';
import UserProfile from './components/UserProfile';
import EarningsView from './components/EarningsView';
import CreateWorkshopModal from './components/CreateWorkshopModal';
import AuthModal from './components/AuthModal';
import { LogIn } from 'lucide-react';

const AppContent = () => {
  const { user, loading, view, showCreateModal, setShowCreateModal } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SkillSync</h1>
          <p className="text-gray-500 mb-8">Trade skills, not money. Learn from your community.</p>

          <div className="card mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-600">1:1</p>
                <p className="text-xs text-gray-500">Time Credits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">₹</p>
                <p className="text-xs text-gray-500">Paid Option</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">Map</p>
                <p className="text-xs text-gray-500">Local Events</p>
              </div>
            </div>
          </div>

          <button onClick={() => setShowAuth(true)} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
            <LogIn size={18} />
            Get Started
          </button>

          <p className="text-xs text-gray-400 mt-4">New users receive 5 free credits</p>
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {view === 'discover' && <DiscoverView />}
        {view === 'map' && <WorkshopMap />}
        {view === 'profile' && <UserProfile />}
        {view === 'earnings' && <EarningsView />}
      </main>
      {showCreateModal && <CreateWorkshopModal />}
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
