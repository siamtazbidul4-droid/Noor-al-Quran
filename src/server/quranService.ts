import { SURAHS_METADATA, SurahMeta } from '../data/surahMetadata';
import { BUNDLED_SURAHS, Ayah } from '../data/quranDataset';
import {
  normalizeArabicForSearch,
  normalizeBengaliForSearch,
  normalizeEnglishForSearch,
  isEnglishSearchMatch,
  isSearchMatch
} from '../utils/searchNormalization';

const surahCache = new Map<number, Ayah[]>();

for (const [surahNumStr, ayahs] of Object.entries(BUNDLED_SURAHS)) {
  surahCache.set(Number(surahNumStr), ayahs);
}

function scoreAyahMatch(query: string, surah: SurahMeta, ayah: Ayah): number {
  const trimmed = query.trim();
  if (!trimmed) return 0;

  const arabicText = normalizeArabicForSearch(ayah.arabicText);
  const bengaliText = normalizeBengaliForSearch(ayah.bengaliTranslation);
  const englishText = normalizeEnglishForSearch(`${surah.englishName} ${surah.englishMeaning}`);
  const banglaLookup = normalizeBengaliForSearch(`${surah.bengaliName} ${surah.bengaliMeaning}`);

  const normQueryArabic = normalizeArabicForSearch(trimmed);
  const normQueryBengali = normalizeBengaliForSearch(trimmed);
  const normQueryEnglish = normalizeEnglishForSearch(trimmed);

  let score = 0;

  if (normQueryArabic && arabicText.includes(normQueryArabic)) score += 90;
  if (normQueryBengali && bengaliText.includes(normQueryBengali)) score += 80;
  if (normQueryEnglish && englishText.includes(normQueryEnglish)) score += 60;
  if (normQueryBengali && banglaLookup.includes(normQueryBengali)) score += 45;

  if (normQueryEnglish && isEnglishSearchMatch(trimmed, surah.englishName)) score += 30;
  if (normQueryEnglish && isEnglishSearchMatch(trimmed, surah.englishMeaning)) score += 20;

  if (normQueryBengali && isSearchMatch(trimmed, surah.bengaliName)) score += 35;
  if (normQueryBengali && isSearchMatch(trimmed, surah.bengaliMeaning)) score += 25;
  if (normQueryArabic && isSearchMatch(trimmed, surah.arabicName, true)) score += 35;

  return score;
}

export async function getAyahsForSurah(surahNumber: number): Promise<Ayah[]> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be 1 to 114.`);
  }

  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  const surahMeta = SURAHS_METADATA[surahNumber - 1];
  const fallbackAyahs: Ayah[] = [];

  for (let i = 1; i <= surahMeta.verseCount; i++) {
    fallbackAyahs.push({
      numberInSurah: i,
      numberInQuran: (surahNumber * 100) + i,
      juz: surahMeta.juz[0] || 1,
      page: surahMeta.page,
      arabicText: i === 1 && surahNumber !== 9 ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : `﴿${i}﴾`,
      bengaliTranslation: '',
      bengaliTransliteration: `আয়াত ${i} বাংলা উচ্চারণ`,
    });
  }

  surahCache.set(surahNumber, fallbackAyahs);
  return fallbackAyahs;
}

export async function searchQuran(query: string, limit = 20) {
  const trimmed = query.trim();
  if (!trimmed) return { surahs: [], ayahs: [] };

  const queryNum = parseInt(trimmed, 10);
  const normQueryArabic = normalizeArabicForSearch(trimmed);
  const normQueryBengali = normalizeBengaliForSearch(trimmed);
  const normQueryEnglish = normalizeEnglishForSearch(trimmed);

  const matchingSurahs: SurahMeta[] = SURAHS_METADATA.filter((surah) => {
    if (!Number.isNaN(queryNum) && surah.number === queryNum) return true;
    if (normQueryArabic && normalizeArabicForSearch(surah.arabicName).includes(normQueryArabic)) return true;
    if (normQueryBengali && normalizeBengaliForSearch(surah.bengaliName).includes(normQueryBengali)) return true;
    if (normQueryBengali && normalizeBengaliForSearch(surah.bengaliMeaning).includes(normQueryBengali)) return true;
    if (normQueryEnglish && normalizeEnglishForSearch(surah.englishName).includes(normQueryEnglish)) return true;
    if (normQueryEnglish && normalizeEnglishForSearch(surah.englishMeaning).includes(normQueryEnglish)) return true;
    return false;
  }).slice(0, 10);

  const candidates: {
    surahNumber: number;
    surahNameBengali: string;
    surahNameArabic: string;
    ayah: Ayah;
    score: number;
  }[] = [];

  for (const [surahNum, ayahs] of surahCache.entries()) {
    const meta = SURAHS_METADATA[surahNum - 1];
    if (!meta) continue;

    for (const ayah of ayahs) {
      const score = scoreAyahMatch(trimmed, meta, ayah);
      if (score <= 0) continue;
      candidates.push({
        surahNumber: surahNum,
        surahNameBengali: meta.bengaliName,
        surahNameArabic: meta.arabicName,
        ayah,
        score
      });
    }
  }

  const matchingAyahs = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ surahNumber, surahNameBengali, surahNameArabic, ayah }) => ({
      surahNumber,
      surahNameBengali,
      surahNameArabic,
      ayah
    }));

  return { surahs: matchingSurahs, ayahs: matchingAyahs };
}
