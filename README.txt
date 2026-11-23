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
