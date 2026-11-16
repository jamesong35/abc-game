// Draws a critter as an SVG from its parts list (see creatures.js).
// Everything is built from simple shapes in a 200×200 box.
//
// Head parts (ears, face, hats, marks) are drawn once around a reference head
// at (100, 88) with radius 46, then moved and scaled to where each body's head
// sits. That way every body shape can wear every head part.
import { TYPES } from './creatures.js';

const OUT = '#2b2d42';
const mirror = (s) => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
const pair = (s) => s + mirror(s);
const g = (transform, s) => (transform ? `<g transform="${transform}">${s}</g>` : s);

// Reference head and face positions.
const R = { top: 42, eyeY: 92, eyeX: 17, mouthY: 108, cheekY: 104, cheekX: 30, mark: 64 };

function starPoints(cx, cy, outer, inner, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

const SERPENT = 'M164 174 C120 190 44 186 46 156 C48 128 150 146 148 118 C146 100 118 104 104 98';

// Each body: its shape, where its head goes (dx, dy, scale), whether it draws
// the round head, and where tails, wings and spots go.
const BODIES = {
  chibi: {
    head: { dx: 0, dy: 0, s: 1 }, round: true,
    draw: (t) => `<ellipse cx="100" cy="148" rx="40" ry="34" fill="${t.main}"/>
      <ellipse cx="100" cy="155" rx="24" ry="20" fill="${t.belly}" stroke="none"/>
      <ellipse cx="82" cy="182" rx="13" ry="8" fill="${t.main}"/>
      <ellipse cx="118" cy="182" rx="13" ry="8" fill="${t.main}"/>`,
    spots: [[80, 140, 6], [120, 150, 5]],
  },
  blob: {
    head: { dx: 0, dy: 22, s: 1.25 }, tail: 'translate(28 4)',
    draw: (t) => `<ellipse cx="76" cy="174" rx="15" ry="9" fill="${t.main}"/>
      <ellipse cx="124" cy="174" rx="15" ry="9" fill="${t.main}"/>
      <ellipse cx="100" cy="118" rx="66" ry="58" fill="${t.main}"/>
      <ellipse cx="100" cy="142" rx="40" ry="28" fill="${t.belly}" stroke="none"/>`,
    spots: [[56, 104, 8], [146, 100, 6], [62, 140, 6], [140, 138, 7]],
  },
  // A turnip with a face. The sprout grows from its tip.
  bulb: {
    head: { dx: 0, dy: 30, s: 1.05 }, tail: 'translate(16 0)',
    draw: (t) => `<ellipse cx="80" cy="182" rx="13" ry="8" fill="${t.main}"/>
      <ellipse cx="120" cy="182" rx="13" ry="8" fill="${t.main}"/>
      <path d="M100 52 C126 66 166 104 160 146 C155 184 45 184 40 146 C34 104 74 66 100 52 Z" fill="${t.main}"/>
      <ellipse cx="100" cy="156" rx="34" ry="19" fill="${t.belly}" stroke="none"/>`,
    spots: [[62, 132, 6], [140, 128, 6], [128, 166, 5]],
  },
  // A round beetle shell with six legs and a little head on top.
  bug: {
    head: { dx: 0, dy: -14, s: 0.75 }, round: true,
    stripes: 'M48 118 Q100 134 152 118 M58 148 Q100 162 142 148 M72 172 Q100 182 128 172',
    back: () => pair(`<path d="M56 116 L30 104 M52 140 L24 142 M58 164 L34 180" fill="none" stroke-width="6"/>`),
    draw: (t) => `<ellipse cx="100" cy="130" rx="54" ry="54" fill="${t.main}"/>
      <path d="M100 96 L100 182" fill="none" stroke-width="3"/>`,
    spots: [[74, 122, 8], [126, 122, 8], [80, 156, 7], [120, 156, 7]],
    bugWings: (t) => pair(`<ellipse cx="54" cy="104" rx="24" ry="46" transform="rotate(-32 54 104)" fill="#ffffff" fill-opacity="0.75" stroke="${t.accent}"/>`),
  },
  // An egg-shaped bird with wings at its sides.
  bird: {
    head: { dx: 0, dy: 18, s: 1.15 }, wingsFront: true,
    draw: (t) => `<path d="M84 176 L78 190 M84 176 L88 190 M116 176 L112 190 M116 176 L122 190" fill="none" stroke="#e8902c" stroke-width="5"/>
      <ellipse cx="100" cy="116" rx="58" ry="66" fill="${t.main}"/>
      <ellipse cx="100" cy="142" rx="38" ry="34" fill="${t.belly}" stroke="none"/>`,
    smallWings: (t) => pair(`<ellipse cx="46" cy="128" rx="14" ry="30" transform="rotate(18 46 128)" fill="${t.accent}"/>`),
    spots: [[70, 92, 5], [132, 96, 5]],
  },
  // A lumpy, chunky rock.
  boulder: {
    head: { dx: 0, dy: 30, s: 1.08 }, tail: 'translate(26 6)',
    draw: (t) => `<ellipse cx="72" cy="184" rx="15" ry="8" fill="${t.main}"/>
      <ellipse cx="128" cy="184" rx="15" ry="8" fill="${t.main}"/>
      <path d="M36 178 L28 136 L48 94 L82 68 L124 66 L158 90 L174 136 L164 178 Z" fill="${t.main}"/>
      <path d="M72 176 L64 152 L84 140 L118 140 L138 154 L130 176 Z" fill="${t.belly}" stroke="none"/>`,
    spots: [[50, 142, 6], [152, 132, 7], [62, 108, 5], [144, 104, 4]],
  },
  // Big round bottom, smaller head, little flipper arms.
  pear: {
    head: { dx: 0, dy: -6, s: 0.9 }, round: true, tail: 'translate(24 0)',
    back: (t) => pair(`<ellipse cx="44" cy="134" rx="12" ry="24" transform="rotate(32 44 134)" fill="${t.main}"/>`),
    draw: (t) => `<ellipse cx="78" cy="184" rx="15" ry="8" fill="${t.main}"/>
      <ellipse cx="122" cy="184" rx="15" ry="8" fill="${t.main}"/>
      <ellipse cx="100" cy="146" rx="60" ry="42" fill="${t.main}"/>
      <ellipse cx="100" cy="156" rx="38" ry="25" fill="${t.belly}" stroke="none"/>`,
    spots: [[62, 150, 6], [138, 146, 6]],
  },
  // A round fish with a tail fin, face toward the front.
  fish: {
    head: { dx: -12, dy: 20, s: 1 },
    back: (t) => `<path d="M140 118 L188 80 Q176 118 188 156 Z" fill="${t.accent}"/>`,
    draw: (t) => `<ellipse cx="94" cy="118" rx="64" ry="50" fill="${t.main}"/>
      <ellipse cx="88" cy="142" rx="40" ry="20" fill="${t.belly}" stroke="none"/>`,
    fins: (t) => ({
      back: `<path d="M76 160 L62 188 L106 166 Z" fill="${t.accent}"/>`,
      front: `<path d="M124 124 Q150 132 140 156 Q122 148 124 124 Z" fill="${t.accent}"/>`,
    }),
    dorsal: (t) => `<path d="M58 80 Q86 28 126 76 Z" fill="${t.accent}"/>`,
    spots: [[120, 96, 6], [140, 112, 5], [128, 152, 4]],
  },
  // Standing on four legs, head to the front, tail at the back.
  quad: {
    head: { dx: -36, dy: 2, s: 0.85 }, round: true,
    tail: 'translate(162 126) scale(0.8) translate(-134 -162)',
    draw: (t) => `<rect x="58" y="142" width="22" height="46" rx="10" fill="${t.main}"/>
      <rect x="86" y="142" width="22" height="46" rx="10" fill="${t.main}"/>
      <rect x="122" y="142" width="22" height="46" rx="10" fill="${t.main}"/>
      <rect x="148" y="142" width="22" height="46" rx="10" fill="${t.main}"/>
      <ellipse cx="114" cy="134" rx="60" ry="36" fill="${t.main}"/>
      <ellipse cx="116" cy="152" rx="36" ry="14" fill="${t.belly}" stroke="none"/>`,
    spots: [[108, 120, 7], [134, 140, 6], [152, 118, 5]],
  },
  // A chubby five-pointed star.
  star: {
    head: { dx: 0, dy: 22, s: 0.9 }, wings: 'translate(0 -16)',
    draw: (t) => `<polygon points="${starPoints(100, 114, 84, 46, 5)}" fill="${t.main}"/>
      <circle cx="100" cy="126" r="28" fill="${t.belly}" stroke="none"/>`,
    spots: [[44, 92, 5], [156, 92, 5], [66, 166, 5], [134, 166, 5]],
  },
  // A snail: a big spiral shell on a long foot, head out in front.
  snail: {
    head: { dx: -44, dy: 26, s: 0.68 }, round: true,
    draw: (t) => `<path d="M26 184 Q22 150 50 140 L150 150 Q188 158 186 184 Z" fill="${t.main}"/>
      <circle cx="124" cy="116" r="52" fill="${t.accent}"/>
      <path d="M124 116 a7 7 0 1 1 14 0 a14 14 0 1 1 -28 0 a21 21 0 1 1 42 0 a28 28 0 1 1 -56 0 a35 35 0 1 1 70 0" fill="none"/>`,
    spots: [[100, 82, 6], [160, 140, 6], [92, 150, 5]], spotFill: (t) => t.belly,
  },
  // A jellyfish: a round dome with wavy tentacles.
  jelly: {
    head: { dx: 0, dy: 4, s: 1.1 },
    back: (t) => [62, 82, 100, 118, 138].map((x, i) => {
      const d = `M${x} 116 q${i % 2 ? 8 : -8} 16 0 32 q${i % 2 ? -8 : 8} 16 0 32`;
      return `<path d="${d}" fill="none" stroke-width="12"/><path d="${d}" fill="none" stroke="${t.belly}" stroke-width="6"/>`;
    }).join(''),
    draw: (t) => `<path d="M32 124 Q32 44 100 44 Q168 44 168 124 Q151 136 134 124 Q117 136 100 124 Q83 136 66 124 Q49 136 32 124 Z" fill="${t.main}"/>
      <ellipse cx="70" cy="70" rx="13" ry="7" transform="rotate(-30 70 70)" fill="#ffffff" fill-opacity="0.6" stroke="none"/>`,
    spots: [[56, 98, 6], [146, 96, 6], [128, 60, 4]], spotFill: (t) => t.belly,
  },
  // A mushroom: a wide cap over a stem with a face.
  mushroom: {
    head: { dx: 0, dy: 48, s: 0.85 },
    draw: (t) => `<path d="M66 98 L134 98 Q146 150 140 186 L60 186 Q54 150 66 98 Z" fill="${t.belly}"/>
      <path d="M16 104 Q18 24 100 22 Q182 24 184 104 Q100 122 16 104 Z" fill="${t.main}"/>`,
    spots: [[58, 66, 10], [100, 42, 9], [142, 66, 10], [82, 92, 6], [120, 92, 6]], spotFill: () => '#ffffff',
  },
  // A turtle: a domed shell on four stubby legs, head out in front.
  turtle: {
    head: { dx: -50, dy: 32, s: 0.66 }, round: true,
    draw: (t) => `<ellipse cx="66" cy="176" rx="13" ry="11" fill="${t.main}"/>
      <ellipse cx="96" cy="180" rx="13" ry="10" fill="${t.main}"/>
      <ellipse cx="136" cy="180" rx="13" ry="10" fill="${t.main}"/>
      <ellipse cx="164" cy="176" rx="13" ry="11" fill="${t.main}"/>
      <path d="M180 160 L196 166 L180 170 Z" fill="${t.main}"/>
      <path d="M44 164 Q46 80 116 78 Q186 80 188 164 Z" fill="${t.accent}"/>
      <path d="M100 108 L132 108 L146 134 L132 160 L100 160 L86 134 Z M100 108 L84 84 M132 108 L148 84 M86 134 L50 134 M146 134 L184 134" fill="none" stroke-width="3"/>
      <rect x="40" y="158" width="152" height="12" rx="6" fill="${t.belly}"/>`,
    spots: [[68, 112, 6], [164, 112, 6], [116, 92, 5]], spotFill: (t) => t.belly,
  },
  // An octopus: a big round head with six curly arms.
  octo: {
    head: { dx: 0, dy: -2, s: 1.2 },
    back: (t) => {
      const arms = ['M64 116 C44 150 30 170 16 166 C6 162 10 150 20 154',
        'M78 128 C70 160 60 180 46 184 C36 186 36 174 46 174',
        'M94 134 C96 160 92 178 82 188 C74 194 70 182 78 180'];
      const one = arms.map((d) => `<path d="${d}" fill="none" stroke-width="20"/><path d="${d}" fill="none" stroke="${t.main}" stroke-width="13"/>`).join('');
      return pair(one);
    },
    draw: (t) => `<circle cx="100" cy="86" r="56" fill="${t.main}"/>`,
    spots: [[62, 62, 6], [140, 58, 7], [152, 96, 5]],
  },
  // A puffy cloud.
  cloud: {
    head: { dx: 0, dy: 30, s: 1 },
    draw: (t) => {
      const puffs = [[54, 132, 32], [84, 100, 38], [124, 94, 40], [154, 128, 30], [100, 142, 40]];
      return puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.main}" stroke-width="7"/>`).join('')
        + puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.main}" stroke="none"/>`).join('');
    },
    spots: [[150, 110, 5], [70, 110, 4]], spotFill: () => '#ffffff',
  },
  // A cactus: a tall rounded column with two arms.
  cactus: {
    head: { dx: 0, dy: 22, s: 0.9 },
    back: (t) => ['M64 120 L46 120 Q38 120 38 112 L38 86', 'M136 136 L154 136 Q162 136 162 128 L162 104']
      .map((d) => `<path d="${d}" fill="none" stroke-width="22"/><path d="${d}" fill="none" stroke="${t.main}" stroke-width="15"/>`).join(''),
    draw: (t) => `<rect x="62" y="48" width="76" height="140" rx="38" fill="${t.main}"/>
      <path d="M82 70 L82 180 M118 70 L118 180" fill="none" stroke="${t.accent}" stroke-width="3" opacity="0.5"/>`,
    spots: [[72, 72, 2.5], [128, 66, 2.5], [70, 150, 2.5], [130, 160, 2.5], [100, 180, 2.5], [72, 116, 2.5], [130, 110, 2.5], [38, 92, 2.5], [162, 112, 2.5]],
    spotFill: () => OUT,
  },
  // A crab: a wide shell, big claws and little legs.
  crab: {
    head: { dx: 0, dy: 40, s: 0.95 },
    back: (t) => pair(`<path d="M52 150 L24 164 M58 162 L34 182 M72 170 L58 190" fill="none" stroke-width="6"/>
      <path d="M58 118 Q34 106 34 84" fill="none" stroke-width="14"/><path d="M58 118 Q34 106 34 84" fill="none" stroke="${t.main}" stroke-width="8"/>
      <path d="M34 48 Q10 50 12 76 Q16 94 36 92 L28 74 L48 66 Q48 50 34 48 Z" fill="${t.main}"/>`),
    draw: (t) => `<ellipse cx="100" cy="134" rx="66" ry="42" fill="${t.main}"/>
      <ellipse cx="100" cy="152" rx="40" ry="18" fill="${t.belly}" stroke="none"/>`,
    spots: [[56, 124, 6], [144, 124, 6], [100, 98, 5]],
  },
  // A seal lying down, with flippers.
  seal: {
    head: { dx: -22, dy: 26, s: 0.95 }, round: true,
    back: (t) => `<ellipse cx="178" cy="140" rx="18" ry="9" transform="rotate(-30 178 140)" fill="${t.main}"/>
      <ellipse cx="180" cy="160" rx="18" ry="9" transform="rotate(20 180 160)" fill="${t.main}"/>`,
    draw: (t) => `<ellipse cx="112" cy="148" rx="66" ry="36" fill="${t.main}"/>
      <ellipse cx="116" cy="164" rx="44" ry="16" fill="${t.belly}" stroke="none"/>
      <ellipse cx="96" cy="182" rx="20" ry="8" transform="rotate(16 96 182)" fill="${t.main}"/>`,
    spots: [[128, 128, 6], [152, 146, 5], [140, 120, 4]],
  },
  // A long, curled-up dragon.
  serpent: {
    head: { dx: 0, dy: -14, s: 0.82 }, round: true,
    tail: 'translate(8 56)', wings: 'translate(0 -34)',
    draw: (t) => `<path d="${SERPENT}" fill="none" stroke-width="36"/>
      <path d="${SERPENT}" fill="none" stroke="${t.main}" stroke-width="29"/>`,
    spots: [[70, 176, 5], [120, 132, 5]],
  },
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

