import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Monitor, CheckCircle, HelpCircle, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  // If already installed and running standalone as desktop app
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installed on Laptop</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 whitespace-nowrap"
        title="Install Terra 1551 RGB Studio as a desktop app on your laptop"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install to Laptop</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Desktop Laptop Installation Guide Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-neutral-100">
                  Install Terra 1551 App on Laptop
                </h3>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-neutral-400 hover:text-neutral-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              You can install Terra 1551 RGB Studio directly onto your laptop running Windows or Linux as a standalone desktop utility:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-cyan-400 font-semibold block font-sans">
                  Method 1: Chrome / Brave / Edge Address Bar
                </span>
                <p className="text-neutral-400 font-sans text-[11px]">
                  Look at the right side of your browser URL bar at the top: click the <strong>Install</strong> or <strong>Computer icon</strong> (💻 / ⊕) and confirm "Install".
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-cyan-400 font-semibold block font-sans">
                  Method 2: Browser Menu (Three Dots ⋮)
                </span>
                <p className="text-neutral-400 font-sans text-[11px]">
                  Click the <strong>⋮ (three dots)</strong> menu in top right &gt; <strong>Save and share</strong> (or <strong>Apps</strong>) &gt; <strong>Install Terra 1551 RGB Studio</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
