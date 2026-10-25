import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Volume2,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Play
} from 'lucide-react';
import { SURAHS_METADATA } from '../data/surahMetadata';
import { JUZ_METADATA } from '../data/juzMetadata';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

export const HomePage: React.FC = () => {
  const { progress } = useAuth();
  const { playAyah } = useAudio();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'makki' | 'madani' | 'popular'>('popular');

  const popularSurahNumbers = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];

  const displayedSurahs = SURAHS_METADATA.filter(s => {
    if (filterType === 'makki') return s.revelationType === 'Makki';
    if (filterType === 'madani') return s.revelationType === 'Madani';
    if (filterType === 'popular') return popularSurahNumbers.includes(s.number);
    return true;
  }).slice(0, 12);

  // Deterministic verse of the day based on day of year
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dailyVerses = [
    {
      surah: 2,
      ayah: 255,
      surahName: "আল-বাক্বারাহ",
      arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ",
      bengali: "আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রাও স্পর্শ করতে পারে না, নিদ্রাও নয়।",
      title: "আয়াতুল কুরসী (Verse of the Throne)"
    },
    {
      surah: 1,
      ayah: 1,
      surahName: "আল-ফাতিহা",
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      bengali: "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।",
      title: "তাওহীদের সূচনা"
    },
    {
      surah: 112,
      ayah: 1,
      surahName: "আল-ইখলাস",
      arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ • ٱللَّهُ ٱلصَّمَدُ",
      bengali: "বলুন, তিনিই আল্লাহ, একক-অদ্বিতীয়। আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।",
      title: "একত্ববাদের ঘোষণা"
    }
  ];
  const dailyVerse = dailyVerses[dayOfYear % dailyVerses.length];

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] transition-colors pb-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B3D32] via-[#0D4438] to-[#111C19] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        
        {/* Subtle Islamic Motif Background Geometry */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B38A42_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Sacred Arabic Branding */}
          <div className="inline-block mb-3">
            <span className="font-quran text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#DFC186] drop-shadow-md tracking-wider">
              الْقُرْآنُ الْكَرِيمُ
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-bengali text-white mb-3 sm:mb-4">
            পবিত্র কুরআন পড়ুন, শুনুন ও বুঝুন
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-emerald-100/90 font-bengali leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
            বিশুদ্ধ উসমানী লিপির আরবি পাঠ্য, সর্বজনগ্রাহ্য বাংলা অনুবাদ, উচ্চারণ সহায়িকা এবং বিশ্ববিখ্যাত ক্বারীগণের বিশুদ্ধ তিলাওয়াত সমৃদ্ধ একটি পূর্ণাঙ্গ কুরআন প্ল্যাটফর্ম।
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to={`/quran/${progress.surahNumber}?ayah=${progress.ayahNumber}`}
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#B38A42] hover:bg-[#C29649] text-white font-semibold font-bengali shadow-lg shadow-black/20 flex items-center gap-2 sm:gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base cursor-pointer w-full xs:w-auto justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>কুরআন পড়ুন</span>
            </Link>

            <Link
              to="/audio"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-[#B38A42]/50 text-[#DFC186] font-semibold font-bengali shadow-md flex items-center gap-2 sm:gap-2.5 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer w-full xs:w-auto justify-center">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#B38A42]" />
              <span>তিলাওয়াত শুনুন</span>
            </Link>
          </div>

          {/* Continue Reading Card */}
          {progress && progress.surahNumber && (
            <div className="mt-8 sm:mt-10 max-w-md mx-auto p-3 sm:p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-[#B38A42]/40 text-left flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#B38A42] flex items-center justify-center text-white shrink-0">
                  <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-200 font-semibold font-bengali block">
                    সর্বশেষ পাঠ্য অবস্থান
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white font-bengali truncate">
                    সূরা {progress.surahNameBengali} — আয়াত {progress.ayahNumber}
                  </p>
                </div>
              </div>
              <Link
                to={`/quran/${progress.surahNumber}?ayah=${progress.ayahNumber}`}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold font-bengali flex items-center gap-1 transition-colors w-full xs:w-auto justify-center xs:justify-start shrink-0"
              >
                চালিয়ে যান <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-12">
        
        {/* Daily Verse Highlight */}
        <section className="bg-white dark:bg-[#162622] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-[#B38A42]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-[#B38A42]">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bengali">
                আজকের নির্ধারিত আয়াত • {dailyVerse.title}
              </h2>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-bengali">
              সূরা {dailyVerse.surahName} [{dailyVerse.surah}:{dailyVerse.ayah}]
            </span>
          </div>

          <div className="my-3 sm:my-4 text-right" dir="rtl">
            <p className="font-quran text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-[#DFC186] leading-relaxed">
              {dailyVerse.arabic}
            </p>
          </div>

          <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 font-bengali leading-relaxed mt-2">
            “{dailyVerse.bengali}”
          </p>

          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
            <button
              onClick={() => playAyah(dailyVerse.surah, dailyVerse.ayah)}
              className="flex items-center gap-2 text-xs font-semibold text-[#0B3D32] dark:text-[#DFC186] hover:underline font-bengali cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#B38A42]" />
              তিলাওয়াত শুনুন
            </button>
            <Link
              to={`/quran/${dailyVerse.surah}?ayah=${dailyVerse.ayah}`}
              className="text-xs font-semibold text-[#B38A42] hover:underline flex items-center gap-1 font-bengali"
            >
              সম্পূর্ণ সূরা পড়ুন <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 30 Juz Explorer Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#B38A42]" />
                পবিত্র কুরআনের ৩০ পারা (Juz Explorer)
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bengali">
                প্রতিটি পারার প্রথম ও শেষ আয়াত নির্দেশক সঠিক ম্যাপিং
              </p>
            </div>
            <Link
              to="/juz"
              className="text-xs sm:text-sm font-semibold text-[#B38A42] hover:underline flex items-center gap-1 font-bengali"
            >
              সকল ৩০ পারা দেখুন <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {JUZ_METADATA.slice(0, 12).map((juz) => (
              <Link
                key={juz.juzNumber}
                to={`/quran/${juz.start.surah}?ayah=${juz.start.ayah}`}
                className="p-3.5 rounded-xl bg-white dark:bg-[#162622] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200 dark:border-gray-800 transition-all hover:border-[#B38A42] group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-md bg-[#0B3D32] text-white flex items-center justify-center text-xs font-bold font-mono">
                    {juz.juzNumber}
                  </span>
                  <span className="font-quran text-sm text-[#B38A42]">
                    {juz.arabicName}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white font-bengali truncate group-hover:text-[#0B3D32] dark:group-hover:text-[#DFC186]">
                    {juz.bengaliName}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bengali mt-0.5 truncate">
                    সূরা {juz.start.surahNameBengali} ({juz.start.ayah})
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Surah Explorer Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B38A42]" />
                সূরা সম্ভার (১১৪টি সূরা)
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bengali">
                প্রামাণ্য উসমানী পাঠ্য ও নির্ভরযোগ্য বাংলা অর্থসহ
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl text-xs font-bengali">
              {(['popular', 'all', 'makki', 'madani'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize font-semibold ${
                    filterType === type
                      ? 'bg-white dark:bg-[#162622] text-[#0B3D32] dark:text-[#DFC186] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type === 'popular' && 'জনপ্রিয়'}
                  {type === 'all' && 'সকল'}
                  {type === 'makki' && 'মাক্কী'}
                  {type === 'madani' && 'মাদানী'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedSurahs.map((surah) => (
              <div
                key={surah.number}
                className="p-4 rounded-xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 hover:border-[#B38A42]/60 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <Link
                  to={`/quran/${surah.number}`}
                  className="flex items-center gap-3.5 flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[#0B3D32] dark:text-emerald-300 flex items-center justify-center font-mono font-bold text-sm shrink-0 group-hover:bg-[#B38A42] group-hover:text-white transition-colors">
                    {surah.number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white font-bengali truncate group-hover:text-[#0B3D32] dark:group-hover:text-[#DFC186]">
                      সূরা {surah.bengaliName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bengali">
                      <span>{surah.englishName}</span>
                      <span>•</span>
                      <span>{surah.verseCount} আয়াত</span>
                      <span>•</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800">
                        {surah.revelationType === 'Makki' ? 'মাক্কী' : 'মাদানী'}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 pl-3 shrink-0">
                  <span className="font-quran text-lg text-[#B38A42]">
                    {surah.arabicName}
                  </span>
                  <Link
                    to={`/quran/${surah.number}`}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-400 hover:text-[#0B3D32] dark:hover:text-[#DFC186]"
                    title="পড়ুন"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/surahs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-[#162622] border border-[#B38A42]/40 text-[#0B3D32] dark:text-[#DFC186] font-semibold text-sm hover:bg-[#B38A42] hover:text-white dark:hover:bg-[#B38A42] transition-colors font-bengali shadow-sm cursor-pointer"
            >
              সকল ১১৪টি সূরার তালিকা দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Content Authority & Licensing Notice */}
        <section className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-[#B38A42]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B38A42] text-white flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-bengali text-[#DFC186]">
                প্রামাণ্য ধর্মীয় উৎস ও বিশুদ্ধতা অঙ্গীকার
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-bengali leading-relaxed mt-1 max-w-2xl">
                নূর আল-কুরআনে কোনো কৃত্রিম বুদ্ধিমত্তা (AI) দ্বারা আয়াত, অর্থ বা তিলাওয়াত তৈরি করা হয় না। আরবি পাঠ্য তানজীল (Tanzil.net) উসমানী লিপি থেকে, বাংলা অনুবাদ ইসলামিক ফাউন্ডেশন বাংলাদেশ কর্তৃক অনুমোদিত মাওলানা মুহিউদ্দীন খানের প্রামাণ্য অনুবাদ এবং তিলাওয়াত বিশ্বনন্দিত ক্বারীদের আসল কণ্ঠ থেকে সংগৃহীত।
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-xs text-emerald-200 border border-emerald-700 whitespace-nowrap font-bengali shrink-0 cursor-pointer"
          >
            উৎস যাচাইকরণ রিপোর্ট
          </Link>
        </section>
      </main>
    </div>
  );
};
