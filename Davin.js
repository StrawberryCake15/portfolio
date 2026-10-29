/* Davin the Project — Build 01. Beginner note: this file wires navigation and controls. */
(() => {
  "use strict";
  document.body.classList.add("js");

  // EDIT HERE: the page slugs must match section IDs and nav hrefs in index.html.
  const pages = ["home", "builds", "lab", "davin", "contact"];
  const pageElements = pages.map((id) => document.getElementById(id));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const pageCurrent = document.getElementById("page-current");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let transitionTimer = 0;
  let wheelTimer = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchTime = 0;

  const trainerBall = document.getElementById("trainer-ball");
  const trainerCard = document.getElementById("trainer-card");
  const closeCardButton = document.getElementById("close-trainer-card");

  function indexFromHash() {
    const slug = window.location.hash.replace(/^#/, "");
    const index = pages.indexOf(slug);
    return index < 0 ? 0 : index;
  }

  function syncPage({ focusHeading = false } = {}) {
    const nextIndex = indexFromHash();
    activeIndex = nextIndex;

    pageElements.forEach((page, index) => {
      const isActive = index === activeIndex;
      page.classList.toggle("active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
      // Inert keeps hidden page controls out of the keyboard tab order.
      if ("inert" in page) page.inert = !isActive;
      else if (!isActive) page.setAttribute("inert", "");
      else page.removeAttribute("inert");
    });

    navLinks.forEach((link, index) => {
      const isActive = index === activeIndex;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    pageCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
    closeTrainerCard();
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
    if (safeIndex === activeIndex) return;
    if (!reducedMotion.matches) {
      document.body.classList.add("transitioning");
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        document.body.classList.remove("transitioning");
      }, 640);
    }
    window.location.hash = pages[safeIndex];
    // hashchange handles most cases; sync immediately keeps feedback responsive.
    syncPage({ focusHeading });
  }

  // Route internal navigation through one handler so mouse clicks get the same wipe as keys.
  document.querySelectorAll("a.nav-tile, a.brand, a.text-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const slug = link.getAttribute("href").replace(/^#/, "");
      const targetIndex = pages.indexOf(slug);
      if (targetIndex < 0) return;
      event.preventDefault();
      requestPage(targetIndex);
    });
  });

  window.addEventListener("hashchange", () => syncPage({ focusHeading: true }));
  window.addEventListener("popstate", () => syncPage({ focusHeading: true }));
  // If opened without a hash, replace the address without adding a history entry.
  if (!window.location.hash) history.replaceState(null, "", "#home");
  syncPage();

  // Wheel gestures advance only once until the trackpad/mouse-wheel goes quiet.
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

  // Arrow keys and number keys work globally except when a native control has focus.
  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (editing) return;

    if (event.key === "Escape") {
      closeTrainerCard();
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

  // Swipe on touch screens. Ignore taps and mostly vertical gestures.
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

  // Subtle desktop-only pointer tilt. Only transform values change; no layout is recalculated.
  const homePage = document.getElementById("home");
  const heroTitle = homePage.querySelector(".hero-title");
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
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
    finePointer.addEventListener?.("change", (event) => {
      if (!event.matches) {
        homePage.removeEventListener("pointermove", scheduleTilt);
        homePage.removeEventListener("pointerleave", clearTilt);
        clearTilt();
      }
    });
  }

  // The ball is a real button, so mouse, touch, Enter, and Space all work natively.
  function openTrainerCard() {
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
  closeCardButton.addEventListener("click", closeTrainerCard);
  document.addEventListener("pointerdown", (event) => {
    if (trainerCard.hidden) return;
    if (!trainerCard.contains(event.target) && !trainerBall.contains(event.target)) closeTrainerCard();
  });

  // EDIT HERE: project copy and statuses. Selection changes the detail pane; no dead links.
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

  // Lab sub-steps: the same viewport presents either the learning list or build notes.
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

  // Ensure native reduced-motion changes also stop pointer tilt and the slash wipe.
  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      document.body.classList.remove("transitioning");
      clearTilt();
    }
  });
})();
