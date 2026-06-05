// Sleek Web Audio System for High-End UI Feedback
let isMutedGlobal = false;

export function setAudioMuted(muted: boolean) {
  isMutedGlobal = muted;
  try {
    localStorage.setItem('greenops_muted', muted ? 'true' : 'false');
  } catch (e) {}
}

export function getAudioMuted(): boolean {
  try {
    const val = localStorage.getItem('greenops_muted');
    if (val === 'true') return true;
    if (val === 'false') return false;
  } catch (e) {}
  return false;
}

// Initialize audio context lazily on first user interaction to bypass browser policies
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playSound(type: 'click' | 'preset' | 'success' | 'alert' | 'input' | 'ai') {
  if (isMutedGlobal || getAudioMuted()) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security requirement)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'click':
      // Extremely quick, subtle click tick at 800Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.082);
      break;

    case 'preset':
      // Pristine cascading acoustic tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.setValueAtTime(0.012, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.22);
      break;

    case 'success':
      // Sophisticated double-chirp chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.setValueAtTime(0.02, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.32);
      break;

    case 'input':
      // Plucky short interface feedback
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
      break;

    case 'alert':
      // Elegant warning sliding frequency
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(350, now + 0.35);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
      break;

    case 'ai':
      // Cosmic intelligent sparkling chime sequence
      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.setValueAtTime(987.77, now + 0.08); // B5
      osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.setValueAtTime(0.012, now + 0.08);
      gain.gain.setValueAtTime(0.012, now + 0.16);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.42);
      break;
  }
}
