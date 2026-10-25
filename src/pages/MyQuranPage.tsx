import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MyQuranPage: React.FC = () => {
  const { progress, bookmarks, deleteBookmark } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#111C19] pb-32 transition-colors">
      <section className="bg-gradient-to-b from-[#0B3D32] to-[#111C19] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#B38A42]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <span className="font-quran text-xl sm:text-2xl text-[#DFC186] block mb-1">مَكْتَبَتِي الْقُرْآنِيَّة</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-bengali text-white mb-2">
              আমার কুরআন পঠন তালিকা
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-bengali">
              সর্বশেষ অবস্থান ও সংরক্ষিত আয়াতগুলো এখানেই রাখা হয়, কোনো লগইন বা অ্যাকাউন্ট ছাড়াই।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#B38A42]/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B38A42] flex items-center justify-center text-white shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-bengali">লোকাল মেমোরি মোড</div>
              <p className="text-xs text-emerald-200/80 font-bengali">অতিরিক্ত অ্যাকাউন্ট লাগে না</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <section className="p-4 sm:p-6 rounded-2xl bg-white border border-[#B38A42]/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B3D32] text-[#DFC186] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-bengali">
                সর্বশেষ পঠিত আয়াত
              </span>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 font-bengali mt-0.5 truncate">
                সূরা {progress.surahNameBengali || `সূরা ${progress.surahNumber}`} — আয়াত {progress.ayahNumber}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bengali truncate">
                আপডেট: {new Date(progress.updatedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <Link
            to={`/quran/${progress.surahNumber}?ayah=${progress.ayahNumber}`}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0B3D32] hover:bg-[#115545] text-white text-xs sm:text-sm font-semibold font-bengali shadow-md transition-colors cursor-pointer w-full sm:w-auto text-center"
          >
            পড়া চালিয়ে যান
          </Link>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-bengali text-[#0B3D32] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#B38A42]" />
              সংরক্ষিত আয়াতসমূহ ({bookmarks.length}টি)
            </h2>
          </div>

          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#B38A42] transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {b.surahNumber}:{b.ayahNumber}
                      </span>
                      <span className="font-quran text-base text-[#B38A42]">{b.surahNameArabic}</span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 font-bengali">সূরা {b.surahNameBengali}</h4>
                    <p className="text-xs text-gray-500 font-bengali mt-0.5">আয়াত নম্বর {b.ayahNumber}</p>
                    {b.note && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg font-bengali italic">
                        "{b.note}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => deleteBookmark(b.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="বুকমার্ক মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/quran/${b.surahNumber}?ayah=${b.ayahNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3D32] hover:underline font-bengali"
                    >
                      খুলুন
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#B38A42]/40 bg-white/70 p-8 text-center">
              <Bookmark className="w-8 h-8 mx-auto text-[#B38A42] mb-3" />
              <h3 className="text-lg font-bold text-[#0B3D32] font-bengali">কোনো বুকমার্ক নেই</h3>
              <p className="text-sm text-gray-500 font-bengali mt-1">কুরআন পাঠের সময় আপনার পছন্দের আয়াতগুলো সংরক্ষণ করুন।</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
