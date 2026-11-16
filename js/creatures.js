// The game's own collectible critters. Each family evolves through 1–3 forms.
// Artwork is drawn in code from the parts listed here (see creature-art.js).

export const TYPES = {
  fire:  { label: 'Fire',  icon: '🔥', main: '#ff7a45', belly: '#ffe0c2', accent: '#ffc93c' },
  water: { label: 'Water', icon: '💧', main: '#4aa8ff', belly: '#d9efff', accent: '#2f6fd6' },
  leaf:  { label: 'Leaf',  icon: '🌿', main: '#5cc96b', belly: '#e3f7cf', accent: '#2e9b48' },
  spark: { label: 'Spark', icon: '⚡', main: '#ffd23f', belly: '#fff5cc', accent: '#ff9f1c' },
  sky:   { label: 'Sky',   icon: '☁️', main: '#8fd0ff', belly: '#ffffff', accent: '#5d9ee8' },
  rock:  { label: 'Rock',  icon: '🪨', main: '#b08968', belly: '#ecd5bd', accent: '#7f5539' },
  frost: { label: 'Frost', icon: '❄️', main: '#a8e6f0', belly: '#f2fcff', accent: '#4fb6d3' },
  star:  { label: 'Star',  icon: '✨', main: '#b388ff', belly: '#f3e7ff', accent: '#ff7ccf' },
  bloom: { label: 'Bloom', icon: '🌸', main: '#ff8fc7', belly: '#ffe6f2', accent: '#ffd23f' },
  moon:  { label: 'Moon',  icon: '🌙', main: '#6c70b8', belly: '#e4e2ff', accent: '#ffd23f' },
  sand:  { label: 'Sand',  icon: '🏜️', main: '#e9b872', belly: '#fff1d6', accent: '#d1773b' },
};

export const RARITY = {
  common: { label: 'Common', weight: 6, stars: 1 },
  rare: { label: 'Rare', weight: 3, stars: 2 },
  super: { label: 'Super rare', weight: 1, stars: 3 },
};

// Body shapes: chibi (big head on a small body), blob, bulb (turnip), bug
// (beetle shell), bird (egg), boulder, pear (big bottom), fish, quad (four
// legs), star and serpent. A form can change its family's parts, so a critter
// can change shape when it evolves.
const LETTER_FAMILIES = [
  { type: 'fire', rarity: 'common', parts: { body: 'chibi', ears: 'pointy', tail: 'fluffy' }, forms: [
    { name: 'Embit', extras: ['flame-tuft'] },
    { name: 'Flarefox', extras: ['flame-tuft', 'tail-flame'] },
    { name: 'Blazetail', extras: ['flame-tuft', 'tail-flame', 'mane', 'whiskers'] },
  ] },
  { type: 'water', rarity: 'common', parts: { body: 'blob' }, forms: [
    { name: 'Puddlet', extras: ['eye-bumps', 'wide-mouth'] },
    { name: 'Bubbletoad', extras: ['eye-bumps', 'wide-mouth', 'spots'] },
    { name: 'Splashking', extras: ['eye-bumps', 'wide-mouth', 'spots', 'crown'] },
  ] },
  { type: 'leaf', rarity: 'common', parts: { body: 'bulb' }, forms: [
    { name: 'Sproutle', extras: ['sprout'] },
    { name: 'Leaflynx', parts: { ears: 'pointy', tail: 'thin' }, extras: ['sprout', 'tail-leaf'] },
    { name: 'Thornwhisk', parts: { ears: 'pointy', tail: 'thin' }, extras: ['flower', 'tail-leaf', 'whiskers', 'spots'] },
  ] },
  { type: 'spark', rarity: 'common', parts: { body: 'bug' }, forms: [
    { name: 'Zipbug', extras: ['antennae'] },
    { name: 'Voltbeetle', extras: ['antennae', 'bug-wings'] },
    { name: 'Thunderhorn', extras: ['bug-wings', 'horn', 'spots'] },
  ] },
  { type: 'sky', rarity: 'common', parts: { body: 'bird' }, forms: [
    { name: 'Fluffle', extras: ['beak', 'tuft', 'wings'] },
    { name: 'Breezewing', extras: ['beak', 'tuft', 'wings', 'tail-feathers'] },
    { name: 'Skysoar', extras: ['beak', 'crest', 'wings-big', 'tail-feathers'] },
  ] },
  { type: 'rock', rarity: 'rare', parts: { body: 'boulder', ears: 'long' }, forms: [
    { name: 'Pebbo', extras: ['spots'] },
    { name: 'Boulderbun', extras: ['spots', 'spikes'] },
    { name: 'Craghorn', parts: { ears: null }, extras: ['spikes', 'horn', 'spots'] },
  ] },
  { type: 'frost', rarity: 'rare', parts: { body: 'pear', ears: 'round' }, forms: [
    { name: 'Snowmite', extras: ['snowflake'] },
    { name: 'Frostpaw', extras: ['snowflake', 'scarf'] },
    { name: 'Glacierbear', parts: { body: 'quad' }, extras: ['snowflake', 'spikes'] },
  ] },
  { type: 'water', rarity: 'rare', parts: { body: 'fish' }, forms: [
    { name: 'Finny', extras: ['fins'] },
    { name: 'Wavefin', extras: ['fins', 'dorsal'] },
    { name: 'Tidalray', extras: ['fins', 'dorsal', 'whiskers', 'spots'] },
  ] },
  { type: 'leaf', rarity: 'rare', parts: { body: 'quad', ears: 'floppy' }, forms: [
    { name: 'Mossling', extras: ['trunk', 'sprout'] },
    { name: 'Mossmammoth', extras: ['trunk', 'tusks', 'flower'] },
  ] },
  { type: 'spark', rarity: 'rare', parts: { body: 'quad', ears: 'droopy', tail: 'bolt' }, forms: [
    { name: 'Sparkpup', extras: ['bolt-mark', 'tongue'] },
    { name: 'Zapwolf', extras: ['bolt-mark', 'tongue', 'spikes', 'spots'] },
  ] },
  { type: 'star', rarity: 'super', parts: { body: 'star' }, forms: [
    { name: 'Twinklet', extras: ['star-mark'] },
    { name: 'Nebulynx', extras: ['star-mark', 'wings-big', 'spots', 'whiskers'] },
  ] },
  { type: 'fire', rarity: 'super', parts: { body: 'serpent' }, forms: [
    { name: 'Emberwing', extras: ['crest', 'wings-big', 'tail-flame', 'whiskers'] },
  ] },
];

const SIZES = [0.78, 0.9, 1];

// Turns a list of families into a numbered critter set with lookups.
export function buildSet(families) {
  const creatures = families.flatMap((fam, family) =>
    fam.forms.map((form, stage) => ({
      id: form.name.toLowerCase(),
      name: form.name,
      type: fam.type,
      rarity: fam.rarity,
      family,
      stage,
      parts: { ...fam.parts, ...form.parts, extras: form.extras },
      // Later forms are drawn bigger. A family's last form is always full size.
      size: SIZES[stage + (3 - fam.forms.length)],
    }))
  ).map((c, i) => ({ ...c, num: i + 1 }));

  return {
    creatures,
    familyCount: families.length,
    byId: (id) => creatures.find((c) => c.id === id),
    previousForm: (c) => creatures.find((p) => p.family === c.family && p.stage === c.stage - 1) || null,
  };
}

// The critters found in Find the Letter.
export const LETTER_SET = buildSet(LETTER_FAMILIES);
export const numberLabel = (c) => `#${String(c.num).padStart(3, '0')}`;
