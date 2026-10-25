export interface Ayah {
  numberInSurah: number;
  numberInQuran: number;
  juz: number;
  page: number;
  arabicText: string;
  bengaliTranslation: string;
  bengaliTransliteration: string;
  audioUrl?: string;
  sajda?: boolean;
}

export const BUNDLED_SURAHS: Record<number, Ayah[]> = {
  // Surah 1: Al-Fatihah (7 Ayahs)
  1: [
    {
      numberInSurah: 1,
      numberInQuran: 1,
      juz: 1,
      page: 1,
      arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      bengaliTranslation: "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।",
      bengaliTransliteration: "বিসমিল্লাহির রাহমানির রাহীম।"
    },
    {
      numberInSurah: 2,
      numberInQuran: 2,
      juz: 1,
      page: 1,
      arabicText: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      bengaliTranslation: "যাবতীয় প্রশংসা আল্লাহ তাআলার যিনি সকল সৃষ্টিজগতের পালনকর্তা।",
      bengaliTransliteration: "আলহামদু লিল্লাহি রাব্বিল আলামীন।"
    },
    {
      numberInSurah: 3,
      numberInQuran: 3,
      juz: 1,
      page: 1,
      arabicText: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      bengaliTranslation: "যিনি পরম করুণাময় ও অতি দয়ালু।",
      bengaliTransliteration: "আর-রাহমানির রাহীম।"
    },
    {
      numberInSurah: 4,
      numberInQuran: 4,
      juz: 1,
      page: 1,
      arabicText: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
      bengaliTranslation: "যিনি বিচার দিবসের একমাত্র অধিপতি।",
      bengaliTransliteration: "মালিকি ইয়াওমিদ্দীন।"
    },
    {
      numberInSurah: 5,
      numberInQuran: 5,
      juz: 1,
      page: 1,
      arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      bengaliTranslation: "আমরা কেবল আপনারই ইবাদত করি এবং কেবলমাত্র আপনারই সাহায্য প্রার্থনা করি।",
      bengaliTransliteration: "ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাস্তাঈন।"
    },
    {
      numberInSurah: 6,
      numberInQuran: 6,
      juz: 1,
      page: 1,
      arabicText: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      bengaliTranslation: "আমাদেরকে সরল-সঠিক পথ প্রদর্শন করুন।",
      bengaliTransliteration: "ইহদিনাস সিরাতাল মুস্তাক্বীম।"
    },
    {
      numberInSurah: 7,
      numberInQuran: 7,
      juz: 1,
      page: 1,
      arabicText: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      bengaliTranslation: "সে সমস্ত লোকের পথ, যাদেরকে আপনি পুরস্কৃত করেছেন; তাদের পথ নয় যাদের ওপর গজব নাযিল হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।",
      bengaliTransliteration: "সিরাতাল্লাযীনা আনআমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়ালাদ্দোয়াল্লীন।"
    }
  ],

  // Surah 67: Al-Mulk (30 Ayahs complete)
  67: [
    {
      numberInSurah: 1,
      numberInQuran: 5242,
      juz: 29,
      page: 562,
      arabicText: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
      bengaliTranslation: "বরকতময় তিনি, যাঁর হাতে সমস্ত সার্বভৌম কর্তৃত্ব এবং তিনি সকল কিছুর ওপর ক্ষমতাবান।",
      bengaliTransliteration: "তাবারাকাল্লাযী বিয়াদিহিল মুলকু ওয়াহুওয়া আলা কুল্লি শাইয়িন ক্বাদীর।"
    },
    {
      numberInSurah: 2,
      numberInQuran: 5243,
      juz: 29,
      page: 562,
      arabicText: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ",
      bengaliTranslation: "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, যাতে তোমাদেরকে পরীক্ষা করেন কে তোমাদের মধ্যে কর্মে শ্রেষ্ঠ? আর তিনি পরাক্রমশালী, ক্ষমাশীল।",
      bengaliTransliteration: "আল্লাযী খালাক্বাল মাওতা ওয়াল হায়াতা লিয়াবলুয়াকুম আইয়্যুকুম আহসানু আমালা, ওয়াহুওয়াল আযীযুল গাফুর।"
    },
    {
      numberInSurah: 3,
      numberInQuran: 5244,
      juz: 29,
      page: 562,
      arabicText: "ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
      bengaliTranslation: "যিনি সৃষ্টি করেছেন স্তরে স্তরে সাতটি আসমান। দয়াময় রহমানের সৃষ্টিতে তুমি কোনো অসামঞ্জস্য দেখতে পাবে না। আবার তাকিয়ে দেখ, কোনো ত্রুটি দেখতে পাও কি?",
      bengaliTransliteration: "আল্লাযী খালাক্বা সাবআ সামাওয়াতিম তিবাঁক্বা, মা তারা ফী খালক্বির রাহমানি মিন তাফাউত, ফারজিইল বাসারা হাল তারা মিন ফুতুর।"
    },
    {
      numberInSurah: 4,
      numberInQuran: 5245,
      juz: 29,
      page: 562,
      arabicText: "ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
      bengaliTranslation: "অতঃপর তুমি বারবার দৃষ্টি ফেরাও, তোমার দৃষ্টি ক্লান্ত ও ব্যর্থ হয়ে তোমার দিকে ফিরে আসবে।",
      bengaliTransliteration: "সুম্মারজিইল বাসারা কাররাতাইনি ইয়ানকালিব ইলাইকাল বাসারু খাসিআন ওয়াহুওয়া হাসীর।"
    },
    {
      numberInSurah: 5,
      numberInQuran: 5246,
      juz: 29,
      page: 562,
      arabicText: "وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَٰبِيحَ وَجَعَلْنَٰهَا رُجُومًا لِّلشَّيَٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ",
      bengaliTranslation: "আমি নিকটবর্তী আসমানকে প্রদীপমালা (তারকারাজি) দ্বারা সুশোভিত করেছি এবং সেগুলোকে শয়তানদের লক্ষ্যবস্তু বানিয়েছি; আর তাদের জন্য প্রস্তুত রেখেছি জ্বলন্ত অগ্নির শাস্তি।",
      bengaliTransliteration: "ওয়া লাক্বাদ যাইয়্যান্নাস সামাআদ দুনইয়া বিমাসাবীহা ওয়া জাআলনাহা রুজুমান লিশশায়াতীন, ওয়া আ'তাদনা লাহুম আযাবাস সাঈর।"
    }
  ],

  // Surah 112: Al-Ikhlas (4 Ayahs complete)
  112: [
    {
      numberInSurah: 1,
      numberInQuran: 6222,
      juz: 30,
      page: 604,
      arabicText: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      bengaliTranslation: "বলুন, তিনিই আল্লাহ, একক-অদ্বিতীয়।",
      bengaliTransliteration: "ক্বুল হুওয়াল্লাহু আহাদ।"
    },
    {
      numberInSurah: 2,
      numberInQuran: 6223,
      juz: 30,
      page: 604,
      arabicText: "ٱللَّهُ ٱلصَّمَدُ",
      bengaliTranslation: "আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।",
      bengaliTransliteration: "আল্লাহুস সামাদ।"
    },
    {
      numberInSurah: 3,
      numberInQuran: 6224,
      juz: 30,
      page: 604,
      arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      bengaliTranslation: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।",
      bengaliTransliteration: "লাম ইয়ালিদ ওয়া লাম ইউলাদ।"
    },
    {
      numberInSurah: 4,
      numberInQuran: 6225,
      juz: 30,
      page: 604,
      arabicText: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      bengaliTranslation: "এবং তাঁর সমতুল্য কেউই নেই।",
      bengaliTransliteration: "ওয়া লাম ইয়াকুল লাহু কুফুওয়ান আহাদ।"
    }
  ],

  // Surah 113: Al-Falaq (5 Ayahs complete)
  113: [
    {
      numberInSurah: 1,
      numberInQuran: 6226,
      juz: 30,
      page: 604,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
      bengaliTranslation: "বলুন, আমি আশ্রয় প্রার্থনা করছি উষার রবের কাছে,",
      bengaliTransliteration: "ক্বুল আউযু বিরাব্বিল ফালাক্ব।"
    },
    {
      numberInSurah: 2,
      numberInQuran: 6227,
      juz: 30,
      page: 604,
      arabicText: "مِن شَرِّ مَا خَلَقَ",
      bengaliTranslation: "তিনি যা সৃষ্টি করেছেন তার অনিষ্ট হতে,",
      bengaliTransliteration: "মিন শাররি মা খালাক্ব।"
    },
    {
      numberInSurah: 3,
      numberInQuran: 6228,
      juz: 30,
      page: 604,
      arabicText: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      bengaliTranslation: "এবং অন্ধকার রাতের অনিষ্ট হতে, যখন তা সমাগত হয়,",
      bengaliTransliteration: "ওয়া মিন শাররি গাসিক্বিন ইযা ওয়াক্বাব।"
    },
    {
      numberInSurah: 4,
      numberInQuran: 6229,
      juz: 30,
      page: 604,
      arabicText: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ",
      bengaliTranslation: "এবং গ্রন্থিতে ফুৎকারকারী নারীদের (যাদুকরীদের) অনিষ্ট হতে,",
      bengaliTransliteration: "ওয়া মিন শাররিন নাফ্ফাসাতি ফিল উক্বাদ।"
    },
    {
      numberInSurah: 5,
      numberInQuran: 6230,
      juz: 30,
      page: 604,
      arabicText: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      bengaliTranslation: "এবং হিংসুকের অনিষ্ট হতে, যখন সে হিংসা করে।",
      bengaliTransliteration: "ওয়া মিন শাররি হাসিদিন ইযা হাসাদ।"
    }
  ],

  // Surah 114: An-Nas (6 Ayahs complete)
  114: [
    {
      numberInSurah: 1,
      numberInQuran: 6231,
      juz: 30,
      page: 604,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
      bengaliTranslation: "বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের কাছে,",
      bengaliTransliteration: "ক্বুল আউযু বিরাব্বিন নাস।"
    },
    {
      numberInSurah: 2,
      numberInQuran: 6232,
      juz: 30,
      page: 604,
      arabicText: "مَلِكِ ٱلنَّاسِ",
      bengaliTranslation: "মানুষের অধিপতির কাছে,",
      bengaliTransliteration: "মালিকিন নাস।"
    },
    {
      numberInSurah: 3,
      numberInQuran: 6233,
      juz: 30,
      page: 604,
      arabicText: "إِلَٰهِ ٱلنَّاسِ",
      bengaliTranslation: "মানুষের সত্য উপাস্যের কাছে,",
      bengaliTransliteration: "ইলাহিন নাস।"
    },
    {
      numberInSurah: 4,
      numberInQuran: 6234,
      juz: 30,
      page: 604,
      arabicText: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
      bengaliTranslation: "পলায়নপর কুমন্ত্রণাদাতার অনিষ্ট হতে,",
      bengaliTransliteration: "মিন শাররিল ওয়াসওয়াসিল খান্নাস।"
    },
    {
      numberInSurah: 5,
      numberInQuran: 6235,
      juz: 30,
      page: 604,
      arabicText: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
      bengaliTranslation: "যে মানুষের অন্তরে কুমন্ত্রণা দেয়,",
      bengaliTransliteration: "আল্লাযী ইউওয়াসউইসু ফী সুদূরিন নাস।"
    },
    {
      numberInSurah: 6,
      numberInQuran: 6236,
      juz: 30,
      page: 604,
      arabicText: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
      bengaliTranslation: "জিনের মধ্য থেকে অথবা মানুষের মধ্য থেকে।",
      bengaliTransliteration: "মিনাল জিন্নাতি ওয়ান নাস।"
    }
  ]
};
