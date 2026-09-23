/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CustomLightingConfig,
  KeyboardLayoutType,
  LightingProfile,
} from './types/keyboard';
import { DEFAULT_PROFILES } from './data/defaultProfiles';
import { Header } from './components/Header';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { EffectsControls } from './components/EffectsControls';
import { ProfileManager } from './components/ProfileManager';
import { TypingChamber } from './components/TypingChamber';
import { HardwareBridge } from './components/HardwareBridgeModal';

const STORAGE_KEY_PROFILES = 'terra_1551_rgb_profiles';
const STORAGE_KEY_ACTIVE_ID = 'terra_1551_active_profile_id';
const STORAGE_KEY_LAYOUT = 'terra_1551_keyboard_layout';
const STORAGE_KEY_SOUND = 'terra_1551_sound_enabled';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'profiles' | 'typing' | 'bridge'>('studio');
  const [layout, setLayout] = useState<KeyboardLayoutType>('iso_de');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Profiles State
  const [profiles, setProfiles] = useState<LightingProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return DEFAULT_PROFILES[0].id;
  });

  // Current active lighting configuration
  const [config, setConfig] = useState<CustomLightingConfig>(() => {
    const matched = DEFAULT_PROFILES.find(p => p.id === activeProfileId) || DEFAULT_PROFILES[0];
    return matched.config;
  });

  // Quick Save Modal from Controls
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalName, setSaveModalName] = useState('');
  const [saveModalTag, setSaveModalTag] = useState<LightingProfile['tag']>('Custom');

  // Sleep & Activity Tracker
  const [isAsleep, setIsAsleep] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  // Load stored preferences
  useEffect(() => {
    try {
      const storedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);
      if (storedLayout === 'iso_de' || storedLayout === 'ansi_us') {
        setLayout(storedLayout);
      }
      const storedSound = localStorage.getItem(STORAGE_KEY_SOUND);
      if (storedSound !== null) {
        setSoundEnabled(storedSound === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  // Persist active profile ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeProfileId);
    } catch {
      // ignore
    }
  }, [activeProfileId]);

  // Activity detection for backlight standby
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isAsleep) {
        setIsAsleep(false);
      }
    };

    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);

    const interval = setInterval(() => {
      if (config.sleepTimeoutMinutes > 0 && !isAsleep) {
        const elapsedMinutes = (Date.now() - lastActivityRef.current) / 60000;
        if (elapsedMinutes >= config.sleepTimeoutMinutes) {
          setIsAsleep(true);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      clearInterval(interval);
    };
  }, [config.sleepTimeoutMinutes, isAsleep]);

  const handleUpdateConfig = useCallback((updater: Partial<CustomLightingConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updater,
    }));
  }, []);

  const handleTogglePower = () => {
    setConfig(prev => ({
      ...prev,
      powerOn: !prev.powerOn,
    }));
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_SOUND, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleLayout = (newLayout: KeyboardLayoutType) => {
    setLayout(newLayout);
    try {
      localStorage.setItem(STORAGE_KEY_LAYOUT, newLayout);
    } catch {
      // ignore
    }
  };

  // Profile operations
  const handleApplyProfile = (profile: LightingProfile) => {
    setActiveProfileId(profile.id);
    setConfig({ ...profile.config, powerOn: true });
  };

  const handleSaveNewProfile = (
    name: string,
    description: string,
    tag: LightingProfile['tag']
  ) => {
    const newProfile: LightingProfile = {
      id: `profile_${Date.now()}`,
      name,
      description,
      tag,
      isFactory: false,
      isDefault: false,
      config: { ...config },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
  };

  const handleUpdateProfile = (
    id: string,
    name: string,
    description: string,
    tag: LightingProfile['tag']
  ) => {
    setProfiles(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, name, description, tag, config: { ...config }, updatedAt: Date.now() }
          : p
      )
    );
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (activeProfileId === id && remaining.length > 0) {
        setActiveProfileId(remaining[0].id);
        setConfig(remaining[0].config);
      }
      return remaining;
    });
  };

  const handleDuplicateProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;

    const copy: LightingProfile = {
      ...target,
      id: `profile_${Date.now()}`,
      name: `${target.name} (Copy)`,
      isFactory: false,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProfiles(prev => [copy, ...prev]);
  };

  const handleSetDefaultProfile = (id: string) => {
    setProfiles(prev =>
      prev.map(p => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
  };

  const handleRestoreDefaults = () => {
    if (confirm('Reset to original factory presets for Terra Mobile 1551? Custom profiles will be preserved.')) {
      const customOnes = profiles.filter(p => !p.isFactory);
      const combined = [...customOnes, ...DEFAULT_PROFILES];
      setProfiles(combined);
      setActiveProfileId(DEFAULT_PROFILES[0].id);
      setConfig(DEFAULT_PROFILES[0].config);
    }
  };

  const handleImportProfiles = (imported: LightingProfile[]) => {
    if (Array.isArray(imported)) {
      setProfiles(prev => {
        const merged = [...imported, ...prev.filter(p => !imported.some(imp => imp.id === p.id))];
        return merged;
      });
      if (imported.length > 0) {
        handleApplyProfile(imported[0]);
      }
    }
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Effective config considering sleep
  const effectiveConfig: CustomLightingConfig = {
    ...config,
    powerOn: isAsleep ? false : config.powerOn,
    brightness: isAsleep ? 0 : config.brightness,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-neutral-100">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        powerOn={config.powerOn}
        onTogglePower={handleTogglePower}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        layout={layout}
        onToggleLayout={handleToggleLayout}
        activeProfileName={activeProfile?.name || 'Terra Custom'}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Interactive Keyboard Display */}
        <section aria-label="Interactive Keyboard Visualizer" className="relative">
          {isAsleep && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700 text-xs font-mono text-cyan-300 shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Standby Sleep Mode Active (Press any key to wake)</span>
            </div>
          )}

          <KeyboardVisualizer
            config={effectiveConfig}
            layoutType={layout}
            onUpdateConfig={handleUpdateConfig}
            soundEnabled={soundEnabled}
          />
        </section>

        {/* Tabbed Feature Deck */}
        <section>
          {activeTab === 'studio' && (
            <EffectsControls
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onSaveProfileRequest={() => {
                setSaveModalName(`Terra ${config.mode.replace('_', ' ')} Preset`);
                setSaveModalTag('Custom');
                setShowSaveModal(true);
              }}
            />
          )}

          {activeTab === 'profiles' && (
            <ProfileManager
              profiles={profiles}
              activeProfileId={activeProfileId}
              onApplyProfile={handleApplyProfile}
              onSaveNewProfile={handleSaveNewProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteProfile={handleDeleteProfile}
              onDuplicateProfile={handleDuplicateProfile}
              onSetDefaultProfile={handleSetDefaultProfile}
              onRestoreDefaults={handleRestoreDefaults}
              onImportProfiles={handleImportProfiles}
              currentConfig={config}
            />
          )}

          {activeTab === 'typing' && (
            <TypingChamber soundEnabled={soundEnabled} />
          )}

          {activeTab === 'bridge' && (
            <HardwareBridge config={config} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 px-4 py-4 mt-12 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Wortmann AG TERRA Mobile 1551 Keyboard Controller Studio</span>
          <span>Clevo/Uniwill ACPI Backlight Standard · Full-Size Chiclet ISO/ANSI</span>
        </div>
      </footer>

      {/* Quick Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-neutral-100">
              Save Current Preset
            </h3>
            <p className="text-xs text-neutral-400">
              Save current {config.mode.replace('_', ' ')} mode ({config.brightness}% brightness, {config.primaryColor}) to your profile manager.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Preset Name
                </label>
                <input
                  type="text"
                  value={saveModalName}
                  onChange={e => setSaveModalName(e.target.value)}
                  placeholder="e.g. My Custom Glow"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Category
                </label>
                <select
                  value={saveModalTag}
                  onChange={e => setSaveModalTag(e.target.value as LightingProfile['tag'])}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/60"
                >
                  <option value="Custom">Custom</option>
                  <option value="Office">Office</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Night">Night</option>
                  <option value="Ambient">Ambient</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (saveModalName.trim()) {
                    handleSaveNewProfile(
                      saveModalName.trim(),
                      `Custom preset configured on ${new Date().toLocaleDateString()}`,
                      saveModalTag
                    );
                    setShowSaveModal(false);
                    setActiveTab('profiles');
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors"
              >
                Save to Profiles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
