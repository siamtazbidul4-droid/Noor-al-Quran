import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getVerseAudioUrl, getSurahAudioUrl } from '../data/recitersData';
import { SURAHS_METADATA } from '../data/surahMetadata';
import {
  INITIAL_PLAYBACK_STATE,
  getCompletionAction,
  getExactAyahTranslation,
  getNextAyahPosition,
  getPreviousAyahPosition,
  hasBengaliSpeechVoice,
  waitForBengaliVoice,
  PlaybackMode,
  PlaybackState,
  reducePlaybackState,
} from '../utils/playbackSequencing';

export interface AudioTrack {
  type: 'ayah' | 'surah';
  surahNumber: number;
  ayahNumber?: number;
  surahNameBengali: string;
  surahNameArabic: string;
  reciterId: string;
  url: string;
}

interface AyahTranslationResponse {
  success: boolean;
  surah?: { number?: number };
  data?: Array<{
    numberInSurah?: number;
    bengaliTranslation?: string;
  }>;
  error?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  repeatCurrentAyah: boolean;
  playbackMode: PlaybackMode;
  playbackStage: PlaybackState['stage'];
  playbackError: string | null;
  canContinueWithoutTranslation: boolean;
  reciterId: string;
  playAyah: (surahNumber: number, ayahNumber: number, reciterId?: string) => void;
  playSurah: (surahNumber: number, reciterId?: string) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setSpeed: (speed: number) => void;
  setReciter: (id: string) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  toggleRepeat: () => void;
  playNextAyah: () => void;
  playPrevAyah: () => void;
  continueWithoutTranslation: () => void;
  retryTranslation: () => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const currentTrackRef = useRef<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [reciterId, setReciterId] = useState('alafasy');
  const [playbackState, setPlaybackState] = useState<PlaybackState>(INITIAL_PLAYBACK_STATE);
  const playbackStateRef = useRef(playbackState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const utteranceTokenRef = useRef<number | null>(null);
  const finishedUtteranceTokenRef = useRef<number | null>(null);
  const speechFailureRef = useRef<{ token: number; message: string } | null>(null);
  const onEndedRef = useRef<() => void>(() => undefined);
  const finishTranslationRef = useRef<(token: number, utterance: SpeechSynthesisUtterance) => void>(() => undefined);
  const playAyahRef = useRef<(surahNumber: number, ayahNumber: number, customReciter?: string) => void>(() => undefined);
  const advanceRef = useRef<(track: AudioTrack) => void>(() => undefined);
  const tokenRef = useRef(0);
  const lastEndedTokenRef = useRef<number | null>(null);

  const dispatch = (event: Parameters<typeof reducePlaybackState>[1]) => {
    const next = reducePlaybackState(playbackStateRef.current, event);
    playbackStateRef.current = next;
    setPlaybackState(next);
    return next;
  };

  const setTrack = (track: AudioTrack | null) => {
    currentTrackRef.current = track;
    setCurrentTrack(track);
  };

  const advanceFromTrack = (track: AudioTrack) => {
    if (track.type !== 'ayah' || !track.ayahNumber) {
      setIsPlaying(false);
      dispatch({ type: 'stop', token: ++tokenRef.current });
      return;
    }

    const surah = SURAHS_METADATA[track.surahNumber - 1];
    if (!surah) return;

    const next = getNextAyahPosition(track.surahNumber, track.ayahNumber, surah.verseCount, SURAHS_METADATA.length);
    if (next) {
      playAyahRef.current(next.surahNumber, next.ayahNumber, track.reciterId);
    } else {
      setIsPlaying(false);
      dispatch({ type: 'complete-range', token: playbackStateRef.current.token });
    }
  };
  advanceRef.current = advanceFromTrack;

  const playAyah = (surahNumber: number, ayahNumber: number, customReciter?: string) => {
    const activeReciter = customReciter || reciterId;
    const surah = SURAHS_METADATA[surahNumber - 1];
    if (!surah || ayahNumber < 1 || ayahNumber > surah.verseCount) return;

    const track: AudioTrack = {
      type: 'ayah',
      surahNumber,
      ayahNumber,
      surahNameBengali: surah.bengaliName,
      surahNameArabic: surah.arabicName,
      reciterId: activeReciter,
      url: getVerseAudioUrl(activeReciter, surahNumber, ayahNumber),
    };

    const token = ++tokenRef.current;
    dispatch({
      type: 'start',
      token,
      mode: playbackStateRef.current.mode,
      repeatCurrentAyah: playbackStateRef.current.repeatCurrentAyah,
    });
    setTrack(track);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setIsPlaying(true);

    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.url;
    audio.playbackRate = playbackSpeed;
    audio.play().catch((error: unknown) => {
      if (playbackStateRef.current.token !== token) return;
      dispatch({
        type: 'playback-error',
        token,
        error: error instanceof Error ? `আরবি অডিও চালানো যায়নি: ${error.message}` : 'আরবি অডিও চালানো যায়নি।',
      });
      setIsLoading(false);
      setIsPlaying(false);
    });
  };
  playAyahRef.current = playAyah;

  const playSurah = (surahNumber: number, customReciter?: string) => {
    const activeReciter = customReciter || reciterId;
    const surah = SURAHS_METADATA[surahNumber - 1];
    if (!surah) return;

    const track: AudioTrack = {
      type: 'surah',
      surahNumber,
      surahNameBengali: surah.bengaliName,
      surahNameArabic: surah.arabicName,
      reciterId: activeReciter,
      url: getSurahAudioUrl(activeReciter, surahNumber),
    };
    dispatch({ type: 'start', token: ++tokenRef.current, mode: playbackStateRef.current.mode, repeatCurrentAyah: false });
    setTrack(track);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setIsPlaying(true);
    if (!audioRef.current) return;
    audioRef.current.src = track.url;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.play().catch((error: unknown) => {
      dispatch({
        type: 'playback-error',
        token: playbackStateRef.current.token,
        error: error instanceof Error ? `সূরার অডিও চালানো যায়নি: ${error.message}` : 'সূরার অডিও চালানো যায়নি।',
      });
      setIsLoading(false);
      setIsPlaying(false);
    });
  };

  const onAudioEnded = () => {
    const audio = audioRef.current;
    const track = currentTrackRef.current;
    const state = playbackStateRef.current;
    if (!audio?.ended || !track || lastEndedTokenRef.current === state.token) return;
    lastEndedTokenRef.current = state.token;

    if (track.type === 'surah') {
      setIsPlaying(false);
      dispatch({ type: 'stop', token: ++tokenRef.current });
      return;
    }

    const next = dispatch({ type: 'arabic-ended', token: state.token });
    const action = getCompletionAction(next);
    if (action) {
      if (action === 'repeat') {
        playAyahRef.current(track.surahNumber, track.ayahNumber!, track.reciterId);
      } else {
        advanceRef.current(track);
      }
    } else if (next.stage === 'translation-loading') {
      setIsPlaying(true);
      setIsLoading(true);
    } else if (next.stage === 'translation') {
      setIsPlaying(true);
      setIsLoading(false);
    }
  };
  onEndedRef.current = onAudioEnded;

  const playNextAyah = () => {
    const track = currentTrackRef.current;
    if (track?.type === 'ayah') advanceFromTrack(track);
  };

  const playPrevAyah = () => {
    const track = currentTrackRef.current;
    if (track?.type !== 'ayah' || !track.ayahNumber) return;
    const previousSurah = track.surahNumber > 1 ? SURAHS_METADATA[track.surahNumber - 2] : undefined;
    const previous = getPreviousAyahPosition(track.surahNumber, track.ayahNumber, previousSurah?.verseCount);
    if (previous) playAyah(previous.surahNumber, previous.ayahNumber, track.reciterId);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    const stage = playbackStateRef.current.stage;
    if (!currentTrackRef.current || !audio) return;

    if (isPlaying) {
      dispatch({ type: 'pause' });
      setIsPlaying(false);
      if ((stage === 'translation' || stage === 'translation-loading') && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      } else if (stage === 'arabic') {
        audio.pause();
      }
      return;
    }

    if (stage === 'error' || stage === 'completed' || stage === 'idle') return;
    if (stage === 'paused-arabic' && audio.ended) {
      const track = currentTrackRef.current;
      if (track?.type === 'ayah' && track.ayahNumber) {
        playAyahRef.current(track.surahNumber, track.ayahNumber, track.reciterId);
        return;
      }
    }
    const resumed = dispatch({ type: 'resume' });
    setIsPlaying(true);
    if (resumed.stage === 'translation' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    } else if (resumed.stage === 'arabic') {
      audio.play().catch((error: unknown) => {
        dispatch({
          type: 'playback-error',
          token: playbackStateRef.current.token,
          error: error instanceof Error ? `অডিও আবার চালানো যায়নি: ${error.message}` : 'অডিও আবার চালানো যায়নি।',
        });
        setIsPlaying(false);
      });
    }
  };

  const setPlaybackMode = (mode: PlaybackMode) => {
    const previousStage = playbackStateRef.current.stage;
    const track = currentTrackRef.current;
    dispatch({ type: 'mode', mode });
    if (mode === 'arabic' && previousStage !== 'arabic' && previousStage !== 'paused-arabic' && track?.type === 'ayah') {
      playAyah(track.surahNumber, track.ayahNumber!, track.reciterId);
    }
  };

  const toggleRepeat = () => {
    dispatch({ type: 'repeat', repeatCurrentAyah: !playbackStateRef.current.repeatCurrentAyah });
  };

  const continueWithoutTranslation = () => {
    const state = playbackStateRef.current;
    const track = currentTrackRef.current;
    if (state.stage !== 'error' || !track) return;
    const next = dispatch({ type: 'continue-without-translation', token: state.token });
    setIsPlaying(false);
    if (next.stage === 'completed') advanceRef.current(track);
  };

  const retryTranslation = () => {
    const state = playbackStateRef.current;
    if (state.stage !== 'error' || state.errorType !== 'translation') return;
    dispatch({ type: 'retry-translation', token: ++tokenRef.current });
    setIsLoading(true);
  };

  const finishTranslation = (token: number, utterance: SpeechSynthesisUtterance) => {
    const state = playbackStateRef.current;
    if (state.token !== token || utteranceRef.current !== utterance) return;
    if (state.stage === 'paused-translation') {
      finishedUtteranceTokenRef.current = token;
      return;
    }
    if (state.stage !== 'translation') return;

    utteranceRef.current = null;
    utteranceTokenRef.current = null;
    finishedUtteranceTokenRef.current = null;
    speechFailureRef.current = null;
    const next = dispatch({ type: 'translation-ended', token });
    const action = getCompletionAction(next);
    if (!action) return;
    const latestTrack = currentTrackRef.current;
    setIsPlaying(false);
    if (!latestTrack) return;
    if (action === 'repeat' && latestTrack.type === 'ayah' && latestTrack.ayahNumber) {
      playAyahRef.current(latestTrack.surahNumber, latestTrack.ayahNumber, latestTrack.reciterId);
    } else {
      advanceRef.current(latestTrack);
    }
  };
  finishTranslationRef.current = finishTranslation;

  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    utteranceTokenRef.current = null;
    finishedUtteranceTokenRef.current = null;
    setTrack(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    dispatch({ type: 'stop', token: ++tokenRef.current });
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onLoadStart = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      const state = playbackStateRef.current;
      if (state.stage === 'arabic' && audio.src === currentTrackRef.current?.url) {
        dispatch({ type: 'playback-error', token: state.token, error: 'আরবি অডিও লোড করা যায়নি। নেটওয়ার্ক যাচাই করে আবার চেষ্টা করুন।' });
      }
    };
    const onEnded = () => onEndedRef.current();

    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const state = playbackState;
    if (state.stage === 'paused-translation' || state.stage === 'paused-translation-loading') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.pause();
      return;
    }
    if (state.stage !== 'translation-loading' && state.stage !== 'translation') return;

