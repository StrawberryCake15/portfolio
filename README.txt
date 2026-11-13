DAVIN THE PROJECT — PORTFOLIO

ENTRY POINT
- index.html is the only website entry point.
- Keep index.html, style.css, Davin.js, assets/, sprites/, and fonts/ together.
- Open index.html directly or serve this folder with a local static server.

PAGES
1. HOME (#home)
2. PERSONAL INFORMATION (#personal)
3. EDUCATION (#education)
4. FAMILY & FRIENDS (#family)
- Home biography is visible on arrival; portrait details are optional hover/focus discoveries.
- Home and Personal Information scroll naturally on compact screens so no copy is clipped.
- New visits use the light PARCHMENT theme; an existing saved theme choice is preserved.
- A silent Poké Ball-inspired scan plays automatically on page load, then reveals HOME. Reduced-motion settings skip it.
- Education groups the school timeline in one panel and automatically rotates each stage's photo proof in the Pokédex panel. Both remain inside the education viewport.
- The Pokedex rotates school records, photo-backed achievements, and locally rendered certificate previews every 5.4 seconds; it pauses only while the tab is hidden or another page is active. Photos keep their full framing over a softly blurred fill, and reduced-motion settings remove the transitions while keeping the records available.
- A wider cassette-inspired proof tape beside the Pokedex gives a fast visual overview: education photos come first, followed by achievement photos and certificate page previews. It loops in about 12 seconds without requiring a click or scroll and changes to a horizontal ticker on compact screens.
- Graduation and achievement photos live in assets/proofs/. Original certificate PDFs live in assets/certs/, with first-page previews stored in assets/certs/previews/.

EDITABLE DATA
Education, achievements, certificates, family, friends, party note, and optional contact are in the CONFIG block near the top of Davin.js.
Education entries can use proofImage and proofAlt; achievements can also use those fields or a proofImages list. Certificates use title, optional issuer/date, fileUrl, and a page-one preview image in assets/certs/previews/.
Family and friends use first names or nicknames only. Feature people only with consent. Optional photos belong in assets/people/.
Family and friend lists start empty. No placeholder people are included.
Contact email is shown only on PERSONAL INFORMATION.

FONTS
Self-host the variable fonts in fonts/ using these exact names:
- Oxanium-VariableFont_wght.woff2 and Oxanium-VariableFont_wght.ttf
- SpaceGrotesk-VariableFont_wght.woff2 and SpaceGrotesk-VariableFont_wght.ttf
System fallback stacks are configured if either font is unavailable. Runtime requests are same-origin only.

SPRITES AND CREDIT
Sprites are local files at sprites/{id}.png. Keep the supplied sprite files together with the site.
Pokémon and its sprites are © Nintendo / Creatures / GAME FREAK. Fan tribute for a class project; not affiliated.

AUDIT
overlap-check.js is a standalone browser-console snippet. It visits all four hashes, waits one second per page, reports visible audited boxes, viewport, theme, and document scrolling.
check_site.py checks packaging, routes, placeholders, fonts, and required sprite files.

NO REMOTE RUNTIME REQUESTS
The Content Security Policy allows local scripts, styles, fonts, and images. Sound is off by default and synthesized only after a click.
