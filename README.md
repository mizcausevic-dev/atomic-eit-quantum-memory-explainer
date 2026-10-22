# Atomic EIT quantum memory

Frame-accurate sectional explainer of atomic electromagnetically induced transparency quantum memory. 34 seconds, 30 fps, frames 0–1019.

Live plate: https://mizcausevic-dev.github.io/atomic-eit-quantum-memory-explainer/

The plate separates hardware (metal and glass) from three overlays: cyan for the signal pathway, gold for the control field, and violet for collective coherence. It shows the lambda system, spatial compression of the signal envelope at reduced group velocity, mapping onto a collective spin wave, and partial retrieval. It does not show a stopped glowing photon, a copied pulse, perfect efficiency, or indefinite storage.

Open `index.html`. Space plays and pauses. The scrubber and the five section buttons jump the timeline. `index.html?frame=700` renders that frame. Add `&shot=1` for a 1920×1080 plate without the page chrome.

`node tests/invariants.js` checks the timeline: one excitation, no backward travel, slowed group velocity only inside the ensemble, a frozen spin wave while the control is off, and a weaker retrieved envelope that is stationary in the closing second.

This is an explanatory schematic, not a device specification or a setup guide. Boundaries are in `ACCURACY-Cursor.md` and on the page. The Medium draft is `article-Cursor.md`.

GitHub Pages serves the `pages` branch. `index.html` keeps that filename because Pages serves it. The article and the accuracy note use the `-Cursor` suffix.
