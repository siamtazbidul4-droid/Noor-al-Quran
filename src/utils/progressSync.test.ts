import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidVerseReference, deduplicateBookmarks, mergeProgress, LocalBookmark, ReadingProgress, DEFAULT_PREFERENCES, getLocalPreferences, saveLocalPreferences } from './progressSync';

test('isValidVerseReference accurately verifies surah and ayah limits', () => {
  // Surah 1 Al-Fatihah has 7 ayahs
  assert.equal(isValidVerseReference(1, 1), true);
  assert.equal(isValidVerseReference(1, 7), true);
  assert.equal(isValidVerseReference(1, 8), false);
  assert.equal(isValidVerseReference(1, 0), false);

  // Surah 2 Al-Baqarah has 286 ayahs
  assert.equal(isValidVerseReference(2, 286), true);
  assert.equal(isValidVerseReference(2, 287), false);

  // Surah 114 An-Nas has 6 ayahs
  assert.equal(isValidVerseReference(114, 6), true);
  assert.equal(isValidVerseReference(114, 7), false);

  // Invalid surah numbers
  assert.equal(isValidVerseReference(0, 1), false);
  assert.equal(isValidVerseReference(115, 1), false);
});

test('deduplicateBookmarks removes duplicates for identical surah:ayah', () => {
  const bookmarks: LocalBookmark[] = [
    { id: '1_1', surahNumber: 1, ayahNumber: 1, surahNameBengali: 'আল-ফাতিহা', surahNameArabic: 'الفاتحة', createdAt: '2026-10-21T10:00:00Z' },
    { id: '1_1_dup', surahNumber: 1, ayahNumber: 1, surahNameBengali: 'আল-ফাতিহা', surahNameArabic: 'الفاتحة', createdAt: '2026-10-21T11:00:00Z' },
    { id: '2_255', surahNumber: 2, ayahNumber: 255, surahNameBengali: 'আল-বাক্বারাহ', surahNameArabic: 'البقرة', createdAt: '2026-10-21T12:00:00Z' },
  ];

  const deduped = deduplicateBookmarks(bookmarks);
  assert.equal(deduped.length, 2);
  assert.equal(deduped[0].surahNumber, 1);
  assert.equal(deduped[0].ayahNumber, 1);
  assert.equal(deduped[1].surahNumber, 2);
  assert.equal(deduped[1].ayahNumber, 255);
});

test('mergeProgress selects latest timestamp and combines completed items', () => {
  const local: ReadingProgress = {
    surahNumber: 1,
    ayahNumber: 5,
    surahNameBengali: 'আল-ফাতিহা',
    surahNameArabic: 'الفاتحة',
    updatedAt: '2026-10-21T14:00:00Z',
    completedSurahs: [1],
    completedJuz: [1]
  };

  const remote: ReadingProgress = {
    surahNumber: 2,
    ayahNumber: 255,
    surahNameBengali: 'আল-বাক্বারাহ',
    surahNameArabic: 'البقرة',
    updatedAt: '2026-10-21T15:00:00Z', // Newer!
    completedSurahs: [1, 114],
    completedJuz: [30]
  };

  const merged = mergeProgress(local, remote);
  assert.equal(merged.surahNumber, 2, 'Should pick remote because updatedAt is newer');
  assert.equal(merged.ayahNumber, 255);
  assert.deepEqual(merged.completedSurahs?.sort(), [1, 114]);
  assert.deepEqual(merged.completedJuz?.sort(), [1, 30]);
});

test('bengaliAudioEnabled persists in user preferences with a safe default', () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => (storage.has(key) ? storage.get(key)! : null),
      setItem: (key: string, value: string) => { storage.set(key, value); },
      removeItem: (key: string) => { storage.delete(key); },
      clear: () => { storage.clear(); }
    },
    configurable: true,
    writable: true,
  });

  const saved = saveLocalPreferences({ bengaliAudioEnabled: true });
  assert.equal(saved.bengaliAudioEnabled, true);
  assert.equal(DEFAULT_PREFERENCES.bengaliAudioEnabled, false);
  assert.equal(getLocalPreferences().bengaliAudioEnabled, true);
});
