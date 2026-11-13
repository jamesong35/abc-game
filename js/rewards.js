// Mystery animals: each correct answer reveals one piece. Five pieces
// completes the animal and adds it to the collection.
export const PIECES = 5;

export const ANIMALS = [
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓' },
  { id: 'tiger', name: 'Tiger', emoji: '🐅' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒' },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘' },
  { id: 'camel', name: 'Camel', emoji: '🐫' },
  { id: 'llama', name: 'Llama', emoji: '🦙' },
  { id: 'sloth', name: 'Sloth', emoji: '🦥' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'koala', name: 'Koala', emoji: '🐨' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐇' },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔' },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️' },
  { id: 'owl', name: 'Owl', emoji: '🦉' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜' },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢' },
  { id: 'crocodile', name: 'Crocodile', emoji: '🐊' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙' },
  { id: 'shark', name: 'Shark', emoji: '🦈' },
];

const KEY = 'abcgame.rewards.v1';
export const byId = (id) => ANIMALS.find((a) => a.id === id);
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function validCurrent(c) {
  return (
    c && byId(c.id) && Array.isArray(c.pieces) &&
    c.pieces.every((n) => Number.isInteger(n) && n >= 0 && n < PIECES) &&
    c.pieces.length < PIECES
  );
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && typeof s.collection === 'object' && s.collection) {
      return {
        current: validCurrent(s.current) ? s.current : null,
        collection: s.collection,
        lastId: s.lastId || null,
      };
    }
  } catch { /* storage unavailable or corrupt: start fresh */ }
  return { current: null, collection: {}, lastId: null };
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const allFound = () => ANIMALS.every((a) => state.collection[a.id] > 0);
export const collection = () => ({ ...state.collection });

function pickNext() {
  const notFound = ANIMALS.filter((a) => !state.collection[a.id]);
  const pool = notFound.length ? notFound : ANIMALS.filter((a) => a.id !== state.lastId);
  return randomItem(pool);
}

// The animal being revealed right now (starts a new one if needed).
export function current() {
  if (!state.current) {
    state.current = { id: pickNext().id, pieces: [] };
    save();
  }
  return { animal: byId(state.current.id), pieces: [...state.current.pieces] };
}

// Piece 0 is the center, which gives the animal away, so it's always revealed last.
const CENTER = 0;

// Reveal one more piece. Returns which piece, and whether the animal is done.
export function addPiece() {
  const { animal, pieces } = current();
  const hidden = [...Array(PIECES).keys()].filter((i) => !pieces.includes(i));
  const corners = hidden.filter((i) => i !== CENTER);
  const index = randomItem(corners.length ? corners : hidden);
  state.current.pieces.push(index);

  let complete = false;
  let justFoundAll = false;
  if (state.current.pieces.length >= PIECES) {
    const hadAll = allFound();
    state.collection[animal.id] = (state.collection[animal.id] || 0) + 1;
    state.lastId = animal.id;
    state.current = null;
    complete = true;
    justFoundAll = !hadAll && allFound();
  }
  save();
  return { index, complete, animal, justFoundAll };
}

// Testing helpers (used from the browser console).
export const debug = {
  collectAllBut(n = 1) {
    ANIMALS.slice(0, ANIMALS.length - n).forEach((a) => { state.collection[a.id] ||= 1; });
    state.current = null;
    save();
  },
  setPieces(count) {
    current();
    // Corners first, matching the real reveal order.
    state.current.pieces = [...Array(Math.min(count, PIECES - 1)).keys()].map((i) => i + 1);
    save();
  },
  reset() {
    state = { current: null, collection: {}, lastId: null };
    save();
  },
};
