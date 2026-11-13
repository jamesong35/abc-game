import { LETTERS, TILE_COLORS } from './letters.js';
import { say, speechAvailable } from './speech.js';
import { chime, boop, fanfare } from './sounds.js';
import { confetti, replay } from './fx.js';
import * as rewards from './rewards.js';

const $ = (id) => document.getElementById(id);
const CASE_KEY = 'abcgame.case';
const PRAISE = ['Great job!', 'You got it!', 'Super!', 'Way to go!', 'Awesome!'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let letterCase = readCase();
let target = null;
let lastTarget = null;
let busy = false;
let timer = null;

function readCase() {
  try { return localStorage.getItem(CASE_KEY) === 'lower' ? 'lower' : 'upper'; } catch { return 'upper'; }
}
function saveCase() {
  try { localStorage.setItem(CASE_KEY, letterCase); } catch { /* ignore */ }
}

const shown = (L) => (letterCase === 'lower' ? L.toLowerCase() : L);
const sizeWord = () => (letterCase === 'lower' ? 'little' : 'big');
const playing = () => $('find').classList.contains('active') && !$('game').hidden;
const article = (name) => (/^[AEIOU]/i.test(name) ? 'an' : 'a');

function later(fn, ms) {
  clearTimeout(timer);
  timer = setTimeout(fn, ms);
}

export function initFind() {
  document.querySelectorAll('[data-case]').forEach((b) =>
    b.addEventListener('click', () => start(b.dataset.case)));
  $('prompt').addEventListener('click', sayTarget);
  $('play-again').addEventListener('click', () => {
    $('complete').hidden = true;
    $('game').hidden = false;
    renderReveal();
    newRound();
  });
  updateCaseButtons();
}

// Called each time the Find screen opens.
export function enterFind() {
  clearTimeout(timer);
  busy = false;
  $('complete').hidden = true;
  $('game').hidden = true;
  $('case-chooser').hidden = false;
  updateCaseButtons();
  say('Pick big letters or little letters!');
}

export function leaveFind() {
  clearTimeout(timer);
  busy = false;
}

function updateCaseButtons() {
  document.querySelectorAll('[data-case]').forEach((b) =>
    b.classList.toggle('on', b.dataset.case === letterCase));
}

function start(c) {
  letterCase = c;
  saveCase();
  updateCaseButtons();
  $('case-chooser').hidden = true;
  $('complete').hidden = true;
  $('game').hidden = false;
  renderReveal();
  newRound();
}

function newRound() {
  busy = false;
  const all = LETTERS.map((l) => l.letter);
  do { target = randomItem(all); } while (target === lastTarget);
  lastTarget = target;

  const choices = shuffle([target, ...shuffle(all.filter((l) => l !== target)).slice(0, 3)]);
  const box = $('choices');
  box.innerHTML = '';
  choices.forEach((L, i) => {
    const b = document.createElement('button');
    b.className = 'tile choice';
    b.style.setProperty('--c', TILE_COLORS[i]);
    const letter = document.createElement('span');
    letter.className = 'choice-letter';
    letter.textContent = shown(L);
    const pic = document.createElement('span');
    pic.className = 'choice-emoji';
    pic.setAttribute('aria-hidden', 'true');
    pic.textContent = LETTERS.find((l) => l.letter === L).emoji;
    b.append(letter, pic);
    b.dataset.letter = L;
    b.setAttribute('aria-label', `${sizeWord()} ${L}`);
    b.addEventListener('click', () => choose(b));
    box.append(b);
  });

  // The game is about hearing a letter's name. If this device can't speak,
  // show the letter instead so it's still playable.
  $('prompt-text').innerHTML = speechAvailable()
    ? 'Listen'
    : `Find <span class="target">${shown(target)}</span>`;
  later(sayTarget, 350);
}

function sayTarget() {
  if (playing() && target) say(`Find the ${sizeWord()} letter ${target}!`);
}

function choose(btn) {
  if (busy) return;
  const L = btn.dataset.letter;

  if (L !== target) {
    replay(btn, 'wrong');
    boop();
    say(`That's the ${sizeWord()} letter ${L}. Try again!`);
    return;
  }

  busy = true;
  btn.classList.add('correct');
  chime();
  confetti(btn);
  const result = rewards.addPiece(filledPieces(rewards.current().animal.emoji));
  renderReveal(result);

  if (result.complete) {
    say('Great job!');
    later(() => celebrate(result), 1100);
  } else {
    say(randomItem(PRAISE));
    later(newRound, 1500);
  }
}

// Which of the 5×2 pieces contain a meaningful part of the picture.
// Found by drawing the emoji on a small canvas and counting painted pixels.
const fillCache = new Map();
function filledPieces(emoji) {
  if (fillCache.has(emoji)) return fillCache.get(emoji);
  let result = [];
  try {
    const size = 200;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const g = canvas.getContext('2d', { willReadFrequently: true });
    g.font = `${size * 0.78}px sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(emoji, size / 2, size / 2);
    const data = g.getImageData(0, 0, size, size).data;
    const counts = new Array(rewards.PIECES).fill(0);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (data[(y * size + x) * 4 + 3] > 40) {
          counts[Math.floor(y / (size / 2)) * 5 + Math.floor(x / (size / 5))]++;
        }
      }
    }
    const cell = (size / 5) * (size / 2);
    result = counts.map((n, i) => (n / cell > 0.08 ? i : -1)).filter((i) => i >= 0);
  } catch { /* canvas unavailable: fall back to any piece */ }
  fillCache.set(emoji, result);
  return result;
}

// Draw the mystery animal: a black silhouette with the revealed pieces in color on top.
// When an animal was just completed, show it fully before the celebration.
function renderReveal(result) {
  const done = result?.complete;
  const { animal, pieces } = done
    ? { animal: result.animal, pieces: [...Array(rewards.PIECES).keys()] }
    : rewards.current();

  const box = $('reveal');
  box.innerHTML = '';
  const sil = document.createElement('div');
  sil.className = 'layer sil';
  sil.textContent = animal.emoji;
  box.append(sil);

  for (let i = 0; i < rewards.PIECES; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const piece = document.createElement('div');
    piece.className = 'layer piece';
    piece.textContent = animal.emoji;
    piece.style.clipPath =
      `inset(${row * 50}% ${100 - (col + 1) * 20}% ${100 - (row + 1) * 50}% ${col * 20}%)`;
    if (pieces.includes(i)) piece.classList.add('on');
    if (result && result.index === i) piece.classList.add('pop');
    box.append(piece);
  }

  const dots = $('dots');
  dots.innerHTML = '';
  for (let i = 0; i < rewards.PIECES; i++) {
    const d = document.createElement('span');
    if (i < pieces.length) d.className = 'on';
    dots.append(d);
  }
  box.setAttribute('aria-label', `Mystery animal, ${pieces.length} of ${rewards.PIECES} pieces found`);
}

function celebrate({ animal, justFoundAll }) {
  if (!$('find').classList.contains('active')) return;
  $('game').hidden = true;
  $('complete').hidden = false;
  const big = $('complete-animal');
  big.textContent = animal.emoji;
  replay(big, 'complete-animal');
  $('complete-text').textContent = `You found ${article(animal.name)} ${animal.name}!`;
  $('complete-all').hidden = !justFoundAll;
  fanfare();
  confetti(big, 40);
  say(`You found ${article(animal.name)} ${animal.name}! It's in your collection now!` +
    (justFoundAll ? ' Wow, you found every animal!' : ''));
}
