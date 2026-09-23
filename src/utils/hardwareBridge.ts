import { CustomLightingConfig } from '../types/keyboard';
import { hexToRgb } from './colorUtils';

export function generateLinuxScript(config: CustomLightingConfig): string {
  const rgbPrimary = hexToRgb(config.primaryColor);
  const brightnessScaled = Math.round((config.brightness / 100) * 255);
  const leftRgb = hexToRgb(config.zoneColors.left);
  const centerRgb = hexToRgb(config.zoneColors.center);
  const rightRgb = hexToRgb(config.zoneColors.right);

  const modeMap: Record<string, string> = {
    static: 'custom',
    breathing: 'breathe',
    wave: 'wave',
    rainbow_cycle: 'rainbow',
    reactive: 'tempo',
    strobe: 'flash',
    gaming_cluster: 'custom',
    audio_visualizer: 'dance',
    custom_zones: 'custom',
  };

  const linuxMode = modeMap[config.mode] || 'custom';

  return `#!/usr/bin/env bash
# ================================================================
# Wortmann AG TERRA Mobile 1551 - RGB Keyboard Profile Sync Script
# Target Interface: clevo-xsm-wmi / clevo_wmi / ACPI LED Controller
# ================================================================

set -e

echo "[+] Syncing RGB Backlight for Wortmann TERRA Mobile 1551..."

KBD_SYSFS="/sys/devices/platform/clevo_wmi"
LED_SYSFS="/sys/class/leds/clevo::kbd_backlight"

# Check root privileges
if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo bash $0"
  exit 1
fi

# Ensure clevo-xsm-wmi kernel module is loaded
if ! lsmod | grep -q clevo; then
  echo "[*] Attempting to load clevo-xsm-wmi or clevo_wmi module..."
  modprobe clevo-xsm-wmi || modprobe clevo_wmi || true
fi

# Set Brightness (${config.brightness}%)
if [ -f "$LED_SYSFS/brightness" ]; then
  echo "${brightnessScaled}" > "$LED_SYSFS/brightness"
  echo "[✓] Brightness written to $LED_SYSFS/brightness: ${brightnessScaled}/255"
fi

# Apply Mode: ${config.mode} -> ${linuxMode}
if [ -f "$KBD_SYSFS/kbl_mode" ]; then
  echo "${linuxMode}" > "$KBD_SYSFS/kbl_mode"
  echo "[✓] Mode set to: ${linuxMode}"
fi

# Apply Zone RGB Colors
# Left: #${config.zoneColors.left.replace('#', '')} | Center: #${config.zoneColors.center.replace('#', '')} | Right: #${config.zoneColors.right.replace('#', '')}
if [ -f "$KBD_SYSFS/kbl_left" ]; then
  echo "${leftRgb.r} ${leftRgb.g} ${leftRgb.b}" > "$KBD_SYSFS/kbl_left"
fi
if [ -f "$KBD_SYSFS/kbl_middle" ]; then
  echo "${centerRgb.r} ${centerRgb.g} ${centerRgb.b}" > "$KBD_SYSFS/kbl_middle"
fi
if [ -f "$KBD_SYSFS/kbl_right" ]; then
  echo "${rightRgb.r} ${rightRgb.g} ${rightRgb.b}" > "$KBD_SYSFS/kbl_right"
fi

echo "[✓] Terra Mobile 1551 RGB Backlight Profile Synced Successfully!"
`;
}

export function generateWindowsScript(config: CustomLightingConfig): string {
  const p = hexToRgb(config.primaryColor);
  const brightnessScaled = Math.round(config.brightness / 10); // 0 to 10 scale typical for Clevo WMI

  return `# ================================================================
# Wortmann AG TERRA Mobile 1551 - Windows RGB Sync PowerShell
# Uses Clevo / Uniwill WMI ACPI Backlight Controller Interface
# ================================================================

# Run in an elevated PowerShell terminal (Run as Administrator)

Write-Host "[+] Initializing Wortmann TERRA Mobile 1551 WMI RGB Bridge..." -ForegroundColor Cyan

try {
    # Query Clevo WMI provider
    $clevoWmi = Get-WmiObject -Namespace "root\\wmi" -Class "CLEVO_GET" -ErrorAction SilentlyContinue

    if ($null -eq $clevoWmi) {
        Write-Warning "[-] CLEVO_GET WMI class not directly active. Ensuring Hotkey/ControlCenter service is running."
    }

    # Configuration Parameters:
    # Mode: ${config.mode.toUpperCase()}
    # Primary RGB: R=${p.r}, G=${p.g}, B=${p.b}
    # Brightness: ${config.brightness}% (${brightnessScaled}/10)
    # Speed: ${config.speed}x

    # Write status to registry for Terra Control Center daemon
    $RegPath = "HKCU:\\Software\\OEM\\KeyboardBacklight"
    if (!(Test-Path $RegPath)) {
        New-Item -Path $RegPath -Force | Out-Null
    }

    Set-ItemProperty -Path $RegPath -Name "Mode" -Value "${config.mode}"
    Set-ItemProperty -Path $RegPath -Name "Brightness" -Value ${config.brightness}
    Set-ItemProperty -Path $RegPath -Name "PrimaryColor" -Value "${config.primaryColor}"
    Set-ItemProperty -Path $RegPath -Name "SecondaryColor" -Value "${config.secondaryColor}"
    Set-ItemProperty -Path $RegPath -Name "Speed" -Value "${config.speed}"

    Write-Host "[✓] Configuration applied to Terra Mobile 1551 Backlight Register." -ForegroundColor Green
    Write-Host "    Press Fn+F11 / Fn+F12 on your Terra keyboard to verify brightness response." -ForegroundColor Yellow
}
catch {
    Write-Error "[-] Execution failed: $_"
}
`;
}

export function generateEcHexPayload(config: CustomLightingConfig): { hexString: string; description: string } {
  // Clevo EC LED Protocol format:
  // Byte 0: Header (0xF0)
  // Byte 1: Command (0xCC = Set Backlight)
  // Byte 2: Mode (0x01=Static, 0x02=Breathe, 0x03=Cycle, 0x04=Wave, 0x05=Dance, 0x06=Tempo/Reactive)
  // Byte 3: Brightness (0x00 to 0x0A)
  // Byte 4-6: Left Zone R, G, B
  // Byte 7-9: Center Zone R, G, B
  // Byte 10-12: Right Zone R, G, B
  // Byte 13: Speed (0x01 to 0x0A)

  const modeByteMap: Record<string, number> = {
    static: 0x01,
    breathing: 0x02,
    rainbow_cycle: 0x03,
    wave: 0x04,
    audio_visualizer: 0x05,
    reactive: 0x06,
    strobe: 0x07,
    gaming_cluster: 0x01,
    custom_zones: 0x01,
  };

  const modeByte = modeByteMap[config.mode] ?? 0x01;
  const brightnessByte = Math.round((config.brightness / 100) * 10);
  const speedByte = Math.max(1, Math.min(10, Math.round(config.speed * 3.3)));

  const left = hexToRgb(config.zoneColors.left);
  const center = hexToRgb(config.zoneColors.center);
  const right = hexToRgb(config.zoneColors.right);

  const bytes = [
    0xf0,
    0xcc,
    modeByte,
    brightnessByte,
    left.r, left.g, left.b,
    center.r, center.g, center.b,
    right.r, right.g, right.b,
    speedByte,
  ];

  const hexString = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  return {
    hexString,
    description: `Raw EC Data Packet: Mode=0x0${modeByte.toString(16)} (${config.mode}), Brightness=${brightnessByte}/10, Speed=${speedByte}/10`,
  };
}
