export interface Reciter {
  id: string;
  nameArabic: string;
  nameBengali: string;
  nameEnglish: string;
  style: string;
  bioBengali: string;
  verseAudioPattern: string; // {surah3}{ayah3}.mp3
  surahAudioPattern: string; // {surah3}.mp3
  hasVerseAudio: boolean;
  hasSurahAudio: boolean;
  attribution: string;
  license: string;
}

export const RECITERS: Reciter[] = [
  {
    id: "alafasy",
    nameArabic: "مشاري بن راشد العفاسي",
    nameBengali: "মিশারী রশিদ আল-আফাসী",
    nameEnglish: "Mishary Rashid Al-Afasy",
    style: "মুরাত্তাল (Murattal)",
    bioBengali: "কুয়েতের বিশ্বখ্যাত ক্বারী ও গ্র্যান্ড মসজিদের সম্মানিত ইমাম। প্রাঞ্জল ও হৃদয়গ্রাহী তিলাওয়াত।",
    verseAudioPattern: "https://everyayah.com/data/Alafasy_128kbps/{surah3}{ayah3}.mp3",
    surahAudioPattern: "https://server8.mp3quran.net/afs/{surah3}.mp3",
    hasVerseAudio: true,
    hasSurahAudio: true,
    attribution: "EveryAyah & MP3Quran Audio Repositories",
    license: "Public Educational / Free Islamic Distribution"
  },
  {
    id: "husary",
    nameArabic: "محمود خليل الحصري",
    nameBengali: "মাহমুদ খলিল আল-হুসারী",
    nameEnglish: "Mahmoud Khalil Al-Husary",
    style: "মুরাত্তাল ও নিখুঁত তাজবীদ",
    bioBengali: "মিসরের যুগশ্রেষ্ঠ শায়খ ও ক্বারী, যাঁর তিলাওয়াত তাজবীদের বিশুদ্ধতম মানদণ্ড হিসেবে গণ্য।",
    verseAudioPattern: "https://everyayah.com/data/Husary_128kbps/{surah3}{ayah3}.mp3",
    surahAudioPattern: "https://server13.mp3quran.net/husr/{surah3}.mp3",
    hasVerseAudio: true,
    hasSurahAudio: true,
    attribution: "Tanzil Project & EveryAyah",
    license: "Public Domain / Islamic Heritage Audio"
  },
  {
    id: "abdulbasit",
    nameArabic: "عبد الباسط عبد الصمد",
    nameBengali: "আব্দুল বাসেত আব্দুস সামাদ",
    nameEnglish: "Abdul Basit Abdul Samad",
    style: "মুরাত্তাল (ঐতিহ্যবাহী)",
    bioBengali: "সুবর্ণ যুগের কিংবদন্তি মিসরীয় ক্বারী, যাঁর গম্ভীর সুর বিশ্বজুড়ে অনন্য মর্যাদা পেয়েছে।",
    verseAudioPattern: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/{surah3}{ayah3}.mp3",
    surahAudioPattern: "https://server7.mp3quran.net/basit/{surah3}.mp3",
    hasVerseAudio: true,
    hasSurahAudio: true,
    attribution: "EveryAyah & MP3Quran",
    license: "Public Domain / Islamic Heritage Audio"
  },
  {
    id: "maher",
    nameArabic: "ماهر المعيقلي",
    nameBengali: "মাহের আল-মুয়াইক্বলী",
    nameEnglish: "Maher Al-Muaiqly",
    style: "মসজিদে হারাম, মক্কা",
    bioBengali: "মক্কার পবিত্র মসজিদুল হারামের সম্মানিত ইমাম ও খতীব। হৃদয়স্পর্শী সুমধুর তিলাওয়াত।",
    verseAudioPattern: "https://everyayah.com/data/MaherAlMuaiqly128kbps/{surah3}{ayah3}.mp3",
    surahAudioPattern: "https://server12.mp3quran.net/maher/{surah3}.mp3",
    hasVerseAudio: true,
    hasSurahAudio: true,
    attribution: "EveryAyah & MP3Quran",
    license: "Public Educational / Free Islamic Distribution"
  }
];

export function getVerseAudioUrl(reciterId: string, surah: number, ayah: number): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return reciter.verseAudioPattern.replace('{surah3}', s).replace('{ayah3}', a);
}

export function getSurahAudioUrl(reciterId: string, surah: number): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const s = String(surah).padStart(3, '0');
  return reciter.surahAudioPattern.replace('{surah3}', s);
}

/**
 * Attempts to load audio from primary CDN and falls back to alternative Qari if needed.
 * This enables graceful degradation if a reciter's CDN is temporarily unavailable.
 */
export async function getAvailableAudioUrl(
  reciterId: string,
  surah: number,
  ayah: number,
  maxRetries = 2
): Promise<{ url: string; reciterId: string; error: string | null }> {
  const primaryUrl = getVerseAudioUrl(reciterId, surah, ayah);
  
  // Try primary reciter first
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(primaryUrl, { method: 'HEAD' });
      if (response.ok) {
        return { url: primaryUrl, reciterId, error: null };
      }
    } catch (e) {
      // Network error or CDN unavailable
    }
  }

  // Fallback to alternative reciters
  const alternatives = RECITERS.filter(r => r.id !== reciterId);
  for (const alt of alternatives) {
    const altUrl = getVerseAudioUrl(alt.id, surah, ayah);
    try {
      const response = await fetch(altUrl, { method: 'HEAD' });
      if (response.ok) {
        return {
          url: altUrl,
          reciterId: alt.id,
          error: `Primary reciter ${reciterId} unavailable; using ${alt.id}`
        };
      }
    } catch (e) {
      // Continue to next alternative
    }
  }

  // All CDNs failed; return primary URL anyway (browser will handle error)
  return {
    url: primaryUrl,
    reciterId,
    error: `Audio unavailable from all CDNs; attempting primary: ${reciterId}`
  };
}
