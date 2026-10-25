import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { SURAHS_METADATA } from '../data/surahMetadata';
import { isSearchMatch } from '../utils/searchNormalization';
import { useAudio } from '../context/AudioContext';

export const SurahExplorerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'makki' | 'madani'>('all');
  const { playSurah, reciterId } = useAudio();

  const filteredSurahs = SURAHS_METADATA.filter(surah => {
    // Type filter
    if (filterType === 'makki' && surah.revelationType !== 'Makki') return false;
    if (filterType === 'madani' && surah.revelationType !== 'Madani') return false;

    // Search filter
    if (!searchQuery.trim()) return true;
    const qNum = parseInt(searchQuery.trim(), 10);
    if (!isNaN(qNum) && surah.number === qNum) return true;
    if (isSearchMatch(searchQuery, surah.arabicName, true)) return true;
    if (isSearchMatch(searchQuery, surah.bengaliName, false)) return true;
    if (isSearchMatch(searchQuery, surah.englishName, false)) return true;
    if (isSearchMatch(searchQuery, surah.bengaliMeaning, false)) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] pb-32 transition-colors">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-quran text-2xl text-[#DFC186] block mb-2">
            فِهْرِسُ السُّوَرِ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-bengali text-white mb-3">
            আল-কুরআনের সকল ১১৪টি সূরা
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-bengali max-w-xl mx-auto">
            পবিত্র কুরআনের ১১৪টি সূরার নাম, অবতীর্ণ হওয়ার স্থান, আয়াত সংখ্যা এবং তাফসীরী অনুবাদে সরাসরি প্রবেশ করুন।
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সূরার নাম (বাংলা / আরবি / ইংরেজি) বা নম্বর দিয়ে খুঁজুন..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#162622] text-gray-900 dark:text-gray-100 placeholder-gray-400 border border-[#B38A42]/30 focus:outline-none focus:ring-2 focus:ring-[#B38A42] font-bengali text-sm shadow-md"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-emerald-950/80 p-0.5 sm:p-1 rounded-xl border border-emerald-800 text-xs font-bengali shrink-0 w-full sm:w-auto justify-stretch sm:justify-start">
              {(['all', 'makki', 'madani'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all cursor-pointer flex-1 sm:flex-none ${
                    filterType === f
                      ? 'bg-[#B38A42] text-white shadow-sm'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  {f === 'all' && 'সকল (১১৪)'}
                  {f === 'makki' && 'মাক্কী (৮৬)'}
                  {f === 'madani' && 'মাদানী (২৮)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Surahs Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-gray-500 font-bengali">
          <span>মোট সূরা: {filteredSurahs.length}টি</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#B38A42] hover:underline cursor-pointer"
            >
              অনুসন্ধান মুছুন
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200/90 dark:border-gray-800 hover:border-[#B38A42] hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#0B3D32] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                      {surah.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white font-bengali group-hover:text-[#0B3D32] dark:group-hover:text-[#DFC186] transition-colors">
                        সূরা {surah.bengaliName}
                      </h3>
                      <p className="text-xs text-gray-500 font-bengali">
                        {surah.englishName} ({surah.englishMeaning})
                      </p>
                    </div>
                  </div>

                  <span className="font-quran text-2xl text-[#B38A42]">
                    {surah.arabicName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-bengali my-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                    {surah.revelationType === 'Makki' ? 'মাক্কী' : 'মাদানী'}
                  </span>
                  <span>•</span>
                  <span>{surah.verseCount} আয়াত</span>
                  <span>•</span>
                  <span>পারা {surah.juz.join(', ')}</span>
                  <span>•</span>
                  <span>রুকু {surah.rukus}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => playSurah(surah.number, reciterId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-bengali transition-colors cursor-pointer"
                  title="সূরা তিলাওয়াত শুনুন"
                >
                  <Volume2 className="w-4 h-4 text-[#B38A42]" />
                  শুনুন
                </button>

                <Link
                  to={`/quran/${surah.number}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B3D32] hover:bg-[#115545] text-white text-xs font-semibold font-bengali shadow-sm transition-colors cursor-pointer"
                >
                  <span>পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="py-20 text-center text-gray-500 font-bengali">
            <p className="text-base">কোনো সূরা খুঁজে পাওয়া যায়নি।</p>
            <p className="text-xs text-gray-400 mt-1">অন্য কোনো বানান বা সূরা নম্বর ব্যবহার করে অনুসন্ধান করুন।</p>
          </div>
        )}
      </main>
    </div>
  );
};
