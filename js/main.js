import { initExplore, enterExplore } from './explore.js';
import { initFind, enterFind, leaveFind } from './find-game.js';
import { renderCollection } from './collection.js';
import { say, stopSpeech, unlockSpeech } from './speech.js';
import { unlockAudio } from './sounds.js';
import { debug } from './rewards.js';

function go(name, tab) {
  const leaving = document.querySelector('.screen.active');
  if (leaving?.id === 'find') leaveFind();
  stopSpeech();

  // The letter and word versions of Explore and Find share a screen.
  const screen = { words: 'find', 'explore-words': 'explore' }[name] || name;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === screen));
  window.scrollTo(0, 0);

  if (name === 'explore') enterExplore('letters');
  if (name === 'explore-words') enterExplore('words');
  if (name === 'find') enterFind('letters');
  if (name === 'words') enterFind('words');
  if (name === 'collection') {
    const n = renderCollection(tab);
    say(n ? `You have ${n} ${n === 1 ? 'critter' : 'critters'}!` : 'Play a game to find critters!');
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-go]');
  if (link) go(link.dataset.go, link.dataset.tab);
});

// Speech and sound need one tap before iOS will play them.
document.addEventListener('pointerdown', () => { unlockSpeech(); unlockAudio(); }, { once: true });

initExplore();
initFind();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// For testing from the browser console, e.g. abcDebug.words.setPieces(4)
window.abcDebug = debug;
