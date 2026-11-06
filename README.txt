DAVIN THE PROJECT — PORTRAIT-FIRST HOME BUILD

OPEN THE PREVIEW
1. Extract the complete project ZIP.
2. Keep index.html, preview.html, style.css, Davin.js, assets/, and sprites/ together.
3. Double-click preview.html (or index.html) to open the portfolio in Chrome or Edge.

PROJECT FILES
- index.html      Main five-page website.
- preview.html    Preview entry point; uses the same shared CSS, JS, and local assets.
- style.css       Shared design system plus the single portrait-first Home layout block.
- Davin.js        Routing, page controls, themes, sound, sprite ribbon, portrait sprite mode.
- assets/         Optimized 4:5 portrait variants (WebP 800w/1200w and JPEG fallback).
- sprites/        Thirty local 96x96 sprite PNGs used by the ribbon.
- overlap-check.js Optional browser-console visual bounds checker.
- Preview_Desktop.png / Preview_Mobile.png  Reference captures of the Home page in Photo Mode.

NOTES
- The portrait is visible in the HTML's first paint; it does not depend on JavaScript adding a loaded class.
- The fallback monogram appears only when the portrait image fails.
- Sound starts OFF and never autoplays.
- The initial theme is NIGHT; theme changes are saved locally when storage is available.
- The portrait sprite is generated from the photo in canvas. If canvas pixel readback is blocked, it falls back to drawImage-only pixelation.
- The 30 sprites are loaded from ./sprites/{id}.png. Keep the folder name and file names unchanged.
- No old assets/davin.jpg reference is used.

SOURCE SIZE COMPARISON
Original uploaded style.css: 107,807 bytes
Updated style.css:           63,278 bytes (see file size in your file manager)
Original uploaded Davin.js:  56,163 bytes
Updated Davin.js:            49,516 bytes

The rest of the page copy is retained. Page order is HOME, DAVIN, BUILDS, LAB, CONTACT.
