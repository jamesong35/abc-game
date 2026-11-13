// Draws a critter as an SVG from its parts list (see creatures.js).
// Everything is built from simple shapes in a 200×200 box.
import { TYPES } from './creatures.js';

const OUT = '#2b2d42';
const mirror = (s) => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
const pair = (s) => s + mirror(s);

// Body layouts: where the head, face and top of the head sit.
const LAYOUT = {
  chibi: { head: [100, 88, 46], top: 42, eyeY: 92, eyeX: 17, mouthY: 108, cheekY: 104, cheekX: 30, mark: 64 },
  blob: { head: null, top: 58, eyeY: 108, eyeX: 20, mouthY: 128, cheekY: 122, cheekX: 36, mark: 80 },
};

function flame(x, y, s, outer, inner) {
  const d = 'M0 -26 C-10 -12 -16 -2 -12 8 C-9 16 9 16 12 8 C16 -2 10 -12 0 -26 Z';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="${d}" fill="${outer}"/>
    <path d="${d}" fill="${inner}" stroke="none" transform="translate(0 6) scale(0.5)"/>
  </g>`;
}

function leaf(x, y, rot, fill) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M0 0 C8 -11 22 -11 30 0 C22 11 8 11 0 0 Z" fill="${fill}"/>
    <path d="M3 0 L25 0" stroke-width="2" fill="none"/>
  </g>`;
}

