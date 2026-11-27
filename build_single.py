#!/usr/bin/env python3
"""Build ONE self-contained HTML file from index.html + style.css + Davin.js
and every image / sprite / font found in assets/, sprites/ and fonts/.

Usage (run inside the project folder):   python build_single.py [output.html]
Result: davin-portfolio.html. Double-click it; no other files are needed.
Certificate PDFs cannot be inlined, so their links keep pointing at assets/certs/.
"""
import base64
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "davin-portfolio.html"
MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".gif": "image/gif", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf"}
CSP = ("<meta content=\"default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; "
       "script-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'\" "
       "http-equiv=\"Content-Security-Policy\"/>")

assets = {}
for folder in ("assets", "fonts", "sprites"):
    base = ROOT / folder
    if base.is_dir():
        for f in sorted(base.rglob("*")):
            if f.is_file() and f.suffix.lower() in MIME:
                assets[f.relative_to(ROOT).as_posix()] = f
cache = {}


def data(rel):
    if rel not in cache:
        f = assets[rel]
        cache[rel] = "data:%s;base64,%s" % (MIME[f.suffix.lower()], base64.b64encode(f.read_bytes()).decode())
    return cache[rel]


html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "style.css").read_text(encoding="utf-8")
js = (ROOT / "Davin.js").read_text(encoding="utf-8")
missing = set()

# CSS: fonts and any image url(); drop TTF fallbacks (WOFF2 is enough in every modern browser)
css = re.sub(r',\s*url\((["\']?)fonts/[^"\')]+\.ttf\1\)\s*format\((["\']?)truetype\2\)', "", css)


def css_url(m):
    rel = m.group(2)
    if rel in assets:
        return 'url("%s")' % data(rel)
    missing.add(rel)
    return m.group(0)


css = re.sub(r'url\((["\']?)((?:fonts|assets|sprites)/[^"\')]+)\1\)', css_url, css)

# HTML: CSP, preloads, stylesheet, static image attributes
html = re.sub(r'<meta[^>]*Content-Security-Policy[^>]*>', lambda m: CSP, html)
html = re.sub(r'<link[^>]*rel="preload"[^>]*>', "", html)
html = re.sub(r'<link[^>]*href="style\.css"[^>]*>', lambda m: "<style>" + css + "</style>", html)


def html_attr(m):
    name, rel, rest = m.group(1), m.group(2), m.group(3)
    if rel in assets:
        return '%s="%s%s"' % (name, data(rel), rest)
    missing.add(rel)
    return m.group(0)


html = re.sub(r'\b(src|srcset)="((?:assets|sprites|fonts)/[^" ]+)([^"]*)"', html_attr, html)

# JS: asset path literals become lookups into one table; sprites resolve through a second table
used = {}


def js_lit(m):
    rel = m.group(2)
    if rel in assets:
        used[rel] = data(rel)
        return '__A["%s"]' % rel
    if not rel.endswith(".pdf"):
        missing.add(rel)
    return m.group(0)


js = re.sub(r'(["\'])((?:assets|fonts)/[^"\']+)\1', js_lit, js)
sprite_hook = '"./sprites/" + id + ".png"'
if sprite_hook in js:
    js = js.replace(sprite_hook, '((window.__SPRITES || {})[id] || "./sprites/" + id + ".png")')
sprites = {}
for rel in assets:
    m = re.fullmatch(r"sprites/(\d+)\.png", rel)
    if m:
        sprites[m.group(1)] = data(rel)
prelude = "const __A = %s;\nwindow.__SPRITES = %s;\n" % (json.dumps(used), json.dumps(sprites))
quiet = ("window.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&"
         "/sprites\\//.test(t.getAttribute('src')||'')){t.style.visibility='hidden'}},true);")
assert "</script" not in js, "Davin.js must not contain a closing script tag"
html = re.sub(r'<script[^>]*src="Davin\.js"[^>]*>\s*</script>', "", html)
head, sep, tail = html.rpartition("</body>")
html = head + "<script>" + quiet + "</script><script>" + prelude + js + "</script>" + sep + tail

OUT.write_text(html, encoding="utf-8")
print("Wrote %s (%.1f MB), %d assets inlined, %d sprites." % (OUT.name, OUT.stat().st_size / 1e6, len(cache), len(sprites)))
if missing:
    print("Not found (these show their built-in fallbacks):")
    for rel in sorted(missing):
        print("  -", rel)
