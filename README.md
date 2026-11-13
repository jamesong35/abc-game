# ABC Game

A web-based game to help kids learn their ABCs. Designed for tablets, phones, and computers.

- **Explore**: tap a letter to see and hear it ("A is for Apple").
- **Find the Letter**: listen and tap the right letter, in capitals (ABC) or lowercase (abc). Each correct answer reveals part of a mystery critter. Five correct answers reveal the whole critter and add it to the collection.
- **My Critters**: the collection of the game's own collectible critters (31 in 12 families). Finding a family again evolves it into its next form. Critters have types (Fire, Water, Leaf…) and rarity (common, rare, super rare).

Plain HTML, CSS and JavaScript with no build step. Speech uses the browser's built-in text-to-speech. Progress is saved in the browser on each device.

## Getting a friendlier voice

The game automatically uses the most natural English voice on each device. Downloading a better voice makes a big difference:

- **iPhone / iPad:** Settings → Accessibility → Spoken Content → Voices → English. Download a **Premium** or **Enhanced** voice, such as **Ava (Premium)** or **Zoe (Premium)**. Then close and reopen the game.
- **Mac:** System Settings → Accessibility → Spoken Content → System Voice → Manage Voices, then download the same voices.
- **Android:** Settings → Accessibility → Text-to-speech output. Choose Google's engine and install a high-quality English voice.
- **Windows:** Microsoft Edge has natural voices (Aria, Jenny, Ana) built in; they need an internet connection.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly from the file system won't work, because the JavaScript modules need a web server.)

## Testing helpers

In the browser console:

- `abcDebug.setPieces(4)`: put the current mystery critter one answer from done
- `abcDebug.findAllBut(1)`: find every critter but one
- `abcDebug.setCurrent('embit')`: make a specific critter the next mystery
- `abcDebug.reset()`: clear all progress