function starPoints(cx, cy, outer, inner, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export function creatureSVG(c) {
  const t = TYPES[c.type];
  const L = LAYOUT[c.parts.body];
  const has = (x) => c.parts.extras.includes(x);
  const top = L.top;
  const back = [];
  const front = [];

  // ---------- Behind the body ----------
  if (has('mane')) {
    const [hx, hy] = L.head || [100, 112];
    back.push(`<polygon points="${starPoints(hx, hy, L.head ? 68 : 80, L.head ? 46 : 58, 14)}" fill="${t.accent}"/>`);
  }
  if (c.parts.tail === 'fluffy') {
    back.push(`<ellipse cx="146" cy="142" rx="17" ry="32" transform="rotate(40 146 142)" fill="${t.main}"/>
      <ellipse cx="162" cy="120" rx="10" ry="13" transform="rotate(40 162 120)" fill="${t.belly}"/>`);
  }
  if (c.parts.tail === 'thin') {
    back.push(`<path d="M134 162 C170 162 174 130 160 108" fill="none" stroke-width="15"/>
      <path d="M134 162 C170 162 174 130 160 108" fill="none" stroke="${t.main}" stroke-width="8"/>`);
  }
  if (has('tail-flame')) back.push(flame(164, 104, 0.9, '#ff4d2e', t.accent));
  if (has('tail-leaf')) back.push(leaf(156, 112, -70, t.accent));
  if (c.parts.wings || has('wings')) {
    back.push(pair(`<ellipse cx="52" cy="138" rx="18" ry="34" transform="rotate(30 52 138)" fill="${t.accent}"/>
      <path d="M44 128 L58 150" stroke-width="2.5" fill="none"/>`));
  }
  if (has('bug-wings')) {
    back.push(pair(`<ellipse cx="54" cy="74" rx="24" ry="40" transform="rotate(-38 54 74)" fill="#ffffff" fill-opacity="0.75" stroke="${t.accent}"/>`));
  }
  if (has('fins')) back.push(pair(`<path d="M40 120 L12 98 L16 142 Z" fill="${t.accent}"/>`));
  if (has('dorsal')) back.push(`<path d="M78 66 Q98 22 126 68 Z" fill="${t.accent}"/>`);
  if (has('antennae')) {
    back.push(pair(`<path d="M88 ${top + 8} Q82 ${top - 18} 68 ${top - 26}" fill="none"/>
      <circle cx="68" cy="${top - 26}" r="7" fill="${t.accent}"/>`));
  }
  if (has('crest')) {
    back.push(`<ellipse cx="86" cy="${top - 8}" rx="7" ry="20" transform="rotate(-28 86 ${top - 8})" fill="${t.accent}"/>
      <ellipse cx="114" cy="${top - 8}" rx="7" ry="20" transform="rotate(28 114 ${top - 8})" fill="${t.accent}"/>
      <ellipse cx="100" cy="${top - 14}" rx="8" ry="22" fill="${t.accent}"/>`);
  }
  if (has('tuft')) {
    back.push(`<ellipse cx="93" cy="${top - 2}" rx="5" ry="12" transform="rotate(-22 93 ${top - 2})" fill="${t.main}"/>
      <ellipse cx="107" cy="${top - 2}" rx="5" ry="12" transform="rotate(22 107 ${top - 2})" fill="${t.main}"/>
      <ellipse cx="100" cy="${top - 5}" rx="5" ry="13" fill="${t.main}"/>`);
  }
  if (has('spikes') && L.head) {
    const [hx, hy, r] = L.head;
    for (const deg of [-62, -31, 0, 31, 62]) {
      const a = ((deg - 90) * Math.PI) / 180;
      const p = (rad, off) => {
        const aa = a + off;
        return `${(hx + rad * Math.cos(aa)).toFixed(1)},${(hy + rad * Math.sin(aa)).toFixed(1)}`;
      };
      back.push(`<polygon points="${p(r - 4, -0.2)} ${p(r + 18, 0)} ${p(r - 4, 0.2)}" fill="${t.accent}"/>`);
    }
  }
  if (has('flame-tuft')) back.push(flame(100, top - 12, 1, '#ff4d2e', t.accent));
  if (has('sprout')) {
    back.push(`<path d="M100 ${top + 6} L100 ${top - 14}" fill="none" stroke-width="4"/>`);
    back.push(leaf(100, top - 14, -155, t.accent), leaf(100, top - 14, -25, t.accent));
  }
  if (c.parts.ears === 'pointy') {
    back.push(pair(`<path d="M60 72 L64 24 L98 50 Z" fill="${t.main}"/>
      <path d="M67 62 L69 38 L87 51 Z" fill="${t.belly}" stroke="none"/>`));
  }
  if (c.parts.ears === 'long') {
    back.push(pair(`<ellipse cx="78" cy="38" rx="12" ry="32" transform="rotate(-14 78 38)" fill="${t.main}"/>
      <ellipse cx="78" cy="42" rx="6" ry="22" transform="rotate(-14 78 42)" fill="${t.belly}" stroke="none"/>`));
  }
  if (c.parts.ears === 'round') {
    back.push(pair(`<circle cx="62" cy="54" r="18" fill="${t.main}"/>
      <circle cx="62" cy="54" r="9" fill="${t.belly}" stroke="none"/>`));
  }

  // ---------- Body and head ----------
  const body = [];
  if (c.parts.body === 'chibi') {
    body.push(`<ellipse cx="100" cy="148" rx="40" ry="34" fill="${t.main}"/>
      <ellipse cx="100" cy="155" rx="24" ry="20" fill="${t.belly}" stroke="none"/>
      <ellipse cx="82" cy="182" rx="13" ry="8" fill="${t.main}"/>
      <ellipse cx="118" cy="182" rx="13" ry="8" fill="${t.main}"/>`);
    if (has('scarf')) {
      body.push(`<path d="M114 132 L128 166 L110 162 Z" fill="${t.accent}"/>
        <path d="M62 124 Q100 142 138 124 L138 136 Q100 154 62 136 Z" fill="${t.accent}"/>`);
    }
    body.push(`<circle cx="100" cy="88" r="46" fill="${t.main}"/>`);
  } else {
    body.push(`<ellipse cx="76" cy="174" rx="15" ry="9" fill="${t.main}"/>
      <ellipse cx="124" cy="174" rx="15" ry="9" fill="${t.main}"/>
      <ellipse cx="100" cy="118" rx="66" ry="58" fill="${t.main}"/>
      <ellipse cx="100" cy="142" rx="40" ry="28" fill="${t.belly}" stroke="none"/>`);
  }

  // ---------- On the body ----------
  let eyes = [[100 - L.eyeX, L.eyeY], [100 + L.eyeX, L.eyeY]];
  if (has('eye-bumps')) {
    eyes = [[76, 70], [124, 70]];
    front.push(`<circle cx="76" cy="70" r="20" fill="${t.main}"/><circle cx="124" cy="70" r="20" fill="${t.main}"/>`);
  }
  if (has('spots')) {
    const spots = c.parts.body === 'chibi'
      ? [[80, 140, 6], [120, 150, 5], [72, 70, 5], [126, 66, 4]]
      : [[56, 104, 8], [146, 100, 6], [62, 140, 6], [140, 138, 7]];
    front.push(spots.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.accent}" stroke="none"/>`).join(''));
  }
  if (has('horn')) front.push(`<path d="M91 ${top + 14} L100 ${top - 24} L109 ${top + 14} Z" fill="#fff4d6"/>`);
  if (has('crown')) {
    front.push(`<path d="M78 ${top + 8} L80 ${top - 14} L90 ${top - 2} L100 ${top - 20} L110 ${top - 2} L120 ${top - 14} L122 ${top + 8} Z" fill="#ffd23f"/>`);
  }
  if (has('flower')) {
    const fy = top - 6;
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      front.push(`<circle cx="${(100 + 9 * Math.cos(a)).toFixed(1)}" cy="${(fy + 9 * Math.sin(a)).toFixed(1)}" r="7.5" fill="#ff8fab"/>`);
    }
    front.push(`<circle cx="100" cy="${fy}" r="5.5" fill="#ffd23f"/>`);
  }
  const m = L.mark;
  if (has('snowflake')) {
    front.push(`<g stroke="${t.accent}" stroke-width="3.5">
      <path d="M100 ${m - 10} L100 ${m + 10}"/><path d="M91 ${m - 5} L109 ${m + 5}"/><path d="M91 ${m + 5} L109 ${m - 5}"/></g>`);
  }
  if (has('star-mark')) front.push(`<polygon points="${starPoints(100, m, 11, 4.8, 5)}" fill="#ffe066" stroke-width="2.5"/>`);
  if (has('bolt-mark')) {
    front.push(`<path d="M103 ${m - 13} L91 ${m + 2} L100 ${m + 2} L96 ${m + 15} L109 ${m - 2} L100 ${m - 2} Z" fill="${t.accent}" stroke-width="2.5"/>`);
  }

  // ---------- Face ----------
  const face = [];
  face.push(`<ellipse cx="${100 - L.cheekX}" cy="${L.cheekY}" rx="8" ry="5" fill="#ff8fab" fill-opacity="0.6" stroke="none"/>
    <ellipse cx="${100 + L.cheekX}" cy="${L.cheekY}" rx="8" ry="5" fill="#ff8fab" fill-opacity="0.6" stroke="none"/>`);
  for (const [x, y] of eyes) {
    face.push(`<circle cx="${x}" cy="${y}" r="9" fill="${OUT}" stroke="none"/>
      <circle cx="${x - 3}" cy="${y - 3}" r="3.4" fill="#fff" stroke="none"/>`);
  }
  const my = L.mouthY;
  if (has('beak')) {
    face.push(`<path d="M89 ${my - 8} L111 ${my - 8} L100 ${my + 7} Z" fill="#ffb347" stroke-width="2.5"/>`);
  } else if (has('trunk')) {
    if (has('tusks')) {
      face.push(pair(`<path d="M84 ${my + 2} C80 ${my + 18} 86 ${my + 26} 94 ${my + 26}" fill="none" stroke-width="9"/>
        <path d="M84 ${my + 2} C80 ${my + 18} 86 ${my + 26} 94 ${my + 26}" fill="none" stroke="#fffaf0" stroke-width="4"/>`));
    }
    const d = `M100 ${my - 10} C100 ${my + 14} 96 ${my + 30} 110 ${my + 34}`;
    face.push(`<path d="${d}" fill="none" stroke-width="17"/><path d="${d}" fill="none" stroke="${t.main}" stroke-width="10"/>`);
  } else if (has('wide-mouth')) {
    face.push(`<path d="M78 ${my - 2} Q100 ${my + 16} 122 ${my - 2}" fill="none" stroke-width="3"/>`);
  } else {
    face.push(`<path d="M93 ${my} Q100 ${my + 7} 107 ${my}" fill="none" stroke-width="3"/>`);
  }
  if (has('whiskers')) {
    face.push(pair(`<g stroke-width="2.5" fill="none">
      <path d="M${100 - L.cheekX - 8} ${L.cheekY - 4} L${100 - L.cheekX - 30} ${L.cheekY - 10}"/>
      <path d="M${100 - L.cheekX - 8} ${L.cheekY + 2} L${100 - L.cheekX - 30} ${L.cheekY + 4}"/></g>`));
  }

  const s = c.size;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g transform="translate(100 194) scale(${s}) translate(-100 -194)" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
${back.join('')}${body.join('')}${front.join('')}${face.join('')}
</g></svg>`;
}
