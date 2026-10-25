import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/Navbar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingScreen } from './components/LoadingScreen';

import { HomePage } from './pages/HomePage';
import { QuranReaderPage } from './pages/QuranReaderPage';
import { SurahExplorerPage } from './pages/SurahExplorerPage';
import { JuzExplorerPage } from './pages/JuzExplorerPage';
import { AudioLibraryPage } from './pages/AudioLibraryPage';
import { MyQuranPage } from './pages/MyQuranPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasSeenLoading = sessionStorage.getItem('noorAlQuranLoadingSeen');
    
    if (hasSeenLoading) {
      // Skip loading animation for internal navigation
      setIsInitialLoading(false);
      setAppReady(true);
      return;
    }

    // Mark that we've shown the loading screen
    sessionStorage.setItem('noorAlQuranLoadingSeen', 'true');

    // Simulate initial app readiness check
    // In production, this could wait for critical resources, fonts, etc.
    const readyTimer = setTimeout(() => {
      setAppReady(true);
    }, 1000);

    return () => clearTimeout(readyTimer);
  }, []);

  const handleLoadingComplete = () => {
    setIsInitialLoading(false);
  };

  // Show loading screen on first visit
  if (isInitialLoading && !appReady) {
    return <LoadingScreen onComplete={handleLoadingComplete} minimumDuration={5000} />;
  }

  // Show loading screen with shorter duration if app is ready but animation isn't complete
  if (isInitialLoading && appReady) {
    return <LoadingScreen onComplete={handleLoadingComplete} minimumDuration={3000} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <div className="min-h-screen flex flex-col font-sans selection:bg-[#B38A42]/20 selection:text-[#0B3D32]">
            <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/surahs" element={<SurahExplorerPage />} />
                <Route path="/juz" element={<JuzExplorerPage />} />
                <Route path="/quran" element={<Navigate to="/quran/1" replace />} />
                <Route path="/quran/:surahNumber" element={<QuranReaderPage />} />
                <Route path="/audio" element={<AudioLibraryPage />} />
                <Route
                  path="/my-quran"
                  element={
                    <ProtectedRoute>
                      <MyQuranPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>

            <Footer />
            <AudioPlayerBar />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          </div>
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
