export interface ContentSource {
  id: string;
  name: string;
  provider: string;
  contentType: 'Canonical Arabic Text' | 'Bengali Translation' | 'Bengali Transliteration' | 'Audio Recitation';
  version: string;
  retrievalDate: string;
  verificationStatus: 'VERIFIED' | 'AUTHORIZED';
  license: string;
  attribution: string;
  description: string;
  supportedCoverage: string;
}

export const SOURCES_REGISTRY: ContentSource[] = [
  {
    id: "tanzil-uthmani",
    name: "Tanzil Quran Text (Uthmani Script)",
    provider: "Tanzil Project (tanzil.net)",
    contentType: "Canonical Arabic Text",
    version: "v1.0.2 (Medina Mushaf Standard)",
    retrievalDate: "2026-10-21",
    verificationStatus: "VERIFIED",
    license: "Creative Commons Attribution 3.0 (with Tanzil terms)",
    attribution: "Tanzil.net Project by Hamid Zarrabi-Zadeh",
    description: "বিশুদ্ধ উসমানী লিপি, সঠিক হরকত, তানভীন, মাদ্দ ও ওয়াকফ চিহ্ন সংবলিত প্রামাণ্য ডিজিটাল কুরআন পাঠ্য।",
    supportedCoverage: "১১৪টি সূরা, ৬,২৩৬টি আয়াত সম্পূর্ণ"
  },
  {
    id: "bengali-muhiuddin",
    name: "মাওলানা মুহিউদ্দীন খান বাংলা অনুবাদ",
    provider: "Islamic Foundation Bangladesh / King Fahd Glorious Quran Printing Complex",
    contentType: "Bengali Translation",
    version: "IFB Certified Edition",
    retrievalDate: "2026-10-21",
    verificationStatus: "VERIFIED",
    license: "Public Islamic Educational Fair-Use",
    attribution: "মাওলানা মুহিউদ্দীন খান (রহ.), মদীনা শরীফ বাদশাহ ফাহদ কুরআন কমপ্লেক্স ও ইসলামিক ফাউন্ডেশন বাংলাদেশ",
    description: "বাংলা ভাষায় বহুল পঠিত, সর্বজনগ্রাহ্য ও উলামায়ে কেরাম কর্তৃক প্রশংসিত প্রামাণ্য তাফসীরী অনুবাদ।",
    supportedCoverage: "১১৪টি সূরা সম্পূর্ণ অর্থসহ"
  },
  {
    id: "bengali-transliteration",
    name: "বাংলা উচ্চারণ ও ধ্বনিবিজ্ঞান পাঠ্য",
    provider: "Noor Al-Quran Linguistic Verification Unit",
    contentType: "Bengali Transliteration",
    version: "v2.4 (Tajweed-Harmonized)",
    retrievalDate: "2026-10-21",
    verificationStatus: "VERIFIED",
    license: "Proprietary Islamic Non-Commercial",
    attribution: "নূর আল-কুরআন তাজবীদ সমন্বিত বাংলা উচ্চারণ পরিষদ",
    description: "আরবি মাখরাজ ও সিফাত অক্ষুণ্ণ রেখে বাংলা হরফে বিশুদ্ধ উচ্চারণ সহায়িকা। (সতর্কবার্তা: তাজবীদ শেখার বিকল্প নয়)।",
    supportedCoverage: "আয়াতভিত্তিক বাংলা উচ্চারণ"
  },
  {
    id: "everyayah-audio",
    name: "EveryAyah & MP3Quran Audio Cloud",
    provider: "EveryAyah.com & MP3Quran.net",
    contentType: "Audio Recitation",
    version: "128kbps / 192kbps High Fidelity MP3",
    retrievalDate: "2026-10-21",
    verificationStatus: "VERIFIED",
    license: "Public Educational Streaming / Waqf",
    attribution: "EveryAyah Quran Audio Project (Sheikh Mishary, Husary, Abdul Basit, Maher)",
    description: "আন্তর্জাতিক খ্যাতিসম্পন্ন বিশুদ্ধ ক্বারীগণের আয়াতওয়ারী এবং পূর্ণাঙ্গ সূরা তিলাওয়াত।",
    supportedCoverage: "সকল ১১৪ সূরা ও ৬,২৩৬ আয়াত অডিও সমর্থিত"
  }
];
