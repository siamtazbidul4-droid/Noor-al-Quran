import { SURAHS_METADATA } from '../data/surahMetadata';

export interface LocalBookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameBengali: string;
  surahNameArabic: string;
  note?: string;
  createdAt: string;
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  surahNameBengali: string;
  surahNameArabic: string;
  updatedAt: string;
  completedSurahs?: number[];
  completedJuz?: number[];
}

export interface UserPreferences {
  reciterId: string;
  arabicFontSize: number;
  lineHeight: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  bengaliAudioEnabled: boolean;
  theme: 'light' | 'dark';
  interfaceLanguage: 'bn' | 'en';
  playbackSpeed: number;
  repeatAyah: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  reciterId: 'alafasy',
  arabicFontSize: 28,
  lineHeight: 2.2,
  showTranslation: true,
  showTransliteration: true,
  bengaliAudioEnabled: false,
  theme: 'light',
  interfaceLanguage: 'bn',
  playbackSpeed: 1.0,
  repeatAyah: false,
};

const STORAGE_KEYS = {
  PROGRESS: 'noor_quran_last_progress',
  BOOKMARKS: 'noor_quran_bookmarks',
  PREFERENCES: 'noor_quran_preferences',
  GUEST_ID: 'noor_quran_guest_session',
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined' && typeof globalThis === 'undefined') return null;
  try {
    const storage = (globalThis as any).localStorage as Storage | undefined;
    if (storage && typeof storage.getItem === 'function') return storage;
  } catch (e) {
    console.warn('Storage unavailable:', e);
  }
  return null;
}

export function getLocalProgress(): ReadingProgress {
  try {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidVerseReference(parsed.surahNumber, parsed.ayahNumber)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local progress:', e);
  }
  // Default to Surah 1 Al-Fatihah, Ayah 1
  return {
    surahNumber: 1,
    ayahNumber: 1,
    surahNameBengali: 'আল-ফাতিহা',
    surahNameArabic: 'الفاتحة',
    updatedAt: new Date().toISOString(),
    completedSurahs: [],
    completedJuz: []
  };
}

export function saveLocalProgress(surahNumber: number, ayahNumber: number): ReadingProgress {
  if (!isValidVerseReference(surahNumber, ayahNumber)) {
    throw new Error(`Invalid verse reference: Surah ${surahNumber}, Ayah ${ayahNumber}`);
  }
  const surah = SURAHS_METADATA[surahNumber - 1];
  const progress: ReadingProgress = {
    ...getLocalProgress(),
    surahNumber,
    ayahNumber,
    surahNameBengali: surah.bengaliName,
    surahNameArabic: surah.arabicName,
    updatedAt: new Date().toISOString()
  };
  try {
    getStorage()?.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress to localStorage:', e);
  }
  return progress;
}

export function getLocalBookmarks(): LocalBookmark[] {
  try {
    const raw = getStorage()?.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) {
      const items: LocalBookmark[] = JSON.parse(raw);
      if (Array.isArray(items)) {
        return deduplicateBookmarks(items);
      }
    }
  } catch (e) {
    console.warn('Error reading bookmarks from localStorage:', e);
  }
  return [];
}

export function saveLocalBookmark(surahNumber: number, ayahNumber: number, note?: string): LocalBookmark[] {
  if (!isValidVerseReference(surahNumber, ayahNumber)) {
    throw new Error(`Invalid bookmark position: Surah ${surahNumber}, Ayah ${ayahNumber}`);
  }
  const current = getLocalBookmarks();
  const surah = SURAHS_METADATA[surahNumber - 1];
  const newBookmark: LocalBookmark = {
    id: `${surahNumber}_${ayahNumber}`,
    surahNumber,
    ayahNumber,
    surahNameBengali: surah.bengaliName,
    surahNameArabic: surah.arabicName,
    note: note || '',
    createdAt: new Date().toISOString()
  };
  const updated = deduplicateBookmarks([newBookmark, ...current]);
  try {
    getStorage()?.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save bookmark to localStorage:', e);
  }
  return updated;
}

export function removeLocalBookmark(id: string): LocalBookmark[] {
  const current = getLocalBookmarks();
  const updated = current.filter(b => b.id !== id);
  try {
    getStorage()?.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to remove bookmark from localStorage:', e);
  }
  return updated;
}

export function isAyahBookmarked(surahNumber: number, ayahNumber: number): boolean {
  const current = getLocalBookmarks();
  return current.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
}

export function deduplicateBookmarks(bookmarks: LocalBookmark[]): LocalBookmark[] {
  const seen = new Set<string>();
  const deduped: LocalBookmark[] = [];
  for (const b of bookmarks) {
    const key = `${b.surahNumber}:${b.ayahNumber}`;
    if (!seen.has(key) && isValidVerseReference(b.surahNumber, b.ayahNumber)) {
      seen.add(key);
      deduped.push(b);
    }
  }
  return deduped;
}

export function mergeProgress(local: ReadingProgress, remote: ReadingProgress): ReadingProgress {
  const localTime = new Date(local.updatedAt || 0).getTime();
  const remoteTime = new Date(remote.updatedAt || 0).getTime();
  const base = localTime > remoteTime ? local : remote;
  
  // Combine unique completed surahs and juz
  const combinedSurahs = Array.from(new Set([...(local.completedSurahs || []), ...(remote.completedSurahs || [])]));
  const combinedJuz = Array.from(new Set([...(local.completedJuz || []), ...(remote.completedJuz || [])]));
  
  return {
    ...base,
    completedSurahs: combinedSurahs,
    completedJuz: combinedJuz
  };
}

export function isValidVerseReference(surahNumber: number, ayahNumber: number): boolean {
  if (typeof surahNumber !== 'number' || typeof ayahNumber !== 'number') return false;
  if (surahNumber < 1 || surahNumber > 114) return false;
  const surah = SURAHS_METADATA[surahNumber - 1];
  if (!surah) return false;
  if (ayahNumber < 1 || ayahNumber > surah.verseCount) return false;
  return true;
}

export function getLocalPreferences(): UserPreferences {
  try {
    const raw = getStorage()?.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading preferences:', e);
  }
  return DEFAULT_PREFERENCES;
}

export function saveLocalPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const updated = { ...getLocalPreferences(), ...prefs };
  try {
    getStorage()?.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving preferences:', e);
  }
  return updated;
}
