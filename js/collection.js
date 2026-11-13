import { CREATURES, TYPES, RARITY, numberLabel } from './creatures.js';
import { creatureSVG } from './creature-art.js';
import { found } from './rewards.js';
import { say } from './speech.js';
import { replay } from './fx.js';

const $ = (id) => document.getElementById(id);

export function renderCollection() {
  const got = found();
  const grid = $('animal-grid');
  grid.innerHTML = '';
  let count = 0;

  CREATURES.forEach((c) => {
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
        say('Keep playing to find this critter!');
      }
    });
    grid.append(card);
  });

  $('collection-count').textContent = `${count} of ${CREATURES.length} critters`;
  $('all-done').hidden = count < CREATURES.length;
  return count;
}
