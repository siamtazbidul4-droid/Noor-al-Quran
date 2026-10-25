import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getLocalProgress,
  saveLocalProgress,
  getLocalBookmarks,
  saveLocalBookmark,
  removeLocalBookmark,
  getLocalPreferences,
  saveLocalPreferences,
  LocalBookmark,
  ReadingProgress,
  UserPreferences,
} from '../utils/progressSync';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  authLoading: boolean;
  progress: ReadingProgress;
  bookmarks: LocalBookmark[];
  preferences: UserPreferences;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProgress: (surahNumber: number, ayahNumber: number) => void;
  addBookmark: (surahNumber: number, ayahNumber: number, note?: string) => void;
  deleteBookmark: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [progress, setProgress] = useState<ReadingProgress>(getLocalProgress());
  const [bookmarks, setBookmarks] = useState<LocalBookmark[]>(getLocalBookmarks());
  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPreferences());

  // Check session status on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user && !data.isGuest) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn('Failed to check session:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  };

  const register = async (displayName: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
    // Clear user state and all local data
    setUser(null);
    // Clear localStorage to prevent stale data leaks
    try {
      localStorage.removeItem('quran_progress');
      localStorage.removeItem('quran_bookmarks');
      localStorage.removeItem('quran_preferences');
    } catch (e) {
      console.warn('Error clearing localStorage on logout:', e);
    }
  };

  const updateProgress = (surahNumber: number, ayahNumber: number) => {
    const p = saveLocalProgress(surahNumber, ayahNumber);
    setProgress(p);
  };

  const addBookmark = (surahNumber: number, ayahNumber: number, note?: string) => {
    const list = saveLocalBookmark(surahNumber, ayahNumber, note);
    setBookmarks(list);
  };

  const deleteBookmark = (id: string) => {
    const list = removeLocalBookmark(id);
    setBookmarks(list);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = saveLocalPreferences(prefs);
    setPreferences(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !user,
        authLoading,
        progress,
        bookmarks,
        preferences,
        login,
        register,
        logout,
        updateProgress,
        addBookmark,
        deleteBookmark,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
