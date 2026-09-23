import React, { useState } from 'react';
import { CustomLightingConfig } from '../types/keyboard';
import {
  generateLinuxScript,
  generateWindowsScript,
  generateEcHexPayload,
} from '../utils/hardwareBridge';
import {
  Check,
  Copy,
  Download,
  Laptop,
  Terminal,
  Cpu,
  Usb,
  FileCode,
  Info,
} from 'lucide-react';

interface HardwareBridgeProps {
  config: CustomLightingConfig;
}

export const HardwareBridge: React.FC<HardwareBridgeProps> = ({ config }) => {
  const [activeOS, setActiveOS] = useState<'linux' | 'windows' | 'raw_ec'>('linux');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [hidStatus, setHidStatus] = useState<string | null>(null);

  const linuxScript = generateLinuxScript(config);
  const windowsScript = generateWindowsScript(config);
  const { hexString, description } = generateEcHexPayload(config);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(id);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleWebHidConnect = async () => {
    if (!('hid' in navigator)) {
      setHidStatus('WebHID is not supported in this browser version. Use Linux or Windows scripts.');
      return;
    }

    try {
      setHidStatus('Scanning for compatible keyboard controller interfaces...');
      // Request HID device
      const devices = await (navigator as unknown as {
        hid: {
          requestDevice: (opts: { filters: Array<{ vendorId?: number; productId?: number }> }) => Promise<unknown[]>;
        };
      }).hid.requestDevice({
        filters: [
          // Common Clevo / Uniwill / ITE Vendor IDs
          { vendorId: 0x048d }, // ITE Tech
          { vendorId: 0x1532 },
          { vendorId: 0x0b05 },
        ],
      });

      if (devices && devices.length > 0) {
        setHidStatus(`Connected to HID device (${devices.length} interface found). Ready to send EC payload.`);
      } else {
        setHidStatus('No HID device selected. Use the generated script below to sync your Terra 1551 directly.');
      }
    } catch (err: unknown) {
      setHidStatus(`HID Request cancelled or unavailable: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                Wortmann TERRA Mobile 1551 Hardware Bridge
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Synchronize your lighting profiles, colors, and breathing effects directly to your physical laptop keyboard.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setActiveOS('linux')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOS === 'linux'
                  ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Linux (clevo_wmi)
            </button>
            <button
              onClick={() => setActiveOS('windows')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOS === 'windows'
                  ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Windows (PowerShell)
            </button>
            <button
              onClick={() => setActiveOS('raw_ec')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOS === 'raw_ec'
                  ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Raw EC Packet
            </button>
          </div>
        </div>

        {/* Script / Command Output Box */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>
                {activeOS === 'linux'
                  ? 'bash ~/terra-sync-rgb.sh'
                  : activeOS === 'windows'
                  ? 'powershell -ExecutionPolicy Bypass -File .\\terra-sync.ps1'
                  : 'Embedded Controller (EC) Register Buffer'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const text =
                    activeOS === 'linux'
                      ? linuxScript
                      : activeOS === 'windows'
                      ? windowsScript
                      : hexString;
                  handleCopy(text, activeOS);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1.5"
              >
                {copiedState === activeOS ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (activeOS === 'linux') {
                    handleDownload(linuxScript, 'terra-sync-rgb.sh');
                  } else if (activeOS === 'windows') {
                    handleDownload(windowsScript, 'terra-sync-rgb.ps1');
                  } else {
                    handleDownload(hexString, 'terra-ec-payload.hex');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Script</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto max-h-72">
            {activeOS === 'linux' && linuxScript}
            {activeOS === 'windows' && windowsScript}
            {activeOS === 'raw_ec' && (
              <div>
                <p className="text-cyan-400 font-semibold mb-2">{description}</p>
                <div className="text-emerald-400 text-sm tracking-wider font-bold">
                  {hexString}
                </div>
                <p className="text-neutral-500 mt-4 text-[11px]">
                  Payload standard: 0xF0 0xCC [Mode] [Brightness] [Left R G B] [Center R G B] [Right R G B] [Speed]
                </p>
              </div>
            )}
          </pre>
        </div>

        {/* WebHID Direct Test */}
        <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Usb className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-neutral-200">WebHID Direct Connection</span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Connect to compatible USB/HID microcontroller bridges or external interfaces directly from your browser.
            </p>
            {hidStatus && (
              <p className="text-xs text-cyan-400 mt-1 font-mono">{hidStatus}</p>
            )}
          </div>

          <button
            onClick={handleWebHidConnect}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            Connect via WebHID
          </button>
        </div>
      </div>

      {/* Terra 1551 Technical Specifications Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Hardware Model</span>
          <h4 className="text-sm font-semibold text-neutral-200">Wortmann TERRA 1551</h4>
          <p className="text-xs text-neutral-400">
            Chassis: Clevo/Uniwill ACPI Backlight Standard with integrated chiclet numeric keypad.
          </p>
        </div>

        <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Physical Hotkeys</span>
          <h4 className="text-sm font-semibold text-neutral-200">Fn Key Combos</h4>
          <div className="text-xs text-neutral-400 space-y-0.5 font-mono">
            <div>Fn + F11: Dim / Turn Off</div>
            <div>Fn + F12: Increase Brightness</div>
            <div>Fn + Space: Toggle LED Color</div>
          </div>
        </div>

        <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Controller Architecture</span>
          <h4 className="text-sm font-semibold text-neutral-200">ITE / ACPI WMI</h4>
          <p className="text-xs text-neutral-400">
            Supports Static, Breathing, Flowing Wave, Reactive Ripple, and Multi-Zone illumination registers.
          </p>
        </div>
      </div>
    </div>
  );
};
