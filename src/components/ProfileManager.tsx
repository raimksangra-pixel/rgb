import React, { useState, useRef } from 'react';
import { LightingProfile, CustomLightingConfig } from '../types/keyboard';
import {
  Bookmark,
  Check,
  Copy,
  Download,
  Edit2,
  FolderDown,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: LightingProfile[];
  activeProfileId: string;
  onApplyProfile: (profile: LightingProfile) => void;
  onSaveNewProfile: (name: string, description: string, tag: LightingProfile['tag']) => void;
  onUpdateProfile: (id: string, name: string, description: string, tag: LightingProfile['tag']) => void;
  onDeleteProfile: (id: string) => void;
  onDuplicateProfile: (id: string) => void;
  onSetDefaultProfile: (id: string) => void;
  onRestoreDefaults: () => void;
  onImportProfiles: (imported: LightingProfile[]) => void;
  currentConfig: CustomLightingConfig;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onApplyProfile,
  onSaveNewProfile,
  onUpdateProfile,
  onDeleteProfile,
  onDuplicateProfile,
  onSetDefaultProfile,
  onRestoreDefaults,
  onImportProfiles,
  currentConfig,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTag, setFormTag] = useState<LightingProfile['tag']>('Custom');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setFormName(`Terra ${currentConfig.mode.replace('_', ' ')} Preset`);
    setFormDesc(`Custom ${currentConfig.mode} effect at ${currentConfig.brightness}% brightness`);
    setFormTag('Custom');
    setIsCreating(true);
    setEditingProfileId(null);
  };

  const openEditModal = (profile: LightingProfile) => {
    setFormName(profile.name);
    setFormDesc(profile.description);
    setFormTag(profile.tag);
    setEditingProfileId(profile.id);
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isCreating) {
      onSaveNewProfile(formName.trim(), formDesc.trim(), formTag);
      setIsCreating(false);
    } else if (editingProfileId) {
      onUpdateProfile(editingProfileId, formName.trim(), formDesc.trim(), formTag);
      setEditingProfileId(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `terra_1551_rgb_profiles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportProfiles(json);
        }
      } catch {
        alert('Invalid profiles JSON format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.tag === activeFilter;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.config.mode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header controls: Search, Tag tabs, Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search profiles by name or mode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Save Current as Preset
          </button>

          <button
            onClick={handleExportJson}
            title="Export profiles to JSON"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            title="Import profiles from JSON"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
          </label>

          <button
            onClick={onRestoreDefaults}
            title="Reset to Factory Presets"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg overflow-x-auto">
        {['All', 'Office', 'Gaming', 'Night', 'Ambient', 'Custom'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat} Presets
          </button>
        ))}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map(profile => {
          const isActive = profile.id === activeProfileId;
          const { config: pConf } = profile;

          return (
            <div
              key={profile.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-neutral-900 border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.12)]'
                  : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Top header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-100">{profile.name}</h4>
                      {profile.isDefault && (
                        <span title="Default startup profile" className="text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                      <span>{profile.tag}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{pConf.mode.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pConf.brightness}% Brightness</span>
                    </div>
                  </div>

                  {/* Active Indicator Badge */}
                  {isActive && (
                    <span className="text-[10px] font-mono font-semibold uppercase text-cyan-400 border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                  {profile.description}
                </p>

                {/* Visual Color Preview Swatch Strip */}
                <div className="h-2 rounded-full overflow-hidden flex border border-neutral-800 mb-4">
                  <div className="flex-1" style={{ backgroundColor: pConf.primaryColor }} />
                  <div className="flex-1" style={{ backgroundColor: pConf.secondaryColor }} />
                  {pConf.mode === 'custom_zones' && (
                    <>
                      <div className="flex-1" style={{ backgroundColor: pConf.zoneColors.left }} />
                      <div className="flex-1" style={{ backgroundColor: pConf.zoneColors.center }} />
                      <div className="flex-1" style={{ backgroundColor: pConf.zoneColors.right }} />
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onApplyProfile(profile)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-cyan-300 border border-neutral-700'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {isActive ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : null}
                  {isActive ? 'Applied' : 'Apply Preset'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetDefaultProfile(profile.id)}
                    title={profile.isDefault ? 'Default startup profile' : 'Set as default on app start'}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${
                      profile.isDefault ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${profile.isDefault ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => onDuplicateProfile(profile.id)}
                    title="Duplicate preset"
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {!profile.isFactory && (
                    <>
                      <button
                        onClick={() => openEditModal(profile)}
                        title="Edit profile details"
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteProfile(profile.id)}
                        title="Delete custom preset"
                        className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save / Edit Profile Modal */}
      {(isCreating || editingProfileId) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-neutral-100">
              {isCreating ? 'Save New Preset Profile' : 'Edit Preset Profile'}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Preset Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Terra Midnight Glow"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Category Tag
                </label>
                <select
                  value={formTag}
                  onChange={e => setFormTag(e.target.value as LightingProfile['tag'])}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/60"
                >
                  <option value="Custom">Custom</option>
                  <option value="Office">Office</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Night">Night</option>
                  <option value="Ambient">Ambient</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Optional brief notes about lighting feel and purpose..."
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProfileId(null);
                  }}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors"
                >
                  {isCreating ? 'Save Preset' : 'Update Preset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
