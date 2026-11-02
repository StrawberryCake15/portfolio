/*
 * Davin the Project — visual overlap audit.
 * Paste this whole snippet into DevTools Console while Home is active.
 * getBoundingClientRect() includes CSS transforms, so tilted/animated text
 * bounds are included. Re-run after changing viewport, theme, or UI state.
 */
(() => {
  const checks = [
    ["Identity text block", "#identity-meta"],
    ["Ball", "#trainer-ball"],
    ["Ball caption", ".ball-caption"],
    ["Eyebrow", ".eyebrow"],
    ["Divider", ".home-divider"],
    ["Headline line 1", ".hero-line-one"],
    ["Headline line 2", ".hero-line-two"],
    ["Headline line 3", ".hero-line-three"],
    ["Tagline", ".tagline"],
    ["Subline", ".hero-subline"],
    ["Hint label", ".bio-hint"],
    ["Profile peek", "#profile-peek"],
    ["Trainer card", "#trainer-card"],
    ["Bio panel", "#bio-panel"],
    ["Previous corner button", "#page-prev"],
    ["Next corner button", "#page-next"]
  ];

  const isVisible = (element) => {
    if (!element || element.hidden || element.closest("[hidden]")) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const measured = checks.map(([label, selector]) => {
    const element = document.querySelector(selector);
    if (!isVisible(element)) return null;
    const rect = element.getBoundingClientRect();
    return { label, selector, rect };
  }).filter(Boolean);

  const overlaps = [];
  for (let i = 0; i < measured.length; i += 1) {
    for (let j = i + 1; j < measured.length; j += 1) {
      const a = measured[i];
      const b = measured[j];
      const left = Math.max(a.rect.left, b.rect.left);
      const right = Math.min(a.rect.right, b.rect.right);
      const top = Math.max(a.rect.top, b.rect.top);
      const bottom = Math.min(a.rect.bottom, b.rect.bottom);
      const width = right - left;
      const height = bottom - top;
      if (width > 0.5 && height > 0.5) {
        overlaps.push({
          elementA: a.label,
          elementB: b.label,
          overlapWidth: Math.round(width * 10) / 10,
          overlapHeight: Math.round(height * 10) / 10,
          intersectionArea: Math.round(width * height)
        });
      }
    }
  }

  const theme = document.documentElement.dataset.theme || "unknown";
  console.group(`Davin overlap audit — ${innerWidth} × ${innerHeight} — ${theme.toUpperCase()}`);
  console.info(`Visible elements checked: ${measured.length}`);
  if (overlaps.length) {
    console.warn(`Found ${overlaps.length} overlapping pair(s):`);
    console.table(overlaps);
  } else {
    console.info("No visible overlaps detected among the listed elements.");
  }
  console.groupEnd();
  return { viewport: { width: innerWidth, height: innerHeight }, theme, checked: measured.length, overlaps };
})();
