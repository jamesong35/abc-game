import { initExplore, resetExplore } from './explore.js';
import { initFind, enterFind, leaveFind } from './find-game.js';
import { renderCollection } from './collection.js';
import { say, stopSpeech, unlockSpeech } from './speech.js';
import { unlockAudio } from './sounds.js';
import { debug } from './rewards.js';

function go(name) {
  const leaving = document.querySelector('.screen.active');
  if (leaving?.id === 'find') leaveFind();
  stopSpeech();

  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === name));
  window.scrollTo(0, 0);

  if (name === 'explore') { resetExplore(); say('Tap a letter!'); }
  if (name === 'find') enterFind();
  if (name === 'collection') {
    const n = renderCollection();
    say(n ? `You have ${n} ${n === 1 ? 'animal' : 'animals'}!` : 'Play Find the Letter to find animals!');
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-go]');
  if (link) go(link.dataset.go);
});

// Speech and sound need one tap before iOS will play them.
document.addEventListener('pointerdown', () => { unlockSpeech(); unlockAudio(); }, { once: true });

initExplore();
initFind();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// For testing from the browser console, e.g. abcDebug.setPieces(4)
window.abcDebug = debug;
