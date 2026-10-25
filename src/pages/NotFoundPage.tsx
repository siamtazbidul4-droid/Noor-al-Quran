import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#111C19] text-[#111C19] dark:text-[#FAF8F2] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5 p-8 bg-white dark:bg-[#162622] rounded-3xl shadow-xl border border-[#B38A42]/30">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-[#B38A42] flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-mono text-[#0B3D32] dark:text-[#DFC186]">
          404
        </h1>
        <h2 className="text-xl font-bold font-bengali">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-bengali leading-relaxed">
          আপনি যে ঠিকানাটি অনুসন্ধান করছেন তা পরিবর্তিত হতে পারে অথবা পৃষ্ঠাটি বিদ্যমান নেই।
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-[#0B3D32] text-white text-xs font-semibold font-bengali flex items-center gap-2 hover:bg-[#115545] transition-colors"
          >
            <Home className="w-4 h-4" />
            মূলপাতায় ফিরুন
          </Link>
          <Link
            to="/surahs"
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold font-bengali flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            সূরা তালিকা
          </Link>
        </div>
      </div>
    </div>
  );
};
