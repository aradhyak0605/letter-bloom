# Letter Bloom

A portrait mobile word game. Connect every tile to make words, unlock letters and grow your score. Three wrong words end a run; short entries and repeats do not cost lives.

## Play modes

- **Classic:** endless randomized growth from 3 to 9 letters; completing nine tiles starts another round. 191 viable starting sets with no immediate repeat.
- **Adventure:** 30 sequential levels across three worlds. Early levels finish at three letters; later levels grow up to eight. Earn up to three stars based on remaining lives. Replays improve stars; completion coins are paid once.
- **Daily:** a date-seeded run from three to six letters, with a once-per-date completion reward.

Home, map and rewards screens make up the game hub. Five missions award coins, which unlock cosmetic themes without payments. Every accepted word earns two coins. Classic shuffle unlocks at four tiles and hints at five; Adventure and Daily hints are available from the start.

Hints reveal one third of the same unfound word at a time, with persistent numbered tiles, and never select tiles for the player. A hint run has three charges. Swipe backwards to undo; release off a tile or with a partial word to clear. Quick taps support accessible word construction followed by Check word. Keyboard letters, Backspace and Enter work too.

## Data and limitations

Progress is local to this browser/device. Existing v2 Classic runs and personal bests migrate on first use. No accounts, purchases, ads or leaderboard backend are included. Daily dates follow the device's local date. The built-in dictionary includes uncommon words; puzzle selection guarantees solvable full-length goals and a growth path, not exclusively everyday vocabulary.

## Development

Buildless HTML, CSS and JavaScript in `dist/`. `engine.js` indexes the dictionary and handles puzzle/hint rules; `game.js` handles screens, interactions and storage; `gestures.js` contains pure trace helpers. `.openai/hosting.json` declares static hosting.

Validation:

```sh
node --check dist/game.js
node --check dist/engine.js
node tests/game.test.cjs
node tests/gestures.test.cjs
```

See `dist/THIRD_PARTY_NOTICES.txt` for word-list licensing. Fonts use Google Fonts with local system fallbacks. See `CHANGELOG.md` for the completion checklist.
