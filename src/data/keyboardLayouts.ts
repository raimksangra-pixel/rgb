import { KeyDefinition, KeyboardLayoutType } from '../types/keyboard';

export const TERRA_KEYBOARD_LAYOUT_ISO: KeyDefinition[] = [
  // Row 0: Function Keys + Esc
  { id: 'esc', code: 'Escape', label: 'Esc', width: 1, row: 0, col: 0, x: 0.02, y: 0.08, zone: 'left' },
  { id: 'f1', code: 'F1', label: 'F1', width: 1, row: 0, col: 1, x: 0.08, y: 0.08, zone: 'left' },
  { id: 'f2', code: 'F2', label: 'F2', width: 1, row: 0, col: 2, x: 0.13, y: 0.08, zone: 'left' },
  { id: 'f3', code: 'F3', label: 'F3', width: 1, row: 0, col: 3, x: 0.18, y: 0.08, zone: 'left' },
  { id: 'f4', code: 'F4', label: 'F4', width: 1, row: 0, col: 4, x: 0.23, y: 0.08, zone: 'left' },
  { id: 'f5', code: 'F5', label: 'F5', width: 1, row: 0, col: 5, x: 0.30, y: 0.08, zone: 'center' },
  { id: 'f6', code: 'F6', label: 'F6', width: 1, row: 0, col: 6, x: 0.35, y: 0.08, zone: 'center' },
  { id: 'f7', code: 'F7', label: 'F7', width: 1, row: 0, col: 7, x: 0.40, y: 0.08, zone: 'center' },
  { id: 'f8', code: 'F8', label: 'F8', width: 1, row: 0, col: 8, x: 0.45, y: 0.08, zone: 'center' },
  { id: 'f9', code: 'F9', label: 'F9', width: 1, row: 0, col: 9, x: 0.52, y: 0.08, zone: 'right' },
  { id: 'f10', code: 'F10', label: 'F10', width: 1, row: 0, col: 10, x: 0.57, y: 0.08, zone: 'right' },
  { id: 'f11', code: 'F11', label: 'F11', subLabel: '🔆-', width: 1, row: 0, col: 11, x: 0.62, y: 0.08, zone: 'right' },
  { id: 'f12', code: 'F12', label: 'F12', subLabel: '🔆+', width: 1, row: 0, col: 12, x: 0.67, y: 0.08, zone: 'right' },
  { id: 'prtsc', code: 'PrintScreen', label: 'Druck', width: 1, row: 0, col: 13, x: 0.73, y: 0.08, zone: 'right' },
  { id: 'pause', code: 'Pause', label: 'Pause', width: 1, row: 0, col: 14, x: 0.78, y: 0.08, zone: 'right' },
  { id: 'del', code: 'Delete', label: 'Entf', width: 1, row: 0, col: 15, x: 0.83, y: 0.08, zone: 'numpad' },
  { id: 'home', code: 'Home', label: 'Pos1', width: 1, row: 0, col: 16, x: 0.88, y: 0.08, zone: 'numpad' },
  { id: 'end', code: 'End', label: 'Ende', width: 1, row: 0, col: 17, x: 0.93, y: 0.08, zone: 'numpad' },

  // Row 1: Numbers & Symbols + Numpad Top
  { id: 'accent', code: 'Backquote', label: '^', subLabel: '°', width: 1, row: 1, col: 0, x: 0.02, y: 0.24, zone: 'left' },
  { id: 'digit1', code: 'Digit1', label: '1', subLabel: '!', width: 1, row: 1, col: 1, x: 0.07, y: 0.24, zone: 'left' },
  { id: 'digit2', code: 'Digit2', label: '2', subLabel: '"', width: 1, row: 1, col: 2, x: 0.12, y: 0.24, zone: 'left' },
  { id: 'digit3', code: 'Digit3', label: '3', subLabel: '§', width: 1, row: 1, col: 3, x: 0.17, y: 0.24, zone: 'left' },
  { id: 'digit4', code: 'Digit4', label: '4', subLabel: '$', width: 1, row: 1, col: 4, x: 0.22, y: 0.24, zone: 'left' },
  { id: 'digit5', code: 'Digit5', label: '5', subLabel: '%', width: 1, row: 1, col: 5, x: 0.27, y: 0.24, zone: 'center' },
  { id: 'digit6', code: 'Digit6', label: '6', subLabel: '&', width: 1, row: 1, col: 6, x: 0.32, y: 0.24, zone: 'center' },
  { id: 'digit7', code: 'Digit7', label: '7', subLabel: '/', width: 1, row: 1, col: 7, x: 0.37, y: 0.24, zone: 'center' },
  { id: 'digit8', code: 'Digit8', label: '8', subLabel: '(', width: 1, row: 1, col: 8, x: 0.42, y: 0.24, zone: 'center' },
  { id: 'digit9', code: 'Digit9', label: '9', subLabel: ')', width: 1, row: 1, col: 9, x: 0.47, y: 0.24, zone: 'right' },
  { id: 'digit0', code: 'Digit0', label: '0', subLabel: '=', width: 1, row: 1, col: 10, x: 0.52, y: 0.24, zone: 'right' },
  { id: 'ss', code: 'Minus', label: 'ß', subLabel: '?', width: 1, row: 1, col: 11, x: 0.57, y: 0.24, zone: 'right' },
  { id: 'acute', code: 'Equal', label: '´', subLabel: '`', width: 1, row: 1, col: 12, x: 0.62, y: 0.24, zone: 'right' },
  { id: 'backspace', code: 'Backspace', label: '⌫ Back', width: 1.5, row: 1, col: 13, x: 0.69, y: 0.24, zone: 'right' },
  { id: 'numlock', code: 'NumLock', label: 'Num', width: 1, row: 1, col: 14, x: 0.78, y: 0.24, zone: 'numpad' },
  { id: 'numpaddiv', code: 'NumpadDivide', label: '/', width: 1, row: 1, col: 15, x: 0.83, y: 0.24, zone: 'numpad' },
  { id: 'numpadmul', code: 'NumpadMultiply', label: '*', width: 1, row: 1, col: 16, x: 0.88, y: 0.24, zone: 'numpad' },
  { id: 'numpadsub', code: 'NumpadSubtract', label: '-', width: 1, row: 1, col: 17, x: 0.93, y: 0.24, zone: 'numpad' },

  // Row 2: QWERTZ
  { id: 'tab', code: 'Tab', label: 'Tab ⇥', width: 1.4, row: 2, col: 0, x: 0.03, y: 0.40, zone: 'left' },
  { id: 'q', code: 'KeyQ', label: 'Q', subLabel: '@', width: 1, row: 2, col: 1, x: 0.09, y: 0.40, zone: 'left' },
  { id: 'w', code: 'KeyW', label: 'W', width: 1, row: 2, col: 2, x: 0.14, y: 0.40, zone: 'left', isSpecial: true },
  { id: 'e', code: 'KeyE', label: 'E', subLabel: '€', width: 1, row: 2, col: 3, x: 0.19, y: 0.40, zone: 'left' },
  { id: 'r', code: 'KeyR', label: 'R', width: 1, row: 2, col: 4, x: 0.24, y: 0.40, zone: 'left' },
  { id: 't', code: 'KeyT', label: 'T', width: 1, row: 2, col: 5, x: 0.29, y: 0.40, zone: 'center' },
  { id: 'z', code: 'KeyZ', label: 'Z', width: 1, row: 2, col: 6, x: 0.34, y: 0.40, zone: 'center' },
  { id: 'u', code: 'KeyU', label: 'U', width: 1, row: 2, col: 7, x: 0.39, y: 0.40, zone: 'center' },
  { id: 'i', code: 'KeyI', label: 'I', width: 1, row: 2, col: 8, x: 0.44, y: 0.40, zone: 'center' },
  { id: 'o', code: 'KeyO', label: 'O', width: 1, row: 2, col: 9, x: 0.49, y: 0.40, zone: 'right' },
  { id: 'p', code: 'KeyP', label: 'P', width: 1, row: 2, col: 10, x: 0.54, y: 0.40, zone: 'right' },
  { id: 'ue', code: 'BracketLeft', label: 'Ü', width: 1, row: 2, col: 11, x: 0.59, y: 0.40, zone: 'right' },
  { id: 'plus', code: 'BracketRight', label: '+', subLabel: '*', width: 1, row: 2, col: 12, x: 0.64, y: 0.40, zone: 'right' },
  { id: 'enter', code: 'Enter', label: '⏎ Enter', width: 1.25, height: 1.9, row: 2, col: 13, x: 0.70, y: 0.48, zone: 'right' },
  { id: 'num7', code: 'Numpad7', label: '7', subLabel: 'Pos1', width: 1, row: 2, col: 14, x: 0.78, y: 0.40, zone: 'numpad' },
  { id: 'num8', code: 'Numpad8', label: '8', subLabel: '▲', width: 1, row: 2, col: 15, x: 0.83, y: 0.40, zone: 'numpad' },
  { id: 'num9', code: 'Numpad9', label: '9', subLabel: 'Bild▲', width: 1, row: 2, col: 16, x: 0.88, y: 0.40, zone: 'numpad' },
  { id: 'numpadadd', code: 'NumpadAdd', label: '+', width: 1, height: 1.9, row: 2, col: 17, x: 0.93, y: 0.48, zone: 'numpad' },

  // Row 3: ASDF
  { id: 'caps', code: 'CapsLock', label: 'Caps ⇪', width: 1.6, row: 3, col: 0, x: 0.03, y: 0.56, zone: 'left' },
  { id: 'a', code: 'KeyA', label: 'A', width: 1, row: 3, col: 1, x: 0.10, y: 0.56, zone: 'left', isSpecial: true },
  { id: 's', code: 'KeyS', label: 'S', width: 1, row: 3, col: 2, x: 0.15, y: 0.56, zone: 'left', isSpecial: true },
  { id: 'd', code: 'KeyD', label: 'D', width: 1, row: 3, col: 3, x: 0.20, y: 0.56, zone: 'left', isSpecial: true },
  { id: 'f', code: 'KeyF', label: 'F', width: 1, row: 3, col: 4, x: 0.25, y: 0.56, zone: 'left' },
  { id: 'g', code: 'KeyG', label: 'G', width: 1, row: 3, col: 5, x: 0.30, y: 0.56, zone: 'center' },
  { id: 'h', code: 'KeyH', label: 'H', width: 1, row: 3, col: 6, x: 0.35, y: 0.56, zone: 'center' },
  { id: 'j', code: 'KeyJ', label: 'J', width: 1, row: 3, col: 7, x: 0.40, y: 0.56, zone: 'center' },
  { id: 'k', code: 'KeyK', label: 'K', width: 1, row: 3, col: 8, x: 0.45, y: 0.56, zone: 'center' },
  { id: 'l', code: 'KeyL', label: 'L', width: 1, row: 3, col: 9, x: 0.50, y: 0.56, zone: 'right' },
  { id: 'oe', code: 'Semicolon', label: 'Ö', width: 1, row: 3, col: 10, x: 0.55, y: 0.56, zone: 'right' },
  { id: 'ae', code: 'Quote', label: 'Ä', width: 1, row: 3, col: 11, x: 0.60, y: 0.56, zone: 'right' },
  { id: 'hash', code: 'Backslash', label: '#', subLabel: '\'', width: 1, row: 3, col: 12, x: 0.65, y: 0.56, zone: 'right' },
  { id: 'num4', code: 'Numpad4', label: '4', subLabel: '◄', width: 1, row: 3, col: 13, x: 0.78, y: 0.56, zone: 'numpad' },
  { id: 'num5', code: 'Numpad5', label: '5', width: 1, row: 3, col: 14, x: 0.83, y: 0.56, zone: 'numpad' },
  { id: 'num6', code: 'Numpad6', label: '6', subLabel: '►', width: 1, row: 3, col: 15, x: 0.88, y: 0.56, zone: 'numpad' },

  // Row 4: Shift & Bottom Alphas
  { id: 'shiftleft', code: 'ShiftLeft', label: '⇧ Shift', width: 1.2, row: 4, col: 0, x: 0.02, y: 0.72, zone: 'left' },
  { id: 'less', code: 'IntlBackslash', label: '<', subLabel: '>', width: 1, row: 4, col: 1, x: 0.08, y: 0.72, zone: 'left' },
  { id: 'y', code: 'KeyY', label: 'Y', width: 1, row: 4, col: 2, x: 0.13, y: 0.72, zone: 'left' },
  { id: 'x', code: 'KeyX', label: 'X', width: 1, row: 4, col: 3, x: 0.18, y: 0.72, zone: 'left' },
  { id: 'c', code: 'KeyC', label: 'C', width: 1, row: 4, col: 4, x: 0.23, y: 0.72, zone: 'left' },
  { id: 'v', code: 'KeyV', label: 'V', width: 1, row: 4, col: 5, x: 0.28, y: 0.72, zone: 'center' },
  { id: 'b', code: 'KeyB', label: 'B', width: 1, row: 4, col: 6, x: 0.33, y: 0.72, zone: 'center' },
  { id: 'n', code: 'KeyN', label: 'N', width: 1, row: 4, col: 7, x: 0.38, y: 0.72, zone: 'center' },
  { id: 'm', code: 'KeyM', label: 'M', subLabel: 'µ', width: 1, row: 4, col: 8, x: 0.43, y: 0.72, zone: 'center' },
  { id: 'comma', code: 'Comma', label: ',', subLabel: ';', width: 1, row: 4, col: 9, x: 0.48, y: 0.72, zone: 'right' },
  { id: 'period', code: 'Period', label: '.', subLabel: ':', width: 1, row: 4, col: 10, x: 0.53, y: 0.72, zone: 'right' },
  { id: 'slash', code: 'Slash', label: '-', subLabel: '_', width: 1, row: 4, col: 11, x: 0.58, y: 0.72, zone: 'right' },
  { id: 'shiftright', code: 'ShiftRight', label: '⇧ Shift', width: 2, row: 4, col: 12, x: 0.66, y: 0.72, zone: 'right' },
  { id: 'arrowup', code: 'ArrowUp', label: '▲', width: 1, row: 4, col: 13, x: 0.72, y: 0.72, zone: 'right', isSpecial: true },
  { id: 'num1', code: 'Numpad1', label: '1', subLabel: 'Ende', width: 1, row: 4, col: 14, x: 0.78, y: 0.72, zone: 'numpad' },
  { id: 'num2', code: 'Numpad2', label: '2', subLabel: '▼', width: 1, row: 4, col: 15, x: 0.83, y: 0.72, zone: 'numpad' },
  { id: 'num3', code: 'Numpad3', label: '3', subLabel: 'Bild▼', width: 1, row: 4, col: 16, x: 0.88, y: 0.72, zone: 'numpad' },
  { id: 'numpadenter', code: 'NumpadEnter', label: '⏎', width: 1, height: 1.9, row: 4, col: 17, x: 0.93, y: 0.80, zone: 'numpad' },

  // Row 5: Modifiers, Space, Arrows, Numpad Bottom
  { id: 'ctrlleft', code: 'ControlLeft', label: 'Ctrl', width: 1.3, row: 5, col: 0, x: 0.03, y: 0.88, zone: 'left' },
  { id: 'fn', code: 'Fn', label: 'Fn', width: 1, row: 5, col: 1, x: 0.08, y: 0.88, zone: 'left' },
  { id: 'metaleft', code: 'MetaLeft', label: 'Win ⊞', width: 1, row: 5, col: 2, x: 0.13, y: 0.88, zone: 'left' },
  { id: 'altleft', code: 'AltLeft', label: 'Alt', width: 1.2, row: 5, col: 3, x: 0.18, y: 0.88, zone: 'left' },
  { id: 'space', code: 'Space', label: 'TERRA MOBILE 1551', width: 5.2, row: 5, col: 4, x: 0.35, y: 0.88, zone: 'center' },
  { id: 'altright', code: 'AltRight', label: 'AltGr', width: 1.2, row: 5, col: 5, x: 0.52, y: 0.88, zone: 'right' },
  { id: 'ctrlright', code: 'ControlRight', label: 'Ctrl', width: 1.2, row: 5, col: 6, x: 0.58, y: 0.88, zone: 'right' },
  { id: 'arrowleft', code: 'ArrowLeft', label: '◄', width: 1, row: 5, col: 7, x: 0.67, y: 0.88, zone: 'right', isSpecial: true },
  { id: 'arrowdown', code: 'ArrowDown', label: '▼', width: 1, row: 5, col: 8, x: 0.72, y: 0.88, zone: 'right', isSpecial: true },
  { id: 'arrowright', code: 'ArrowRight', label: '►', width: 1, row: 5, col: 9, x: 0.77, y: 0.88, zone: 'right', isSpecial: true },
  { id: 'num0', code: 'Numpad0', label: '0', subLabel: 'Einfg', width: 2, row: 5, col: 10, x: 0.83, y: 0.88, zone: 'numpad' },
  { id: 'numdecimal', code: 'NumpadDecimal', label: ',', subLabel: 'Entf', width: 1, row: 5, col: 11, x: 0.88, y: 0.88, zone: 'numpad' },
];

