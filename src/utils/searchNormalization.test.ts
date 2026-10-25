import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArabicForSearch, normalizeBengaliForSearch, isSearchMatch } from './searchNormalization';

test('Arabic search normalization strips diacritics and unifies letters', () => {
  // "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
  const rawWithTashkeel = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const normalized = normalizeArabicForSearch(rawWithTashkeel);
  
  // Normalized should not contain harakat like kasrah, shaddah, etc.
  assert.equal(normalized.includes('\u0650'), false, 'Should strip kasrah');
  assert.equal(normalized.includes('\u0651'), false, 'Should strip shaddah');
  assert.equal(normalized.includes('الله'), true, 'Should preserve core letters');
});

test('Arabic search matching matches query without requiring tashkeel', () => {
  const verseText = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";
  const plainQuery = "الحمد";
  assert.equal(isSearchMatch(plainQuery, verseText, true), true);
  
  const queryAlamin = "العالمين";
  assert.equal(isSearchMatch(queryAlamin, verseText, true), true);
});

test('Bengali search normalization trims and ignores case/formatting', () => {
  const target = "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে";
  assert.equal(isSearchMatch("করুণাময়", target, false), true);
  assert.equal(isSearchMatch("আল্লাহর নামে", target, false), true);
  assert.equal(isSearchMatch("অপরিচিত", target, false), false);
});
