// Thin wrapper around the browser's built-in text-to-speech.
// Each device has its own set of voices, so we score them and use the most
// natural-sounding English voice available.
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;

// Natural, friendly voices on common devices:
// Apple (iPhone, iPad, Mac), Microsoft Edge "Natural" voices, Google (Chrome/Android).
const FRIENDLY = [
  'Ava', 'Zoe', 'Allison', 'Samantha', 'Evan', 'Nathan', 'Joelle', 'Noelle', 'Susan', 'Tom',
  'Karen', 'Serena', 'Kate', 'Moira', 'Tessa', 'Fiona',
  'Ana', 'Aria', 'Jenny', 'Emma', 'Michelle', 'Ava Multilingual', 'Libby', 'Sonia', 'Natasha',
  'Google US English', 'Google UK English Female',
];

// Novelty and older robotic-sounding voices that ship on Apple devices.
const ROBOTIC = [
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Good News', 'Jester',
  'Organ', 'Superstar', 'Trinoids', 'Whisper', 'Wobble', 'Zarvox', 'Fred', 'Junior', 'Ralph',
  'Kathy', 'Princess', 'Deranged', 'Hysterical', 'Eddy', 'Flo', 'Grandma', 'Grandpa', 'Reed',
  'Rocko', 'Sandy', 'Shelley',
];

const hasWord = (name, word) => new RegExp(`(^|[^a-z])${word}([^a-z]|$)`, 'i').test(name);

// Higher score = better voice. Exported so it can be tested.
export function scoreVoice(v, online = true) {
  if (!/^en([-_]|$)/i.test(v.lang)) return -Infinity;
  const name = v.name;
  let score = 0;
  if (/premium/i.test(name)) score += 100;
  if (/natural|neural/i.test(name)) score += 90;
  if (/enhanced/i.test(name)) score += 70;
  if (/^Google/i.test(name)) score += 60;
  if (FRIENDLY.some((w) => hasWord(name, w))) score += 40;
  if (ROBOTIC.some((w) => hasWord(name, w))) score -= 200;
  if (/en[-_]US/i.test(v.lang)) score += 10;
  else if (/en[-_](GB|AU|CA|IE|NZ)/i.test(v.lang)) score += 5;
  // Online-only voices (Google, Edge Natural) don't work without internet.
  if (!online && v.localService === false) score -= 300;
  if (v.default) score += 1;
  return score;
}

export function bestVoice(voices, online = true) {
  let best = null;
  let bestScore = -Infinity;
  for (const v of voices) {
    const s = scoreVoice(v, online);
    if (s > bestScore) { best = v; bestScore = s; }
  }
  return best;
}

let voice = null;
function pickVoice() {
  if (!synth) return;
  voice = bestVoice(synth.getVoices(), navigator.onLine !== false);
  window.__voice = voice?.name || null; // handy for testing
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
  window.addEventListener('online', pickVoice);
  window.addEventListener('offline', pickVoice);
}

export const speechAvailable = () => !!synth;

export function say(text) {
  window.__lastSpoken = text; // handy for testing
  if (!synth) return;
  if (!voice) pickVoice();
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang || 'en-US';
  u.rate = 0.9;
  u.pitch = 1.05;
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
