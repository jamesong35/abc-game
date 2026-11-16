import { TYPES, RARITY, numberLabel } from './creatures.js';
import { creatureSVG } from './creature-art.js';
import { letterRewards, wordRewards } from './rewards.js';
import { say } from './speech.js';
import { replay } from './fx.js';

const $ = (id) => document.getElementById(id);
const TAB_KEY = 'abcgame.collectionTab';
const SETS = { letters: letterRewards, words: wordRewards };

let tab = readTab();
function readTab() {
  try { return localStorage.getItem(TAB_KEY) === 'words' ? 'words' : 'letters'; } catch { return 'letters'; }
}
function saveTab() {
  try { localStorage.setItem(TAB_KEY, tab); } catch { /* ignore */ }
}

const countFound = (r) => r.set.creatures.filter((c) => r.found()[c.id]).length;

document.querySelectorAll('.set-tabs [data-tab]').forEach((b) =>
  b.addEventListener('click', () => {
    renderCollection(b.dataset.tab);
    say(tab === 'words' ? 'Word critters!' : 'Letter critters!');
  }));

// Draws the chosen set (or the last one viewed). Returns how many critters
// have been found across both sets.
export function renderCollection(which) {
  if (which === 'letters' || which === 'words') { tab = which; saveTab(); }
  const r = SETS[tab];
  const got = r.found();
  const creatures = r.set.creatures;

  document.querySelectorAll('.set-tabs [data-tab]').forEach((b) => {
    const s = SETS[b.dataset.tab];
    b.classList.toggle('on', b.dataset.tab === tab);
    b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    b.querySelector('.tab-count').textContent = `${countFound(s)}/${s.set.creatures.length}`;
  });

  const grid = $('animal-grid');
  grid.innerHTML = '';
  let count = 0;

  creatures.forEach((c) => {
    const times = got[c.id] || 0;
    if (times) count++;
    const type = TYPES[c.type];

    const card = document.createElement('button');
    card.className = `critter-card ${times ? `found ${c.rarity}` : ''}`;
    card.setAttribute('aria-label', times ? `${numberLabel(c)} ${c.name}` : `${numberLabel(c)} mystery critter`);
    card.innerHTML = `
      <span class="num">${numberLabel(c)}</span>
      <span class="art">${creatureSVG(c)}</span>
      <span class="critter-name"></span>
      <span class="critter-meta">${times ? `${type.icon} ${'★'.repeat(RARITY[c.rarity].stars)}` : '&nbsp;'}</span>`;
    card.querySelector('.critter-name').textContent = times ? c.name : '???';

    if (times > 1) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `×${times}`;
      card.append(badge);
    }

    card.addEventListener('click', () => {
      if (times) {
        say(`${c.name}! ${type.label} type.`);
        replay(card, 'bounce');
      } else {
        say(tab === 'words' ? 'Play Find the Word to find this critter!' : 'Play Find the Letter to find this critter!');
      }
    });
    grid.append(card);
  });

  $('collection-count').textContent = `${count} of ${creatures.length} ${tab === 'words' ? 'word' : 'letter'} critters`;
  $('all-done').hidden = count < creatures.length;
  return countFound(letterRewards) + countFound(wordRewards);
}
