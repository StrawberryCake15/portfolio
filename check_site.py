from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
required = ["index.html", "style.css", "Davin.js", "README.txt", "overlap-check.js"]
routes = ["home", "personal", "education", "family"]
home_sprites = [1,4,6,7,25,39,54,94,130,133,143,149,150,151,152,155,158,175,196,197,258,384,448,650,653,656,658,722,725,728]
extra_sprites = [3,9,26,37,52,63,66,74,95,104,123,129,131,132,137,144,147,172,179,183,194,212,248,249,252,254,255,257,282,359,373,385,387,390,393,443,445,475,495,498,501,570,571,678,681,700,724,727,730,745]
problems = []

for name in required:
    if not (ROOT / name).is_file():
        problems.append("Missing " + name)

html_path = ROOT / "index.html"
js_path = ROOT / "Davin.js"
css_path = ROOT / "style.css"
html = html_path.read_text(encoding="utf-8") if html_path.exists() else ""
js = js_path.read_text(encoding="utf-8") if js_path.exists() else ""
css = css_path.read_text(encoding="utf-8") if css_path.exists() else ""

for route in routes:
    if not re.search(r'\bid="' + re.escape(route) + r'"', html):
        problems.append("Missing route #" + route)
if re.search(r'\bid="(?:builds|lab|contact|davin)"', html, re.I):
    problems.append("Obsolete page route remains")
if re.search(r'PASTE[^\n]*HERE|\[[A-Z][A-Z _-]+\]', js + html):
    problems.append("Placeholder text remains")
active_html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
if re.search(r"fonts\.(?:googleapis|gstatic)\.com", active_html):
    problems.append("Unexpected Google Fonts runtime reference")
for font in ["Oxanium-VariableFont_wght.woff2", "SpaceGrotesk-VariableFont_wght.woff2"]:
    if not (ROOT / "fonts" / font).is_file():
        problems.append("Missing " + str(Path("fonts") / font))
for sprite_id in home_sprites + extra_sprites:
    if not (ROOT / "sprites" / (str(sprite_id) + ".png")).is_file():
        problems.append("Missing sprite " + str(sprite_id))
for image in ["logo-dmmmsu.jpg", "logo-uc.jpg"]:
    if not (ROOT / "assets" / image).is_file():
        problems.append("Missing " + str(Path("assets") / image))
for preview in ["preview.html", "OPEN_PREVIEW.html", "Davin_About_Standalone.html"]:
    if (ROOT / preview).exists():
        problems.append("Obsolete preview file remains: " + preview)
if "!important" in css:
    problems.append("Unexpected !important declaration")
if re.search(r"font-size\s*:\s*(?:8|9|10)(?:\.\d+)?px", css):
    problems.append("Font size under 11px remains")
if "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self';" not in html:
    problems.append("CSP is missing the self-only font/script/style policy")

if problems:
    print("CHECK FAILED")
    for problem in problems:
        print("- " + problem)
    sys.exit(1)
print("OK: package routes, assets, fonts, and placeholders")
