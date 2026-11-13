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
};

export const RARITY = {
  common: { label: 'Common', weight: 6, stars: 1 },
  rare: { label: 'Rare', weight: 3, stars: 2 },
  super: { label: 'Super rare', weight: 1, stars: 3 },
};

const FAMILIES = [
  { type: 'fire', rarity: 'common', parts: { body: 'chibi', ears: 'pointy', tail: 'fluffy' }, forms: [
    { name: 'Embit', extras: ['flame-tuft'] },
    { name: 'Flarefox', extras: ['flame-tuft', 'tail-flame'] },
    { name: 'Blazetail', extras: ['flame-tuft', 'tail-flame', 'mane'] },
  ] },
  { type: 'water', rarity: 'common', parts: { body: 'blob' }, forms: [
    { name: 'Puddlet', extras: ['eye-bumps', 'wide-mouth'] },
    { name: 'Bubbletoad', extras: ['eye-bumps', 'wide-mouth', 'spots'] },
    { name: 'Splashking', extras: ['eye-bumps', 'wide-mouth', 'spots', 'crown'] },
  ] },
  { type: 'leaf', rarity: 'common', parts: { body: 'chibi', ears: 'pointy', tail: 'thin' }, forms: [
    { name: 'Sproutle', extras: ['sprout'] },
    { name: 'Leaflynx', extras: ['sprout', 'tail-leaf'] },
    { name: 'Thornwhisk', extras: ['flower', 'tail-leaf', 'whiskers'] },
  ] },
  { type: 'spark', rarity: 'common', parts: { body: 'blob' }, forms: [
    { name: 'Zipbug', extras: ['antennae'] },
    { name: 'Voltbeetle', extras: ['antennae', 'bug-wings'] },
    { name: 'Thunderhorn', extras: ['bug-wings', 'horn', 'spots'] },
  ] },
  { type: 'sky', rarity: 'common', parts: { body: 'chibi', wings: true }, forms: [
    { name: 'Fluffle', extras: ['beak', 'tuft'] },
    { name: 'Breezewing', extras: ['beak', 'tuft'] },
    { name: 'Skysoar', extras: ['beak', 'crest'] },
  ] },
  { type: 'rock', rarity: 'rare', parts: { body: 'chibi', ears: 'long' }, forms: [
    { name: 'Pebbo', extras: ['spots'] },
    { name: 'Boulderbun', extras: ['spots', 'spikes'] },
    { name: 'Craghorn', extras: ['spikes', 'horn'] },
  ] },
  { type: 'frost', rarity: 'rare', parts: { body: 'chibi', ears: 'round' }, forms: [
    { name: 'Snowmite', extras: ['snowflake'] },
    { name: 'Frostpaw', extras: ['snowflake', 'scarf'] },
    { name: 'Glacierbear', extras: ['snowflake', 'scarf', 'mane'] },
  ] },
  { type: 'water', rarity: 'rare', parts: { body: 'blob' }, forms: [
    { name: 'Finny', extras: ['fins'] },
    { name: 'Wavefin', extras: ['fins', 'dorsal'] },
    { name: 'Tidalray', extras: ['fins', 'dorsal', 'whiskers'] },
  ] },
  { type: 'leaf', rarity: 'rare', parts: { body: 'chibi', ears: 'round' }, forms: [
    { name: 'Mossling', extras: ['trunk', 'sprout'] },
    { name: 'Mossmammoth', extras: ['trunk', 'tusks', 'flower'] },
  ] },
  { type: 'spark', rarity: 'rare', parts: { body: 'chibi', ears: 'pointy', tail: 'fluffy' }, forms: [
    { name: 'Sparkpup', extras: ['bolt-mark'] },
    { name: 'Zapwolf', extras: ['bolt-mark', 'mane'] },
  ] },
  { type: 'star', rarity: 'super', parts: { body: 'chibi', ears: 'pointy', tail: 'fluffy' }, forms: [
    { name: 'Twinklet', extras: ['star-mark'] },
    { name: 'Nebulynx', extras: ['star-mark', 'mane', 'wings'] },
  ] },
  { type: 'fire', rarity: 'super', parts: { body: 'chibi', wings: true }, forms: [
    { name: 'Emberwing', extras: ['beak', 'crest', 'mane'] },
  ] },
];

const SIZES = [0.78, 0.9, 1];

export const CREATURES = FAMILIES.flatMap((fam, family) =>
  fam.forms.map((form, stage) => ({
    id: form.name.toLowerCase(),
    name: form.name,
    type: fam.type,
    rarity: fam.rarity,
    family,
    stage,
    parts: { ...fam.parts, extras: form.extras },
    // Later forms are drawn bigger. A family's last form is always full size.
    size: SIZES[stage + (3 - fam.forms.length)],
  }))
).map((c, i) => ({ ...c, num: i + 1 }));

export const FAMILY_COUNT = FAMILIES.length;
export const byId = (id) => CREATURES.find((c) => c.id === id);
export const previousForm = (c) =>
  CREATURES.find((p) => p.family === c.family && p.stage === c.stage - 1) || null;
export const numberLabel = (c) => `#${String(c.num).padStart(3, '0')}`;
