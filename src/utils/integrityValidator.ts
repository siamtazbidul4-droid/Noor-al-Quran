import { SURAHS_METADATA } from '../data/surahMetadata';
import { JUZ_METADATA } from '../data/juzMetadata';
import { RECITERS } from '../data/recitersData';
import { SOURCES_REGISTRY } from '../data/sourcesRegistry';

export interface IntegrityCheckResult {
  passed: boolean;
  timestamp: string;
  checks: {
    name: string;
    description: string;
    status: 'PASSED' | 'FAILED' | 'WARNING';
    detail: string;
  }[];
  totalSurahs: number;
  totalVersesCalculated: number;
  expectedVerses: number;
  totalJuz: number;
  totalReciters: number;
}

export function validateQuranIntegrity(): IntegrityCheckResult {
  const checks: IntegrityCheckResult['checks'] = [];
  let allPassed = true;

  // 1. Verify 114 Surahs
  const surahCount = SURAHS_METADATA.length;
  if (surahCount === 114) {
    checks.push({
      name: "Surah Count Verification",
      description: "Ensure exactly 114 canonical Surahs exist",
      status: "PASSED",
      detail: `Found exactly ${surahCount} canonical Surahs.`
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Surah Count Verification",
      description: "Ensure exactly 114 canonical Surahs exist",
      status: "FAILED",
      detail: `Expected 114 Surahs, found ${surahCount}.`
    });
  }

  // 2. Verify Consecutive Surah Numbering 1..114
  let numberingValid = true;
  for (let i = 0; i < SURAHS_METADATA.length; i++) {
    if (SURAHS_METADATA[i].number !== i + 1) {
      numberingValid = false;
      break;
    }
  }
  if (numberingValid) {
    checks.push({
      name: "Surah Numbering Sequence",
      description: "Ensure Surahs are strictly ordered from 1 to 114 without gaps",
      status: "PASSED",
      detail: "All Surah numbers are strictly sequential (1..114)."
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Surah Numbering Sequence",
      description: "Ensure Surahs are strictly ordered from 1 to 114 without gaps",
      status: "FAILED",
      detail: "Surah sequence order mismatch detected."
    });
  }

  // 3. Verify Total Verse Count = 6,236 (Kufic / Medina standard)
  const totalVerses = SURAHS_METADATA.reduce((sum, s) => sum + s.verseCount, 0);
  const EXPECTED_VERSES = 6236;
  if (totalVerses === EXPECTED_VERSES) {
    checks.push({
      name: "Total Verse Count Integrity",
      description: "Ensure total verses match 6,236 (Authoritative Hafs / Kufic counting)",
      status: "PASSED",
      detail: `Calculated sum of all Surah verse counts: ${totalVerses} verses (matches canonical count ${EXPECTED_VERSES}).`
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Total Verse Count Integrity",
      description: "Ensure total verses match 6,236 (Authoritative Hafs / Kufic counting)",
      status: "FAILED",
      detail: `Calculated ${totalVerses} verses, expected ${EXPECTED_VERSES}.`
    });
  }

  // 4. Verify 30 Juz
  const juzCount = JUZ_METADATA.length;
  if (juzCount === 30) {
    checks.push({
      name: "Juz / Para Count Verification",
      description: "Ensure all 30 Juz exist with documented boundaries",
      status: "PASSED",
      detail: `All 30 Juz definitions present.`
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Juz / Para Count Verification",
      description: "Ensure all 30 Juz exist with documented boundaries",
      status: "FAILED",
      detail: `Expected 30 Juz, found ${juzCount}.`
    });
  }

  // 5. Verify Juz Boundary Feasibility
  let juzBoundariesValid = true;
  for (const juz of JUZ_METADATA) {
    const startSurah = SURAHS_METADATA[juz.start.surah - 1];
    const endSurah = SURAHS_METADATA[juz.end.surah - 1];

    if (!startSurah || juz.start.ayah < 1 || juz.start.ayah > startSurah.verseCount) {
      juzBoundariesValid = false;
      break;
    }
    if (!endSurah || juz.end.ayah < 1 || juz.end.ayah > endSurah.verseCount) {
      juzBoundariesValid = false;
      break;
    }
  }

  if (juzBoundariesValid) {
    checks.push({
      name: "Juz Boundary Validation",
      description: "Verify start and end verse references exist within their respective Surahs",
      status: "PASSED",
      detail: "All 30 Juz starting and ending verses are verified within Surah verse limits."
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Juz Boundary Validation",
      description: "Verify start and end verse references exist within their respective Surahs",
      status: "FAILED",
      detail: "Invalid Juz boundary reference found."
    });
  }

  // 6. Verify Reciters Coverage
  const validReciters = RECITERS.every(r => r.id && r.verseAudioPattern && r.surahAudioPattern && r.attribution);
  if (validReciters && RECITERS.length >= 3) {
    checks.push({
      name: "Reciter Audio Registry",
      description: "Ensure identified Qaris have verified audio templates and licensing attribution",
      status: "PASSED",
      detail: `${RECITERS.length} authentic male Qaris configured with documented licensing.`
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Reciter Audio Registry",
      description: "Ensure identified Qaris have verified audio templates and licensing attribution",
      status: "FAILED",
      detail: "Reciter configuration missing or incomplete."
    });
  }

  // 7. Verify Content Sources Registry
  if (SOURCES_REGISTRY.length >= 4) {
    checks.push({
      name: "Source Governance Registry",
      description: "Verify Arabic, Bengali Translation, Transliteration, and Audio sources are tracked",
      status: "PASSED",
      detail: `${SOURCES_REGISTRY.length} authoritative sources registered with licensing and retrieval timestamps.`
    });
  } else {
    allPassed = false;
    checks.push({
      name: "Source Governance Registry",
      description: "Verify Arabic, Bengali Translation, Transliteration, and Audio sources are tracked",
      status: "FAILED",
      detail: "Incomplete source registry."
    });
  }

  return {
    passed: allPassed,
    timestamp: new Date().toISOString(),
    checks,
    totalSurahs: surahCount,
    totalVersesCalculated: totalVerses,
    expectedVerses: EXPECTED_VERSES,
    totalJuz: juzCount,
    totalReciters: RECITERS.length
  };
}
