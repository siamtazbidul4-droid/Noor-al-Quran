import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuranIntegrity } from './integrityValidator';
import { SURAHS_METADATA } from '../data/surahMetadata';
import { JUZ_METADATA } from '../data/juzMetadata';

test('Quran data integrity passes all canonical checks', () => {
  const result = validateQuranIntegrity();
  assert.equal(result.passed, true, 'Integrity verification must pass');
  assert.equal(result.totalSurahs, 114, 'Must have exactly 114 Surahs');
  assert.equal(result.totalVersesCalculated, 6236, 'Must calculate exactly 6,236 verses');
  assert.equal(result.totalJuz, 30, 'Must have 30 Juz');
  assert.ok(result.checks.length >= 6, 'Must execute structural verification checks');
});

test('Surah metadata has no duplicate or missing numbers', () => {
  const numbers = SURAHS_METADATA.map(s => s.number);
  const set = new Set(numbers);
  assert.equal(set.size, 114, 'All 114 numbers must be unique');
  assert.equal(numbers[0], 1, 'First surah is 1');
  assert.equal(numbers[113], 114, 'Last surah is 114');
});

test('Juz boundary mappings reference valid Surahs and Ayahs', () => {
  for (const juz of JUZ_METADATA) {
    assert.ok(juz.juzNumber >= 1 && juz.juzNumber <= 30);
    const startSurah = SURAHS_METADATA[juz.start.surah - 1];
    const endSurah = SURAHS_METADATA[juz.end.surah - 1];
    assert.ok(startSurah, `Start surah for Juz ${juz.juzNumber} exists`);
    assert.ok(endSurah, `End surah for Juz ${juz.juzNumber} exists`);
    assert.ok(juz.start.ayah >= 1 && juz.start.ayah <= startSurah.verseCount);
    assert.ok(juz.end.ayah >= 1 && juz.end.ayah <= endSurah.verseCount);
  }
});
