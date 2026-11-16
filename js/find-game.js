import { LETTERS, TILE_COLORS } from './letters.js';
import { say, speechAvailable } from './speech.js';
import { chime, boop, fanfare } from './sounds.js';
import { confetti, replay } from './fx.js';
import { letterRewards, wordRewards, PIECES } from './rewards.js';
import { TYPES, RARITY, numberLabel } from './creatures.js';
import { WORD_FAMILIES } from './words.js';
import { creatureSVG } from './creature-art.js';

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

// 'letters' (Find the Letter) or 'words' (Find the Word). Both share this screen.
let mode = 'letters';
const rewards = () => (mode === 'words' ? wordRewards : letterRewards);

// Find the Word plays 5 words from one family (cat, hat, bat…) per critter.
let family = null;
let wordQueue = [];

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
const sizeWord = () => (letterCase === 'lower' ? 'lowercase' : 'capital');
const playing = () => $('find').classList.contains('active') && !$('game').hidden;

function later(fn, ms) {
  clearTimeout(timer);
  timer = setTimeout(fn, ms);
}

export function initFind() {
  document.querySelectorAll('[data-case]').forEach((b) =>
    b.addEventListener('click', () => start(b.dataset.case)));
  $('prompt').addEventListener('click', sayTarget);
  $('play-again').addEventListener('click', () => {
    wordQueue = [];
    $('complete').hidden = true;
    $('game').hidden = false;
    renderReveal();
    newRound();
  });
  updateCaseButtons();
}

