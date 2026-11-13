// Thin wrapper around the browser's built-in text-to-speech.
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voice = null;

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  const english = voices.filter((v) => /^en[-_]/i.test(v.lang));
  voice =
    english.find((v) => /Samantha|Google US English|Karen|Moira|Aria|Jenny/i.test(v.name)) ||
    english.find((v) => /en[-_]US/i.test(v.lang)) ||
    english[0] ||
    null;
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

export const speechAvailable = () => !!synth;

export function say(text) {
  window.__lastSpoken = text; // handy for testing
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang || 'en-US';
  u.rate = 0.9;
  u.pitch = 1.1;
  synth.speak(u);
}

export function stopSpeech() {
  synth?.cancel();
}

// iOS only allows speech after a user gesture. Speaking a silent
// utterance on the first tap unlocks it for the rest of the session.
let unlocked = false;
export function unlockSpeech() {
  if (unlocked || !synth) return;
  unlocked = true;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  synth.speak(u);
}
