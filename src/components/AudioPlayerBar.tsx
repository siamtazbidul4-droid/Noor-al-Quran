import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  X,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { RECITERS } from '../data/recitersData';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackSpeed,
    repeatCurrentAyah,
    playbackMode,
    playbackStage,
    playbackError,
    canContinueWithoutTranslation,
    retryTranslation,
    reciterId,
    togglePlay,
    seek,
    setSpeed,
    setReciter,
    setPlaybackMode,
    toggleRepeat,
    playNextAyah,
    playPrevAyah,
    continueWithoutTranslation,
    stopAudio
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5];

  const cycleSpeed = () => {
    const idx = speedOptions.indexOf(playbackSpeed);
    const nextIdx = (idx + 1) % speedOptions.length;
    setSpeed(speedOptions[nextIdx]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B3D32] border-t-2 border-[#B38A42] text-white shadow-2xl px-2 sm:px-4 py-2 sm:py-2.5 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-3">
        
        {/* Track Metadata Info */}
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-1/3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-900 border border-[#B38A42]/40 flex items-center justify-center shrink-0 text-[#DFC186]">
            {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm truncate font-bengali">
                {currentTrack.surahNameBengali}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-200 font-quran">
                {currentTrack.surahNameArabic}
              </span>
              {currentTrack.type === 'ayah' && currentTrack.ayahNumber && (
                <span className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 font-mono shrink-0">
                  আ: {currentTrack.ayahNumber}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-emerald-300/80 flex-wrap">
              <span className="truncate max-w-[120px] sm:max-w-none">
                {RECITERS.find(r => r.id === reciterId)?.nameBengali || 'ক্বারী মিশারী'}
              </span>
              <span className="hidden sm:inline">•</span>
              <Link
                to={`/quran/${currentTrack.surahNumber}${currentTrack.ayahNumber ? `?ayah=${currentTrack.ayahNumber}` : ''}`}
                className="text-[#DFC186] hover:underline flex items-center gap-0.5 text-[10px] sm:text-[11px] shrink-0"
              >
                পাঠ্যে যান <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-100/80 font-bengali truncate" aria-live="polite">
              {playbackStage === 'arabic' || playbackStage === 'paused-arabic'
                ? playbackStage === 'paused-arabic' ? 'আরবি তিলাওয়াত (বিরতি)' : 'আরবি তিলাওয়াত'
                : playbackStage === 'translation-loading' || playbackStage === 'paused-translation-loading'
                ? playbackStage === 'paused-translation-loading' ? 'বাংলা অনুবাদ প্রস্তুতি (বিরতি)' : 'বাংলা অনুবাদ প্রস্তুত হচ্ছে'
                : playbackStage === 'translation' || playbackStage === 'paused-translation'
                ? playbackStage === 'paused-translation' ? 'বাংলা অনুবাদ (বিরতি)' : 'বাংলা অনুবাদ (টেক্সট-টু-স্পিচ)'
                : playbackStage === 'completed'
                ? 'প্লেব্যাক সম্পূর্ণ'
                : null}
            </div>
          </div>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1 w-full lg:w-5/12">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            {/* Repeat Verse (Verse-level only) */}
            {currentTrack.type === 'ayah' && (
              <button
                onClick={toggleRepeat}
                className={`p-1 sm:p-1.5 rounded-full transition-colors cursor-pointer ${
                  repeatCurrentAyah ? 'text-[#B38A42] bg-emerald-900' : 'text-emerald-300/70 hover:text-white'
                }`}
                title={repeatCurrentAyah ? 'আয়াত পুনরাবৃত্তি চালু' : 'আয়াত পুনরাবৃত্তি বন্ধ'}
                aria-label="Toggle repeat ayah"
              >
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Previous Ayah */}
            {currentTrack.type === 'ayah' && (
              <button
                onClick={playPrevAyah}
                disabled={currentTrack.ayahNumber === 1 && currentTrack.surahNumber === 1}
                className="p-1 sm:p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white disabled:opacity-30 cursor-pointer"
                aria-label="Previous Ayah"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B38A42] hover:bg-[#C29649] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
            </button>

            {/* Next Ayah */}
            {currentTrack.type === 'ayah' && (
              <button
                onClick={playNextAyah}
                className="p-1 sm:p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer"
                aria-label="Next Ayah"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Speed toggle */}
            <button
              onClick={cycleSpeed}
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-emerald-200 hover:text-white cursor-pointer font-mono"
              title="প্লেব্যাক গতি পরিবর্তন"
            >
              {playbackSpeed}x
            </button>

            <button
              onClick={() => setPlaybackMode(playbackMode === 'arabic' ? 'arabic-bangla' : 'arabic')}
              className="text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-emerald-900 border border-[#B38A42]/50 text-emerald-100 hover:text-white cursor-pointer whitespace-nowrap"
              title="আরবি + বাংলা অনুবাদ মোড"
              aria-label="Toggle Arabic plus Bangla mode"
            >
              {playbackMode === 'arabic-bangla' ? 'আরবি + বাংলা' : 'শুধু আরবি'}
            </button>
          </div>

          {playbackError && (
            <div className="w-full flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-amber-100 font-bengali" role="alert">
              <span className="text-center">{playbackError}</span>
              {canContinueWithoutTranslation && (
                <button
                  onClick={retryTranslation}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded border border-amber-200/50 hover:bg-emerald-800"
                >
                  আবার চেষ্টা করুন
                </button>
              )}
              {canContinueWithoutTranslation && (
                <button
                  onClick={continueWithoutTranslation}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded border border-amber-200/50 hover:bg-emerald-800"
                >
                  বাংলা বাদ দিয়ে পরের আয়াত
                </button>
              )}
            </div>
          )}

          {/* Seek Bar */}
          <div className="w-full flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] text-emerald-300">
            <span className="w-7 sm:w-8 text-right font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={handleSeekChange}
              disabled={playbackStage === 'translation' || playbackStage === 'paused-translation'}
              className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-[#B38A42]"
              aria-label="Seek audio"
            />
            <span className="w-7 sm:w-8 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Reciter Selector & Close */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 w-full lg:w-1/4">
          <select
            value={reciterId}
            onChange={(e) => setReciter(e.target.value)}
            className="bg-emerald-950 border border-[#B38A42]/40 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-emerald-100 focus:outline-none focus:ring-1 focus:ring-[#B38A42] cursor-pointer max-w-[140px] sm:max-w-none truncate"
            aria-label="Select Reciter"
          >
            {RECITERS.map(r => (
              <option key={r.id} value={r.id}>
                {r.nameEnglish}
              </option>
            ))}
          </select>

          <button
            onClick={stopAudio}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close audio player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
