import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findBengaliVoice,
  getCompletionAction,
  getExactAyahTranslation,
  getNextAyahPosition,
  getPreviousAyahPosition,
  hasBengaliSpeechVoice,
  INITIAL_PLAYBACK_STATE,
  isPlaceholderTranslation,
  PlaybackState,
  reducePlaybackState,
  waitForBengaliVoice,
} from './playbackSequencing';

function start(mode: 'arabic' | 'arabic-bangla' = 'arabic-bangla', repeatCurrentAyah = false, token = 1): PlaybackState {
  return reducePlaybackState(INITIAL_PLAYBACK_STATE, {
    type: 'start',
    mode,
    repeatCurrentAyah,
    token,
  });
}

test('Arabic completion enters translation and cannot advance before translation completes', () => {
  const state = start();
  const loadingStage = reducePlaybackState(state, { type: 'arabic-ended', token: 1 });
  assert.equal(loadingStage.stage, 'translation-loading');
  assert.equal(getCompletionAction(loadingStage), null);

  const translationStage = reducePlaybackState(loadingStage, { type: 'translation-started', token: 1 });
  assert.equal(translationStage.stage, 'translation');
  const completed = reducePlaybackState(translationStage, { type: 'translation-ended', token: 1 });
  assert.equal(completed.stage, 'completed');
  assert.equal(getCompletionAction(completed), 'advance');
});

test('duplicate Arabic ended and duplicate Bangla completion events do not re-enter completed stages', () => {
  const state = start();
  const afterFirstArabicEnd = reducePlaybackState(state, { type: 'arabic-ended', token: 1 });
  const afterDuplicateArabicEnd = reducePlaybackState(afterFirstArabicEnd, { type: 'arabic-ended', token: 1 });
  assert.equal(afterDuplicateArabicEnd.stage, 'translation-loading');

  const translationStarted = reducePlaybackState(afterDuplicateArabicEnd, { type: 'translation-started', token: 1 });
  const afterFirstBanglaEnd = reducePlaybackState(translationStarted, { type: 'translation-ended', token: 1 });
  const afterDuplicateBanglaEnd = reducePlaybackState(afterFirstBanglaEnd, { type: 'translation-ended', token: 1 });
  assert.equal(getCompletionAction(afterFirstBanglaEnd), 'advance');
  assert.deepEqual(afterDuplicateBanglaEnd, afterFirstBanglaEnd);
});

test('Next and Previous during Arabic or translation invalidate stale callbacks', () => {
  for (const oldStage of [
    start(),
    reducePlaybackState(start(), { type: 'arabic-ended', token: 1 }),
  ]) {
    const navigatedTrack = reducePlaybackState(oldStage, {
      type: 'start',
      mode: 'arabic-bangla',
      repeatCurrentAyah: false,
      token: 2,
    });
    assert.equal(navigatedTrack.stage, 'arabic');
    assert.deepEqual(
      reducePlaybackState(navigatedTrack, { type: 'translation-ended', token: 1 }),
      navigatedTrack,
    );
    assert.deepEqual(
      reducePlaybackState(navigatedTrack, { type: 'arabic-ended', token: 1 }),
      navigatedTrack,
    );
  }
});

test('pause and resume preserve the active Arabic or translation stage', () => {
  const pausedArabic = reducePlaybackState(start(), { type: 'pause' });
  assert.equal(pausedArabic.stage, 'paused-arabic');
  assert.equal(reducePlaybackState(pausedArabic, { type: 'resume' }).stage, 'arabic');

  const translationLoading = reducePlaybackState(start(), { type: 'arabic-ended', token: 1 });
  const translationStarted = reducePlaybackState(translationLoading, { type: 'translation-started', token: 1 });
  const pausedTranslation = reducePlaybackState(translationStarted, { type: 'pause' });
  assert.equal(pausedTranslation.stage, 'paused-translation');
  assert.equal(reducePlaybackState(pausedTranslation, { type: 'resume' }).stage, 'translation');
});

test('rapid mode switching changes only the active mode and stale events remain guarded', () => {
  const arabicState = start('arabic');
  const dualModeState = reducePlaybackState(arabicState, { type: 'mode', mode: 'arabic-bangla' });
  const arabicOnlyState = reducePlaybackState(dualModeState, { type: 'mode', mode: 'arabic' });
  const dualAgainState = reducePlaybackState(arabicOnlyState, { type: 'mode', mode: 'arabic-bangla' });
  assert.equal(dualAgainState.mode, 'arabic-bangla');
  assert.equal(reducePlaybackState(dualAgainState, { type: 'arabic-ended', token: 1 }).stage, 'translation-loading');
});

test('missing translation or Bengali voice reports an error and advances only after explicit recovery', () => {
  let state = reducePlaybackState(start(), { type: 'arabic-ended', token: 1 });
  state = reducePlaybackState(state, {
    type: 'translation-error',
    token: 1,
    error: 'Bangla translation or voice unavailable',
  });
  assert.equal(state.stage, 'error');
  assert.equal(getCompletionAction(state), null);

  const recovered = reducePlaybackState(state, { type: 'continue-without-translation', token: 1 });
  assert.equal(recovered.stage, 'completed');
  assert.equal(getCompletionAction(recovered), 'advance');
});

