export type LightingMode =
  | 'breathing'
  | 'static'
  | 'wave'
  | 'rainbow_cycle'
  | 'reactive'
  | 'strobe'
  | 'audio_visualizer'
  | 'gaming_cluster'
  | 'custom_zones';

export type WaveDirection = 'left_to_right' | 'right_to_left' | 'top_to_bottom' | 'bottom_to_top' | 'radial_out' | 'radial_in';

export type KeyboardLayoutType = 'iso_de' | 'ansi_us';

export interface KeyDefinition {
  id: string;
  code: string;
  label: string;
  subLabel?: string;
  width?: number; // In standard 1u key units (1 = standard square, 1.25, 1.5, 2.0, etc.)
  height?: number;
  row: number; // 0 to 5
  col: number; // visual index in row
  x: number; // relative coordinate for wave/ripple calculations
  y: number;
  zone: 'left' | 'center' | 'right' | 'numpad';
  isSpecial?: boolean;
}

export interface ZoneColors {
  left: string;
  center: string;
  right: string;
  numpad: string;
}

export interface CustomLightingConfig {
  mode: LightingMode;
  brightness: number; // 0 to 100
  speed: number; // 0.2 to 3.0x
  primaryColor: string;
  secondaryColor: string;
  waveDirection: WaveDirection;
  wavePalette: 'rainbow' | 'cyber' | 'sunset' | 'aurora' | 'emerald' | 'custom';
  breathingMinBrightness: number; // 0 to 50%
  breathingDualColor: boolean;
  reactiveMode: 'ripple' | 'echo';
  reactiveDecayMs: number; // 200 to 2000ms
  reactiveBgColor: string;
  zoneColors: ZoneColors;
  perKeyColors: Record<string, string>; // key id -> hex color
  audioSensitivity: number; // 1 to 10
  strobeFrequency: number; // 1 to 10 Hz
  sleepTimeoutMinutes: number; // 0 = disabled, 1, 3, 5, 10
  dimOnBattery: boolean;
  powerOn: boolean;
}

export interface LightingProfile {
  id: string;
  name: string;
  description: string;
  tag: 'Office' | 'Gaming' | 'Night' | 'Ambient' | 'Custom';
  isFactory?: boolean;
  isDefault?: boolean;
  config: CustomLightingConfig;
  createdAt: number;
  updatedAt: number;
}
