# ABC Game

A web-based game to help kids learn their ABCs. Designed for tablets, phones, and computers.

- **Explore**: tap a letter to see and hear it ("A is for Apple").
- **Find the Letter**: listen and tap the right letter, in capitals (ABC) or lowercase (abc). Each correct answer reveals part of a mystery animal. Ten correct answers reveal the whole animal and add it to the collection.
- **My Animals**: the collection of animals found so far.

Plain HTML, CSS and JavaScript with no build step. Speech uses the browser's built-in text-to-speech. Progress is saved in the browser on each device.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly from the file system won't work, because the JavaScript modules need a web server.)

## Testing helpers

In the browser console:

- `abcDebug.setPieces(9)`: put the current mystery animal one answer from done
- `abcDebug.collectAllBut(1)`: collect every animal but one
- `abcDebug.reset()`: clear all progress
