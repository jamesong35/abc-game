import { ANIMALS, collection } from './rewards.js';
import { say } from './speech.js';
import { replay } from './fx.js';

const $ = (id) => document.getElementById(id);

export function renderCollection() {
  const found = collection();
  const grid = $('animal-grid');
  grid.innerHTML = '';
  let count = 0;

  ANIMALS.forEach((a) => {
    const times = found[a.id] || 0;
    if (times) count++;
    const card = document.createElement('button');
    card.className = 'animal-card' + (times ? ' found' : '');
    card.setAttribute('aria-label', times ? a.name : 'Mystery animal');

    const emoji = document.createElement('span');
    emoji.className = 'animal-emoji';
    emoji.textContent = a.emoji;
    const name = document.createElement('span');
    name.className = 'animal-name';
    name.textContent = times ? a.name : '?';
    card.append(emoji, name);

    if (times > 1) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `×${times}`;
      card.append(badge);
    }

    card.addEventListener('click', () => {
      if (times) {
        say(`${a.name}!`);
        replay(card, 'bounce');
      } else {
        say('Keep playing to find this animal!');
      }
    });
    grid.append(card);
  });

  $('collection-count').textContent = `${count} of ${ANIMALS.length} animals`;
  $('all-done').hidden = count < ANIMALS.length;
  return count;
}
