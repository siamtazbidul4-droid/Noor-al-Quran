import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Volume2,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Search,
  Radio,
  UserCheck
} from 'lucide-react';
import { RECITERS } from '../data/recitersData';
import { SURAHS_METADATA } from '../data/surahMetadata';
import { useAudio } from '../context/AudioContext';

export const AudioLibraryPage: React.FC = () => {
  const { currentTrack, isPlaying, playSurah, togglePlay, reciterId, setReciter } = useAudio();
  const [searchSurah, setSearchSurah] = useState('');

  const selectedReciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];

  const filteredSurahs = SURAHS_METADATA.filter(s => {
    if (!searchSurah.trim()) return true;
    const q = searchSurah.toLowerCase().trim();
    return (
      s.number.toString() === q ||
      s.bengaliName.includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.arabicName.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] pb-32 transition-colors">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-quran text-2xl text-[#DFC186] block mb-2">
            تِلَاوَاتُ الْقُرْآنِ الْكَرِيمِ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-bengali text-white mb-3">
            বিশুদ্ধ তিলাওয়াত লাইব্রেরি (Authentic Audio)
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-bengali max-w-xl mx-auto">
            বিশ্ববিখ্যাত প্রামাণ্য ক্বারীগণের সুললিত কণ্ঠে ১১৪টি সূরার পূর্ণাঙ্গ ও আয়াতভিত্তিক বিশুদ্ধ তিলাওয়াত।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Reciter Selector Cards */}
        <div>
          <h2 className="text-lg font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#B38A42]" />
            সম্মানিত ক্বারী নির্বাচন করুন
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {RECITERS.map((r) => {
              const isSelected = r.id === reciterId;
              return (
                <button
                  key={r.id}
                  onClick={() => setReciter(r.id)}
                  className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-900/90 text-white border-[#B38A42] ring-2 ring-[#B38A42]/40 shadow-lg'
                      : 'bg-white dark:bg-[#162622] text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800 hover:border-[#B38A42]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-quran text-lg text-[#DFC186]">
                        {r.nameArabic}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B38A42] text-white font-bengali">
                          নির্বাচিত
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base font-bengali">
                      {r.nameBengali}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5 font-bengali">{r.style}</p>
                    <p className="text-xs opacity-75 mt-2 line-clamp-2 font-bengali leading-relaxed">
                      {r.bioBengali}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 dark:border-gray-800 text-[11px] opacity-70 font-bengali">
                    উৎস: {r.attribution}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Reciter Surah Playlist */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold font-bengali text-[#0B3D32] dark:text-[#DFC186] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#B38A42]" />
                {selectedReciter.nameBengali} — পূর্ণাঙ্গ সূরা প্লেলিস্ট
              </h2>
              <p className="text-xs text-gray-500 font-bengali">
                ১১৪টি সূরার হাই-কোয়ালিটি অডিও স্ট্রিমিং
              </p>
            </div>

            {/* Quick search */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchSurah}
                onChange={(e) => setSearchSurah(e.target.value)}
                placeholder="সূরার নাম দিয়ে ফিল্টার..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#162622] border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#B38A42] font-bengali"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {filteredSurahs.map((surah) => {
              const isCurrentSurahPlaying =
                isPlaying && currentTrack?.surahNumber === surah.number;

              return (
                <div
                  key={surah.number}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    isCurrentSurahPlaying
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-[#B38A42] ring-1 ring-[#B38A42]'
                      : 'bg-white dark:bg-[#162622] border-gray-200 dark:border-gray-800 hover:border-[#B38A42]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => {
                        if (isCurrentSurahPlaying) togglePlay();
                        else playSurah(surah.number, reciterId);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
                        isCurrentSurahPlaying
                          ? 'bg-[#B38A42] text-white'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-[#0B3D32] dark:text-emerald-300 group-hover:bg-[#B38A42] group-hover:text-white'
                      }`}
                      aria-label={`Play Surah ${surah.number}`}
                    >
                      {isCurrentSurahPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm font-bengali text-gray-900 dark:text-white truncate">
                        {surah.number}. {surah.bengaliName}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-bengali">
                        {surah.verseCount} আয়াত
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/quran/${surah.number}`}
                    className="text-gray-400 hover:text-[#B38A42] p-1.5 rounded-lg transition-colors"
                    title="পাঠ্য দেখুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audio Licensing & Quality Documentation */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#162622] border border-[#B38A42]/30 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#B38A42] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base font-bengali text-gray-900 dark:text-white mb-1">
              তিলাওয়াত অধিকার ও উৎস পরিচিতি
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bengali leading-relaxed">
              নূর আল-কুরআনের অডিওসমূহ এভরিআয়া (EveryAyah.com) ও এমপিথ্রিকুরআন (MP3Quran.net) এর পাবলিক ইসলামিক ওয়াকফ রিপোজিটরি থেকে সরাসরি সিডিএন (CDN) মাধ্যমে পরিবেশিত। এতে কোনো সিন্থেটিক বা এআই-জেনারেটেড কণ্ঠ ব্যবহার করা হয়নি; সকল তিলাওয়াত বিশ্বনন্দিত মূল ক্বারীগণের আসল কণ্ঠের রেকর্ডিং।
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
