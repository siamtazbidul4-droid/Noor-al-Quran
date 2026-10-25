/**
 * Arabic Diacritic Normalization for Search Indexing
 * Strips tashkeel/harakat, madd, sukun, and normalizes hamza variants.
 * NOTE: Used strictly for matching search queries. Canonical Quranic text is NEVER modified for display.
 */
export function normalizeArabicForSearch(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKC')
    .replace(/[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeBengaliForSearch(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[।!?,;:()\[\]{}"“”‘’—–_]+/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeEnglishForSearch(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isSearchMatch(query: string, targetText: string, isArabic = false): boolean {
  if (!query || !targetText) return false;
  const normalizedQuery = isArabic ? normalizeArabicForSearch(query) : normalizeBengaliForSearch(query);
  const normalizedTarget = isArabic ? normalizeArabicForSearch(targetText) : normalizeBengaliForSearch(targetText);

  if (!normalizedQuery || !normalizedTarget) return false;
  return normalizedTarget.includes(normalizedQuery);
}

export function isEnglishSearchMatch(query: string, targetText: string): boolean {
  if (!query || !targetText) return false;
  const normalizedQuery = normalizeEnglishForSearch(query);
  const normalizedTarget = normalizeEnglishForSearch(targetText);
  if (!normalizedQuery || !normalizedTarget) return false;
  return normalizedTarget.includes(normalizedQuery);
}
