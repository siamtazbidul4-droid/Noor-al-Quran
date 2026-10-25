import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { JUZ_METADATA } from '../data/juzMetadata';
import { useAuth } from '../context/AuthContext';

export const JuzExplorerPage: React.FC = () => {
  const { progress } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] pb-32 transition-colors">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-quran text-2xl text-[#DFC186] block mb-2">
            أَجْزَاءُ الْقُرْآنِ الْكَرِيمِ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-bengali text-white mb-3">
            পবিত্র কুরআনের ৩০ পারা (Juz Explorer)
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-bengali max-w-xl mx-auto">
            কুরআনুল কারীমের সম্পূর্ণ ৩০টি পারার প্রামাণ্য সীমানা, প্রারম্ভিক ও সমাপনী আয়াত এবং সরাসরি পাঠ্য ব্যবস্থা।
          </p>
        </div>
      </section>

      {/* 30 Juz Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
          {JUZ_METADATA.map((juz) => {
            const isCompleted = progress.completedJuz?.includes(juz.juzNumber);

            return (
              <div
                key={juz.juzNumber}
                className="p-5 rounded-2xl bg-white dark:bg-[#162622] border border-gray-200 dark:border-gray-800 hover:border-[#B38A42] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-lg bg-[#0B3D32] text-white font-mono font-bold text-xs">
                      পারা {juz.juzNumber}
                    </span>
                    <span className="font-quran text-xl text-[#B38A42]">
                      {juz.arabicName}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 dark:text-white font-bengali group-hover:text-[#0B3D32] dark:group-hover:text-[#DFC186] transition-colors mb-1">
                    {juz.bengaliName}
                  </h3>
                  <p className="text-xs text-gray-500 italic mb-4">
                    {juz.transliteration}
                  </p>

                  {/* Boundary Box */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-1.5 sm:space-y-2 text-xs font-bengali">
                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span className="text-gray-400">শুরু:</span>
                      <span className="font-semibold text-right">
                        সূরা {juz.start.surahNameBengali} — আয়াত {juz.start.ayah}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span className="text-gray-400">সমাপ্তি:</span>
                      <span className="font-semibold text-right">
                        সূরা {juz.end.surahNameBengali} — আয়াত {juz.end.ayah}
                      </span>
                    </div>
                    <div className="pt-1 border-t border-gray-200/60 dark:border-gray-700 flex items-center justify-between text-gray-500">
                      <span>মোট আয়াত:</span>
                      <span className="font-mono font-bold text-[#B38A42]">{juz.verseCount}টি</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-bengali font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> সম্পন্ন
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-bengali">
                      প্রথম আয়াত থেকে শুরু
                    </span>
                  )}

                  <Link
                    to={`/quran/${juz.start.surah}?ayah=${juz.start.ayah}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B3D32] hover:bg-[#115545] text-white text-xs font-semibold font-bengali transition-colors shadow-sm cursor-pointer"
                  >
                    <span>পড়া শুরু করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
