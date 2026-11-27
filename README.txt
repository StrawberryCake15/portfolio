DAVIN THE PROJECT — PORTFOLIO UPDATE

ENTRY POINT
- index.html is the only website entry point.
- Keep index.html, style.css, Davin.js, assets/, fonts/, and sprites/ together.
- Open index.html directly or serve this folder with a local static server.

PAGES
1. HOME (#home)
2. PERSONAL INFORMATION (#personal)
3. EDUCATION (#education)
4. FAMILY & FRIENDS (#family)
- Four-page navigation, /04 indicator, Previous/Next controls, arrow keys, and number keys 1–4 are retained.
- All four page views remain fixed to the viewport. On compact screens, Personal Information and Education use accessible in-page tabs to keep every section readable without overall page scrolling.
- The theme selector and user-activated sound control remain. Sound is OFF by default.
- Reduced-motion settings pause/disable decorative movement.

FAMILY & FRIENDS
- FOUNDATIONS: three family cards, using the three user-provided photos and the requested personal captions.
- THE SQUAD: three user-provided group photos and the shared gratitude caption.
- MY OTHERS ♥: a 35mm-style film strip. The supplementaryPhotos array in CONFIG is intentionally empty until additional photos are supplied. When populated, the photos loop continuously and pause on hover/focus; reduced-motion preferences disable the animation.
- Edit CONFIG.family, CONFIG.friends, CONFIG.partyNote, and CONFIG.supplementaryPhotos near the top of Davin.js. Personal Information also uses compact-screen Identity / Field Notes tabs.
- Keep the family and friends photos in assets/family/ and assets/friends/ respectively.

EDUCATION
- The school timeline, achievement list, Pokédex proof viewer, and proof tape remain data-driven in CONFIG.
- School years and requested achievement entries follow the project brief.
- Two certificate cards remain placeholders until real certificate files and preview images are added.
- School logo image slots use text initials as a fallback when logo files are absent. On compact screens, Education separates the academic journey, achievement log, and proof archive into three touch-friendly views.

LOCAL ASSETS NOT INCLUDED IN THIS UPDATE
The uploaded source bundle did not include the original assets/, fonts/, or sprites/ folders. The six newly supplied photographs are included, optimized as WebP. To restore the original homepage portrait, personal profile portrait, school logos, education proof photos, self-hosted fonts, and Pokémon sprite ribbon, copy the corresponding original files/folders from the existing repository into this project, preserving the paths referenced by Davin.js and index.html:
- assets/daveen-cutout.png and assets/daveen-cutout.webp
- assets/about-portrait.jpg and assets/about-portrait-800.webp
- assets/logo-dmmmsu.jpg and assets/logo-uc.jpg
- assets/proofs/ (education and achievement proof images)
- fonts/Oxanium-VariableFont_wght.woff2 and fonts/SpaceGrotesk-VariableFont_wght.woff2
- sprites/{id}.png for the IDs configured in Davin.js
If the original asset directories already exist in your GitHub repository, copy their contents unchanged; do not replace personal photographs with generated images.

CHECKS
- Run: python check_site.py
- overlap-check.js can be pasted into the browser console on the deployed site to check the four views at the current viewport.
- The current archive check verifies the four routes, family photo files, local policy, and configured view behavior. Missing original repository assets are reported as warnings rather than fabricated.

VISUAL DEPTH AND PERFORMANCE
- A fixed depth stack (soft glow, running perspective grid, rising pixel embers, vignette) sits behind every page; each page's hero panel has a rotating border ring; family/squad photos share one colour grade with corner brackets and a periodic light sweep.
- Adaptive quality: about 5.5 seconds after load the page samples its frame rate. Below roughly 34 fps it adds the fx-lite class, which turns the embers, grid motion, ring rotation, and light sweeps into static versions.
- Add ?fx=full or ?fx=lite to the URL to force a mode when testing (for example index.html?fx=full#family).
- Reduced-motion settings remove the embers and stop all of these animations.

CHOREOGRAPHY (PASS 2)
- Built on the browser's native Web Animations API; no animation or 3D library is bundled, so the strict self-only policy and the single-file build stay intact.
- FAMILY & FRIENDS battle intro (about 3.5 seconds, first visit per browser session only): alternating stripes sweep in, "DAVIN sent out THE INNER CIRCLE!" types in a Pokemon-style box, a pixel Poke Ball is thrown, bounces and wobbles, then bursts open and the six photos fly out into their frames while the panels fade in. Click or press any key to skip. Reduced-motion settings skip it entirely.
- PERSONAL: an NPC dialogue box in the page heading types three sentences taken from this page (click to advance), and the portrait and name sit on parallax depth layers.
- HOME: the name animates in letter by letter each time you arrive, and the portrait ball wiggles every few seconds.

LATEST CHANGES
- MY OTHERS film is one constant belt: frames move at a steady speed and are recycled off-screen, so there is no keyframe loop or restart. It pauses on hover/focus and is static with reduced motion.
- Default theme is NIGHT (black and maroon). The toggle now cycles NIGHT, PARCHMENT, SLATE; saved choices from before this update are ignored once (storage key davin-theme-v2).
- Achievements are six: MILO Little Olympics was replaced by Online Certifications, and Workshop Engagement was added.
- THE SQUAD uses one photo (assets/friends/squad-01.webp). squad-02 and squad-03 are no longer used and can be deleted.
- The HOME button is gone from the navigation (desktop and mobile menu). The DAVIN logo, the PREV/NEXT buttons and key 1 still lead home; all four pages remain.
- Personal information: panels fade up together as the page wipe passes, then the dialogue box types, replacing the earlier per-element pop-in.

FAMILY CAPTIONS AND PHOTO HIGHLIGHTS
- Captions are rewritten around the main message: Mama (love and support), Papa (protection and guidance), Ading (inspiration and reminder), the squad (blessings and support). Edit them in CONFIG.family (note, short, tag), CONFIG.partyNote / partyShort and CONFIG.squadTag.
- "short" and "partyShort" are the condensed versions shown on screens up to 900px wide so every photo and caption fits without scrolling; the full version shows on larger screens.
- Each photo carries its message tag, a soft glow frame and a very slow drift; hovering a family card spotlights it and dims the others. fx-lite and reduced motion turn the drift off.
