# Letter Bloom

A portrait, touch-first word game. Built with plain HTML, CSS and JavaScript; no build step or paid services.

## Play
- A run starts with one of five randomly chosen playable three-letter sets.
- Connect letter tiles by dragging, or tap tiles and check the word. Keyboard entry is supported.
- Find 3 words to gain a random fourth letter. Goals gradually increase up to 8 words per addition.
- Existing tiles remain. A new tile is selected from letters that preserve enough unused dictionary words for the next stage.
- Three wrong words end the entire run. Short and repeated words are free.
- Consecutive correct words increase the points multiplier, capped at 3x.
- Four letters unlock shuffle, five unlock three hints per garden, six permanently unlock Night.
- Completing the nine-letter stage starts a fresh garden while retaining score and lives.
- Classic and local-date Daily Seed runs save independently on the device.

## Develop
Serve `dist` with any static server, e.g. `python -m http.server 8000 --directory dist`.
Run `node tests/game.test.cjs` for game rules and solvability checks.

## Files
- `dist/index.html`: full-height portrait interface, pop-up menus, responsive styles.
- `dist/game.js`: state, interactions, random growth, persistence, scoring.
- `dist/words.js`: bundled English word set.
- `dist/manifest.webmanifest`: standalone portrait web-app metadata.
- `dist/THIRD_PARTY_NOTICES.txt`: word-data acknowledgements and notices.

## Next development milestones
1. Test swiping, small-screen layout and pacing on real Android/iPhone devices.
2. Refine the dictionary with a modern game-word list and a common-word pool for hints and difficulty. Current Webster-derived vocabulary includes obscure/dated entries and is not a tournament dictionary.
3. Expand starting sets, add milestone animation/audio settings, accessibility settings and onboarding.
4. Add daily completion goals, cosmetic achievements and optional challenge modes after retention testing.
5. Add install/offline support, cloud saves and a signed-in leaderboard if desired. Current scores are local, editable and not suitable for competitive rewards.
6. Only then integrate ads; keep the core game independent of an ad SDK, and review provider requirements before release. No ad network, tracking, payments or analytics are currently included.

This is a playable web-game prototype, not a native Android/iOS package. Daily mode uses the same starting set per local date; later letters depend on play history. Web-app manifest support varies by browser; no offline caching yet.
