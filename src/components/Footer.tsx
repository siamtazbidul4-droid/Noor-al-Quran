import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Volume2, ListOrdered, Search } from 'lucide-react';

interface FooterLink {
  to: string;
  labelBn: string;
  labelEn: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const quranLinks: FooterLink[] = [
  { to: '/surahs', labelBn: 'সূরা তালিকা', labelEn: 'Surahs', icon: BookOpen },
  { to: '/juz', labelBn: '৩০ পারা', labelEn: '30 Juz', icon: ListOrdered },
  { to: '/quran/1', labelBn: 'কুরআন পাঠ', labelEn: 'Quran Reader' },
  { to: '/audio', labelBn: 'তিলাওয়াত', labelEn: 'Audio', icon: Volume2 },
];

const resourcesLinks: FooterLink[] = [
  { to: '/my-quran', labelBn: 'আমার কুরআন', labelEn: 'My Quran' },
  { to: '/surahs', labelBn: 'অনুসন্ধান ও ব্রাউজ', labelEn: 'Browse & Search', icon: Search },
];

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#B38A42]/30 bg-[#0B3D32] text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="space-y-2 sm:space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 group">
              <span
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#B38A42] to-[#8C6B2D] flex items-center justify-center text-white shadow-inner font-quran text-lg sm:text-xl font-bold"
                aria-hidden="true"
              >
                ن
              </span>
              <span className="font-bold text-base sm:text-lg tracking-wide text-white group-hover:text-[#DFC186] transition-colors">
                Noor Al-Quran
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-emerald-200/90 font-bengali">
              নূর আল-কুরআন — প্রামাণ্য তিলাওয়াত, বাংলা অনুবাদ ও উচ্চারণসহ পবিত্র কুরআন পাঠের প্ল্যাটফর্ম।
            </p>
            <p className="text-[10px] sm:text-xs text-emerald-300/70 font-quran" dir="rtl" lang="ar">
              وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ
            </p>
          </div>

          {/* Quran navigation */}
          <nav aria-label="কুরআন নেভিগেশন" className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#DFC186]">
              কুরআন নেভিগেশন
            </h2>
            <ul className="space-y-2">
              {quranLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-sm text-emerald-100/90 hover:text-white hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#B38A42] focus:ring-offset-2 focus:ring-offset-[#0B3D32] rounded transition-colors"
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-[#B38A42]" aria-hidden="true" />}
                    <span className="font-bengali">{link.labelBn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Useful resources */}
          <nav aria-label="প্রয়োজনীয় সংস্থান" className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#DFC186]">
              প্রয়োজনীয় সংস্থান
            </h2>
            <ul className="space-y-2">
              {resourcesLinks.map((link) => (
                <li key={link.labelEn}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-sm text-emerald-100/90 hover:text-white hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#B38A42] focus:ring-offset-2 focus:ring-offset-[#0B3D32] rounded transition-colors"
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-[#B38A42]" aria-hidden="true" />}
                    <span className="font-bengali">{link.labelBn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#B38A42]/20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs text-emerald-300/80">
          <p className="font-bengali text-center sm:text-left">
            © {new Date().getFullYear()} Noor Al-Quran — সর্বস্বত্ব সংরক্ষিত
          </p>
          <p className="font-quran text-[#DFC186] text-sm" lang="ar" dir="rtl">
            ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ ﴾
          </p>
        </div>
      </div>
    </footer>
  );
};
