import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CustomLightingConfig, KeyDefinition, KeyboardLayoutType } from '../types/keyboard';
import { getKeyboardLayout } from '../data/keyboardLayouts';
import {
  adjustBrightness,
  getBreathingFactor,
  getWaveColor,
  hexToRgb,
  hslToRgb,
  interpolateColor,
  rgbToHex,
} from '../utils/colorUtils';
import { visualizerEngine, playKeyClickSound } from '../utils/audioSynth';
import { Sun, Sparkles, SlidersHorizontal, MousePointer } from 'lucide-react';

interface ActiveKeyRipple {
  keyId: string;
  x: number;
  y: number;
  timestamp: number;
}

interface KeyboardVisualizerProps {
  config: CustomLightingConfig;
  layoutType: KeyboardLayoutType;
  onUpdateConfig: (updater: Partial<CustomLightingConfig>) => void;
  selectedColorToPaint?: string;
  paintModeEnabled?: boolean;
  onSelectKey?: (keyId: string) => void;
  soundEnabled: boolean;
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  config,
  layoutType,
  onUpdateConfig,
  selectedColorToPaint = '#00d2ff',
  paintModeEnabled = false,
  onSelectKey,
  soundEnabled,
}) => {
  const keys = getKeyboardLayout(layoutType);
  const [pressedKeyCodes, setPressedKeyCodes] = useState<Set<string>>(new Set());
  const [ripples, setRipples] = useState<ActiveKeyRipple[]>([]);
  const ripplesRef = useRef<ActiveKeyRipple[]>([]);
  ripplesRef.current = ripples;

  const [keyColors, setKeyColors] = useState<Record<string, string>>({});
  const animFrameIdRef = useRef<number | null>(null);

  // Trigger ripple from key
  const triggerKeyAction = useCallback((keyDef: KeyDefinition) => {
    if (soundEnabled) {
      playKeyClickSound();
    }

    if (paintModeEnabled && onSelectKey) {
      onSelectKey(keyDef.id);
      return;
    }

    // Add ripple
    const newRipple: ActiveKeyRipple = {
      keyId: keyDef.id,
      x: keyDef.x,
      y: keyDef.y,
      timestamp: performance.now(),
    };
    setRipples(prev => [...prev.slice(-12), newRipple]);
  }, [soundEnabled, paintModeEnabled, onSelectKey]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in text inputs or textareas
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      setPressedKeyCodes(prev => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      const matchedKey = keys.find(k => k.code === e.code);
      if (matchedKey) {
        triggerKeyAction(matchedKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeyCodes(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys, triggerKeyAction]);

  // Real-time lighting animation loop
  useEffect(() => {
    let isCancelled = false;

    const renderFrame = (timestamp: number) => {
      if (isCancelled) return;

      const activeRipples = ripplesRef.current.filter(
        r => timestamp - r.timestamp < (config.reactiveDecayMs || 800)
      );
      if (activeRipples.length !== ripplesRef.current.length) {
        setRipples(activeRipples);
      }

      const newColors: Record<string, string> = {};
      const baseBrightness = config.powerOn ? config.brightness : 0;

      // Audio frequencies if visualizer mode
      const audioBands = config.mode === 'audio_visualizer' ? visualizerEngine.getFrequencies() : [];

      for (const key of keys) {
        let computedHex = '#111827'; // Dark off base

        if (!config.powerOn) {
          newColors[key.id] = '#0a0d14';
          continue;
        }

        // Per-Key custom colors take precedence if configured
        if (config.mode === 'custom_zones') {
          const zoneColor = config.zoneColors[key.zone] || config.primaryColor;
          computedHex = config.perKeyColors[key.id] || zoneColor;
        } else if (config.mode === 'static') {
          computedHex = config.perKeyColors[key.id] || config.primaryColor;
        } else if (config.mode === 'breathing') {
          const breathFactor = getBreathingFactor(
            timestamp,
            config.speed,
            config.breathingMinBrightness
          );
          if (config.breathingDualColor) {
            computedHex = interpolateColor(config.primaryColor, config.secondaryColor, breathFactor);
          } else {
            const rawRgb = hexToRgb(config.primaryColor);
            const r = Math.round(rawRgb.r * breathFactor);
            const g = Math.round(rawRgb.g * breathFactor);
            const b = Math.round(rawRgb.b * breathFactor);
            computedHex = rgbToHex(r, g, b);
          }
        } else if (config.mode === 'wave') {
          computedHex = getWaveColor(
            key.x,
            key.y,
            timestamp,
            config.waveDirection,
            config.wavePalette,
            config.speed,
            config.primaryColor,
            config.secondaryColor
          );
        } else if (config.mode === 'rainbow_cycle') {
          const cycleDuration = 5000 / Math.max(0.2, config.speed);
          const hue = ((timestamp % cycleDuration) / cycleDuration) * 360;
          const rgb = hslToRgb(hue, 1, 0.5);
          computedHex = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else if (config.mode === 'strobe') {
          const freq = Math.max(1, config.strobeFrequency);
          const period = 1000 / freq;
          const isFlash = (timestamp % period) < period * 0.45;
          computedHex = isFlash ? config.primaryColor : '#090d16';
        } else if (config.mode === 'gaming_cluster') {
          const isGamerKey =
            key.id === 'w' ||
            key.id === 'a' ||
            key.id === 's' ||
            key.id === 'd' ||
            key.id === 'arrowup' ||
            key.id === 'arrowleft' ||
            key.id === 'arrowdown' ||
            key.id === 'arrowright' ||
            key.id === 'space';

          if (isGamerKey) {
            computedHex = config.primaryColor;
          } else {
            computedHex = config.secondaryColor;
          }
        } else if (config.mode === 'audio_visualizer') {
          const bandIndex = Math.min(15, Math.floor(key.x * 16));
          const energy = audioBands[bandIndex] || 0.2;
          const invertedY = 1 - key.y;
          const thresh = invertedY;
          if (energy >= thresh) {
            computedHex = interpolateColor(config.primaryColor, config.secondaryColor, energy);
          } else {
            computedHex = '#080d1a';
          }
        } else if (config.mode === 'reactive') {
          computedHex = config.reactiveBgColor || '#080d1a';
        }

        // Apply Reactive Ripples / Echoes on top
        if (activeRipples.length > 0) {
          for (const ripple of activeRipples) {
            const ageMs = timestamp - ripple.timestamp;
            const decay = 1 - ageMs / config.reactiveDecayMs;

            if (config.reactiveMode === 'echo') {
              if (ripple.keyId === key.id && decay > 0) {
                computedHex = interpolateColor(computedHex, config.primaryColor, decay);
              }
            } else {
              // Radial Ripple wave equation
              const dx = (key.x - ripple.x) * 1.8;
              const dy = key.y - ripple.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              // Wave travels outward
              const waveSpeed = 0.0012; // units per ms
              const waveRadius = ageMs * waveSpeed;
              const waveWidth = 0.18;
              const distFromCrest = Math.abs(dist - waveRadius);

              if (distFromCrest < waveWidth && decay > 0) {
                const intensity = (1 - distFromCrest / waveWidth) * decay;
                computedHex = interpolateColor(computedHex, config.primaryColor, intensity);
              }
            }
          }
        }

        // Direct highlight if key is currently physically held down
        if (pressedKeyCodes.has(key.code)) {
          computedHex = '#ffffff';
        }

        // Final brightness scale
        newColors[key.id] = adjustBrightness(computedHex, baseBrightness);
      }

      setKeyColors(newColors);
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isCancelled = true;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [config, keys, pressedKeyCodes]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Laptop Keyboard Recessed Chassis */}
      <div className="w-full max-w-6xl p-4 sm:p-6 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 rounded-2xl border border-neutral-800/90 shadow-2xl relative overflow-hidden">
        {/* Chassis Brushed Bezel Highlights */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />

        {/* Status bar atop keyboard */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">WORTMANN TERRA 1551 CHASSIS</span>
            <span className="text-neutral-600">|</span>
            <span className="font-mono text-cyan-400">
              {config.mode.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono">
              <Sun className="w-3.5 h-3.5 text-neutral-400" />
              <span>{config.brightness}%</span>
            </div>
            {config.dimOnBattery && (
              <span className="text-amber-400/90 text-[11px] font-mono">Battery Saver Active</span>
            )}
          </div>
        </div>

        {/* Chiclet Keyboard Matrix */}
        <div className="relative p-2.5 sm:p-3.5 bg-neutral-950 rounded-xl border border-neutral-800/80 shadow-inner">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {[0, 1, 2, 3, 4, 5].map(rowNum => {
              const rowKeys = keys.filter(k => k.row === rowNum);
              return (
                <div key={rowNum} className="flex items-center gap-1 sm:gap-1.5 w-full">
                  {rowKeys.map(key => {
                    const color = keyColors[key.id] || '#0d1117';
                    const isPressed = pressedKeyCodes.has(key.code);
                    const widthUnit = key.width || 1;

                    return (
                      <button
                        key={key.id}
                        type="button"
                        onClick={() => triggerKeyAction(key)}
                        style={{
                          flexGrow: widthUnit,
                          flexBasis: `${widthUnit * 42}px`,
                          height: rowNum === 0 ? '30px' : '42px',
                          boxShadow: config.powerOn
                            ? `0 0 10px ${color}33, inset 0 0 6px ${color}22`
                            : 'none',
                        }}
                        className={`group relative flex flex-col items-center justify-center rounded-md border transition-all duration-75 select-none ${
                          isPressed
                            ? 'scale-95 translate-y-0.5 border-white bg-neutral-800 text-white'
                            : 'border-neutral-800/90 bg-neutral-900/95 hover:border-neutral-700'
                        }`}
                      >
                        {/* Underglow LED diffusion */}
                        <div
                          className="absolute -inset-0.5 rounded-md pointer-events-none opacity-40 blur-[2px] transition-colors duration-150"
                          style={{ backgroundColor: color }}
                        />

                        {/* Translucent Laser-Etched Keycap Legend */}
                        <span
                          className="relative z-10 font-mono text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors duration-100"
                          style={{
                            color: config.powerOn ? color : '#525252',
                            textShadow: config.powerOn ? `0 0 8px ${color}` : 'none',
                          }}
                        >
                          {key.label}
                        </span>

                        {key.subLabel && (
                          <span
                            className="relative z-10 font-mono text-[8px] sm:text-[9px] opacity-75 leading-none mt-0.5"
                            style={{
                              color: config.powerOn ? color : '#404040',
                            }}
                          >
                            {key.subLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Brightness Jump Bar & Hotkeys helper */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Quick Brightness:</span>
            {[0, 25, 50, 75, 100].map(val => (
              <button
                key={val}
                onClick={() => onUpdateConfig({ brightness: val, powerOn: val > 0 })}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                  config.brightness === val && config.powerOn
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 border border-neutral-700/50'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px]">
            <span>Hotkeys:</span>
            <span>Fn + F11 (Dim)</span>
            <span>·</span>
            <span>Fn + F12 (Bright)</span>
            <span>·</span>
            <span>Fn + Space (Color)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
