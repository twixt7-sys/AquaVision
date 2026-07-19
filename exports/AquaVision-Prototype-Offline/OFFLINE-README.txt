AquaVision Prototype — Offline Presentation Pack
================================================

This folder is a self-contained build. No internet connection is required once
extracted. All fonts, charts, pitch deck data, and demo fixtures are bundled.

QUICK START (recommended)
-------------------------
1. Double-click Start-Prototype.bat
2. Your browser opens at http://localhost:4173
3. Press Ctrl+C in the terminal window when finished

Requires Node.js 18+ on the presentation laptop. Node does not need network
access after the first run (npx caches the static server).

MANUAL START (if the batch file fails)
--------------------------------------
Open a terminal in this folder and run:

  npx --yes serve -s . -l 4173

Then open http://localhost:4173 in Chrome or Edge.

PITCH MODE KEYBOARD MAP
-----------------------
  → / Space / PgDn   Next slide
  ← / PgUp           Previous slide
  Home / End         First / last slide
  F                  Fullscreen
  N                  Presenter notes
  A                  Objections / FAQ drawer
  5                  5-minute version (9 slides)
  D                  Live demo jump (slides 5–7)
  Esc                Back to landing

PRESENTER RUN-OF-SHOW
---------------------
1. Start on the landing page → Pitch mode
2. Slides 1–4: problem + phased spine (press N for script)
3. Slides 5/6/7: press D for live demo, Esc to return
4. Slide 13: the two honest zeros
5. Slide 15: the ask
6. Q&A: press A for objections drawer
7. Short on time? Press 5 for the 9-slide cut

Shareable URLs (refresh-safe):
  #/pitch/1 … #/pitch/16
  #/demo/free/home
  #/demo/enterprise/pondtwin
  #/charts
