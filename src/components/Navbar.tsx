import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Volume2,
  Bookmark,
  Search,
  ShieldCheck,
  Menu,
  X,
  Globe,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { preferences, updatePreferences } = useAuth();
  const isBn = preferences.interfaceLanguage === 'bn';
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    updatePreferences({ interfaceLanguage: isBn ? 'en' : 'bn' });
  };

  const navItems = [
    { path: '/', labelBn: 'মূলপাতা', labelEn: 'Home', icon: Home },
    { path: '/surahs', labelBn: 'আল-কুরআন', labelEn: 'Surahs', icon: BookOpen },
    { path: '/juz', labelBn: '৩০ পারা', labelEn: '30 Juz', icon: null },
    { path: '/audio', labelBn: 'তিলাওয়াত', labelEn: 'Audio', icon: Volume2 },
    { path: '/my-quran', labelBn: 'বুকমার্কস', labelEn: 'My Quran', icon: Bookmark },
    { path: '/admin', labelBn: 'প্রশাসন', labelEn: 'Admin', icon: ShieldCheck },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Manage body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => window.removeEventListener('keydown', handleTabKey);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B3D32]/95 text-white border-b border-[#B38A42]/30 shadow-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#B38A42] to-[#8C6B2D] flex items-center justify-center text-white shadow-inner font-quran text-lg sm:text-xl font-bold flex-shrink-0">
              ن
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base lg:text-lg tracking-wide text-white group-hover:text-[#B38A42] transition-colors truncate">
                  Noor Al-Quran
                </span>
                <span className="hidden sm:inline text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-[#B38A42]/20 text-[#DFC186] border border-[#B38A42]/30 font-quran whitespace-nowrap">
                  القرآن الكريم
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/80 font-bengali truncate">
                {isBn ? 'নূর আল-কুরআন' : 'The Holy Quran'}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-wrap">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1 lg:gap-1.5 ${
                    active
                      ? 'bg-[#B38A42] text-white shadow-sm'
                      : 'text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 opacity-80" />}
                  <span className="font-bengali whitespace-nowrap">{isBn ? item.labelBn : item.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-[#B38A42]/30 text-emerald-200 text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B38A42] min-h-[44px] min-w-[44px] justify-center"
              aria-label={isBn ? 'কুরআন অনুসন্ধান করুন' : 'Search Quran'}
              title={isBn ? 'অনুসন্ধান' : 'Search'}
            >
              <Search className="w-4 h-4 text-[#B38A42] flex-shrink-0" />
              <span className="hidden sm:inline font-bengali whitespace-nowrap">{isBn ? 'অনুসন্ধান' : 'Search'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-emerald-800/50 text-emerald-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={isBn ? 'ভাষা পরিবর্তন করুন' : 'Toggle Language'}
              aria-label={isBn ? 'ভাষা পরিবর্তন করুন' : 'Toggle language'}
            >
              <Globe className="w-4 h-4 text-[#B38A42]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-800/50 text-emerald-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? (isBn ? 'মেনু বন্ধ করুন' : 'Close menu') : (isBn ? 'মেনু খুলুন' : 'Open menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Premium Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            style={{
              animation: 'fadeIn 300ms ease-out'
            }}
          />

          {/* Mobile Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-16 left-0 right-0 bg-gradient-to-b from-[#0B3D32] via-[#0D4438] to-[#0B3D32] z-50 md:hidden shadow-2xl border-b border-[#B38A42]/30 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? 'নেভিগেশন মেনু' : 'Navigation menu'}
            style={{
              animation: 'slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              maxHeight: 'calc(100vh - 4rem)',
              overflowY: 'auto'
            }}
          >
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all min-h-[56px] ${
                      active
                        ? 'bg-[#B38A42] text-white font-semibold shadow-lg shadow-[#B38A42]/20'
                        : 'text-emerald-100 hover:bg-emerald-800/40 active:bg-emerald-800/60'
                    }`}
                  >
                    {item.icon && (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        active ? 'bg-white/20' : 'bg-emerald-900/60'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="font-bengali flex-1">{isBn ? item.labelBn : item.labelEn}</span>
                    {active && (
                      <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Language Toggle in Mobile Menu */}
            <div className="px-4 py-4 border-t border-[#B38A42]/20">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#B38A42]" />
                  <span className="font-bengali font-medium">
                    {isBn ? 'ইংরেজিতে পরিবর্তন করুন' : 'Switch to Bengali'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#DFC186] bg-[#B38A42]/30 px-3 py-1 rounded-lg">
                  {isBn ? 'EN' : 'বাং'}
                </span>
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideDown {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};
