export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  const f = Math.max(0, Math.min(1, factor));
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = rgb1.r + f * (rgb2.r - rgb1.r);
  const g = rgb1.g + f * (rgb2.g - rgb1.g);
  const b = rgb1.b + f * (rgb2.b - rgb1.b);

  return rgbToHex(r, g, b);
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function getBreathingFactor(elapsedMs: number, speed: number, minBrightnessPercent: number): number {
  // Sinusoidal breathing curve
  // speed 1.0 means ~3000ms period
  const periodMs = 3000 / Math.max(0.2, speed);
  const phase = (elapsedMs % periodMs) / periodMs; // 0 to 1
  
  // Sine curve normalized to 0..1
  const rawSine = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  
  // Apply ease curve for more natural lung-like dwell at apex
  const smoothed = Math.pow(rawSine, 1.4);

  const minFloor = minBrightnessPercent / 100;
  return minFloor + (1 - minFloor) * smoothed;
}

export const PALETTE_STOPS = {
  rainbow: ['#ff0055', '#ff9900', '#ffee00', '#00ff66', '#00ccff', '#7700ff', '#ff00aa'],
  cyber: ['#00f5d4', '#00bbf9', '#7b2cbf', '#f72585', '#00f5d4'],
  sunset: ['#2e0854', '#791e7e', '#c1396b', '#ea6955', '#f8a055', '#fce182'],
  aurora: ['#051923', '#003554', '#006494', '#0582ca', '#00a6fb', '#57cc99', '#80ed99'],
  emerald: ['#003820', '#006d38', '#00a854', '#20df79', '#75ff9f', '#00a854'],
  custom: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
};

export function getWaveColor(
  x: number,
  y: number,
  timeMs: number,
  direction: string,
  paletteKey: keyof typeof PALETTE_STOPS,
  speed: number,
  primaryColor: string,
  secondaryColor: string
): string {
  // Calculate spatial coordinate along wave direction
  let coord = 0;
  if (direction === 'left_to_right') {
    coord = x;
  } else if (direction === 'right_to_left') {
    coord = 1 - x;
  } else if (direction === 'top_to_bottom') {
    coord = y;
  } else if (direction === 'bottom_to_top') {
    coord = 1 - y;
  } else if (direction === 'radial_out') {
    const dx = x - 0.5;
    const dy = (y - 0.5) * 1.5;
    coord = Math.sqrt(dx * dx + dy * dy) * 1.4;
  } else if (direction === 'radial_in') {
    const dx = x - 0.5;
    const dy = (y - 0.5) * 1.5;
    coord = 1 - Math.sqrt(dx * dx + dy * dy) * 1.4;
  }

  // Wave velocity
  const cycleTime = 4000 / Math.max(0.2, speed);
  const offset = (timeMs % cycleTime) / cycleTime;
  const progress = ((coord - offset) % 1 + 1) % 1;

  if (paletteKey === 'custom') {
    return interpolateColor(primaryColor, secondaryColor, (Math.sin(progress * Math.PI * 2) + 1) / 2);
  }

  const stops = PALETTE_STOPS[paletteKey] || PALETTE_STOPS.rainbow;
  const totalStops = stops.length - 1;
  const scaled = progress * totalStops;
  const index = Math.floor(scaled);
  const factor = scaled - index;

  const c1 = stops[index % stops.length];
  const c2 = stops[(index + 1) % stops.length];
  return interpolateColor(c1, c2, factor);
}

export function adjustBrightness(hex: string, brightnessPercent: number): string {
  const rgb = hexToRgb(hex);
  const factor = Math.max(0, Math.min(100, brightnessPercent)) / 100;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

export const PRESET_SWATCHES = [
  { name: 'Terra Cyan', hex: '#00d2ff' },
  { name: 'Pure Ice White', hex: '#e2f1ff' },
  { name: 'Warm Tungsten', hex: '#ffbe76' },
  { name: 'German Red', hex: '#ff3838' },
  { name: 'Emerald Nitro', hex: '#2ed573' },
  { name: 'Ultraviolet', hex: '#7d5fff' },
  { name: 'Electric Magenta', hex: '#ff3f8b' },
  { name: 'Solar Amber', hex: '#ffa502' },
  { name: 'Cobalt Navy', hex: '#1e90ff' },
  { name: 'Deep Stealth', hex: '#485460' },
];