    const track = currentTrackRef.current;
    const token = state.token;
    const ayahNumber = track?.ayahNumber;
    if (!track || track.type !== 'ayah' || !ayahNumber) {
      dispatch({ type: 'translation-error', token, error: 'এই আয়াতের বাংলা অনুবাদ খুঁজে পাওয়া যায়নি।' });
      setIsPlaying(false);
      return;
    }
    if (utteranceTokenRef.current === token && utteranceRef.current) {
      if (speechFailureRef.current?.token === token) {
        const failure = speechFailureRef.current;
        speechFailureRef.current = null;
        utteranceRef.current = null;
        utteranceTokenRef.current = null;
        dispatch({ type: 'translation-error', token, error: failure.message });
        setIsPlaying(false);
      } else if (finishedUtteranceTokenRef.current === token) {
        finishTranslationRef.current(token, utteranceRef.current);
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      return;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 12000);
    const isCurrentToken = () => isCurrentRequest
      && playbackStateRef.current.token === token
      && playbackStateRef.current.stage === 'translation-loading';

    const playTranslation = async () => {
      try {
        const response = await fetch(`/api/v1/quran/surahs/${track.surahNumber}/ayahs`, { signal: controller.signal });
        if (!response.ok) throw new Error('বাংলা অনুবাদ লোড করা যায়নি।');
        const payload = await response.json() as AyahTranslationResponse;
        if (
          !payload.success
          || payload.surah?.number !== track.surahNumber
          || !Array.isArray(payload.data)
        ) throw new Error(payload.error || 'বাংলা অনুবাদ লোড করা যায়নি।');

        const translation = getExactAyahTranslation(payload.data, ayahNumber);
        if (!translation) {
          throw new Error('এই আয়াতের যাচাইকৃত বাংলা অনুবাদ পাওয়া যায়নি।');
        }
        if (!isCurrentToken()) return;

        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          throw new Error('এই ব্রাউজারে বাংলা টেক্সট-টু-স্পিচ সমর্থিত নয়।');
        }
        const speech = window.speechSynthesis;
        const bengaliVoice = await waitForBengaliVoice(speech, controller.signal);
        if (!isCurrentToken()) return;
        if (!bengaliVoice || !hasBengaliSpeechVoice(speech.getVoices())) {
          throw new Error('এই ডিভাইসে বাংলা ভাষার speech voice পাওয়া যায়নি। Bengali voice সক্রিয় করে আবার চেষ্টা করুন।');
        }

        const utterance = new SpeechSynthesisUtterance(translation);
        utterance.voice = bengaliVoice;
        utterance.lang = bengaliVoice.lang || 'bn-BD';
        utterance.rate = 0.92;
        utterance.onend = () => {
          finishTranslationRef.current(token, utterance);
        };
        utterance.onerror = event => {
          if (
            playbackStateRef.current.token !== token
            || utteranceRef.current !== utterance
          ) return;
          const message = event.error
            ? `বাংলা অনুবাদের speech চালানো যায়নি (${event.error})।`
            : 'বাংলা অনুবাদের speech চালানো যায়নি।';
          if (playbackStateRef.current.stage === 'paused-translation') {
            speechFailureRef.current = { token, message };
            return;
          }
          if (playbackStateRef.current.stage === 'translation') {
            utteranceRef.current = null;
            utteranceTokenRef.current = null;
            finishedUtteranceTokenRef.current = null;
            dispatch({ type: 'translation-error', token, error: message });
            setIsPlaying(false);
          }
        };

        utteranceTokenRef.current = token;
        utteranceRef.current = utterance;
        dispatch({ type: 'translation-started', token });
        setIsLoading(false);
        setIsPlaying(true);
        speech.speak(utterance);
      } catch (error) {
        if (!isCurrentToken() || (error instanceof DOMException && error.name === 'AbortError' && !timedOut)) return;
        dispatch({
          type: 'translation-error',
          token,
          error: timedOut
            ? 'বাংলা অনুবাদ লোড হতে বেশি সময় লাগছে। নেটওয়ার্ক যাচাই করে আবার চেষ্টা করুন।'
            : error instanceof Error ? error.message : 'বাংলা অনুবাদ চালানো যায়নি।',
        });
        setIsPlaying(false);
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    void playTranslation();
    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeoutId);
      controller.abort();
      const current = playbackStateRef.current;
      if (current.token !== token || (current.stage !== 'translation' && current.stage !== 'paused-translation')) {
        if (utteranceTokenRef.current === token) {
          utteranceRef.current = null;
          utteranceTokenRef.current = null;
          finishedUtteranceTokenRef.current = null;
          speechFailureRef.current = null;
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
        }
      }
    };
  }, [
    playbackState.stage,
    playbackState.token,
    currentTrack?.type,
    currentTrack?.surahNumber,
    currentTrack?.ayahNumber,
  ]);

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const setReciter = (id: string) => {
    setReciterId(id);
    const track = currentTrackRef.current;
    if (!track) return;
    if (track.type === 'ayah' && track.ayahNumber) playAyah(track.surahNumber, track.ayahNumber, id);
    else playSurah(track.surahNumber, id);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        playbackSpeed,
        repeatCurrentAyah: playbackState.repeatCurrentAyah,
        playbackMode: playbackState.mode,
        playbackStage: playbackState.stage,
        playbackError: playbackState.error,
        canContinueWithoutTranslation: playbackState.errorType === 'translation',
        reciterId,
        playAyah,
        playSurah,
        togglePlay,
        seek: seconds => {
          if (audioRef.current && playbackStateRef.current.stage !== 'translation' && playbackStateRef.current.stage !== 'paused-translation') {
            audioRef.current.currentTime = seconds;
            setCurrentTime(seconds);
          }
        },
        setSpeed,
        setReciter,
        setPlaybackMode,
        toggleRepeat,
        playNextAyah,
        playPrevAyah,
        continueWithoutTranslation,
        retryTranslation,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}
