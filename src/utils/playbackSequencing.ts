export type PlaybackMode = 'arabic' | 'arabic-bangla';
export type PlaybackStage =
  | 'idle'
  | 'arabic'
  | 'translation-loading'
  | 'translation'
  | 'paused-arabic'
  | 'paused-translation-loading'
  | 'paused-translation'
  | 'error'
  | 'completed';

export interface PlaybackState {
  stage: PlaybackStage;
  mode: PlaybackMode;
  token: number;
  repeatCurrentAyah: boolean;
  error: string | null;
  errorType: 'translation' | 'audio' | null;
}

export type PlaybackEvent =
  | { type: 'start'; token: number; mode: PlaybackMode; repeatCurrentAyah: boolean }
  | { type: 'mode'; mode: PlaybackMode }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'arabic-ended'; token: number }
  | { type: 'translation-started'; token: number }
  | { type: 'translation-ended'; token: number }
  | { type: 'translation-error'; token: number; error: string }
  | { type: 'playback-error'; token: number; error: string }
  | { type: 'continue-without-translation'; token: number }
  | { type: 'retry-translation'; token: number }
  | { type: 'complete-range'; token: number }
  | { type: 'repeat'; repeatCurrentAyah: boolean }
  | { type: 'stop'; token: number };

export interface AyahPosition {
  surahNumber: number;
  ayahNumber: number;
}

export function getNextAyahPosition(
  surahNumber: number,
  ayahNumber: number,
  verseCount: number,
  totalSurahs = 114,
): AyahPosition | null {
  if (ayahNumber < verseCount) return { surahNumber, ayahNumber: ayahNumber + 1 };
  if (surahNumber < totalSurahs) return { surahNumber: surahNumber + 1, ayahNumber: 1 };
  return null;
}

export function getPreviousAyahPosition(
  surahNumber: number,
  ayahNumber: number,
  previousSurahVerseCount?: number,
): AyahPosition | null {
  if (ayahNumber > 1) return { surahNumber, ayahNumber: ayahNumber - 1 };
  if (surahNumber > 1 && previousSurahVerseCount) {
    return { surahNumber: surahNumber - 1, ayahNumber: previousSurahVerseCount };
  }
  return null;
}

export function getCompletionAction(state: PlaybackState): 'repeat' | 'advance' | null {
  if (state.stage !== 'completed') return null;
  return state.repeatCurrentAyah ? 'repeat' : 'advance';
}

export const INITIAL_PLAYBACK_STATE: PlaybackState = {
  stage: 'idle',
  mode: 'arabic',
  token: 0,
  repeatCurrentAyah: false,
  error: null,
  errorType: null,
};

export function reducePlaybackState(state: PlaybackState, event: PlaybackEvent): PlaybackState {
  if (event.type === 'start') {
    return {
      stage: 'arabic',
      mode: event.mode,
      token: event.token,
      repeatCurrentAyah: event.repeatCurrentAyah,
      error: null,
      errorType: null,
    };
  }

  if (event.type === 'stop') {
    return { ...INITIAL_PLAYBACK_STATE, mode: state.mode, token: event.token };
  }

  if (event.type === 'mode') {
    return { ...state, mode: event.mode };
  }

  if (event.type === 'repeat') {
    return { ...state, repeatCurrentAyah: event.repeatCurrentAyah };
  }

  if (event.type === 'pause') {
    if (state.stage === 'arabic') return { ...state, stage: 'paused-arabic' };
    if (state.stage === 'translation-loading') return { ...state, stage: 'paused-translation-loading' };
    if (state.stage === 'translation') return { ...state, stage: 'paused-translation' };
    return state;
  }

  if (event.type === 'resume') {
    if (state.stage === 'paused-arabic') return { ...state, stage: 'arabic' };
    if (state.stage === 'paused-translation-loading') return { ...state, stage: 'translation-loading' };
    if (state.stage === 'paused-translation') return { ...state, stage: 'translation' };
    return state;
  }

  if (event.token !== state.token) return state;

  switch (event.type) {
    case 'arabic-ended':
      if (state.stage !== 'arabic') return state;
      if (state.mode === 'arabic-bangla') {
        return { ...state, stage: 'translation-loading', error: null };
      }
      return { ...state, stage: 'completed', error: null };
    case 'translation-started':
      if (state.stage !== 'translation-loading') return state;
      return { ...state, stage: 'translation', error: null };
    case 'translation-ended':
      if (state.stage !== 'translation') return state;
      return { ...state, stage: 'completed', error: null, errorType: null };
    case 'retry-translation':
      if (state.stage !== 'error' || state.errorType !== 'translation') return state;
      return { ...state, stage: 'translation-loading', token: event.token, error: null, errorType: null };
    case 'continue-without-translation':
      if (state.stage !== 'error' || state.errorType !== 'translation') return state;
      return { ...state, stage: 'completed', error: null, errorType: null };
    case 'translation-error':
      if (state.stage !== 'translation-loading' && state.stage !== 'translation') return state;
      return { ...state, stage: 'error', error: event.error, errorType: 'translation' };
    case 'playback-error':
      if (state.stage !== 'arabic' && state.stage !== 'translation' && state.stage !== 'translation-loading') return state;
      return { ...state, stage: 'error', error: event.error, errorType: 'audio' };
    case 'complete-range':
      if (state.stage === 'idle') return state;
      return { ...state, stage: 'completed', error: null, errorType: null };
    default:
      return state;
  }
}