test('Arabic-only mode completes the Arabic stage without starting translation', () => {
  const state = reducePlaybackState(start('arabic'), { type: 'arabic-ended', token: 1 });
  assert.equal(state.stage, 'completed');
  assert.equal(getCompletionAction(state), 'advance');
});

test('repeat-current-ayah repeats after its complete sequence', () => {
  const translationStage = reducePlaybackState(
    start('arabic-bangla', true),
    { type: 'arabic-ended', token: 1 },
  );
  assert.equal(translationStage.stage, 'translation-loading');
  const started = reducePlaybackState(translationStage, { type: 'translation-started', token: 1 });
  const completed = reducePlaybackState(started, { type: 'translation-ended', token: 1 });
  assert.equal(getCompletionAction(completed), 'repeat');

  const arabicOnlyCompleted = reducePlaybackState(
    reducePlaybackState(start('arabic', true), { type: 'arabic-ended', token: 1 }),
    { type: 'complete-range', token: 1 },
  );
  assert.equal(getCompletionAction(arabicOnlyCompleted), 'repeat');
});

test('surah boundary navigation advances and goes back to the previous surah last ayah', () => {
  assert.deepEqual(getNextAyahPosition(1, 7, 7), { surahNumber: 2, ayahNumber: 1 });
  assert.deepEqual(getPreviousAyahPosition(2, 1, 7), { surahNumber: 1, ayahNumber: 7 });
});

test('final ayah of the final surah completes the range without advancing out of bounds', () => {
  assert.equal(getNextAyahPosition(114, 6, 6), null);
  const completed = reducePlaybackState(
    reducePlaybackState(start('arabic'), { type: 'arabic-ended', token: 1 }),
    { type: 'complete-range', token: 1 },
  );
  assert.equal(completed.stage, 'completed');
  assert.equal(getCompletionAction(completed), 'advance');
});

test('translation mapping rejects empty and generated fallback placeholders', () => {
  assert.equal(isPlaceholderTranslation(''), true);
  assert.equal(isPlaceholderTranslation('অনুবাদ প্রক্রিয়াকরণে রয়েছে...'), true);
  assert.equal(isPlaceholderTranslation('সূরা আল-বাক্বারাহ - আয়াত 1'), true);
  assert.equal(isPlaceholderTranslation('আলিফ-লাম-মীম।'), false);
});

test('translation is selected by exact ayah number, not by array position', () => {
  const records = [
    { numberInSurah: 2, bengaliTranslation: 'দ্বিতীয় আয়াতের অনুবাদ' },
    { numberInSurah: 1, bengaliTranslation: 'প্রথম আয়াতের অনুবাদ' },
  ];
  assert.equal(getExactAyahTranslation(records, 1), 'প্রথম আয়াতের অনুবাদ');
  assert.equal(getExactAyahTranslation(records, 3), null);
});

test('missing Bengali voice support is not replaced by an unrelated voice', () => {
  assert.equal(hasBengaliSpeechVoice([]), false);
  assert.equal(hasBengaliSpeechVoice([{ lang: 'en-US', name: 'English Voice' }]), false);
  assert.equal(hasBengaliSpeechVoice([{ lang: 'bn-BD', name: 'Bangla Voice' }]), true);
});

test('finds an immediately available Bengali voice', async () => {
  const voice = { lang: 'bn-IN', name: 'Bangla Voice' };
  const found = await waitForBengaliVoice({ getVoices: () => [voice] }, new AbortController().signal);
  assert.equal(found, voice);
});

test('finds a Bengali voice after voices load asynchronously', async () => {
  let voices: readonly { lang: string; name: string }[] = [];
  let listener: EventListener | undefined;
  const source = {
    getVoices: () => voices,
    addEventListener: (_type: 'voiceschanged', nextListener: EventListener) => { listener = nextListener; },
    removeEventListener: (_type: 'voiceschanged', listenerToRemove: EventListener) => {
      if (listener === listenerToRemove) listener = undefined;
    },
  };
  const pending = waitForBengaliVoice(source, new AbortController().signal, 200);
  voices = [{ lang: 'bn-BD', name: 'Bangla Voice' }];
  listener?.(new Event('voiceschanged'));
  assert.equal((await pending)?.name, 'Bangla Voice');
  assert.equal(listener, undefined);
});

test('reports no Bengali voice when only unrelated voices are available', async () => {
  const source = {
    getVoices: () => [{ lang: 'en-US', name: 'English Voice' }],
  };
  assert.equal(await waitForBengaliVoice(source, new AbortController().signal, 20), null);
  assert.equal(findBengaliVoice(source.getVoices()), null);
});

test('aborts Bengali voice discovery and releases its listeners', async () => {
  const controller = new AbortController();
  let listener: EventListener | undefined;
  const source = {
    getVoices: () => [] as readonly { lang: string; name: string }[],
    addEventListener: (_type: 'voiceschanged', nextListener: EventListener) => { listener = nextListener; },
    removeEventListener: (_type: 'voiceschanged', listenerToRemove: EventListener) => {
      if (listener === listenerToRemove) listener = undefined;
    },
  };
  const pending = waitForBengaliVoice(source, controller.signal, 500);
  controller.abort();
  await assert.rejects(pending, (error: unknown) => error instanceof DOMException && error.name === 'AbortError');
  assert.equal(listener, undefined);
});
