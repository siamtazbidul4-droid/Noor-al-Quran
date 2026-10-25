export interface JuzMeta {
  juzNumber: number;
  arabicName: string;
  bengaliName: string;
  transliteration: string;
  start: {
    surah: number;
    ayah: number;
    surahNameBengali: string;
    surahNameArabic: string;
  };
  end: {
    surah: number;
    ayah: number;
    surahNameBengali: string;
    surahNameArabic: string;
  };
  verseCount: number;
}

export const JUZ_METADATA: JuzMeta[] = [
  {
    juzNumber: 1,
    arabicName: "الم",
    bengaliName: "আলিফ-লাম-মীম",
    transliteration: "Alif Lam Meem",
    start: { surah: 1, ayah: 1, surahNameBengali: "আল-ফাতিহা", surahNameArabic: "الفاتحة" },
    end: { surah: 2, ayah: 141, surahNameBengali: "আল-বাক্বারাহ", surahNameArabic: "البقرة" },
    verseCount: 148
  },
  {
    juzNumber: 2,
    arabicName: "سيقول",
    bengaliName: "সায়াকুল",
    transliteration: "Sayaqool",
    start: { surah: 2, ayah: 142, surahNameBengali: "আল-বাক্বারাহ", surahNameArabic: "البقرة" },
    end: { surah: 2, ayah: 252, surahNameBengali: "আল-বাক্বারাহ", surahNameArabic: "البقرة" },
    verseCount: 111
  },
  {
    juzNumber: 3,
    arabicName: "تلك الرسل",
    bengaliName: "তিলকার রুসুল",
    transliteration: "Tilka 'r-Rusul",
    start: { surah: 2, ayah: 253, surahNameBengali: "আল-বাক্বারাহ", surahNameArabic: "البقرة" },
    end: { surah: 3, ayah: 92, surahNameBengali: "আলে ইমরান", surahNameArabic: "آل عمران" },
    verseCount: 126
  },
  {
    juzNumber: 4,
    arabicName: "لن تنالوا",
    bengaliName: "লান তানালূ",
    transliteration: "Lan Tanaloo",
    start: { surah: 3, ayah: 93, surahNameBengali: "আলে ইমরান", surahNameArabic: "آل عمران" },
    end: { surah: 4, ayah: 23, surahNameBengali: "আন-নিসা", surahNameArabic: "النساء" },
    verseCount: 131
  },
  {
    juzNumber: 5,
    arabicName: "والمحصنات",
    bengaliName: "ওয়াল মুহসানাত",
    transliteration: "Wa 'l-Muhsanat",
    start: { surah: 4, ayah: 24, surahNameBengali: "আন-নিসা", surahNameArabic: "النساء" },
    end: { surah: 4, ayah: 147, surahNameBengali: "আন-নিসা", surahNameArabic: "النساء" },
    verseCount: 124
  },
  {
    juzNumber: 6,
    arabicName: "لا يحب الله",
    bengaliName: "লা ইয়ুহিব্বুল্লাহ",
    transliteration: "La Yuhibbullah",
    start: { surah: 4, ayah: 148, surahNameBengali: "আন-নিসা", surahNameArabic: "النساء" },
    end: { surah: 5, ayah: 81, surahNameBengali: "আল-মায়িদাহ", surahNameArabic: "المائدة" },
    verseCount: 110
  },
  {
    juzNumber: 7,
    arabicName: "وإذا سمعوا",
    bengaliName: "ওয়া ইযা সামিউ",
    transliteration: "Wa Idha Sami'oo",
    start: { surah: 5, ayah: 82, surahNameBengali: "আল-মায়িদাহ", surahNameArabic: "المائدة" },
    end: { surah: 6, ayah: 110, surahNameBengali: "আল-আনআম", surahNameArabic: "الأنعام" },
    verseCount: 149
  },
  {
    juzNumber: 8,
    arabicName: "ولو أننا",
    bengaliName: "ওয়া লাও আন্নানা",
    transliteration: "Wa Law Annana",
    start: { surah: 6, ayah: 111, surahNameBengali: "আল-আনআম", surahNameArabic: "الأنعام" },
    end: { surah: 7, ayah: 87, surahNameBengali: "আল-আরাফ", surahNameArabic: "الأعراف" },
    verseCount: 142
  },
  {
    juzNumber: 9,
    arabicName: "قال الملأ",
    bengaliName: "ক্বলাল মালাউ",
    transliteration: "Qal al-Mala'",
    start: { surah: 7, ayah: 88, surahNameBengali: "আল-আরাফ", surahNameArabic: "الأعراف" },
    end: { surah: 8, ayah: 40, surahNameBengali: "আল-আনফাল", surahNameArabic: "الأنفال" },
    verseCount: 159
  },
  {
    juzNumber: 10,
    arabicName: "واعلموا",
    bengaliName: "ওয়া’লামু",
    transliteration: "Wa A'lamoo",
    start: { surah: 8, ayah: 41, surahNameBengali: "আল-আনফাল", surahNameArabic: "الأنفال" },
    end: { surah: 9, ayah: 92, surahNameBengali: "আত-তাওবাহ", surahNameArabic: "التوبة" },
    verseCount: 127
  },
  {
    juzNumber: 11,
    arabicName: "يعتذرون",
    bengaliName: "ইয়া’তাযিরূনা",
    transliteration: "Ya'tadhiruna",
    start: { surah: 9, ayah: 93, surahNameBengali: "আত-তাওবাহ", surahNameArabic: "التوبة" },
    end: { surah: 11, ayah: 5, surahNameBengali: "হুদ", surahNameArabic: "هود" },
    verseCount: 151
  },
  {
    juzNumber: 12,
    arabicName: "وما من دابة",
    bengaliName: "ওয়া মা মিন দাব্বাহ",
    transliteration: "Wa Mamin Da'abbah",
    start: { surah: 11, ayah: 6, surahNameBengali: "হুদ", surahNameArabic: "هود" },
    end: { surah: 12, ayah: 52, surahNameBengali: "ইউসুফ", surahNameArabic: "يوسف" },
    verseCount: 170
  },
  {
    juzNumber: 13,
    arabicName: "وما أبرئ",
    bengaliName: "ওয়া মা উবাররিউ",
    transliteration: "Wa Ma Ubarri'u",
    start: { surah: 12, ayah: 53, surahNameBengali: "ইউসুফ", surahNameArabic: "يوسف" },
    end: { surah: 14, ayah: 52, surahNameBengali: "ইব্রাহিম", surahNameArabic: "إبراهيم" },
    verseCount: 155
  },
  {
    juzNumber: 14,
    arabicName: "ربما",
    bengaliName: "রুবা’মা",
    transliteration: "Rubama",
    start: { surah: 15, ayah: 1, surahNameBengali: "আল-হিজর", surahNameArabic: "الحجر" },
    end: { surah: 16, ayah: 128, surahNameBengali: "আন-নাহল", surahNameArabic: "النحل" },
    verseCount: 227
  },
  {
    juzNumber: 15,
    arabicName: "سبحان الذي",
    bengaliName: "সুবহানাল্লাযী",
    transliteration: "Subhan alladhi",
    start: { surah: 17, ayah: 1, surahNameBengali: "আল-ইসরা", surahNameArabic: "الإسراء" },
    end: { surah: 18, ayah: 74, surahNameBengali: "আল-কাহফ", surahNameArabic: "الكهف" },
    verseCount: 185
  },
  {
    juzNumber: 16,
    arabicName: "قال ألم",
    bengaliName: "ক্বলা আলাম",
    transliteration: "Qal Alam",
    start: { surah: 18, ayah: 75, surahNameBengali: "আল-কাহফ", surahNameArabic: "الكهف" },
    end: { surah: 20, ayah: 135, surahNameBengali: "ত্বা-হা", surahNameArabic: "طه" },
    verseCount: 269
  },
  {
    juzNumber: 17,
    arabicName: "اقترب للناس",
    bengaliName: "ইক্বতারাবা লিন্নাস",
    transliteration: "Iqtaraba Lin-Nas",
    start: { surah: 21, ayah: 1, surahNameBengali: "আল-আম্বিয়া", surahNameArabic: "الأنبياء" },
    end: { surah: 22, ayah: 78, surahNameBengali: "আল-হজ্জ", surahNameArabic: "الحج" },
    verseCount: 190
  },
  {
    juzNumber: 18,
    arabicName: "قد أفلح",
    bengaliName: "ক্বাদ আফলাহা",
    transliteration: "Qad Aflaha",
    start: { surah: 23, ayah: 1, surahNameBengali: "আল-মুমিনুন", surahNameArabic: "المؤمنون" },
    end: { surah: 25, ayah: 20, surahNameBengali: "আল-ফুরকান", surahNameArabic: "الفرقان" },
    verseCount: 202
  },
  {
    juzNumber: 19,
    arabicName: "وقال الذين",
    bengaliName: "ওয়া ক্বলাল্লাযীনা",
    transliteration: "Wa Qal alladhina",
    start: { surah: 25, ayah: 21, surahNameBengali: "আল-ফুরকান", surahNameArabic: "الفرقان" },
    end: { surah: 27, ayah: 55, surahNameBengali: "আন-নামল", surahNameArabic: "النمل" },
    verseCount: 339
  },
  {
    juzNumber: 20,
    arabicName: "فما كان",
    bengaliName: "ফামা কানা",
    transliteration: "Fa-ma Kana",
    start: { surah: 27, ayah: 56, surahNameBengali: "আন-নামল", surahNameArabic: "النمل" },
    end: { surah: 29, ayah: 45, surahNameBengali: "আল-আনকাবুত", surahNameArabic: "العنكبوت" },
    verseCount: 171
  },
  {
    juzNumber: 21,
    arabicName: "ولا تجادلوا",
    bengaliName: "উতলু মা উহিয়া",
    transliteration: "Utlu Ma Oohiya",
    start: { surah: 29, ayah: 46, surahNameBengali: "আল-আনকাবুত", surahNameArabic: "العنكبوت" },
    end: { surah: 33, ayah: 30, surahNameBengali: "আল-আহযাব", surahNameArabic: "الأحزاب" },
    verseCount: 178
  },
  {
    juzNumber: 22,
    arabicName: "ومن يقنت",
    bengaliName: "ওয়া মান ইয়াক্বনুত",
    transliteration: "Wa Man Yaqnut",
    start: { surah: 33, ayah: 31, surahNameBengali: "আল-আহযাব", surahNameArabic: "الأحزاب" },
    end: { surah: 36, ayah: 27, surahNameBengali: "ইয়াসীন", surahNameArabic: "يس" },
    verseCount: 169
  },
  {
    juzNumber: 23,
    arabicName: "وما أنزلنا",
    bengaliName: "ওয়ামা আনযালনা",
    transliteration: "Wa Ma Anzalna",
    start: { surah: 36, ayah: 28, surahNameBengali: "ইয়াসীন", surahNameArabic: "يس" },
    end: { surah: 39, ayah: 31, surahNameBengali: "আজ-যুমার", surahNameArabic: "الزمر" },
    verseCount: 357
  },
  {
    juzNumber: 24,
    arabicName: "فمن أظلم",
    bengaliName: "ফামান আযলামু",
    transliteration: "Faman Azlamu",
    start: { surah: 39, ayah: 32, surahNameBengali: "আজ-যুমার", surahNameArabic: "الزمر" },
    end: { surah: 41, ayah: 46, surahNameBengali: "ফুসসিলাত", surahNameArabic: "فصلت" },
    verseCount: 175
  },
  {
    juzNumber: 25,
    arabicName: "إليه يرد",
    bengaliName: "ইলাইহি ইউরাদ্দু",
    transliteration: "Ilayhi Yuraddu",
    start: { surah: 41, ayah: 47, surahNameBengali: "ফুসসিলাত", surahNameArabic: "فصلت" },
    end: { surah: 45, ayah: 37, surahNameBengali: "আল-জাসিয়াহ", surahNameArabic: "الجاثية" },
    verseCount: 246
  },
  {
    juzNumber: 26,
    arabicName: "حم",
    bengaliName: "হা-মীম",
    transliteration: "Ha-Meem",
    start: { surah: 46, ayah: 1, surahNameBengali: "আল-আহকাফ", surahNameArabic: "الأحقاف" },
    end: { surah: 51, ayah: 30, surahNameBengali: "আয-যারিয়াত", surahNameArabic: "الذاريات" },
    verseCount: 195
  },
  {
    juzNumber: 27,
    arabicName: "قال فما خطبكم",
    bengaliName: "ক্বলা ফামা খাতবুকুম",
    transliteration: "Qal Fama Khatbukum",
    start: { surah: 51, ayah: 31, surahNameBengali: "আয-যারিয়াত", surahNameArabic: "الذاريات" },
    end: { surah: 57, ayah: 29, surahNameBengali: "আল-হাদীদ", surahNameArabic: "الحديد" },
    verseCount: 399
  },
  {
    juzNumber: 28,
    arabicName: "قد سمع الله",
    bengaliName: "ক্বাদ সামিয়াল্লাহ",
    transliteration: "Qad Sami'a Allah",
    start: { surah: 58, ayah: 1, surahNameBengali: "আল-মুজাদালাহ", surahNameArabic: "المجادلة" },
    end: { surah: 66, ayah: 12, surahNameBengali: "আত-তাহরীম", surahNameArabic: "التحريم" },
    verseCount: 137
  },
  {
    juzNumber: 29,
    arabicName: "تبارك الذي",
    bengaliName: "তাবারাকাল্লাযী",
    transliteration: "Tabarak alladhi",
    start: { surah: 67, ayah: 1, surahNameBengali: "আল-মুলক", surahNameArabic: "الملك" },
    end: { surah: 77, ayah: 50, surahNameBengali: "আল-মুরসালাত", surahNameArabic: "المرسلات" },
    verseCount: 431
  },
  {
    juzNumber: 30,
    arabicName: "عم",
    bengaliName: "আম্মা ইয়াতাসাআলূন",
    transliteration: "'Amma",
    start: { surah: 78, ayah: 1, surahNameBengali: "আন-নাবা", surahNameArabic: "النبإ" },
    end: { surah: 114, ayah: 6, surahNameBengali: "আন-নাস", surahNameArabic: "الناس" },
    verseCount: 564
  }
];
