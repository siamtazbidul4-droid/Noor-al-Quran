import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Volume2, ArrowRight, Loader2 } from 'lucide-react';
import { SURAHS_METADATA, SurahMeta } from '../data/surahMetadata';
import { isSearchMatch } from '../utils/searchNormalization';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ surahs: SurahMeta[]; ayahs: any[] }>({ surahs: [], ayahs: [] });
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ surahs: [], ayahs: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults({ surahs: [], ayahs: [] });
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);
    const timeout = setTimeout(() => {
      const qNum = parseInt(q, 10);
      const matchedSurahs = SURAHS_METADATA.filter(s => {
        if (!isNaN(qNum) && s.number === qNum) return true;
        if (isSearchMatch(q, s.arabicName, true)) return true;
        if (isSearchMatch(q, s.bengaliName, false)) return true;
        if (isSearchMatch(q, s.englishName, false)) return true;
        if (isSearchMatch(q, s.bengaliMeaning, false)) return true;
        if (isSearchMatch(q, s.englishMeaning, false)) return true;
        return false;
      }).slice(0, 8);

      fetch(`/api/v1/search?q=${encodeURIComponent(q)}&limit=10`)
        .then(r => r.json())
        .then(data => {
          if (requestId !== requestIdRef.current) return;
          if (data.success && data.results) {
            setResults({
              surahs: matchedSurahs.length > 0 ? matchedSurahs : (data.results.surahs || []),
              ayahs: data.results.ayahs || []
            });
          } else {
            setResults({ surahs: matchedSurahs, ayahs: [] });
          }
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setResults({ surahs: matchedSurahs, ayahs: [] });
        })
        .finally(() => {
          if (requestId === requestIdRef.current) {
            setIsSearching(false);
          }
        });
    }, 220);

    return () => {
      clearTimeout(timeout);
      requestIdRef.current += 1;
    };
  }, [query]);

  if (!isOpen) return null;

  const handleSelectSurah = (surahNumber: number) => {
    navigate(`/quran/${surahNumber}`);
    onClose();
  };

  const handleSelectAyah = (surahNumber: number, ayahNumber: number) => {
    navigate(`/quran/${surahNumber}?ayah=${ayahNumber}`);
    onClose();
  };

  const popularShortcuts = [
    { num: 1, name: 'আল-ফাতিহা' },
    { num: 2, name: 'আল-বাক্বারাহ' },
    { num: 18, name: 'আল-কাহফ' },
    { num: 36, name: 'ইয়াসীন' },
    { num: 55, name: 'আর-রহমান' },
    { num: 67, name: 'আল-মুলক' },
    { num: 112, name: 'আল-ইখলাস' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center sm:pt-16 px-0 sm:px-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: 'fadeIn 200ms ease-out' }}
    >
      <div 
        className="w-full max-w-2xl bg-[#FAF8F2] dark:bg-[#111C19] sm:rounded-2xl shadow-2xl border-0 sm:border border-[#B38A42]/30 overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[85vh]"
        style={{ animation: 'slideInModal 350ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-4 border-b border-[#B38A42]/20 flex items-center gap-3 bg-white dark:bg-[#162622] sticky top-0 z-10 shadow-sm">
          <Search className="w-5 h-5 text-[#B38A42] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="সূরা নম্বর, নাম (বাংলা/আরবি/ইংরেজি), অথবা আয়াতের অর্থ অনুসন্ধান..."
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base font-bengali"
          />
          {isSearching && <Loader2 className="w-4 h-4 sm:w-4 sm:h-4 animate-spin text-[#B38A42] shrink-0" />}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="অনুসন্ধান বন্ধ করুন"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results / Quick Suggestions */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!query && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-bengali">
                দ্রুত প্রবেশিকা (জনপ্রিয় সূরাসমূহ)
              </p>
              <div className="flex flex-wrap gap-2">
                {popularShortcuts.map((s) => (
                  <button
                    key={s.num}
                    onClick={() => handleSelectSurah(s.num)}
                    className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0B3D32] dark:text-emerald-200 hover:bg-[#B38A42] hover:text-white dark:hover:bg-[#B38A42] hover:border-[#B38A42] transition-all text-xs font-bengali flex items-center gap-2 cursor-pointer min-h-[44px] active:scale-95">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">সূরা {s.name} ({s.num})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Surah Matches */}
          {results.surahs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-bengali">
                সূরা ফলাফল ({results.surahs.length})
              </p>
              <div className="grid grid-cols-1 gap-3">
                {results.surahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => handleSelectSurah(surah.number)}
                    className="w-full text-left p-4 rounded-xl bg-white dark:bg-[#162622] hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-gray-200 dark:border-gray-800 hover:border-[#B38A42] transition-all flex items-center justify-between group cursor-pointer min-h-[72px] active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-10 h-10 rounded-lg bg-[#0B3D32] dark:bg-[#B38A42] text-white flex items-center justify-center font-mono text-sm font-bold flex-shrink-0">
                        {surah.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base text-gray-900 dark:text-white font-bengali truncate">
                          সূরা {surah.bengaliName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{surah.englishName} • {surah.verseCount} আয়াত</p>
                      </div>
                    </div>
                    <span className="font-quran text-lg text-[#B38A42] flex-shrink-0 ml-2">
                      {surah.arabicName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ayah Matches */}
          {results.ayahs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-bengali">
                আয়াত ফলাফল ({results.ayahs.length})
              </p>
              <div className="space-y-3">
                {results.ayahs.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAyah(item.surahNumber, item.ayah.numberInSurah)}
                    className="w-full text-left p-4 rounded-xl bg-white dark:bg-[#162622] hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-gray-200 dark:border-gray-800 hover:border-[#B38A42] transition-all cursor-pointer group active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#0B3D32] dark:text-[#DFC186] font-semibold mb-2 font-bengali gap-2">
                      <span className="truncate">সূরা {item.surahNameBengali} — আয়াত {item.ayah.numberInSurah}</span>
                      <span className="font-quran text-sm text-[#B38A42] flex-shrink-0">{item.surahNameArabic}</span>
                    </div>
                    <p className="font-quran text-base sm:text-lg text-right text-gray-800 dark:text-gray-200 mb-2 leading-relaxed" dir="rtl">
                      {item.ayah.arabicText}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 font-bengali leading-relaxed">
                      {item.ayah.bengaliTranslation}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.surahs.length === 0 && results.ayahs.length === 0 && !isSearching && (
            <div className="text-center py-12 text-gray-500 font-bengali">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4">"{query}" এর জন্য কোনো সূরা বা আয়াত খুঁজে পাওয়া যায়নি</p>
              <p className="text-xs mt-2 text-gray-400">সূরা নম্বর বা সঠিক বাংলা/ইংরেজি বানানে পুনরায় চেষ্টা করুন।</p>
            </div>
          )}
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

        @keyframes slideInModal {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInModal {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInModal {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
};