export function isPlaceholderTranslation(text: string): boolean {
  const normalized = text.trim();
  return !normalized
    || normalized === 'অনুবাদ প্রক্রিয়াকরণে রয়েছে...'
    || /^সূরা .+ - আয়াত \d+$/u.test(normalized);
}

export function getExactAyahTranslation(
  ayahs: readonly { numberInSurah?: number; bengaliTranslation?: string }[],
  ayahNumber: number,
): string | null {
  const translation = ayahs.find(ayah => ayah.numberInSurah === ayahNumber)?.bengaliTranslation?.trim();
  return translation && !isPlaceholderTranslation(translation) ? translation : null;
}

export function hasBengaliSpeechVoice(voices: readonly { lang: string; name: string }[]): boolean {
  return voices.some(voice => /^bn(?:-|$)/i.test(voice.lang.trim()));
}

export interface SpeechVoiceDescriptor {
  lang: string;
  name: string;
}

export interface SpeechVoiceSource<TVoice extends SpeechVoiceDescriptor = SpeechVoiceDescriptor> {
  getVoices: () => readonly TVoice[];
  addEventListener?: (type: 'voiceschanged', listener: EventListener) => void;
  removeEventListener?: (type: 'voiceschanged', listener: EventListener) => void;
  onvoiceschanged?: ((this: SpeechSynthesis, ev: Event) => unknown) | null;
}

export function findBengaliVoice<TVoice extends SpeechVoiceDescriptor>(
  voices: readonly TVoice[],
): TVoice | null {
  return voices.find(voice => /^bn(?:-|$)/i.test(voice.lang.trim())) ?? null;
}

export function waitForBengaliVoice<TVoice extends SpeechVoiceDescriptor>(
  source: SpeechVoiceSource<TVoice>,
  signal: AbortSignal,
  timeoutMs = 8000,
): Promise<TVoice | null> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Voice discovery aborted', 'AbortError'));
      return;
    }

    let settled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const previousVoiceHandler = source.onvoiceschanged;

    const cleanup = () => {
      clearTimeout(timeout);
      if (retryTimer !== undefined) clearTimeout(retryTimer);
      source.removeEventListener?.('voiceschanged', onVoicesChanged);
      if (source.onvoiceschanged === onVoicesChanged) source.onvoiceschanged = previousVoiceHandler ?? null;
      signal.removeEventListener('abort', onAbort);
    };
    const finish = (voice: TVoice | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(voice);
    };
    const onVoicesChanged: EventListener = () => {
      let voice: TVoice | null = null;
      try {
        voice = findBengaliVoice(source.getVoices());
      } catch {
        finish(null);
        return;
      }
      if (voice) finish(voice);
    };
    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new DOMException('Voice discovery aborted', 'AbortError'));
    };

    timeout = setTimeout(() => finish(null), Math.max(0, timeoutMs));
    const pollVoices = () => {
      onVoicesChanged(new Event('voiceschanged'));
      if (!settled) retryTimer = setTimeout(pollVoices, 250);
    };
    pollVoices();
    source.addEventListener?.('voiceschanged', onVoicesChanged);
    if (typeof source.onvoiceschanged === 'undefined') {
      source.onvoiceschanged = onVoicesChanged as SpeechVoiceSource<TVoice>['onvoiceschanged'];
    }
    signal.addEventListener('abort', onAbort, { once: true });
    onVoicesChanged(new Event('voiceschanged'));
  });
}
