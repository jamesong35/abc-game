import { LETTERS, TILE_COLORS } from './letters.js';
import { WORD_FAMILIES } from './words.js';
import { say } from './speech.js';
import { replay } from './fx.js';

const $ = (id) => document.getElementById(id);

// 'letters': A to Z. 'words': the word families, one word card at a time.
let mode = 'letters';
let index = 0;   // letter, or word within the family
let family = 0;  // which word family is open

const colorOf = (i) => TILE_COLORS[i % TILE_COLORS.length];
const count = () => (mode === 'words' ? WORD_FAMILIES[family].words.length : LETTERS.length);

export function initExplore() {
  $('prev-letter').addEventListener('click', () => open((index + count() - 1) % count()));
  $('next-letter').addEventListener('click', () => open((index + 1) % count()));
  $('detail-card').addEventListener('click', () => { speak(); replay($('detail-card'), 'bounce'); });
  $('close-detail').addEventListener('click', showGrid);
}

// Called each time an Explore screen opens.
export function enterExplore(m) {
  mode = m;
  const words = mode === 'words';
  $('explore-title').textContent = words ? 'Explore Words' : 'Explore Letters';
  $('close-detail').textContent = words ? 'All words' : 'All letters';
  $('prev-letter').setAttribute('aria-label', words ? 'Previous word' : 'Previous letter');
  $('next-letter').setAttribute('aria-label', words ? 'Next word' : 'Next letter');

  const grid = $('letter-grid');
  grid.innerHTML = '';
  if (words) {
    WORD_FAMILIES.forEach((f, i) => {
      const b = document.createElement('button');
      b.className = 'tile family';
      b.style.setProperty('--c', colorOf(i));
      b.innerHTML = `<span>-${f.ending}</span><span class="example">${f.words[0].word}</span>`;
      b.setAttribute('aria-label', `${f.ending} words`);
      b.addEventListener('click', () => { family = i; open(0); });
      grid.append(b);
    });
  } else {
    LETTERS.forEach((item, i) => {
      const b = document.createElement('button');
      b.className = 'tile';
      b.style.setProperty('--c', colorOf(i));
      b.textContent = item.letter + item.letter.toLowerCase();
      b.setAttribute('aria-label', `Letter ${item.letter}`);
      b.addEventListener('click', () => open(i));
      grid.append(b);
    });
  }
  showGrid();
  say(words ? 'Tap a word family!' : 'Tap a letter!');
}

function open(i) {
  index = i;
  const card = $('detail-card');
  const big = card.querySelector('.detail-letter');
  if (mode === 'words') {
    const f = WORD_FAMILIES[family];
    const { word, emoji } = f.words[i];
    // The first letter in color, the shared ending in ink.
    big.className = 'detail-letter word';
    big.innerHTML = `<span class="first">${word[0]}</span>${word.slice(1)}`;
    big.style.setProperty('--c', colorOf(family));
    card.querySelector('.detail-emoji').textContent = emoji || '';
    card.querySelector('.detail-word').textContent = `-${f.ending} family`;
  } else {
    const { letter, word, emoji } = LETTERS[i];
    big.className = 'detail-letter';
    big.textContent = letter + letter.toLowerCase();
    big.style.setProperty('--c', colorOf(i));
    card.querySelector('.detail-emoji').textContent = emoji;
    card.querySelector('.detail-word').textContent = word;
  }
  $('letter-grid').hidden = true;
  $('letter-detail').hidden = false;
  speak();
}

function speak() {
  if (mode === 'words') {
    const { word } = WORD_FAMILIES[family].words[index];
    const Word = word[0].toUpperCase() + word.slice(1);
    // Spell with capitals so the voice says the letter names.
    say(`${Word}! ${word.toUpperCase().split('').join(', ')}. ${Word}!`);
  } else {
    const { letter, word } = LETTERS[index];
    say(`${letter}! ${letter} is for ${word}.`);
  }
}

function showGrid() {
  $('letter-detail').hidden = true;
  $('letter-grid').hidden = false;
}
