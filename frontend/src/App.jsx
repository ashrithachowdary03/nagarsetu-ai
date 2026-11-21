import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import CitizenDashboardPage from './pages/CitizenDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PublicDashboardPage from './pages/PublicDashboardPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CategoriesPage from './pages/CategoriesPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [currentTab, setCurrentTab] = useState('landing');
  const [trackedRefId, setTrackedRefId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('login');

  const handleNavigate = (tabId, param) => {
    if (tabId === 'track' && param) {
      setTrackedRefId(param);
    }
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (defaultMode = 'login') => {
    setAuthDefaultTab(defaultMode);
    setAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onTrackRef={(ref) => handleNavigate('track', ref)}
          />
        )}

        {currentTab === 'submit' && (
          <SubmitComplaintPage
            onNavigate={handleNavigate}
            onComplaintCreated={(comp) => {}}
          />
        )}

        {currentTab === 'track' && (
          <TrackComplaintPage
            initialRefId={trackedRefId}
          />
        )}

        {currentTab === 'citizen-dashboard' && (
          <CitizenDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'public-stats' && (
          <PublicDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthPage
          defaultTab={authDefaultTab}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setAuthModalOpen(false)}
        />
      )}

    </div>
  );
}