// Called each time the Find screen opens, for either level.
export function enterFind(m = 'letters') {
  clearTimeout(timer);
  busy = false;
  mode = m;
  const words = mode === 'words';
  $('find-title').textContent = words ? 'Find the Word' : 'Find the Letter';
  document.querySelector('#find .case-toggle').hidden = words;
  $('complete').hidden = true;
  if (words) {
    wordQueue = [];
    $('case-chooser').hidden = true;
    $('game').hidden = false;
    renderReveal();
    newRound();
    return;
  }
  $('game').hidden = true;
  $('case-chooser').hidden = false;
  updateCaseButtons();
  say('Pick capital letters or lowercase letters!');
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

// Start a new word family: 5 different target words from it, never the
// same family twice in a row.
function nextFamily() {
  const others = WORD_FAMILIES.filter((f) => f !== family);
  family = randomItem(others);
  wordQueue = shuffle(family.words.map((w) => w.word)).slice(0, PIECES);
}

function letterChoices() {
  const all = LETTERS.map((l) => l.letter);
  do { target = randomItem(all); } while (target === lastTarget);
  lastTarget = target;
  return shuffle([target, ...shuffle(all.filter((l) => l !== target)).slice(0, 3)]).map((L) => ({
    value: L,
    text: shown(L),
    emoji: LETTERS.find((l) => l.letter === L).emoji,
    label: `${sizeWord()} ${L}`,
  }));
}

function wordChoices() {
  if (!wordQueue.length) nextFamily();
  target = wordQueue.shift();
  const others = shuffle(family.words.filter((w) => w.word !== target)).slice(0, 3);
  const picks = [family.words.find((w) => w.word === target), ...others];
  return shuffle(picks).map((w) => ({ value: w.word, text: w.word, emoji: w.emoji || '', label: w.word }));
}

function newRound() {
  busy = false;
  const words = mode === 'words';
  const choices = words ? wordChoices() : letterChoices();
  const box = $('choices');
  box.innerHTML = '';
  choices.forEach((ch, i) => {
    const b = document.createElement('button');
    b.className = words ? 'tile choice word' : 'tile choice';
    b.style.setProperty('--c', TILE_COLORS[i]);
    const text = document.createElement('span');
    text.className = 'choice-letter';
    text.textContent = ch.text;
    // In Find the Word the picture stays hidden until the word is found,
    // so kids read the word instead of matching the picture.
    const pic = document.createElement('span');
    pic.className = 'choice-emoji';
    pic.setAttribute('aria-hidden', 'true');
    pic.textContent = ch.emoji;
    b.append(text, pic);
    b.dataset.letter = ch.value;
    b.setAttribute('aria-label', ch.label);
    b.addEventListener('click', () => choose(b));
    box.append(b);
  });

  // The game is about hearing the letter or word. If this device can't speak,
  // show it instead so it's still playable.
  $('prompt-text').innerHTML = speechAvailable()
    ? 'Listen'
    : `Find <span class="target">${words ? target : shown(target)}</span>`;
  later(() => sayTarget(true), 350);
}

// The first time in a round: "Find the letter A!" or "Find the word cat!".
// After that, the Listen button just says the letter or word.
function sayTarget(full) {
  if (!playing() || !target) return;
  const kind = mode === 'words' ? 'word' : 'letter';
  say(full === true ? `Find the ${kind} ${target}!` : `${target}!`);
}

function choose(btn) {
  if (busy) return;
  const L = btn.dataset.letter;

  if (L !== target) {
    replay(btn, 'wrong');
    boop();
    say(`That's the ${mode === 'words' ? 'word' : 'letter'} ${L}. Try again!`);
    return;
  }

  busy = true;
  btn.classList.add('correct');
  btn.querySelector('.choice-emoji').classList.add('show');
  chime();
  confetti(btn);
  const result = rewards().addPiece();
  renderReveal(result);

  if (result.complete) {
    say('Great job!');
    later(() => celebrate(result), 1100);
  } else {
    say(randomItem(PRAISE));
    later(newRound, 1500);
  }
}

// The 5 reward pieces: a center square plus four L-shaped corners around it,
// so every piece covers a visible part of the critter. (Percent coordinates.)
const PIECE_SHAPES = [
  'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',                      // center
  'polygon(0 0, 50% 0, 50% 25%, 25% 25%, 25% 50%, 0 50%)',            // top left
  'polygon(50% 0, 100% 0, 100% 50%, 75% 50%, 75% 25%, 50% 25%)',      // top right
  'polygon(100% 50%, 100% 100%, 50% 100%, 50% 75%, 75% 75%, 75% 50%)', // bottom right
  'polygon(0 50%, 25% 50%, 25% 75%, 50% 75%, 50% 100%, 0 100%)',      // bottom left
];

// Draw the mystery critter: a black silhouette with the revealed pieces in color on top.
// When a critter was just completed, show it fully before the celebration.
function renderReveal(result) {
  const done = result?.complete;
  const { creature, pieces } = done
    ? { creature: result.creature, pieces: [...Array(PIECES).keys()] }
    : rewards().current();
  const art = creatureSVG(creature);

  const box = $('reveal');
  box.innerHTML = '';
  const sil = document.createElement('div');
  sil.className = 'layer sil';
  sil.innerHTML = art;
  box.append(sil);

  for (let i = 0; i < PIECES; i++) {
    const piece = document.createElement('div');
    piece.className = 'layer piece';
    piece.innerHTML = art;
    piece.style.clipPath = PIECE_SHAPES[i];
    if (pieces.includes(i)) piece.classList.add('on');
    if (result && result.index === i) piece.classList.add('pop');
    box.append(piece);
  }

  const dots = $('dots');
  dots.innerHTML = '';
  for (let i = 0; i < PIECES; i++) {
    const d = document.createElement('span');
    if (i < pieces.length) d.className = 'on';
    dots.append(d);
  }
  box.setAttribute('aria-label', `Mystery critter, ${pieces.length} of ${PIECES} pieces found`);
}

function celebrate({ creature: c, firstTime, justFoundAll }) {
  if (!$('find').classList.contains('active')) return;
  $('game').hidden = true;
  $('complete').hidden = false;

  const prev = firstTime ? rewards().set.previousForm(c) : null;
  const big = $('complete-animal');
  big.innerHTML = prev
    ? `<div class="evo-prev">${creatureSVG(prev)}</div><span class="evo-arrow" aria-hidden="true">➜</span><div class="evo-new">${creatureSVG(c)}</div>`
    : `<div class="evo-new">${creatureSVG(c)}</div>`;
  replay(big, 'complete-animal');

  const headline = prev
    ? `${prev.name} evolved into ${c.name}!`
    : firstTime ? `You found ${c.name}!` : `You found another ${c.name}!`;
  $('complete-text').textContent = headline;

  const type = TYPES[c.type];
  const rarity = c.rarity === 'common' ? '' : ` · ${'⭐'.repeat(RARITY[c.rarity].stars)} ${RARITY[c.rarity].label}!`;
  const meta = $('complete-meta');
  meta.textContent = `${numberLabel(c)} · ${type.icon} ${type.label} type${rarity}`;
  meta.className = `meta ${c.rarity}`;
  $('complete-all').hidden = !justFoundAll;
  $('see-critters').dataset.tab = mode;

  fanfare();
  confetti(big, c.rarity === 'common' ? 40 : 80);
  let speech = prev ? `Whoa! ${headline}` : `${headline} It's in your collection now!`;
  if (c.rarity === 'rare') speech += " It's a rare critter!";
  if (c.rarity === 'super') speech += ' Wow, a super rare critter!';
  if (justFoundAll) speech += ' You found every critter!';
  say(speech);
}
