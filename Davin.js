/* Davin the Project — Build 01. Beginner note: this file wires navigation and controls. */
(() => {
  "use strict";
  document.body.classList.add("js");
  const webFontSheet = document.getElementById("web-fonts");
  if (webFontSheet) webFontSheet.media = "all";

  // EDIT HERE: keep these route slugs aligned with the section IDs and navigation hrefs.
  const pages = ["home", "builds", "lab", "davin", "contact"];
  const pageElements = pages.map((id) => document.getElementById(id));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const pageCurrent = document.getElementById("page-current");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const smallScreen = window.matchMedia("(max-width: 500px)");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  let activeIndex = 0;
  let transitionTimer = 0;
  let wheelTimer = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchTime = 0;
  let userPausedSprites = false;
  let spriteBuilt = false;
  let profilePeekTimer = 0;

  const trainerBall = document.getElementById("trainer-ball");
  const trainerCard = document.getElementById("trainer-card");
  const closeCardButton = document.getElementById("close-trainer-card");
  const profilePeek = document.getElementById("profile-peek");
  const spriteBand = document.getElementById("sprite-band");
  const spriteToggle = document.getElementById("sprite-toggle");
  const homePage = document.getElementById("home");
  const heroTitle = homePage.querySelector(".hero-title");

  function indexFromHash() {
    const slug = window.location.hash.replace(/^#/, "");
    const index = pages.indexOf(slug);
    return index < 0 ? 0 : index;
  }

  function setMobileMenu(open, { restoreFocus = false } = {}) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      const firstLink = mobileMenu.querySelector("a[data-nav]");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else if (restoreFocus && mobileMenu.contains(document.activeElement)) {
      menuToggle.focus({ preventScroll: true });
    }
  }

  function syncPage({ focusHeading = false } = {}) {
    activeIndex = indexFromHash();
    pageElements.forEach((page, index) => {
      const isActive = index === activeIndex;
      page.classList.toggle("active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
      if ("inert" in page) page.inert = !isActive;
      else if (!isActive) page.setAttribute("inert", "");
      else page.removeAttribute("inert");
    });

    navLinks.forEach((link) => {
      const isActive = Number(link.dataset.nav) === activeIndex;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    pageCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
    closeTrainerCard();
    setMobileMenu(false);
    updateSpritePlayback();
    if (focusHeading) {
      const heading = pageElements[activeIndex].querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  function requestPage(index, { focusHeading = true } = {}) {
    const safeIndex = Math.max(0, Math.min(pages.length - 1, index));
    if (safeIndex === activeIndex) {
      setMobileMenu(false, { restoreFocus: true });
      return;
    }
    if (!reducedMotion.matches) {
      document.body.classList.add("transitioning");
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => document.body.classList.remove("transitioning"), 640);
    }
    window.location.hash = pages[safeIndex];
    syncPage({ focusHeading });
  }

  // Both desktop and mobile links share the original data-nav routing hook.
  document.querySelectorAll("a.nav-tile, a.brand, a.text-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const targetIndex = pages.indexOf(href.replace(/^#/, ""));
      if (targetIndex < 0) return;
      event.preventDefault();
      requestPage(targetIndex);
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      setMobileMenu(open, { restoreFocus: false });
    });
  }

  window.addEventListener("hashchange", () => syncPage({ focusHeading: true }));
  window.addEventListener("popstate", () => syncPage({ focusHeading: true }));
  if (!window.location.hash) history.replaceState(null, "", "#home");
  syncPage();

  // Wheel/trackpad gestures change one page, then wait for inertia to settle.
  window.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    event.preventDefault();
    window.clearTimeout(wheelTimer);
    if (!wheelLocked) {
      wheelLocked = true;
      requestPage(activeIndex + (event.deltaY > 0 ? 1 : -1));
    }
    wheelTimer = window.setTimeout(() => { wheelLocked = false; }, 720);
  }, { passive: false });

  // Keyboard navigation remains available on every page; Escape closes overlays.
  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (editing) return;
    if (event.key === "Escape") {
      closeTrainerCard();
      setMobileMenu(false, { restoreFocus: true });
      return;
    }
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      requestPage(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      requestPage(activeIndex - 1);
    } else if (/^[1-5]$/.test(event.key)) {
      requestPage(Number(event.key) - 1);
    }
  });

  // Swipe navigation ignores taps and mostly vertical gestures.
  document.addEventListener("touchstart", (event) => {
    if (!event.changedTouches.length) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
    lastTouchTime = Date.now();
  }, { passive: true });
  document.addEventListener("touchend", (event) => {
    if (!event.changedTouches.length || Date.now() - lastTouchTime > 1200) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    requestPage(activeIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Desktop-only pointer tilt changes transform values inside a single animation frame.
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function scheduleTilt(event) {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 5;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 4;
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      heroTitle.style.setProperty("--tilt-x", `${pointerX}px`);
      heroTitle.style.setProperty("--tilt-y", `${pointerY}px`);
      pointerFrame = 0;
    });
  }
  function clearTilt() {
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    heroTitle.style.setProperty("--tilt-x", "0px");
    heroTitle.style.setProperty("--tilt-y", "0px");
  }
  if (finePointer.matches && !reducedMotion.matches) {
    homePage.addEventListener("pointermove", scheduleTilt);
    homePage.addEventListener("pointerleave", clearTilt);
  }
  finePointer.addEventListener?.("change", (event) => {
    if (!event.matches) {
      homePage.removeEventListener("pointermove", scheduleTilt);
      homePage.removeEventListener("pointerleave", clearTilt);
      clearTilt();
    } else if (!reducedMotion.matches) {
      homePage.addEventListener("pointermove", scheduleTilt);
      homePage.addEventListener("pointerleave", clearTilt);
    }
  });

  // Portraits fall back to a clean monogram when ./assets/davin.jpg is unavailable.
  document.querySelectorAll(".portrait-frame img").forEach((image) => {
    const frame = image.closest(".portrait-frame");
    image.addEventListener("load", () => frame.classList.add("is-loaded"), { once: true });
    image.addEventListener("error", () => frame.classList.remove("is-loaded"), { once: true });
    if (image.complete && image.naturalWidth > 0) frame.classList.add("is-loaded");
  });

  // Hover/focus reveals a short profile peek after a 150 ms intent delay.
  function hideProfilePeek() {
    window.clearTimeout(profilePeekTimer);
    profilePeek.hidden = true;
  }
  function scheduleProfilePeek() {
    window.clearTimeout(profilePeekTimer);
    if (trainerCard.hidden) {
      profilePeekTimer = window.setTimeout(() => {
        if (trainerCard.hidden) profilePeek.hidden = false;
      }, 150);
    }
  }
  trainerBall.addEventListener("pointerenter", (event) => {
    if (finePointer.matches && event.pointerType !== "touch") scheduleProfilePeek();
  });
  trainerBall.addEventListener("pointerleave", hideProfilePeek);
  trainerBall.addEventListener("focus", scheduleProfilePeek);
  trainerBall.addEventListener("blur", hideProfilePeek);

  function openTrainerCard() {
    hideProfilePeek();
    trainerCard.hidden = false;
    trainerBall.classList.add("is-open");
    trainerBall.setAttribute("aria-expanded", "true");
  }
  function closeTrainerCard() {
    if (!trainerCard || !trainerBall) return;
    trainerCard.hidden = true;
    trainerBall.classList.remove("is-open");
    trainerBall.setAttribute("aria-expanded", "false");
  }
  trainerBall.addEventListener("click", () => {
    if (trainerBall.getAttribute("aria-expanded") === "true") closeTrainerCard();
    else openTrainerCard();
  });
  closeCardButton.addEventListener("click", () => {
    closeTrainerCard();
    trainerBall.focus({ preventScroll: true });
  });
  document.addEventListener("pointerdown", (event) => {
    if (trainerCard.hidden) return;
    if (!trainerCard.contains(event.target) && !trainerBall.contains(event.target)) closeTrainerCard();
  });

  // EDIT HERE: project copy and statuses. Selection updates the existing detail pane.
  const builds = [
    { category: "C++ / EXPERIMENT", title: "First Contact", description: "A space for an early C++ experiment. Use it to record the core idea, the programming concept, and what the next attempt should test.", status: "CONCEPT", tools: "C++ / TO VERIFY", next: "Record the real experiment and what it taught you." },
    { category: "GAME / CONCEPT", title: "Unnamed Game", description: "A game idea at the concept stage. The focus is finding a clear player goal and a reason to keep exploring.", status: "CONCEPT", tools: "Design notes / EDIT HERE", next: "Define the core loop before choosing an implementation." },
    { category: "AI / FUTURE BUILD", title: "Learning Machine", description: "A future exploration of how machine learning could support interactive and adaptive experiences.", status: "CONCEPT", tools: "Not selected yet", next: "Build the foundations before committing to a model or feature." },
    { category: "CREATIVE TECHNOLOGY", title: "Project 04", description: "A reserved slot for the next idea that earns its way into the project log.", status: "CONCEPT", tools: "To be determined", next: "Replace this entry when a real project begins." }
  ];
  const detailIndex = document.getElementById("detail-index");
  const detailCategory = document.getElementById("detail-category");
  const detailTitle = document.getElementById("detail-title");
  const detailDescription = document.getElementById("detail-description");
  const detailStatus = document.getElementById("detail-status");
  const detailTools = document.getElementById("detail-tools");
  const detailNext = document.getElementById("detail-next");
  const buildButtons = Array.from(document.querySelectorAll("[data-build]"));
  function selectBuild(index) {
    const build = builds[index];
    if (!build) return;
    buildButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    detailIndex.textContent = `BUILD / ${String(index + 1).padStart(2, "0")}`;
    detailCategory.textContent = build.category;
    detailTitle.textContent = build.title;
    detailDescription.textContent = build.description;
    detailStatus.textContent = build.status;
    detailTools.textContent = build.tools;
    detailNext.textContent = build.next;
  }
  buildButtons.forEach((button) => button.addEventListener("click", () => selectBuild(Number(button.dataset.build))));

  // Lab sub-steps keep the two existing content panels inside one viewport.
  const labSteps = [document.getElementById("lab-step-one"), document.getElementById("lab-step-two")];
  const labStepCount = document.getElementById("lab-step-count");
  const labPrev = document.getElementById("lab-prev");
  const labNext = document.getElementById("lab-next");
  let labStepIndex = 0;
  function setLabStep(index) {
    labStepIndex = Math.max(0, Math.min(1, index));
    labSteps.forEach((step, stepIndex) => {
      const active = stepIndex === labStepIndex;
      step.hidden = !active;
      step.classList.toggle("active", active);
    });
    labStepCount.textContent = `STEP ${labStepIndex + 1} / 2`;
    labPrev.disabled = labStepIndex === 0;
    labNext.disabled = labStepIndex === 1;
  }
  labPrev.addEventListener("click", () => setLabStep(labStepIndex - 1));
  labNext.addEventListener("click", () => setLabStep(labStepIndex + 1));

  // Sprite IDs/names are standard English Pokédex entries. Images are optional local files.
  const pokemon = [
    [1, "Bulbasaur"], [4, "Charmander"], [6, "Charizard"], [7, "Squirtle"], [25, "Pikachu"],
    [39, "Jigglypuff"], [54, "Psyduck"], [94, "Gengar"], [130, "Gyarados"], [133, "Eevee"],
    [143, "Snorlax"], [149, "Dragonite"], [150, "Mewtwo"], [151, "Mew"], [152, "Chikorita"],
    [155, "Cyndaquil"], [158, "Totodile"], [175, "Togepi"], [196, "Espeon"], [197, "Umbreon"],
    [258, "Mudkip"], [384, "Rayquaza"], [448, "Lucario"], [650, "Chespin"], [653, "Fennekin"],
    [656, "Froakie"], [658, "Greninja"], [722, "Rowlet"], [725, "Litten"], [728, "Popplio"]
  ];
  function updateSpritePlayback() {
    if (!spriteBand || !spriteToggle) return;
    const automaticallyPaused = document.hidden || !homePage.classList.contains("active") || reducedMotion.matches;
    spriteBand.classList.toggle("is-paused", userPausedSprites || automaticallyPaused);
    spriteBand.classList.toggle("is-static", reducedMotion.matches);
    spriteToggle.setAttribute("aria-pressed", String(userPausedSprites));
    spriteToggle.setAttribute("aria-label", userPausedSprites ? "Play sprite animation" : "Pause sprite animation");
    spriteToggle.textContent = userPausedSprites ? "▶" : "Ⅱ";
  }
  function createSpriteSet() {
    const set = document.createElement("div");
    set.className = "sprite-set";
    pokemon.forEach(([id, name]) => {
      const item = document.createElement("span");
      item.className = "sprite-item";
      item.dataset.spriteId = String(id);
      const image = document.createElement("img");
      image.src = `./sprites/${id}.png`;
      image.width = 64;
      image.height = 64;
      image.alt = "";
      image.decoding = "async";
      image.addEventListener("load", () => settleSpriteAsset(id, true), { once: true });
      image.addEventListener("error", () => settleSpriteAsset(id, false), { once: true });
      const label = document.createElement("span");
      label.className = "sprite-name";
      label.textContent = name;
      item.append(image, label);
      set.append(item);
    });
    return set;
  }
  const pendingSpriteIds = new Set(pokemon.map(([id]) => id));
  const loadedSpriteIds = new Set();
  const settledSpriteIds = new Set();
  function settleSpriteAsset(id, loaded) {
    if (settledSpriteIds.has(id)) return;
    settledSpriteIds.add(id);
    pendingSpriteIds.delete(id);
    if (loaded) {
      loadedSpriteIds.add(id);
      spriteToggle.hidden = false;
    } else {
      spriteBand.querySelectorAll(`.sprite-item[data-sprite-id="${id}"]`).forEach((item) => item.remove());
    }
    if (pendingSpriteIds.size === 0 && loadedSpriteIds.size === 0) {
      spriteBand.remove();
      spriteToggle.hidden = true;
    }
  }
  function buildSpriteBand() {
    if (spriteBuilt || !spriteBand || smallScreen.matches) return;
    spriteBuilt = true;
    const rows = Array.from(spriteBand.querySelectorAll(".sprite-row"));
    rows.forEach((row) => {
      const track = row.querySelector(".sprite-track");
      track.append(createSpriteSet(), createSpriteSet());
    });
    updateSpritePlayback();
  }
  if (!smallScreen.matches) buildSpriteBand();
  smallScreen.addEventListener?.("change", (event) => {
    if (!event.matches) buildSpriteBand();
  });
  if (spriteToggle) {
    spriteToggle.addEventListener("click", () => {
      userPausedSprites = !userPausedSprites;
      updateSpritePlayback();
    });
  }
  document.addEventListener("visibilitychange", updateSpritePlayback);
  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      document.body.classList.remove("transitioning");
      clearTilt();
    } else {
      buildSpriteBand();
    }
    updateSpritePlayback();
  });

  // A single hello wobble gives the signature ball a quiet moment after the page settles.
  window.setTimeout(() => {
    if (!reducedMotion.matches && trainerBall && homePage.classList.contains("active")) {
      trainerBall.classList.add("hello-wobble");
      trainerBall.addEventListener("animationend", () => trainerBall.classList.remove("hello-wobble"), { once: true });
    }
  }, 2200);
})();
