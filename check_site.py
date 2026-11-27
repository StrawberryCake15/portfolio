from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
required = ["index.html", "style.css", "Davin.js", "README.txt", "overlap-check.js"]
routes = ["home", "personal", "education", "family"]
family_photos = [
    "assets/family/my-mama.webp", "assets/family/my-papa.webp", "assets/family/my-ading.webp",
    "assets/friends/squad-01.webp",
]
optional_original = [
    "assets/daveen-cutout.png", "assets/daveen-cutout.webp", "assets/about-portrait.jpg",
    "assets/about-portrait-800.webp", "assets/logo-dmmmsu.jpg", "assets/logo-uc.jpg",
    "fonts/Oxanium-VariableFont_wght.woff2", "fonts/SpaceGrotesk-VariableFont_wght.woff2",
]
problems = []
warnings = []
for name in required:
    if not (ROOT / name).is_file():
        problems.append("Missing " + name)

html = (ROOT / "index.html").read_text(encoding="utf-8")
js = (ROOT / "Davin.js").read_text(encoding="utf-8")
css = (ROOT / "style.css").read_text(encoding="utf-8")
for route in routes:
    if not re.search(r'\bid="' + re.escape(route) + r'"', html):
        problems.append("Missing route #" + route)
if re.search(r'\bid="(?:builds|lab|contact|davin)"', html, re.I):
    problems.append("Obsolete page route remains")
if "THE INNER CIRCLE" not in html or "FOUNDATIONS" not in html or "THE SQUAD" not in html or "MY OTHERS" not in html:
    problems.append("Family & Friends sections are incomplete")
for memory in re.findall(r'photo:\s*"(assets/[^"]+)"', js.split("supplementaryPhotos", 1)[-1].split("]", 1)[0]):
    if not (ROOT / memory).is_file():
        warnings.append("MY OTHERS photo listed in CONFIG but not in this bundle: " + memory)
if "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self';" not in html:
    problems.append("CSP is missing the self-only font/script/style policy")
if "!important" in css:
    problems.append("Unexpected !important declaration")
if re.search(r"font-size\s*:\s*(?:8|9|10)(?:\.\d+)?px", css):
    problems.append("Font size under 11px remains")
for photo in family_photos:
    if not (ROOT / photo).is_file():
        problems.append("Missing supplied photograph " + photo)
for asset in optional_original:
    if not (ROOT / asset).is_file():
        warnings.append("Original repository asset not present in uploaded bundle: " + asset)
for sprite_id in [3,9,26,37,52,63,66,74,95,104,123,129,131,132,137,144,147,172,179,183,194,212,248,249,252,254,255,257,282,359,373,385,387,390,393,443,445,475,495,498,501,570,571,678,681,700,724,727,730,745]:
    if not (ROOT / "sprites" / (str(sprite_id) + ".png")).is_file():
        warnings.append("Original sprite not present in uploaded bundle: " + str(sprite_id))

if problems:
    print("CHECK FAILED")
    for item in problems:
        print("- " + item)
    sys.exit(1)
print("OK: routes, sections, supplied photos, and core project files")
if warnings:
    print("WARNINGS: original repository assets still need to be copied into this export")
    for item in warnings:
        print("- " + item)
