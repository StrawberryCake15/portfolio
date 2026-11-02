DAVIN THE PROJECT — HOMEPAGE OVERLAP FIX

FILES
- index.html: complete updated homepage and five-page structure.
- preview.html: browser-openable preview entry point (same page as index.html).
- style.css: existing styles plus the final Home spacing/alignment overrides.
- Davin.js: existing interaction code plus popover Escape/focus-return fix.
- portrait_inline.js: supplied portrait as a data URI, loaded before Davin.js.
- sprites/: the 30 supplied local sprite PNGs.
- overlap-check.js: separate console audit snippet; it is NOT loaded by the website.

HOW TO VIEW
1. Extract the ZIP.
2. Keep index.html, preview.html, style.css, Davin.js, and portrait_inline.js together.
3. Keep the sprites folder beside those files.
4. Double-click preview.html (or index.html) to open it in Chrome/Edge.

IMPORTANT
- The Content-Security-Policy in the HTML was not changed.
- The portrait data is supplied by portrait_inline.js so the site can display it
  under the existing self-only script policy and data: image policy.
- In Davin.js, POKE_SPRITES, SPRITES, CURSORS, and PORTRAIT_SRC paste points are
  represented by the requested placeholder comments. The preview uses the
  supplied data from portrait_inline.js and the supplied local sprite PNGs.
- Do not open preview.html by itself after moving it away from its companion
  files. The relative stylesheet, script, and sprite paths must remain intact.

OVERLAP AUDIT
Open the browser console on Home and paste the contents of overlap-check.js.
Repeat at each viewport size, theme, and relevant state (idle, ball peek,
trainer card, and bio panel). The audit reports intersecting visible bounding
boxes, including CSS-transformed bounds.