export function creatureSVG(c) {
  const t = TYPES[c.type];
  const B = BODIES[c.parts.body] || BODIES.chibi;
  const has = (x) => c.parts.extras.includes(x);
  const { top } = R;
  const H = B.head;
  const headT = `translate(${100 + H.dx} ${88 + H.dy}) scale(${H.s}) translate(-100 -88)`;

  const back = [];      // behind everything
  const headBack = [];  // behind the head (ears, hair, hats that sit behind)
  const body = [];
  const bodyFront = [];
  const headFront = []; // face and things on the head

  // ---------- Tails and wings ----------
  const tail = [];
  if (c.parts.tail === 'fluffy') {
    tail.push(`<ellipse cx="146" cy="142" rx="17" ry="32" transform="rotate(40 146 142)" fill="${t.main}"/>
      <ellipse cx="162" cy="120" rx="10" ry="13" transform="rotate(40 162 120)" fill="${t.belly}"/>`);
  }
  if (c.parts.tail === 'thin') {
    tail.push(`<path d="M134 162 C170 162 174 130 160 108" fill="none" stroke-width="15"/>
      <path d="M134 162 C170 162 174 130 160 108" fill="none" stroke="${t.main}" stroke-width="8"/>`);
  }
  if (c.parts.tail === 'bolt') {
    tail.push(`<path d="M128 160 L150 126 L140 124 L164 92 L158 120 L170 122 L140 166 Z" fill="${t.accent}"/>`);
  }
  if (c.parts.tail === 'puff') tail.push(`<circle cx="142" cy="166" r="15" fill="${t.belly}"/>`);
  if (has('tail-flame')) tail.push(flame(164, 104, 0.9, '#ff4d2e', t.accent));
  if (has('tail-leaf')) tail.push(leaf(156, 112, -70, t.accent));
  if (tail.length) back.push(g(B.tail, tail.join('')));

  if (has('tail-feathers')) {
    back.push(`<g fill="${t.accent}">
      <ellipse cx="160" cy="160" rx="10" ry="26" transform="rotate(52 160 160)"/>
      <ellipse cx="166" cy="142" rx="10" ry="26" transform="rotate(72 166 142)"/>
      <ellipse cx="164" cy="124" rx="9" ry="22" transform="rotate(92 164 124)"/></g>`);
  }
  if (has('wings-big')) {
    back.push(g(B.wings, pair(`<path d="M74 110 C56 66 20 50 8 70 C0 86 16 96 12 108 C8 120 24 128 22 138 C40 144 60 140 76 132 Z" fill="${t.accent}"/>
      <path d="M62 108 L30 80 M60 122 L24 112" stroke-width="2.5" fill="none"/>`)));
  }
  if (has('wings') || c.parts.wings) {
    if (B.wingsFront) bodyFront.push(B.smallWings(t));
    else {
      back.push(g(B.wings, pair(`<ellipse cx="52" cy="138" rx="18" ry="34" transform="rotate(30 52 138)" fill="${t.accent}"/>
        <path d="M44 128 L58 150" stroke-width="2.5" fill="none"/>`)));
    }
  }
  if (has('bug-wings')) {
    back.push(B.bugWings ? B.bugWings(t)
      : pair(`<ellipse cx="54" cy="74" rx="24" ry="40" transform="rotate(-38 54 74)" fill="#ffffff" fill-opacity="0.75" stroke="${t.accent}"/>`));
  }
  if (has('fins')) {
    if (B.fins) {
      const f = B.fins(t);
      back.push(f.back);
      bodyFront.push(f.front);
    } else {
      back.push(pair(`<path d="M40 120 L12 98 L16 142 Z" fill="${t.accent}"/>`));
    }
  }
  if (has('dorsal')) back.push(B.dorsal ? B.dorsal(t) : `<path d="M78 66 Q98 22 126 68 Z" fill="${t.accent}"/>`);
  if (has('back-spikes')) {
    // Plates along the top of a four-legged body.
    for (const x of [96, 120, 144]) {
      const y = 134 - 36 * Math.sqrt(1 - ((x - 114) / 60) ** 2);
      back.push(`<polygon points="${x - 11},${(y + 8).toFixed(1)} ${x},${(y - 18).toFixed(1)} ${x + 11},${(y + 8).toFixed(1)}" fill="${t.accent}"/>`);
    }
  }
  if (has('rain')) {
    for (const [x, y] of [[40, 178], [160, 176], [24, 154]]) {
      back.push(`<path d="M${x} ${y - 11} Q${x + 8} ${y} ${x} ${y + 7} Q${x - 8} ${y} ${x} ${y - 11} Z" fill="#4aa8ff" stroke-width="2.5"/>`);
    }
  }
  if (B.back) back.push(B.back(t));

  // ---------- Behind the head ----------
  if (has('mane')) headBack.push(`<polygon points="${starPoints(100, 88, 68, 46, 14)}" fill="${t.accent}"/>`);
  if (has('petals')) {
    for (let i = 0; i < 10; i++) {
      const a = (360 * i) / 10;
      headBack.push(`<ellipse cx="100" cy="${88 - 52}" rx="15" ry="22" transform="rotate(${a} 100 88)" fill="${t.accent}"/>`);
    }
  }
  if (has('rainbow-mane')) {
    const colors = ['#ff6b6b', '#ff9f1c', '#ffd23f', '#5cc96b', '#4aa8ff', '#b388ff'];
    colors.forEach((col, i) => {
      const a = ((-70 + i * 26) * Math.PI) / 180;
      headBack.push(`<circle cx="${(100 + 46 * Math.cos(a)).toFixed(1)}" cy="${(88 + 46 * Math.sin(a)).toFixed(1)}" r="15" fill="${col}"/>`);
    });
  }
  if (has('antennae')) {
    headBack.push(pair(`<path d="M88 ${top + 8} Q82 ${top - 18} 68 ${top - 26}" fill="none"/>
      <circle cx="68" cy="${top - 26}" r="7" fill="${t.accent}"/>`));
  }
  if (has('crest')) {
    headBack.push(`<ellipse cx="86" cy="${top - 8}" rx="7" ry="20" transform="rotate(-28 86 ${top - 8})" fill="${t.accent}"/>
      <ellipse cx="114" cy="${top - 8}" rx="7" ry="20" transform="rotate(28 114 ${top - 8})" fill="${t.accent}"/>
      <ellipse cx="100" cy="${top - 14}" rx="8" ry="22" fill="${t.accent}"/>`);
  }
  if (has('tuft')) {
    headBack.push(`<ellipse cx="93" cy="${top - 2}" rx="5" ry="12" transform="rotate(-22 93 ${top - 2})" fill="${t.main}"/>
      <ellipse cx="107" cy="${top - 2}" rx="5" ry="12" transform="rotate(22 107 ${top - 2})" fill="${t.main}"/>
      <ellipse cx="100" cy="${top - 5}" rx="5" ry="13" fill="${t.main}"/>`);
  }
  if (has('spikes')) {
    for (const deg of [-62, -31, 0, 31, 62]) {
      const a = ((deg - 90) * Math.PI) / 180;
      const p = (rad, off) => `${(100 + rad * Math.cos(a + off)).toFixed(1)},${(88 + rad * Math.sin(a + off)).toFixed(1)}`;
      headBack.push(`<polygon points="${p(42, -0.2)} ${p(64, 0)} ${p(42, 0.2)}" fill="${t.accent}"/>`);
    }
  }
  if (has('flame-tuft')) headBack.push(flame(100, top - 12, 1, '#ff4d2e', t.accent));
  if (has('sprout')) {
    headBack.push(`<path d="M100 ${top + 6} L100 ${top - 14}" fill="none" stroke-width="4"/>`);
    headBack.push(leaf(100, top - 14, -155, t.accent), leaf(100, top - 14, -25, t.accent));
  }
  const ears = c.parts.ears;
  if (ears === 'pointy') {
    headBack.push(pair(`<path d="M60 72 L64 24 L98 50 Z" fill="${t.main}"/>
      <path d="M67 62 L69 38 L87 51 Z" fill="${t.belly}" stroke="none"/>`));
  }
  if (ears === 'long') {
    headBack.push(pair(`<ellipse cx="78" cy="38" rx="12" ry="32" transform="rotate(-14 78 38)" fill="${t.main}"/>
      <ellipse cx="78" cy="42" rx="6" ry="22" transform="rotate(-14 78 42)" fill="${t.belly}" stroke="none"/>`));
  }
  if (ears === 'round') {
    headBack.push(pair(`<circle cx="62" cy="54" r="18" fill="${t.main}"/>
      <circle cx="62" cy="54" r="9" fill="${t.belly}" stroke="none"/>`));
  }
  if (ears === 'droopy') {
    // Puppy ears that fold down the sides of the head.
    headBack.push(pair(`<path d="M70 48 Q42 44 38 94 Q52 96 82 54 Z" fill="${t.accent}"/>`));
  }
  if (ears === 'floppy') {
    headBack.push(pair(`<ellipse cx="50" cy="92" rx="24" ry="34" transform="rotate(12 50 92)" fill="${t.main}"/>
      <ellipse cx="52" cy="94" rx="14" ry="22" transform="rotate(12 52 94)" fill="${t.belly}" stroke="none"/>`));
  }

  // ---------- Body ----------
  body.push(B.draw(t));
  if (has('stripes') && B.stripes) body.push(`<path d="${B.stripes}" fill="none" stroke-width="11"/>`);
  if (has('scarf')) {
    headFront.push(`<path d="M114 132 L128 166 L110 162 Z" fill="${t.accent}"/>
      <path d="M62 124 Q100 142 138 124 L138 136 Q100 154 62 136 Z" fill="${t.accent}"/>`);
  }
  if (B.round) headFront.push(`<circle cx="100" cy="88" r="46" fill="${t.main}"/>`);
  if (has('spots')) {
    const fill = B.spotFill ? B.spotFill(t) : t.accent;
    // Spots on a mushroom cap go under its face; everywhere else they sit on top.
    (B.spotFill ? body : bodyFront).push(B.spots.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="none"/>`).join(''));
  }

  // ---------- On the head ----------
  let eyes = [[100 - R.eyeX, R.eyeY], [100 + R.eyeX, R.eyeY]];
  if (has('eye-bumps')) {
    eyes = [[81, 56], [119, 56]];
    headFront.push(`<circle cx="81" cy="56" r="16" fill="${t.main}"/><circle cx="119" cy="56" r="16" fill="${t.main}"/>`);
  }
  if (has('horn')) headFront.push(`<path d="M91 ${top + 14} L100 ${top - 24} L109 ${top + 14} Z" fill="#fff4d6"/>`);
  if (has('crown')) {
    headFront.push(`<path d="M78 ${top + 8} L80 ${top - 14} L90 ${top - 2} L100 ${top - 20} L110 ${top - 2} L120 ${top - 14} L122 ${top + 8} Z" fill="#ffd23f"/>`);
  }
  if (has('flower')) {
    const fy = top - 6;
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      headFront.push(`<circle cx="${(100 + 9 * Math.cos(a)).toFixed(1)}" cy="${(fy + 9 * Math.sin(a)).toFixed(1)}" r="7.5" fill="#ff8fab"/>`);
    }
    headFront.push(`<circle cx="100" cy="${fy}" r="5.5" fill="#ffd23f"/>`);
  }
  const m = R.mark;
  if (has('snowflake')) {
    headFront.push(`<g stroke="${t.accent}" stroke-width="3.5">
      <path d="M100 ${m - 10} L100 ${m + 10}"/><path d="M91 ${m - 5} L109 ${m + 5}"/><path d="M91 ${m + 5} L109 ${m - 5}"/></g>`);
  }
  if (has('star-mark')) headFront.push(`<polygon points="${starPoints(100, m, 11, 4.8, 5)}" fill="#ffe066" stroke-width="2.5"/>`);
  if (has('moon-mark')) {
    headFront.push(`<path d="M104 ${m - 12} A12 12 0 1 0 104 ${m + 12} A9 9 0 1 1 104 ${m - 12} Z" fill="#ffe066" stroke-width="2.5"/>`);
  }
  if (has('bolt-mark')) {
    headFront.push(`<path d="M103 ${m - 13} L91 ${m + 2} L100 ${m + 2} L96 ${m + 15} L109 ${m - 2} L100 ${m - 2} Z" fill="${t.accent}" stroke-width="2.5"/>`);
  }

  // ---------- Face ----------
  headFront.push(`<ellipse cx="${100 - R.cheekX}" cy="${R.cheekY}" rx="8" ry="5" fill="#ff8fab" fill-opacity="0.6" stroke="none"/>
    <ellipse cx="${100 + R.cheekX}" cy="${R.cheekY}" rx="8" ry="5" fill="#ff8fab" fill-opacity="0.6" stroke="none"/>`);
  for (const [x, y] of eyes) {
    if (has('owl-eyes')) headFront.push(`<circle cx="${x}" cy="${y}" r="15" fill="#ffffff" stroke-width="3"/>`);
    headFront.push(`<circle cx="${x}" cy="${y}" r="9" fill="${OUT}" stroke="none"/>
      <circle cx="${x - 3}" cy="${y - 3}" r="3.4" fill="#fff" stroke="none"/>`);
  }
  const my = R.mouthY;
  if (has('beak')) {
    headFront.push(`<path d="M89 ${my - 8} L111 ${my - 8} L100 ${my + 7} Z" fill="#ffb347" stroke-width="2.5"/>`);
  } else if (has('trunk')) {
    if (has('tusks')) {
      headFront.push(pair(`<path d="M84 ${my + 2} C80 ${my + 18} 86 ${my + 26} 94 ${my + 26}" fill="none" stroke-width="9"/>
        <path d="M84 ${my + 2} C80 ${my + 18} 86 ${my + 26} 94 ${my + 26}" fill="none" stroke="#fffaf0" stroke-width="4"/>`));
    }
    const d = `M100 ${my - 10} C100 ${my + 14} 96 ${my + 30} 110 ${my + 34}`;
    headFront.push(`<path d="${d}" fill="none" stroke-width="17"/><path d="${d}" fill="none" stroke="${t.main}" stroke-width="10"/>`);
  } else if (has('wide-mouth')) {
    headFront.push(`<path d="M78 ${my - 2} Q100 ${my + 16} 122 ${my - 2}" fill="none" stroke-width="3"/>`);
  } else {
    if (has('tongue')) headFront.push(`<path d="M95 ${my + 3} Q95 ${my + 18} 100 ${my + 18} Q105 ${my + 18} 105 ${my + 3} Z" fill="#ff6b8a" stroke-width="2.5"/>`);
    headFront.push(`<path d="M93 ${my} Q100 ${my + 7} 107 ${my}" fill="none" stroke-width="3"/>`);
  }
  if (has('whiskers')) {
    headFront.push(pair(`<g stroke-width="2.5" fill="none">
      <path d="M${100 - R.cheekX - 8} ${R.cheekY - 4} L${100 - R.cheekX - 30} ${R.cheekY - 10}"/>
      <path d="M${100 - R.cheekX - 8} ${R.cheekY + 2} L${100 - R.cheekX - 30} ${R.cheekY + 4}"/></g>`));
  }

  const s = c.size;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g transform="translate(100 194) scale(${s}) translate(-100 -194)" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
${back.join('')}${g(headT, headBack.join(''))}${body.join('')}${g(headT, headFront.join(''))}${bodyFront.join('')}
</g></svg>`;
}
