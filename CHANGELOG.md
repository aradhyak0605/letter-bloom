# Current improvement checklist

- [x] Connecting line follows the finger between letters.
- [x] Trace back through earlier letters to undo; release away from tiles to clear without losing a life.
- [x] Require words to use every tile at the current level; guarantee solvable growth.
- [x] Improve touch feedback, word-length guidance and mobile layout.
- [x] Run regression checks and publish the updated game.

## Verification

- Game rules: 100 generated runs, exact-length enforcement, unchanged existing letters, no impossible stage targets, scoring, duplicate handling and third-miss game over.
- Gestures: live pointer tail, backtracking, tap undo and off-tile cancellation.
- Browser: tap entry, backtracking from EAT to EA, cancellation with lives unchanged, transition to four-letter mode.
- Layout: 360 × 640 with nine tiles and 390 × 844 with four tiles.
- Deployment: published successfully on 14 November 2026.

