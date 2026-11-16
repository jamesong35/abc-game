// Word families for Find the Word: 3-letter words that end the same way,
// so the only difference between the choices is the first letter.
// An emoji is shown after a correct answer, only where the picture is clear.

const fam = (ending, list) => ({
  ending,
  words: list.split(' ').map((w) => {
    const [word, emoji] = w.split(':');
    return emoji ? { word, emoji } : { word };
  }),
});

export const WORD_FAMILIES = [
  fam('at', 'cat:🐱 hat:🎩 bat:🦇 mat rat:🐀 sat pat fat'),
  fam('an', 'can:🥫 fan man:👨 pan:🍳 ran:🏃 van:🚐 tan'),
  fam('ap', 'cap:🧢 map:🗺️ nap:😴 tap:🚰 lap gap'),
  fam('ag', 'bag:👜 rag tag:🏷️ wag nag'),
  fam('ab', 'cab:🚕 dab jab lab:🔬 tab'),
  fam('ad', 'dad:👨 pad had lad sad:😢 mad:😠'),
  fam('ig', 'big pig:🐷 dig wig jig fig'),
  fam('ip', 'dip hip lip:👄 sip tip zip'),
  fam('it', 'sit:🪑 bit fit kit pit'),
  fam('id', 'kid:🧒 lid hid did bid'),
  fam('in', 'bin:🗑️ fin pin:📌 tin win:🏆'),
  fam('ot', 'hot:🔥 pot:🍲 dot cot lot got'),
  fam('og', 'dog:🐶 fog:🌫️ hog:🐗 jog:🏃 log:🪵'),
  fam('ug', 'bug:🐛 hug:🤗 mug:☕ rug jug tug'),
  fam('un', 'bun sun:☀️ fun:🎉 run:🏃 pun'),
  fam('ub', 'cub tub:🛁 rub sub:🥪 hub'),
  fam('ut', 'nut:🥜 hut:🛖 cut:✂️ but rut'),
  fam('um', 'gum yum:😋 hum sum mum'),
  fam('en', 'hen:🐔 pen:🖊️ ten:🔟 den men'),
  fam('et', 'jet:✈️ net pet:🐶 wet:💧 vet set'),
  fam('ed', 'bed:🛏️ red:🟥 fed led wed'),
  fam('op', 'hop:🐇 mop top pop cop:👮'),
];
