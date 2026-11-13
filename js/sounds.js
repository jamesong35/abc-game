// Small cheerful sound effects made with Web Audio, so there are no sound files.
let ctx = null;

function audio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'triangle', vol = 0.18) {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + start;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const unlockAudio = () => audio();

export function chime() {
  [523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.3));
}

export function boop() {
  tone(260, 0, 0.12, 'sine', 0.12);
  tone(200, 0.1, 0.18, 'sine', 0.12);
}

export function fanfare() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.35));
  tone(784, 0.6, 0.7);
  tone(1047, 0.6, 0.7);
}
