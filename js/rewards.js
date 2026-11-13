// Mystery critters: each correct answer reveals one piece. Five pieces
// completes the critter and adds it to the collection.
//
// A family's first form is found first. Each time that family comes up
// again, the next form is the reward, so the critter "evolves".
import { CREATURES, RARITY, FAMILY_COUNT, byId } from './creatures.js';

export const PIECES = 5;
// Piece 0 is the center, which gives the critter away, so it's always revealed last.
const CENTER = 0;

const KEY = 'abcgame.critters.v1';
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function weightedPick(list) {
  const total = list.reduce((sum, c) => sum + RARITY[c.rarity].weight, 0);
  let r = Math.random() * total;
  for (const c of list) {
    r -= RARITY[c.rarity].weight;
    if (r < 0) return c;
  }
  return list[list.length - 1];
}

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
    if (s && typeof s.found === 'object' && s.found) {
      return { current: validCurrent(s.current) ? s.current : null, found: s.found, lastId: s.lastId || null };
    }
  } catch { /* storage unavailable or corrupt: start fresh */ }
  return { current: null, found: {}, lastId: null };
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const allFound = () => CREATURES.every((c) => state.found[c.id] > 0);
export const found = () => ({ ...state.found });

// The next form each family can give: its first form not found yet.
function nextForms() {
  const next = [];
  for (let f = 0; f < FAMILY_COUNT; f++) {
    const form = CREATURES.find((c) => c.family === f && !state.found[c.id]);
    if (form) next.push(form);
  }
  return next;
}

function pickNext() {
  const next = nextForms();
  if (next.length) return weightedPick(next);
  // Everything found: any critter can come again (shown as ×2, ×3…).
  return weightedPick(CREATURES.filter((c) => c.id !== state.lastId));
}

// The critter being revealed right now (starts a new one if needed).
export function current() {
  if (!state.current) {
    state.current = { id: pickNext().id, pieces: [] };
    save();
  }
  return { creature: byId(state.current.id), pieces: [...state.current.pieces] };
}

// Reveal one more piece. Returns which piece, and whether the critter is done.
export function addPiece() {
  const { creature, pieces } = current();
  const hidden = [...Array(PIECES).keys()].filter((i) => !pieces.includes(i));
  const corners = hidden.filter((i) => i !== CENTER);
  const index = randomItem(corners.length ? corners : hidden);
  state.current.pieces.push(index);

  const result = { index, complete: false, creature, firstTime: false, justFoundAll: false };
  if (state.current.pieces.length >= PIECES) {
    const hadAll = allFound();
    result.firstTime = !state.found[creature.id];
    state.found[creature.id] = (state.found[creature.id] || 0) + 1;
    state.lastId = creature.id;
    state.current = null;
    result.complete = true;
    result.justFoundAll = !hadAll && allFound();
  }
  save();
  return result;
}

// Testing helpers (used from the browser console).
export const debug = {
  findAllBut(n = 1) {
    CREATURES.slice(0, CREATURES.length - n).forEach((c) => { state.found[c.id] ||= 1; });
    state.current = null;
    save();
  },
  setPieces(count) {
    current();
    // Corners first, matching the real reveal order.
    state.current.pieces = [...Array(Math.min(count, PIECES - 1)).keys()].map((i) => i + 1);
    save();
  },
  setCurrent(id) {
    if (!byId(id)) return 'unknown critter';
    state.current = { id, pieces: [] };
    save();
    return id;
  },
  reset() {
    state = { current: null, found: {}, lastId: null };
    save();
  },
};
