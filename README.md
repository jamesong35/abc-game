# ABC Game

A web-based game to help kids learn their ABCs. Designed for tablets, phones, and computers.

- **Explore**: tap a letter to see and hear it ("A is for Apple").
- **Find the Letter**: listen and tap the right letter, in capitals (ABC) or lowercase (abc). Each correct answer reveals part of a mystery critter. Five correct answers reveal the whole critter and add it to the collection.
- **Find the Word**: listen and tap the right 3-letter word. Each set of 5 questions uses one word family (cat, hat, bat…), so the words differ only in their first letter. The word's picture appears after it's found. Sets reveal Word Critters, a separate collection.
- **My Critters**: two collections of the game's own collectible critters: 31 Letter Critters and 50 Word Critters. Finding a family again evolves it into its next form. Critters have types (Fire, Water, Leaf…) and rarity (common, rare, super rare).

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

Use `abcDebug.letters` for Find the Letter and `abcDebug.words` for Find the Word:

- `abcDebug.letters.setPieces(4)`: put the current mystery critter one answer from done
- `abcDebug.words.findAllBut(1)`: find every word critter but one
- `abcDebug.letters.setCurrent('embit')`: make a specific critter the next mystery
- `abcDebug.words.reset()`: clear that collection's progress
