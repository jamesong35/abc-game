import { LETTERS, TILE_COLORS } from './letters.js';
import { say } from './speech.js';
import { replay } from './fx.js';

const $ = (id) => document.getElementById(id);
let index = 0;

export function initExplore() {
  const grid = $('letter-grid');
  LETTERS.forEach((item, i) => {
    const b = document.createElement('button');
    b.className = 'tile';
    b.style.setProperty('--c', TILE_COLORS[i % TILE_COLORS.length]);
    b.textContent = item.letter + item.letter.toLowerCase();
    b.setAttribute('aria-label', `Letter ${item.letter}`);
    b.addEventListener('click', () => open(i));
    grid.append(b);
  });

  $('prev-letter').addEventListener('click', () => open((index + LETTERS.length - 1) % LETTERS.length));
  $('next-letter').addEventListener('click', () => open((index + 1) % LETTERS.length));
  $('detail-card').addEventListener('click', () => { speak(); replay($('detail-card'), 'bounce'); });
  $('close-detail').addEventListener('click', resetExplore);
}

function open(i) {
  index = i;
  const { letter, word, emoji } = LETTERS[i];
  const card = $('detail-card');
  card.querySelector('.detail-letter').textContent = letter + letter.toLowerCase();
  card.querySelector('.detail-letter').style.setProperty('--c', TILE_COLORS[i % TILE_COLORS.length]);
  card.querySelector('.detail-emoji').textContent = emoji;
  card.querySelector('.detail-word').textContent = word;
  $('letter-grid').hidden = true;
  $('letter-detail').hidden = false;
  speak();
}

function speak() {
  const { letter, word } = LETTERS[index];
  say(`${letter}! ${letter} is for ${word}.`);
}

export function resetExplore() {
  $('letter-detail').hidden = true;
  $('letter-grid').hidden = false;
}
