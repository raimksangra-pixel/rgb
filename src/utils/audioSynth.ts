// Web Audio API helper for sound feedback and live microphone visualizer

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeyClickSound(volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Crisp click frequency burst
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Audio may be blocked until user gesture, ignore safely
  }
}

export class AudioVisualizerEngine {
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  public isActive = false;

  async startListening(): Promise<boolean> {
    try {
      const ctx = getAudioContext();
      if (!ctx) return false;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const source = ctx.createMediaStreamSource(this.mediaStream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);
      const buffer = new ArrayBuffer(this.analyser.frequencyBinCount);
      this.dataArray = new Uint8Array(buffer);
      this.isActive = true;
      return true;
    } catch {
      this.isActive = false;
      return false;
    }
  }

  stopListening() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    this.analyser = null;
    this.isActive = false;
  }

  getFrequencies(): number[] {
    if (this.analyser && this.dataArray && this.isActive) {
      this.analyser.getByteFrequencyData(this.dataArray);
      // Return 16 normalized bands
      const bands: number[] = [];
      const step = Math.floor(this.dataArray.length / 16);
      for (let i = 0; i < 16; i++) {
        const val = this.dataArray[i * step] || 0;
        bands.push(val / 255);
      }
      return bands;
    }

    // Return simulated bouncing rhythmic frequencies if microphone is not permitted
    const t = Date.now() / 300;
    return Array.from({ length: 16 }, (_, i) => {
      const v = (Math.sin(t * 1.5 + i * 0.7) + Math.cos(t * 0.8 - i * 0.4) + 2) / 4;
      return Math.max(0.1, Math.min(1, v));
    });
  }
}

export const visualizerEngine = new AudioVisualizerEngine();
