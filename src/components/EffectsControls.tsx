import React, { useState } from 'react';
import { CustomLightingConfig, LightingMode, WaveDirection } from '../types/keyboard';
import { PRESET_SWATCHES } from '../utils/colorUtils';
import { visualizerEngine } from '../utils/audioSynth';
import {
  Wind,
  Waves,
  Sun,
  Zap,
  Mic,
  Gamepad2,
  Layers,
  Palette,
  Timer,
  Battery,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface EffectsControlsProps {
  config: CustomLightingConfig;
  onUpdateConfig: (updater: Partial<CustomLightingConfig>) => void;
  onSaveProfileRequest: () => void;
}

export const EffectsControls: React.FC<EffectsControlsProps> = ({
  config,
  onUpdateConfig,
  onSaveProfileRequest,
}) => {
  const [micActive, setMicActive] = useState(false);

  const MODES: { id: LightingMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'breathing', label: 'Breathing', icon: <Wind className="w-4 h-4" />, desc: 'Smooth sinusoidal pulse' },
    { id: 'wave', label: 'Color Wave', icon: <Waves className="w-4 h-4" />, desc: 'Flowing directional gradient' },
    { id: 'static', label: 'Static', icon: <Sun className="w-4 h-4" />, desc: 'Steady constant illumination' },
    { id: 'rainbow_cycle', label: 'Rainbow Cycle', icon: <Sparkles className="w-4 h-4" />, desc: 'Full spectrum rotation' },
    { id: 'reactive', label: 'Reactive Ripple', icon: <Zap className="w-4 h-4" />, desc: 'Illuminates on physical keypress' },
    { id: 'gaming_cluster', label: 'Gaming Cluster', icon: <Gamepad2 className="w-4 h-4" />, desc: 'Highlights WASD & arrows' },
    { id: 'audio_visualizer', label: 'Audio Equalizer', icon: <Mic className="w-4 h-4" />, desc: 'Dances to sound or music' },
    { id: 'custom_zones', label: 'Multi-Zone RGB', icon: <Layers className="w-4 h-4" />, desc: 'Left, Center, Right & Numpad' },
  ];

  const handleToggleMic = async () => {
    if (!micActive) {
      const ok = await visualizerEngine.startListening();
      setMicActive(ok);
    } else {
      visualizerEngine.stopListening();
      setMicActive(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Mode Selector Segmented Bar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Lighting Mode</span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {MODES.find(m => m.id === config.mode)?.desc}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {MODES.map(m => {
            const isActive = config.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onUpdateConfig({ mode: m.id })}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-800 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <div className={`${isActive ? 'text-cyan-400' : 'text-neutral-500'}`}>{m.icon}</div>
                <span className="text-xs font-medium whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode-Specific Fine-Tuning Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Color Palette & Swatches */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Color Palette</span>
              </span>
              <span className="font-mono text-xs text-neutral-400 uppercase">
                {config.primaryColor}
              </span>
            </div>

            {/* Primary & Secondary Color Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Primary Glow</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={e => onUpdateConfig({ primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={e => onUpdateConfig({ primaryColor: e.target.value })}
                    className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded font-mono text-xs text-neutral-200 text-center uppercase"
                  />
                </div>
              </div>

              {(config.mode === 'breathing' && config.breathingDualColor) ||
              config.mode === 'gaming_cluster' ||
              config.mode === 'audio_visualizer' ||
              (config.mode === 'wave' && config.wavePalette === 'custom') ? (
                <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">Secondary / Ambient</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={e => onUpdateConfig({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={e => onUpdateConfig({ secondaryColor: e.target.value })}
                      className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded font-mono text-xs text-neutral-200 text-center uppercase"
                    />
                  </div>
                </div>
              ) : null}

              {/* Reactive Background Color */}
              {config.mode === 'reactive' && (
                <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">Idle Base Tone</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.reactiveBgColor}
                      onChange={e => onUpdateConfig({ reactiveBgColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.reactiveBgColor}
                      onChange={e => onUpdateConfig({ reactiveBgColor: e.target.value })}
                      className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded font-mono text-xs text-neutral-200 text-center uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Swatches */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide block mb-2.5">
                Terra Certified Swatches
              </span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_SWATCHES.map(swatch => (
                  <button
                    key={swatch.hex}
                    title={swatch.name}
                    onClick={() => onUpdateConfig({ primaryColor: swatch.hex })}
                    className="group flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-neutral-700 group-hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="text-[9px] text-neutral-400 font-mono truncate w-12 text-center">
                      {swatch.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Mode Fine Tuning Parameters */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Effect Dynamics</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Speed {config.speed.toFixed(1)}x
            </span>
          </div>

          {/* Breathing Mode Adjustments */}
          {config.mode === 'breathing' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Breathing Pace (Period)</span>
                  <span className="font-mono text-neutral-300">
                    {(3 / config.speed).toFixed(1)}s / breath
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={config.speed}
                  onChange={e => onUpdateConfig({ speed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Minimum Floor Intensity</span>
                  <span className="font-mono text-neutral-300">
                    {config.breathingMinBrightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={config.breathingMinBrightness}
                  onChange={e =>
                    onUpdateConfig({ breathingMinBrightness: parseInt(e.target.value) })
                  }
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Prevents keyboard backlight from completely turning off during exhale.
                </p>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-300">Dual Color Transition</span>
                <button
                  onClick={() =>
                    onUpdateConfig({ breathingDualColor: !config.breathingDualColor })
                  }
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    config.breathingDualColor
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {config.breathingDualColor ? 'Enabled (A → B)' : 'Single Fade (A → Dark)'}
                </button>
              </div>
            </div>
          )}

          {/* Color Wave Adjustments */}
          {config.mode === 'wave' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Flow Speed</span>
                  <span className="font-mono text-neutral-300">{config.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={config.speed}
                  onChange={e => onUpdateConfig({ speed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs text-neutral-400 block mb-2">Wave Direction</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'left_to_right', label: 'Left → Right' },
                    { id: 'right_to_left', label: 'Right → Left' },
                    { id: 'top_to_bottom', label: 'Top → Down' },
                    { id: 'bottom_to_top', label: 'Down → Top' },
                    { id: 'radial_out', label: 'Center Out' },
                    { id: 'radial_in', label: 'Inward' },
                  ].map(dir => (
                    <button
                      key={dir.id}
                      onClick={() => onUpdateConfig({ waveDirection: dir.id as WaveDirection })}
                      className={`px-2 py-1.5 text-[11px] rounded border font-medium transition-colors text-center ${
                        config.waveDirection === dir.id
                          ? 'bg-neutral-800 border-cyan-500/50 text-cyan-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-neutral-400 block mb-2">Wave Palette</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'cyber', label: 'Cyber Neon' },
                    { id: 'rainbow', label: 'Spectrum' },
                    { id: 'aurora', label: 'Aurora' },
                    { id: 'sunset', label: 'Sunset' },
                    { id: 'emerald', label: 'Emerald' },
                    { id: 'custom', label: 'Dual Stop' },
                  ].map(pal => (
                    <button
                      key={pal.id}
                      onClick={() =>
                        onUpdateConfig({
                          wavePalette: pal.id as 'rainbow' | 'cyber' | 'sunset' | 'aurora' | 'emerald' | 'custom',
                        })
                      }
                      className={`px-2 py-1.5 text-[11px] rounded border font-medium transition-colors text-center ${
                        config.wavePalette === pal.id
                          ? 'bg-neutral-800 border-cyan-500/50 text-cyan-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {pal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reactive Ripple Adjustments */}
          {config.mode === 'reactive' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-300">Kinetic Physics</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateConfig({ reactiveMode: 'ripple' })}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      config.reactiveMode === 'ripple'
                        ? 'bg-neutral-800 text-cyan-300 border border-neutral-700'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Radial Ripple
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ reactiveMode: 'echo' })}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      config.reactiveMode === 'echo'
                        ? 'bg-neutral-800 text-cyan-300 border border-neutral-700'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Key Echo
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Decay Time (Trail Persistence)</span>
                  <span className="font-mono text-neutral-300">{config.reactiveDecayMs} ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={config.reactiveDecayMs}
                  onChange={e => onUpdateConfig({ reactiveDecayMs: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                Tip: Press any key on your physical Terra Mobile keyboard to see the reactive ripple erupt in real-time!
              </p>
            </div>
          )}

          {/* Audio Visualizer Adjustments */}
          {config.mode === 'audio_visualizer' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium">Microphone Sensor</span>
                  <button
                    onClick={handleToggleMic}
                    className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                      micActive
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {micActive ? 'Active (Listening)' : 'Use Simulated Music Beats'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {micActive
                    ? 'Using your laptop microphone to bounce key rows in real-time.'
                    : 'Currently playing synthetic rhythmic frequency waves.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Visualizer Sensitivity</span>
                  <span className="font-mono text-neutral-300">{config.audioSensitivity}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={config.audioSensitivity}
                  onChange={e => onUpdateConfig({ audioSensitivity: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Custom Multi-Zone Mode */}
          {config.mode === 'custom_zones' && (
            <div className="space-y-3">
              <span className="text-xs text-neutral-400 block">Independent Zone Colors</span>
              {(['left', 'center', 'right', 'numpad'] as const).map(zone => (
                <div
                  key={zone}
                  className="flex items-center justify-between p-2 bg-neutral-950 rounded-lg border border-neutral-800"
                >
                  <span className="text-xs font-medium text-neutral-300 capitalize">{zone} Zone</span>
                  <input
                    type="color"
                    value={config.zoneColors[zone]}
                    onChange={e =>
                      onUpdateConfig({
                        zoneColors: { ...config.zoneColors, [zone]: e.target.value },
                      })
                    }
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Static, Gaming, Rainbow generic */}
          {(config.mode === 'static' || config.mode === 'rainbow_cycle' || config.mode === 'gaming_cluster') && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Cycle / Transition Rate</span>
                  <span className="font-mono text-neutral-300">{config.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="3.0"
                  step="0.1"
                  value={config.speed}
                  onChange={e => onUpdateConfig({ speed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Hardware Power & Auto-Dimming */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span>Hardware Power & Sleep</span>
              </span>
            </div>

            <div className="space-y-4">
              {/* Master Brightness */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Master Brightness</span>
                  <span className="font-mono text-neutral-300">{config.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={config.brightness}
                  onChange={e =>
                    onUpdateConfig({
                      brightness: parseInt(e.target.value),
                      powerOn: parseInt(e.target.value) > 0,
                    })
                  }
                  className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Standby Timeout */}
              <div>
                <span className="text-xs text-neutral-400 block mb-2">Backlight Standby Timer</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { val: 0, label: 'Off' },
                    { val: 1, label: '1 min' },
                    { val: 3, label: '3 min' },
                    { val: 5, label: '5 min' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => onUpdateConfig({ sleepTimeoutMinutes: item.val })}
                      className={`px-2 py-1.5 text-[11px] rounded border font-medium transition-colors text-center ${
                        config.sleepTimeoutMinutes === item.val
                          ? 'bg-neutral-800 border-cyan-500/50 text-cyan-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Saver Emulation */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-neutral-300">Dim On Battery</span>
                </div>
                <button
                  onClick={() => onUpdateConfig({ dimOnBattery: !config.dimOnBattery })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                    config.dimOnBattery
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {config.dimOnBattery ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Save to Profile Button */}
          <button
            onClick={onSaveProfileRequest}
            className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4" />
            Save Current Setting as Preset Profile
          </button>
        </div>
      </div>
    </div>
  );
};
