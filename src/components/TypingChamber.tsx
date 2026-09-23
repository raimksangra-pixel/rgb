import React, { useState, useEffect, useRef } from 'react';
import { playKeyClickSound } from '../utils/audioSynth';
import { Keyboard, RotateCcw, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface TypingChamberProps {
  soundEnabled: boolean;
}

const PRACTICE_SENTENCES = [
  "Wortmann AG TERRA Mobile 1551 delivers exceptional performance with precision RGB engineering.",
  "The quick brown fox jumps over the lazy dog under glowing neon backlit chiclet keys.",
  "Experience smooth breathing gradients and tactile reactive ripple waves across every keystroke.",
  "Engineered in Germany with robust thermal chassis design and multi-zone ambient lighting.",
];

export const TypingChamber: React.FC<TypingChamberProps> = ({ soundEnabled }) => {
  const [targetTextIndex, setTargetTextIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetText = PRACTICE_SENTENCES[targetTextIndex];

  const handleReset = () => {
    setInputText('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setKeyPressCount(0);
    setIsCompleted(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleNextText = () => {
    setTargetTextIndex(prev => (prev + 1) % PRACTICE_SENTENCES.length);
    handleReset();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (soundEnabled) {
      playKeyClickSound();
    }

    setKeyPressCount(prev => prev + 1);

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(currentAccuracy);

    // Calculate WPM
    if (startTime) {
      const minutes = (Date.now() - startTime) / 60000;
      if (minutes > 0.02) {
        const words = val.length / 5;
        setWpm(Math.round(words / minutes));
      }
    }

    // Check completion
    if (val === targetText) {
      setIsCompleted(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overview header */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
              Terra Typing Test & Kinetic Response Chamber
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Test
            </button>
            <button
              onClick={handleNextText}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              Next Prompt
            </button>
          </div>
        </div>

        {/* Telemetry metrics bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80">
            <span className="text-[11px] text-neutral-500 font-mono block">Typing Speed</span>
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
              {wpm} <span className="text-xs font-normal text-neutral-400">WPM</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80">
            <span className="text-[11px] text-neutral-500 font-mono block">Accuracy</span>
            <div className="text-xl font-bold font-mono text-neutral-200 tabular-nums mt-0.5">
              {accuracy}%
            </div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80">
            <span className="text-[11px] text-neutral-500 font-mono block">Keystrokes</span>
            <div className="text-xl font-bold font-mono text-neutral-200 tabular-nums mt-0.5">
              {keyPressCount}
            </div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80">
            <span className="text-[11px] text-neutral-500 font-mono block">Latency Feel</span>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              &lt; 1 <span className="text-xs font-normal text-neutral-400">ms</span>
            </div>
          </div>
        </div>

        {/* Prompt string with matched character styling */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-sm leading-relaxed mb-4">
          {targetText.split('').map((char, index) => {
            let status = 'text-neutral-500';
            if (index < inputText.length) {
              status = inputText[index] === char ? 'text-cyan-400 font-bold' : 'text-red-400 bg-red-950/40 rounded';
            } else if (index === inputText.length) {
              status = 'text-neutral-100 underline decoration-cyan-400 decoration-2 underline-offset-4';
            }
            return (
              <span key={index} className={status}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Interactive Typing Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleChange}
            placeholder="Type the sentence above to trigger real-time keyboard ripples..."
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-500/60 shadow-inner"
          />
        </div>

        {isCompleted && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Great typing! Keystroke reactivity verified across Terra 1551 matrix.</span>
            </div>
            <button
              onClick={handleNextText}
              className="px-3 py-1 bg-emerald-500 text-neutral-950 font-semibold rounded hover:bg-emerald-400 transition-colors"
            >
              Continue Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
