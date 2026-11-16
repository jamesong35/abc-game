// The critters found in Find the Word: their own set of 50, separate from the
// letter critters. Drawn in code from their parts (see creature-art.js).
import { buildSet } from './creatures.js';

const WORD_FAMILIES = [
  { type: 'leaf', rarity: 'common', parts: { body: 'snail' }, forms: [
    { name: 'Snailby', extras: ['antennae'] },
    { name: 'Shellsworth', extras: ['antennae', 'spots'] },
    { name: 'Spiralord', extras: ['antennae', 'spots', 'crown'] },
  ] },
  { type: 'water', rarity: 'common', parts: { body: 'jelly' }, forms: [
    { name: 'Jellop', extras: [] },
    { name: 'Wobblejelly', extras: ['spots'] },
    { name: 'Glowjelly', extras: ['spots', 'star-mark'] },
  ] },
  { type: 'bloom', rarity: 'common', parts: { body: 'mushroom' }, forms: [
    { name: 'Mushie', extras: ['spots'] },
    { name: 'Capling', extras: ['spots', 'wide-mouth'] },
    { name: 'Fungiant', extras: ['spots', 'wide-mouth', 'whiskers'] },
  ] },
  { type: 'moon', rarity: 'common', parts: { body: 'bird' }, forms: [
    { name: 'Hootling', extras: ['owl-eyes', 'beak', 'wings'] },
    { name: 'Owlbert', parts: { ears: 'pointy' }, extras: ['owl-eyes', 'beak', 'wings'] },
    { name: 'Moonowl', parts: { ears: 'pointy' }, extras: ['owl-eyes', 'beak', 'wings-big', 'moon-mark'] },
  ] },
  { type: 'water', rarity: 'common', parts: { body: 'turtle' }, forms: [
    { name: 'Tortle', extras: [] },
    { name: 'Shellback', extras: ['spots'] },
    { name: 'Tidalturtle', extras: ['spots', 'horn'] },
  ] },
  { type: 'star', rarity: 'common', parts: { body: 'octo' }, forms: [
    { name: 'Inky', extras: [] },
    { name: 'Octopop', extras: ['spots'] },
    { name: 'Krakid', extras: ['spots', 'crown'] },
  ] },
  { type: 'moon', rarity: 'common', parts: { body: 'chibi', ears: 'long', tail: 'puff' }, forms: [
    { name: 'Hopsy', extras: [] },
    { name: 'Bunbun', extras: ['whiskers'] },
    { name: 'Moonhopper', extras: ['whiskers', 'moon-mark'] },
  ] },
  { type: 'sky', rarity: 'common', parts: { body: 'cloud' }, forms: [
    { name: 'Puffy', extras: [] },
    { name: 'Cumulo', extras: ['tuft'] },
    { name: 'Stormcloud', extras: ['bolt-mark', 'rain'] },
  ] },
  { type: 'sand', rarity: 'common', parts: { body: 'cactus' }, forms: [
    { name: 'Pricklet', extras: ['spots'] },
    { name: 'Cactoo', extras: ['spots', 'flower'] },
    { name: 'Saguardian', extras: ['spots', 'flower', 'wide-mouth'] },
  ] },
  { type: 'spark', rarity: 'rare', parts: { body: 'bug' }, forms: [
    { name: 'Buzzle', extras: ['stripes', 'antennae'] },
    { name: 'Honeyhum', extras: ['stripes', 'antennae', 'bug-wings'] },
    { name: 'Queenbuzz', extras: ['stripes', 'antennae', 'bug-wings', 'crown'] },
  ] },
  { type: 'rock', rarity: 'rare', parts: { body: 'dino' }, forms: [
    { name: 'Dinobit', extras: ['back-spikes'] },
    { name: 'Stompasaur', extras: ['back-spikes', 'horn'] },
    { name: 'Rexpaw', extras: ['back-spikes', 'horn', 'wide-mouth', 'spots'] },
  ] },
  { type: 'bloom', rarity: 'rare', parts: { body: 'potted' }, forms: [
    { name: 'Budling', extras: ['sprout'] },
    { name: 'Blossomette', extras: ['petals'] },
    { name: 'Bloomqueen', extras: ['petals', 'crown'] },
  ] },
  { type: 'frost', rarity: 'rare', parts: { body: 'pear' }, forms: [
    { name: 'Pengo', extras: ['beak'] },
    { name: 'Slidewing', extras: ['beak', 'tuft', 'scarf'] },
  ] },
  { type: 'sand', rarity: 'rare', parts: { body: 'crab' }, forms: [
    { name: 'Pinchy', extras: [] },
    { name: 'Clawdia', extras: ['spots', 'wide-mouth'] },
  ] },
  { type: 'bloom', rarity: 'common', parts: { body: 'blob', ears: 'round', tail: 'thin' }, forms: [
    { name: 'Squeakit', extras: ['whiskers'] },
    { name: 'Cheddarmouse', extras: ['whiskers', 'tuft', 'spots'] },
  ] },
  { type: 'moon', rarity: 'rare', parts: { body: 'bat', ears: 'pointy' }, forms: [
    { name: 'Duskit', extras: ['moon-mark'] },
    { name: 'Nightflap', extras: ['moon-mark', 'spots', 'tongue'] },
  ] },
  { type: 'rock', rarity: 'common', parts: { body: 'seal' }, forms: [
    { name: 'Sealy', extras: ['whiskers'] },
    { name: 'Flipflop', extras: ['whiskers', 'spots'] },
  ] },
  { type: 'star', rarity: 'super', parts: { body: 'serpent' }, forms: [
    { name: 'Wyrmlet', extras: ['horn'] },
    { name: 'Skydrake', extras: ['horn', 'wings-big', 'spikes'] },
  ] },
  { type: 'star', rarity: 'super', parts: { body: 'quad', tail: 'fluffy' }, forms: [
    { name: 'Unipony', extras: ['horn', 'rainbow-mane'] },
    { name: 'Rainbowhorn', extras: ['horn', 'rainbow-mane', 'wings-big'] },
  ] },
];

export const WORD_SET = buildSet(WORD_FAMILIES);
