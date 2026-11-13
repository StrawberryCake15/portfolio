/* Console audit for all four pages. Run on the portfolio after it has loaded. */
(async () => {
  const routes = ["home", "personal", "education", "family"];
  const originalHash = location.hash || "#home";
  const isVisible = (element) => {
    if (!element || element.hidden || element.closest("[hidden]")) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const recordFor = (route) => {
    const page = document.getElementById(route);
    const candidates = [...page.querySelectorAll("[data-audit-box]")];
    candidates.push(...document.querySelectorAll(".corner-button, .site-credit"));
    const visible = candidates.filter(isVisible);
    const boxes = visible.map((element) => ({
      name: element.dataset.auditBox || element.id || element.className || element.tagName,
      element,
      rect: element.getBoundingClientRect()
    }));
    const overlaps = [];
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i], b = boxes[j];
        if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
        const width = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
        const height = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
        if (width > 1 && height > 1) overlaps.push({
          elementA: a.name, elementB: b.name,
          overlapWidth: Math.round(width), overlapHeight: Math.round(height)
        });
      }
    }
    return {
      page: route,
      viewport: innerWidth + " × " + innerHeight,
      theme: document.documentElement.dataset.theme || "unknown",
      documentSize: document.documentElement.scrollWidth + " × " + document.documentElement.scrollHeight,
      scrolls: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
      overlaps
    };
  };
  const results = [];
  for (const route of routes) {
    location.hash = "#" + route;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await new Promise(requestAnimationFrame);
    results.push(recordFor(route));
  }
  location.hash = originalHash;
  console.group("Davin page overlap audit");
  console.table(results.map(({page, viewport, theme, documentSize, scrolls}) => ({page, viewport, theme, documentSize, scrolls})));
  results.forEach((result) => {
    console.group(result.page + " — " + result.viewport + " — " + result.theme);
    console.table(result.overlaps);
    console.info(result.scrolls ? "Page scroll detected." : "No document scroll.");
    console.groupEnd();
  });
  console.groupEnd();
  return results;
})();