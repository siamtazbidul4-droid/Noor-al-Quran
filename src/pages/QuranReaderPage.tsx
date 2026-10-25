import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  RotateCcw,
  Volume2,
  Loader2,
  BookOpen
} from 'lucide-react';
import { SURAHS_METADATA } from '../data/surahMetadata';
import { RECITERS } from '../data/recitersData';
import { Ayah } from '../data/quranDataset';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

export const QuranReaderPage: React.FC = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentSurahNum = parseInt(surahNumber || '1', 10);
  const targetAyahParam = searchParams.get('ayah');
  const targetAyahNum = targetAyahParam ? parseInt(targetAyahParam, 10) : null;

  // Validate surah and ayah numbers
  if (isNaN(currentSurahNum) || currentSurahNum < 1 || currentSurahNum > 114) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] text-[#111C19] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 font-bengali">অবৈধ সূরা সংখ্যা</h1>
          <p className="text-lg text-gray-600 mb-6">সূরা ১ থেকে ১১৪ এর মধ্যে থাকতে হবে।</p>
          <a href="/quran/1" className="px-6 py-2 bg-[#0B3D32] text-white rounded-lg">প্রথম সূরায় যান</a>
        </div>
      </div>
    );
  }

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);

  const { progress, updateProgress, bookmarks, addBookmark, deleteBookmark, preferences, updatePreferences } = useAuth();
  const {
    currentTrack,
    isPlaying,
    playAyah,
    playSurah,
    togglePlay,
    reciterId,
    setReciter,
    setPlaybackMode
  } = useAudio();

  const surahMeta = SURAHS_METADATA[currentSurahNum - 1] || SURAHS_METADATA[0];
  const verseRefs = useRef<{ [key: number]: HTMLElement | null }>({});
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Fetch Ayahs for the current Surah
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/v1/quran/surahs/${currentSurahNum}/ayahs?reciter=${reciterId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load verses');
        return res.json();
      })
      .then(data => {
        if (!isCancelled) {
          if (data.success && data.data) {
            setAyahs(data.data);
            // Validate targetAyahNum before saving progress
            const surahMeta = SURAHS_METADATA[currentSurahNum - 1];
            const validAyahNum = (targetAyahNum && targetAyahNum >= 1 && targetAyahNum <= surahMeta.verseCount) ? targetAyahNum : 1;
            updateProgress(currentSurahNum, validAyahNum);
          } else {
            setError(data.error || 'Failed to fetch surah data');
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setError(err.message || 'Error connecting to Quran service');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentSurahNum, reciterId]);

  // Scroll to target ayah if present in URL
  useEffect(() => {
    if (!loading && targetAyahNum && verseRefs.current[targetAyahNum]) {
      setTimeout(() => {
        verseRefs.current[targetAyahNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [loading, targetAyahNum]);

  // Copy Arabic + Bengali text
  const handleCopy = (ayah: Ayah) => {
    const textToCopy = `${ayah.arabicText}\n\nউচ্চারণ: ${ayah.bengaliTransliteration}\n\nঅনুবাদ: ${ayah.bengaliTranslation}\n[সূরা ${surahMeta.bengaliName}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedAyah(ayah.numberInSurah);
      setTimeout(() => setCopiedAyah(null), 2000);
    });
  };

  // Share verse URL
  const handleShare = (ayahNumber: number) => {
    const url = `${window.location.origin}/quran/${currentSurahNum}?ayah=${ayahNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `সূরা ${surahMeta.bengaliName} — আয়াত ${ayahNumber}`,
        text: `পবিত্র কুরআন থেকে সূরা ${surahMeta.bengaliName}-এর ${ayahNumber} নম্বর আয়াত পড়ুন:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedAyah(ayahNumber);
        setTimeout(() => setCopiedAyah(null), 2000);
      });
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahNum > 1) {
      navigate(`/quran/${currentSurahNum - 1}`);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahNum < 114) {
      navigate(`/quran/${currentSurahNum + 1}`);
    }
  };

  const isAyahPlaying = (ayahNumber: number) => {
    return (
      isPlaying &&
      currentTrack?.type === 'ayah' &&
      currentTrack?.surahNumber === currentSurahNum &&
      currentTrack?.ayahNumber === ayahNumber
    );
  };

  const isBookmarked = (ayahNumber: number) => {
    return bookmarks.some(b => b.surahNumber === currentSurahNum && b.ayahNumber === ayahNumber);
  };

  const toggleBookmark = (ayahNumber: number) => {
    const existing = bookmarks.find(b => b.surahNumber === currentSurahNum && b.ayahNumber === ayahNumber);
    if (existing) {
      deleteBookmark(existing.id);
    } else {
      addBookmark(currentSurahNum, ayahNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] pb-32 transition-colors">
      
      {/* Top Header & Sticky Navigation Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[#FAF8F2]/95 dark:bg-[#111C19]/95 backdrop-blur-md border-b border-[#B38A42]/20 py-2 sm:py-3 px-3 sm:px-4 lg:px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          
          {/* Surah Dropdown Selector */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <select
              value={currentSurahNum}
              onChange={(e) => navigate(`/quran/${e.target.value}`)}
              className="bg-white dark:bg-[#162622] border border-gray-300 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold font-bengali text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#B38A42] cursor-pointer w-full sm:w-auto min-w-0"
              aria-label="Select Surah"
            >
              {SURAHS_METADATA.map(s => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.bengaliName} ({s.englishName}) — {s.verseCount} আয়াত
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions & View Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
            <button
              onClick={() => playSurah(currentSurahNum, reciterId)}
              className="px-2 sm:px-3 py-1.5 rounded-lg bg-[#0B3D32] hover:bg-[#115545] text-white text-[10px] sm:text-xs font-semibold font-bengali flex items-center gap-1 sm:gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="সম্পূর্ণ সূরা তিলাওয়াত শুনুন"
            >
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFC186]" />
              <span className="hidden sm:inline">পূর্ণাঙ্গ সূরা শুনুন</span>
              <span className="sm:hidden">শুনুন</span>
            </button>

            <button
              onClick={() => setShowControls(!showControls)}
              className={`p-1.5 sm:p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                showControls
                  ? 'bg-[#B38A42] text-white border-[#B38A42]'
                  : 'bg-white dark:bg-[#162622] text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
              }`}
              title="পাঠক সেটিংস (হরফের আকার ও অনুবাদ প্রদর্শন)"
              aria-label="Toggle reader settings"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Reader Customization Settings Drawer */}
        {showControls && (
          <div className="max-w-5xl mx-auto mt-2 sm:mt-3 p-3 sm:p-4 bg-white dark:bg-[#162622] rounded-xl border border-[#B38A42]/30 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in duration-150">
            {/* Arabic Font Size Slider */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 font-bengali block mb-1">
                আরবি হরফের আকার ({preferences.arabicFontSize}px)
              </label>
              <input
                type="range"
                min="20"
                max="44"
                step="2"
                value={preferences.arabicFontSize}
                onChange={(e) => updatePreferences({ arabicFontSize: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#B38A42]"
              />
            </div>

            {/* Reciter Selector */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 font-bengali block mb-1">
                ক্বারী নির্বাচন
              </label>
              <select
                value={reciterId}
                onChange={(e) => setReciter(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 sm:px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200"
              >
                {RECITERS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nameBengali}
                  </option>
                ))}
              </select>
            </div>

            {/* Translation Visibility */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 font-bengali">
                বাংলা অনুবাদ
              </label>
              <button
                onClick={() => updatePreferences({ showTranslation: !preferences.showTranslation })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  preferences.showTranslation ? 'bg-[#0B3D32]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.showTranslation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Transliteration Visibility */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 font-bengali">
                বাংলা উচ্চারণ
              </label>
              <button
                onClick={() => updatePreferences({ showTransliteration: !preferences.showTransliteration })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  preferences.showTransliteration ? 'bg-[#0B3D32]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.showTransliteration ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Bengali Translation Audio Toggle */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex flex-col min-w-0">
                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 font-bengali truncate">
                  বাংলা অর্থের অডিও
                </label>
                {!speechSupported && (
                  <span className="text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-300 font-bengali">
                    এই ডিভাইসে উপলব্ধ নয়
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  const enabled = !preferences.bengaliAudioEnabled;
                  updatePreferences({ bengaliAudioEnabled: enabled });
                  setPlaybackMode(enabled ? 'arabic-bangla' : 'arabic');
                }}
                disabled={!speechSupported}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  !speechSupported
                    ? 'bg-gray-300 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                    : preferences.bengaliAudioEnabled
                    ? 'bg-[#0B3D32] cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-pointer'
                }`}
                aria-label="Toggle Bengali translation audio"
                title={speechSupported ? 'বাংলা অর্থের অডিও চালু/বন্ধ করুন' : 'এই ব্রাউজারে বাংলা ভাষার টেক্সট-টু-স্পিচ উপলব্ধ নয়'}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.bengaliAudioEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Reader Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Surah Header Banner */}
        <div className="text-center p-5 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white shadow-xl border border-[#B38A42]/40 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#B38A42]/30 text-[#DFC186] border border-[#B38A42]/40 font-bengali inline-block mb-2">
              {surahMeta.revelationType === 'Makki' ? 'মাক্কী সূরা' : 'মাদানী সূরা'} • সূরা নং {surahMeta.number} • পারা {surahMeta.juz.join(', ')}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali text-white mb-2">
              সূরা {surahMeta.bengaliName}
            </h1>
            <p className="font-quran text-2xl sm:text-3xl lg:text-4xl text-[#DFC186] mb-2 sm:mb-3">
              {surahMeta.arabicName}
            </p>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-bengali">
              অর্থ: {surahMeta.bengaliMeaning} ({surahMeta.englishMeaning}) • মোট আয়াত: {surahMeta.verseCount}টি
            </p>

            {/* Bismillah (Except Surah 9 At-Tawbah and Surah 1 Al-Fatihah where it's ayah 1) */}
            {currentSurahNum !== 9 && currentSurahNum !== 1 && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[#B38A42]/30 text-center">
                <p className="font-quran text-xl sm:text-2xl lg:text-3xl text-[#DFC186]" dir="rtl">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
                <p className="text-[10px] sm:text-xs text-emerald-200/80 font-bengali mt-1">
                  শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#B38A42] mx-auto" />
            <p className="text-sm font-bengali text-gray-600 dark:text-gray-400">
              প্রামাণ্য কুরআন পাঠ্য লোড হচ্ছে...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-bengali font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#0B3D32] text-white text-xs font-bengali cursor-pointer"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Verses List */}
        {!loading && !error && ayahs.length > 0 && (
          <div className="space-y-4">
            {ayahs.map((ayah) => {
              const playing = isAyahPlaying(ayah.numberInSurah);
              const bookmarked = isBookmarked(ayah.numberInSurah);
              const isTargeted = targetAyahNum === ayah.numberInSurah;

              return (
                <article
                  key={ayah.numberInSurah}
                  ref={el => { verseRefs.current[ayah.numberInSurah] = el; }}
                  className={`p-5 sm:p-6 rounded-2xl transition-all border ${
                    playing
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-[#B38A42] ring-2 ring-[#B38A42]/30 shadow-md'
                      : isTargeted
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-[#162622] border-gray-200/80 dark:border-gray-800 hover:border-[#B38A42]/40 shadow-sm'
                  }`}
                >
                  {/* Verse Top Bar (Ayah reference & Action Controls) */}
                  <div className="flex items-center justify-between pb-2 sm:pb-3 mb-3 sm:mb-4 border-b border-gray-100 dark:border-gray-800/80 text-xs flex-wrap gap-2">
                    <span className="font-mono font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#0B3D32] text-white text-[10px] sm:text-[11px] shadow-sm">
                      {surahMeta.number}:{ayah.numberInSurah}
                    </span>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {/* Play Ayah Audio */}
                      <button
                        onClick={() => {
                          if (playing) togglePlay();
                          else playAyah(currentSurahNum, ayah.numberInSurah, reciterId);
                        }}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                          playing
                            ? 'bg-[#B38A42] text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                        title={playing ? "তিলাওয়াত থামান" : "এই আয়াত শুনুন"}
                        aria-label={`Play Ayah ${ayah.numberInSurah}`}
                      >
                        {playing ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />}
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                          bookmarked
                            ? 'text-[#B38A42] bg-amber-50 dark:bg-amber-950/60'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}
                        title={bookmarked ? "বুকমার্ক থেকে মুছুন" : "বুকমার্ক করুন"}
                        aria-label="Bookmark ayah"
                      >
                        <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(ayah)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                        title="আয়াত ও অনুবাদ অনুলিপি করুন"
                        aria-label="Copy ayah text"
                      >
                        {copiedAyah === ayah.numberInSurah ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(ayah.numberInSurah)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                        title="আয়াতের লিংক শেয়ার করুন"
                        aria-label="Share ayah link"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Canonical Arabic Text */}
                  <div className="my-3 sm:my-4 text-right" dir="rtl">
                    <p
                      className="font-quran leading-loose text-gray-900 dark:text-[#DFC186]"
                      style={{ fontSize: `${preferences.arabicFontSize}px`, lineHeight: 2.3 }}
                    >
                      {ayah.arabicText}
                      <span className="inline-block mx-2 text-[#B38A42] text-sm select-none font-bold">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </p>
                  </div>

                  {/* Bengali Transliteration (উচ্চারণ) */}
                  {preferences.showTransliteration && ayah.bengaliTransliteration && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bengali block mb-1">
                        উচ্চারণ:
                      </span>
                      <p className="text-sm font-bengali text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        {ayah.bengaliTransliteration}
                      </p>
                    </div>
                  )}

                  {/* Bengali Translation (অনুবাদ) */}
                  {preferences.showTranslation && ayah.bengaliTranslation && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38A42] font-bengali block mb-1">
                        অনুবাদ (মাওলানা মুহিউদ্দীন খান):
                      </span>
                      <p className="text-base font-bengali text-gray-800 dark:text-gray-100 leading-relaxed">
                        {ayah.bengaliTranslation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Surah Navigation Footer */}
        <div className="pt-8 pb-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 font-bengali">
          <button
            onClick={handlePrevSurah}
            disabled={currentSurahNum <= 1}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#162622] border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            পূর্ববর্তী সূরা
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            শীর্ষে ফিরে যান
          </button>

          <button
            onClick={handleNextSurah}
            disabled={currentSurahNum >= 114}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#162622] border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            পরবর্তী সূরা
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