export const TERRA_KEYBOARD_LAYOUT_ANSI: KeyDefinition[] = TERRA_KEYBOARD_LAYOUT_ISO.map(key => {
  // Convert labels for ANSI US
  if (key.id === 'z') return { ...key, label: 'Y' };
  if (key.id === 'y') return { ...key, label: 'Z' };
  if (key.id === 'ue') return { ...key, label: '[', subLabel: '{' };
  if (key.id === 'plus') return { ...key, label: ']', subLabel: '}' };
  if (key.id === 'oe') return { ...key, label: ';', subLabel: ':' };
  if (key.id === 'ae') return { ...key, label: '\'', subLabel: '"' };
  if (key.id === 'ss') return { ...key, label: '-', subLabel: '_' };
  if (key.id === 'acute') return { ...key, label: '=', subLabel: '+' };
  if (key.id === 'accent') return { ...key, label: '`', subLabel: '~' };
  if (key.id === 'prtsc') return { ...key, label: 'PrtSc' };
  if (key.id === 'del') return { ...key, label: 'Del' };
  if (key.id === 'home') return { ...key, label: 'Home' };
  if (key.id === 'end') return { ...key, label: 'End' };
  return key;
}).filter(key => key.id !== 'less'); // Remove extra ISO angle bracket key for ANSI

export function getKeyboardLayout(type: KeyboardLayoutType): KeyDefinition[] {
  return type === 'iso_de' ? TERRA_KEYBOARD_LAYOUT_ISO : TERRA_KEYBOARD_LAYOUT_ANSI;
}
