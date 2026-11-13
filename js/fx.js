const COLORS = ['#ef476f', '#ffb703', '#219ebc', '#06a77d', '#8338ec', '#fb8500'];

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A quick burst of confetti from the middle of an element.
export function confetti(el, count = 20) {
  if (reducedMotion()) return;
  const layer = document.getElementById('fx');
  const r = el.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 110;
    p.className = 'confetti';
    p.style.left = `${r.left + r.width / 2}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.background = COLORS[i % COLORS.length];
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.addEventListener('animationend', () => p.remove());
    layer.append(p);
  }
}

// Restart a CSS animation class on an element.
export function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
