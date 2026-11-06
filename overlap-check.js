/* Davin the Project — Home layout audit. Paste into DevTools Console on Home. */
(() => {
  const selectors = [
    ["Home copy", ".home-copy"],
    ["Eyebrow", ".home-eyebrow"],
    ["Name line 1", ".name-line-one"],
    ["Name line 2", ".name-line-two"],
    ["Role chips", ".role-chips"],
    ["About slot", ".about-slot"],
    ["CTA", ".home-cta"],
    ["Prepared for", ".prepared-for"],
    ["Portrait stage", ".portrait-stage"],
    ["Portrait details", ".portrait-details"],
    ["Portrait ball", ".portrait-ball-control"],
    ["Mode label", ".portrait-mode-label"],
    ["Site credit", ".site-credit"],
    ["Corner controls", ".corner-controls"]
  ];
  const visible = (el) => {
    if (!el || el.hidden || el.closest("[hidden]")) return false;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) <= 0.01) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const measured = selectors.map(([name, selector]) => {
    const el = document.querySelector(selector);
    if (!visible(el)) return null;
    return { name, rect: el.getBoundingClientRect() };
  }).filter(Boolean);
  const overlaps = [];
  for (let i = 0; i < measured.length; i += 1) {
    for (let j = i + 1; j < measured.length; j += 1) {
      const a = measured[i].rect, b = measured[j].rect;
      const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (width > 1 && height > 1) overlaps.push({
        elementA: measured[i].name,
        elementB: measured[j].name,
        overlapWidth: Math.round(width * 10) / 10,
        overlapHeight: Math.round(height * 10) / 10
      });
    }
  }
  const result = {
    viewport: `${innerWidth} × ${innerHeight}`,
    theme: document.documentElement.dataset.theme || "unknown",
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    overlaps
  };
  console.group(`Davin Home audit — ${result.viewport} — ${result.theme}`);
  console.table(overlaps);
  console.info(`Document size: ${result.scrollWidth} × ${result.scrollHeight}`);
  console.info(overlaps.length ? "Review the intersecting pairs above." : "No listed element pairs intersect.");
  console.groupEnd();
  return result;
})();
