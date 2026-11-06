/* Davin the Project — Build 02. Beginner note: this file wires page, theme, sound, and home interactions. */
(() => {
  "use strict";

  // EDIT HERE: personalize the homepage and tune its light effects.
  const CONFIG = {
    displayName: ["DAVEEN", "PEÑARANDA"],
    showProjectHeadline: false,
    bioText: "I'm Daveen, a Computer Science student who learns by making. I'm working toward game development and machine learning, and I want to build games that entertain, teach, and spark curiosity in the next generation.",
    trainerSpriteSrc: "", // Optional same-origin hand-drawn sprite; leave empty to build from the portrait.
    themeNames: ["night", "parchment", "slate"],
    spriteRows: { desktop: 4, short: 3, phone: 2 },
    spriteSpeeds: { far: 110, near: 55 },
    soundDefault: false,
    audioFile: "",
    ballWobbleInterval: 7000,
    detailIntentDelay: 120,
    detailHideDelay: 300
  };

  // Sprite data is supplied in the local sprites/ folder.
  const POKE_SPRITES = [
    /* PASTE SPRITE DATA HERE */
  ];
  const SPRITES = [
    /* PASTE SPRITE DATA HERE */
  ];
  const CURSORS = [
    /* PASTE SPRITE DATA HERE */
  ];

  document.body.classList.add("js");

  // Apply the editable display name from CONFIG to the two visible name lines.
  document.querySelectorAll("#home-title .name-line").forEach((line, index) => {
    if (CONFIG.displayName[index]) line.textContent = CONFIG.displayName[index];
  });

  // EDIT HERE: the order here controls hashes, keys, indicators, and corner navigation.
  const pages = ["home", "davin", "builds", "lab", "contact"];
  const pageNames = ["Home", "Davin", "Builds", "Lab", "Contact"];
  const pageElements = pages.map((id) => document.getElementById(id));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const pageCurrent = document.getElementById("page-current");
  const pagePrev = document.getElementById("page-prev");
  const pageNext = document.getElementById("page-next");
  const pagePrevLabel = document.getElementById("page-prev-label");
  const pageNextLabel = document.getElementById("page-next-label");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const smallScreen = window.matchMedia("(max-width: 600px)");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const homePage = document.getElementById("home");
  const portraitStage = document.getElementById("portrait-stage");
  const portraitButton = document.getElementById("portrait-toggle");
  const portraitImage = document.getElementById("portrait-photo");
  const portraitCanvas = document.getElementById("portrait-canvas");
  const portraitBall = document.getElementById("portrait-ball");
  const davinPage = document.getElementById("davin");
  const aboutProfileCard = document.getElementById("agent-profile");
  const aboutPhotoToggle = document.getElementById("about-photo-toggle");
  const aboutProfilePhoto = document.getElementById("about-profile-photo");
  const aboutPhotoMode = document.getElementById("about-photo-mode");
  const portraitModeLabel = document.getElementById("portrait-mode-label");
  const portraitDetails = document.getElementById("portrait-details");
  const detailsClose = document.getElementById("details-close");
  const aboutBio = document.getElementById("about-bio");
  const spriteBand = document.getElementById("sprite-band");
  const spriteRows = document.getElementById("sprite-rows");
  const spriteToggle = document.getElementById("sprite-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const soundToggle = document.getElementById("sound-toggle");
  const themeAnnouncement = document.getElementById("theme-announcement");
  const themeMeta = document.getElementById("theme-color-meta");

  let activeIndex = 0;
  let transitionTimer = 0;
  let wheelTimer = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchTime = 0;
  let spriteParallaxFrame = 0;
  let pendingSpriteOffset = 0;
  let detailIntentTimer = 0;
  let detailHideTimer = 0;
  let aboutEntryTimer = 0;
  let wobbleTimer = 0;
  let wobbleEndTimer = 0;
  let spriteBuildPromise = null;
  let spriteRowsCount = 0;
  let userPausedSprites = false;
  let sparkleTimer = 0;
  let resizeTimer = 0;
  let audioContext = null;
  let masterGain = null;
  let noiseBuffer = null;
  let musicTimer = 0;
  let audioEnabled = false; // Sound is OFF on every load; there is no autoplay.
  let audioTrack = null;
  let audioFadeTimer = 0;
  let beatIndex = 0;
  let nextBeatTime = 0;
  let detailsOpen = false;
  let suppressDetailsUntilLeave = false;
  let spriteMode = false;
  let spriteBuildPromiseForPortrait = null;
  let cachedSpriteCanvas = null;
  let bioPrepared = false;
  let bioRevealedThisSession = false;
  try { bioRevealedThisSession = sessionStorage.getItem("davin-home-bio-revealed") === "true"; } catch (_error) { /* Session storage is optional. */ }
  let bioRevealTimer = 0;
  let trainerSpriteImage = null;
  let trainerSpritePromise = null;
  let lastPointerType = "";


  // THEMES: start in NIGHT unless a previous theme choice was saved by this site.
  function readSavedTheme() {
    try {
      const saved = localStorage.getItem("davin-theme");
      return CONFIG.themeNames.includes(saved) ? saved : "night";
    } catch (_error) {
      return "night";
    }
  }

  let currentTheme = readSavedTheme();
  function setTheme(theme, announce = true) {
    if (!CONFIG.themeNames.includes(theme)) return;
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    const nextTheme = CONFIG.themeNames[(CONFIG.themeNames.indexOf(theme) + 1) % CONFIG.themeNames.length];
    themeToggle.setAttribute("aria-label", `Theme: ${theme.toUpperCase()}. Switch to ${nextTheme.toUpperCase()}.`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme.toUpperCase()}`);
    if (themeMeta) {
      const themeBackground = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
      if (themeBackground) themeMeta.setAttribute("content", themeBackground);
    }
    try {
      localStorage.setItem("davin-theme", theme);
    } catch (_error) {
      // The selected theme still works for this page when storage is blocked.
    }
    if (announce) themeAnnouncement.textContent = `Theme changed to ${theme}.`;
  }
  setTheme(currentTheme, false);
  themeToggle.addEventListener("click", () => {
    const next = CONFIG.themeNames[(CONFIG.themeNames.indexOf(currentTheme) + 1) % CONFIG.themeNames.length];
    setTheme(next, true);
  });

  // AUDIO: no network calls. The original loop is synthesized only after the user opts in.
  const beatSeconds = 60 / 96;
  const melodyMidi = [69, 0, 72, 76, 74, 0, 72, 69, 67, 0, 72, 74, 76, 0, 74, 72, 69, 0, 72, 76, 79, 0, 76, 74, 72, 0, 69, 67, 64, 0, 67, 69];
  const bassMidi = [45, 45, 41, 41, 43, 43, 40, 40];
  const audioCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

  function updateSoundButton() {
    // One boolean drives the visible label, speaker icon, and accessible state.
    soundToggle.classList.toggle("is-on", audioEnabled);
    soundToggle.dataset.soundState = audioEnabled ? "on" : "off";
    soundToggle.setAttribute("aria-pressed", String(audioEnabled));
    soundToggle.setAttribute("aria-label", audioEnabled ? "Sound on" : "Sound off");
    soundToggle.title = audioEnabled ? "Sound on" : "Sound off";
    const soundState = soundToggle.querySelector(".sound-state");
    if (soundState) soundState.textContent = audioEnabled ? "ON" : "OFF";
  }

  function createAudioEngine() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);

    // A short noise buffer is reused for the quiet hi-hat sound.
    noiseBuffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * 0.08), audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i += 1) noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length);
    return true;
  }

  function midiToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function scheduleTone(frequency, startAt, duration, wave, level, endFrequency = frequency) {
    if (!audioContext || !masterGain) return;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (endFrequency !== frequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startAt + duration);
    envelope.gain.setValueAtTime(0.0001, startAt);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), startAt + Math.min(0.025, duration * 0.25));
    envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  function scheduleHat(startAt) {
    if (!audioContext || !masterGain || !noiseBuffer) return;
    const source = audioContext.createBufferSource();
    const envelope = audioContext.createGain();
    source.buffer = noiseBuffer;
    envelope.gain.setValueAtTime(0.018, startAt);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.045);
    source.connect(envelope);
    envelope.connect(masterGain);
    source.start(startAt);
    source.stop(startAt + 0.05);
  }

  function scheduleBeat(index, when) {
    const note = melodyMidi[index];
    if (note) scheduleTone(midiToFrequency(note), when, 0.28, "square", 0.025);
    if (index % 4 === 0) {
      const bassNote = bassMidi[Math.floor(index / 4) % bassMidi.length];
      scheduleTone(midiToFrequency(bassNote), when, 0.49, "triangle", 0.045);
    }
    scheduleHat(when + 0.02);
  }

  function scheduleMusic() {
    if (!audioContext || !audioEnabled || document.hidden) return;
    const lookAhead = 0.12;
    while (nextBeatTime < audioContext.currentTime + lookAhead) {
      scheduleBeat(beatIndex % melodyMidi.length, nextBeatTime);
      beatIndex += 1;
      nextBeatTime += beatSeconds;
    }
  }

  function fadeMaster(target, afterFade) {
    if (!audioContext || !masterGain) {
      if (afterFade) afterFade();
      return;
    }
    const now = audioContext.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(target, now + 0.4);
    window.clearTimeout(audioFadeTimer);
    if (afterFade) audioFadeTimer = window.setTimeout(afterFade, 420);
  }

  function startSynthMusic() {
    if (!audioContext || !masterGain) return;
    audioContext.resume().then(() => {
      if (!audioEnabled || document.hidden) return;
      beatIndex = 0;
      nextBeatTime = audioContext.currentTime + 0.08;
      fadeMaster(0.10);
      window.clearInterval(musicTimer);
      musicTimer = window.setInterval(scheduleMusic, 25);
    }).catch(() => {
      audioEnabled = false;
      updateSoundButton();
    });
  }

  function startAudioFile() {
    if (!audioTrack) {
      audioTrack = new Audio(CONFIG.audioFile);
      audioTrack.loop = true;
      audioTrack.volume = 0;
    }
    audioTrack.play().then(() => {
      const start = performance.now();
      window.clearInterval(audioFadeTimer);
      audioFadeTimer = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / 400);
        audioTrack.volume = progress * 0.10;
        if (progress >= 1) window.clearInterval(audioFadeTimer);
      }, 25);
    }).catch(() => {
      audioEnabled = false;
      updateSoundButton();
    });
  }

  function setAudioEnabled(enabled) {
    audioEnabled = enabled;
    updateSoundButton();
    if (!enabled) {
      if (audioTrack) {
        const start = performance.now();
        window.clearInterval(audioFadeTimer);
        audioFadeTimer = window.setInterval(() => {
          const progress = Math.min(1, (performance.now() - start) / 400);
          audioTrack.volume = 0.10 * (1 - progress);
          if (progress >= 1) {
            window.clearInterval(audioFadeTimer);
            audioTrack.pause();
          }
        }, 25);
      } else {
        window.clearInterval(musicTimer);
        fadeMaster(0, () => audioContext && audioContext.suspend());
      }
      return;
    }
    if (CONFIG.audioFile) startAudioFile();
    else {
      if (!audioContext && !createAudioEngine()) {
        audioEnabled = false;
        soundToggle.disabled = true;
        soundToggle.setAttribute("aria-label", "Sound unavailable in this browser");
        updateSoundButton();
        return;
      }
      startSynthMusic();
    }
  }

  if (CONFIG.audioFile && audioCsp) {
    // Optional same-origin audio files need this one additional CSP directive.
    if (!audioCsp.content.includes("media-src")) audioCsp.content += "; media-src 'self'";
  }
  soundToggle.addEventListener("click", () => setAudioEnabled(!audioEnabled));
  updateSoundButton();

  function playSoundEffect(kind) {
    if (!audioEnabled || document.hidden) return;
    if (CONFIG.audioFile) return;
    if (!audioContext || !masterGain) return;
    const now = audioContext.currentTime;
    if (kind === "latch") {
      scheduleTone(740, now, 0.075, "triangle", 0.035, 420);
    } else {
      scheduleTone(520, now, 0.06, "square", 0.018, 690);
    }
  }

  function pauseAudioForHiddenTab() {
    if (!audioEnabled) return;
    if (audioTrack) {
      audioTrack.pause();
    } else {
      window.clearInterval(musicTimer);
      fadeMaster(0, () => audioContext && audioContext.suspend());
    }
  }

  function resumeAudioForVisibleTab() {
    if (!audioEnabled) return;
    if (audioTrack) startAudioFile();
    else if (audioContext) startSynthMusic();
  }

  // URL routing and page visibility.
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

  function updateCornerButtons() {
    if (!pagePrev || !pageNext) return;
    const previousName = pageNames[Math.max(0, activeIndex - 1)];
    const nextName = pageNames[(activeIndex + 1) % pages.length];
    pagePrev.hidden = activeIndex === 0;
    pagePrevLabel.textContent = `< ${previousName.toUpperCase()}`;
    pagePrev.setAttribute("aria-label", `Previous page: ${previousName}`);
    pageNextLabel.textContent = activeIndex === pages.length - 1 ? "HOME >" : `NEXT: ${nextName.toUpperCase()} >`;
    pageNext.setAttribute("aria-label", activeIndex === pages.length - 1 ? "Next page: Home" : `Next page: ${nextName}`);
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
    updateCornerButtons();
    if (activeIndex === 1) runAboutEntry();
    else {
      window.clearTimeout(aboutEntryTimer);
      if (davinPage) davinPage.classList.remove("is-entering");
    }
    closeStageDetails();
    setMobileMenu(false);
    document.body.classList.toggle("home-active", activeIndex === 0);
    updateSpritePlayback();
    if (activeIndex === 0) startBallWobbleTimer();
    else stopBallWobbleTimer();
    if (focusHeading) {
      const heading = pageElements[activeIndex].querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  function requestPage(index, { focusHeading = true } = {}) {
    let safeIndex = Math.max(0, Math.min(pages.length - 1, index));
    if (index >= pages.length) safeIndex = 0;
    if (safeIndex === activeIndex) {
      setMobileMenu(false, { restoreFocus: true });
      return;
    }
    if (!reducedMotion.matches) {
      document.body.classList.add("transitioning");
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => document.body.classList.remove("transitioning"), 640);
    }
    playSoundEffect("page");
    window.location.hash = pages[safeIndex];
    syncPage({ focusHeading });
  }

  document.querySelectorAll("a.nav-tile, a.brand, a.text-link, a.home-cta").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const targetIndex = pages.indexOf(href.replace(/^#/, ""));
      if (targetIndex < 0) return;
      event.preventDefault();
      requestPage(targetIndex);
    });
  });

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    setMobileMenu(open);
  });
  pagePrev.addEventListener("click", () => requestPage(activeIndex - 1));
  pageNext.addEventListener("click", () => requestPage(activeIndex === pages.length - 1 ? 0 : activeIndex + 1));
  window.addEventListener("hashchange", () => syncPage({ focusHeading: true }));
  window.addEventListener("popstate", () => syncPage({ focusHeading: true }));
  if (!window.location.hash) history.replaceState(null, "", "#home");
  syncPage();

  // One wheel gesture changes one page; wait for trackpad inertia to settle.
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

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (editing) return;
    if (event.key === "Escape") {
      if (detailsOpen) closeStageDetails({ returnFocus: true });
      if (menuToggle.getAttribute("aria-expanded") === "true") setMobileMenu(false, { restoreFocus: true });
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

  // PORTRAIT: the image is visible from first paint. Only failures reveal the monogram.
  function showPortraitFallback() {
    portraitStage.classList.add("image-failed");
  }
  portraitImage.addEventListener("error", showPortraitFallback, { once: true });
  portraitImage.addEventListener("load", () => portraitStage.classList.remove("image-failed"), { once: true });
  if (portraitImage.complete && portraitImage.naturalWidth === 0) showPortraitFallback();

  // ABOUT PROFILE: the photo is visible on first paint; ID mode is an optional text-only view.
  function updateAboutPhotoMode() {
    if (!aboutProfileCard || !aboutPhotoToggle) return;
    const idMode = aboutProfileCard.classList.contains("is-id-mode");
    aboutPhotoToggle.setAttribute("aria-pressed", String(idMode));
    aboutPhotoToggle.setAttribute("aria-label", idMode ? "Switch profile portrait to photo mode" : "Switch profile portrait to text-only ID mode");
    if (aboutPhotoMode) aboutPhotoMode.textContent = idMode ? "ID MODE" : "PHOTO MODE";
  }
  if (aboutProfilePhoto && aboutProfileCard) {
    aboutProfilePhoto.addEventListener("error", () => aboutProfileCard.classList.add("photo-failed"), { once: true });
    aboutProfilePhoto.addEventListener("load", () => aboutProfileCard.classList.remove("photo-failed"), { once: true });
    if (aboutProfilePhoto.complete && aboutProfilePhoto.naturalWidth === 0) aboutProfileCard.classList.add("photo-failed");
  }
  if (aboutPhotoToggle && aboutProfileCard) {
    aboutPhotoToggle.addEventListener("click", () => {
      aboutProfileCard.classList.toggle("is-id-mode");
      updateAboutPhotoMode();
    });
    updateAboutPhotoMode();
  }

  // ABOUT PAGE: play a short, one-pass card/dossier arrival when the page becomes active.
  function runAboutEntry() {
    if (!davinPage) return;
    window.clearTimeout(aboutEntryTimer);
    davinPage.classList.remove("is-entering");
    if (reducedMotion.matches) return;
    requestAnimationFrame(() => davinPage.classList.add("is-entering"));
    aboutEntryTimer = window.setTimeout(() => davinPage.classList.remove("is-entering"), 900);
  }

  // ABOUT SLOT: create all word spans at once, with a bounded reveal under 0.9 seconds.
  function prepareBioWords() {
    if (bioPrepared) return;
    const words = CONFIG.bioText.trim().split(/\s+/);
    const stagger = words.length > 1 ? Math.min(14, 620 / (words.length - 1)) : 0;
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "bio-word";
      span.textContent = `${word}${index === words.length - 1 ? "" : " "}`;
      span.style.setProperty("--word-delay", `${Math.round(index * stagger)}ms`);
      fragment.append(span);
    });
    aboutBio.replaceChildren(fragment);
    bioPrepared = true;
  }

  function revealAboutBio(instant = false) {
    prepareBioWords();
    homePage.classList.add("details-open");
    if (instant || reducedMotion.matches || bioRevealedThisSession) {
      homePage.classList.add("bio-instant", "bio-revealed");
      bioRevealedThisSession = true;
      return;
    }
    homePage.classList.remove("bio-instant", "bio-revealed");
    requestAnimationFrame(() => homePage.classList.add("bio-revealed"));
    window.clearTimeout(bioRevealTimer);
    bioRevealTimer = window.setTimeout(() => {
      bioRevealedThisSession = true;
      try { sessionStorage.setItem("davin-home-bio-revealed", "true"); } catch (_error) { /* Session storage is optional. */ }
    }, 850);
  }

  function openStageDetails({ instant = false } = {}) {
    window.clearTimeout(detailIntentTimer);
    window.clearTimeout(detailHideTimer);
    if (detailsOpen) return;
    detailsOpen = true;
    portraitDetails.hidden = false;
    portraitDetails.classList.remove("is-visible");
    revealAboutBio(instant);
    requestAnimationFrame(() => portraitDetails.classList.add("is-visible"));
  }

  function closeStageDetails({ returnFocus = false } = {}) {
    window.clearTimeout(detailIntentTimer);
    window.clearTimeout(detailHideTimer);
    if (!detailsOpen && portraitDetails.hidden) return;
    detailsOpen = false;
    portraitDetails.classList.remove("is-visible");
    homePage.classList.remove("details-open");
    window.setTimeout(() => {
      if (!detailsOpen) portraitDetails.hidden = true;
    }, reducedMotion.matches ? 0 : 260);
    if (returnFocus) {
      suppressDetailsUntilLeave = true;
      portraitButton.focus({ preventScroll: true });
    }
  }

  function scheduleDetailsOpen() {
    window.clearTimeout(detailHideTimer);
    if (suppressDetailsUntilLeave || activeIndex !== 0) return;
    window.clearTimeout(detailIntentTimer);
    detailIntentTimer = window.setTimeout(() => {
      if (activeIndex === 0 && (portraitStage.matches(":hover") || portraitStage.contains(document.activeElement))) {
        openStageDetails();
      }
    }, CONFIG.detailIntentDelay);
  }

  function scheduleDetailsClose() {
    window.clearTimeout(detailIntentTimer);
    window.clearTimeout(detailHideTimer);
    detailHideTimer = window.setTimeout(() => {
      const pointerInside = portraitStage.matches(":hover");
      const focusInside = portraitStage.contains(document.activeElement);
      if (!pointerInside && !focusInside) closeStageDetails();
    }, CONFIG.detailHideDelay);
  }

  portraitStage.addEventListener("pointerenter", (event) => {
    if (finePointer.matches && event.pointerType !== "touch") scheduleDetailsOpen();
  });
  portraitStage.addEventListener("pointerleave", (event) => {
    if (event.relatedTarget && portraitStage.contains(event.relatedTarget)) return;
    suppressDetailsUntilLeave = false;
    scheduleDetailsClose();
  });
  portraitStage.addEventListener("focusin", () => scheduleDetailsOpen());
  portraitStage.addEventListener("focusout", (event) => {
    if (event.relatedTarget && portraitStage.contains(event.relatedTarget)) return;
    scheduleDetailsClose();
  });
  portraitDetails.addEventListener("pointerenter", () => window.clearTimeout(detailHideTimer));
  portraitDetails.addEventListener("focusin", () => window.clearTimeout(detailHideTimer));
  portraitDetails.addEventListener("pointerleave", scheduleDetailsClose);
  detailsClose.addEventListener("click", () => closeStageDetails({ returnFocus: true }));
  document.addEventListener("pointerdown", (event) => {
    if (detailsOpen && !portraitStage.contains(event.target)) closeStageDetails();
  });

  // Build the pixel portrait once. If canvas readback is blocked, drawing still works without quantization.
  function medianCutPalette(imageData, maxColors = 14) {
    const data = imageData.data;
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 16) continue;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    if (!pixels.length) return [];
    const rangeFor = (box) => {
      const mins = [255,255,255], maxs = [0,0,0];
      box.forEach((p) => p.forEach((v,c) => { mins[c] = Math.min(mins[c],v); maxs[c] = Math.max(maxs[c],v); }));
      return maxs.map((v,c) => v-mins[c]);
    };
    const boxes = [pixels];
    while (boxes.length < maxColors) {
      let pick = -1, bestRange = -1, channel = 0;
      boxes.forEach((box, index) => {
        if (box.length < 2) return;
        const ranges = rangeFor(box);
        const maxRange = Math.max(...ranges);
        if (maxRange > bestRange) { bestRange = maxRange; pick = index; channel = ranges.indexOf(maxRange); }
      });
      if (pick < 0) break;
      const box = boxes.splice(pick,1)[0].sort((a,b) => a[channel]-b[channel]);
      const middle = Math.floor(box.length/2);
      boxes.push(box.slice(0,middle), box.slice(middle));
    }
    return boxes.map((box) => {
      const total = box.reduce((sum,p) => [sum[0]+p[0],sum[1]+p[1],sum[2]+p[2]],[0,0,0]);
      return total.map((v) => Math.round(v/box.length));
    });
  }

  function cssRgbToken(name) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const match = value.match(/#([0-9a-f]{6})/i);
    if (match) return [parseInt(match[1].slice(0,2),16),parseInt(match[1].slice(2,4),16),parseInt(match[1].slice(4,6),16)];
    const rgb = value.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/i);
    return rgb ? [Number(rgb[1]),Number(rgb[2]),Number(rgb[3])] : null;
  }

  function quantizePortrait(canvas) {
    try {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const image = context.getImageData(0,0,canvas.width,canvas.height);
      const palette = medianCutPalette(image,14);
      if (palette.length < 2) return;
      const luminance = (p) => p[0]*.2126 + p[1]*.7152 + p[2]*.0722;
      let dark = 0, light = 0;
      palette.forEach((p,i) => { if (luminance(p)<luminance(palette[dark])) dark=i; if (luminance(p)>luminance(palette[light])) light=i; });
      const bg = cssRgbToken("--bg"), ink = cssRgbToken("--ink");
      if (bg) palette[dark] = bg;
      if (ink) palette[light] = ink;
      for (let i=0;i<image.data.length;i+=4) {
        if (image.data[i+3] < 16) continue;
        let nearest = palette[0], best = Infinity;
        for (const p of palette) {
          const dr=image.data[i]-p[0], dg=image.data[i+1]-p[1], db=image.data[i+2]-p[2];
          const distance=dr*dr+dg*dg+db*db;
          if (distance<best) { best=distance; nearest=p; }
        }
        image.data[i]=nearest[0]; image.data[i+1]=nearest[1]; image.data[i+2]=nearest[2];
      }
      context.putImageData(image,0,0);
    } catch (_error) {
      // Some file:// browsers block getImageData; the drawImage pixelation remains usable.
    }
  }

  function loadTrainerSprite() {
    if (!CONFIG.trainerSpriteSrc) return Promise.resolve(portraitImage);
    if (trainerSpriteImage && trainerSpriteImage.complete && trainerSpriteImage.naturalWidth) return Promise.resolve(trainerSpriteImage);
    if (trainerSpritePromise) return trainerSpritePromise;
    trainerSpritePromise = new Promise((resolve) => {
      trainerSpriteImage = new Image();
      trainerSpriteImage.onload = () => resolve(trainerSpriteImage);
      trainerSpriteImage.onerror = () => { trainerSpriteImage = null; resolve(portraitImage); };
      trainerSpriteImage.src = CONFIG.trainerSpriteSrc;
    });
    return trainerSpritePromise;
  }

  function getSpriteSource() {
    if (CONFIG.trainerSpriteSrc && trainerSpriteImage && trainerSpriteImage.complete && trainerSpriteImage.naturalWidth) return trainerSpriteImage;
    return portraitImage;
  }

  // Scale the final 56x70 sprite by a whole-number factor so pixels stay crisp.
  function sizeSpriteCanvas() {
    const rect = portraitStage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scale = Math.max(1, Math.floor(Math.min(rect.width / 56, rect.height / 70)));
    portraitCanvas.style.width = `${56 * scale}px`;
    portraitCanvas.style.height = `${70 * scale}px`;
  }
  sizeSpriteCanvas();
  window.addEventListener("resize", sizeSpriteCanvas, { passive: true });

  function drawSpriteLevel(level) {
    const source = getSpriteSource();
    if (!source || !source.complete || !source.naturalWidth) return false;
    const width = level;
    const height = Math.round(level * 1.25);
    portraitCanvas.width = width;
    portraitCanvas.height = height;
    const context = portraitCanvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.clearRect(0,0,width,height);
    context.drawImage(source,0,0,width,height);
    return true;
  }

  async function preparePixelPortrait() {
    if (cachedSpriteCanvas) return cachedSpriteCanvas;
    if (spriteBuildPromiseForPortrait) return spriteBuildPromiseForPortrait;
    spriteBuildPromiseForPortrait = (async () => {
      await loadTrainerSprite();
      const source = getSpriteSource();
      if (!source || !source.complete || !source.naturalWidth) return null;
      for (const level of [300,160,96,64,56]) {
        drawSpriteLevel(level);
        await new Promise((resolve) => window.setTimeout(resolve, 1));
      }
      quantizePortrait(portraitCanvas);
      const cache = document.createElement("canvas");
      cache.width = 56; cache.height = 70;
      cache.getContext("2d").drawImage(portraitCanvas,0,0,56,70);
      cachedSpriteCanvas = cache;
      return cache;
    })();
    const result = await spriteBuildPromiseForPortrait;
    spriteBuildPromiseForPortrait = null;
    return result;
  }

  function updatePortraitModeControls() {
    portraitButton.setAttribute("aria-pressed", String(spriteMode));
    portraitButton.setAttribute("aria-label", spriteMode ? "Return to photo mode" : "Turn portrait into a sprite");
    portraitBall.setAttribute("aria-pressed", String(spriteMode));
    portraitBall.setAttribute("aria-label", spriteMode ? "Return my portrait to photo mode" : "Turn my portrait into a sprite");
    portraitModeLabel.textContent = spriteMode ? "SPRITE MODE" : "PHOTO MODE";
  }

  async function enterSpriteMode() {
    if (spriteMode) return;
    spriteMode = true;
    updatePortraitModeControls();
    playSoundEffect("page");
    portraitStage.classList.add("sprite-transition");
    if (reducedMotion.matches) {
      const cache = await preparePixelPortrait();
      if (cache) {
        portraitCanvas.width=cache.width; portraitCanvas.height=cache.height;
        portraitCanvas.getContext("2d").drawImage(cache,0,0);
      }
      portraitStage.classList.add("sprite-mode");
      portraitStage.classList.remove("sprite-transition");
      return;
    }
    await loadTrainerSprite();
    const source = getSpriteSource();
    if (!source || !source.complete || !source.naturalWidth) {
      spriteMode = false; updatePortraitModeControls(); portraitStage.classList.remove("sprite-transition"); return;
    }
    drawSpriteLevel(300);
    portraitStage.classList.add("sprite-mode");
    const levels = [160,96,64,56];
    levels.forEach((level,index) => window.setTimeout(() => drawSpriteLevel(level), 145 + index*105));
    window.setTimeout(async () => {
      const cache = await preparePixelPortrait();
      if (cache) {
        portraitCanvas.width=cache.width; portraitCanvas.height=cache.height;
        portraitCanvas.getContext("2d").drawImage(cache,0,0);
      }
    }, 575);
    window.setTimeout(() => portraitStage.classList.remove("sprite-transition"), 680);
  }

  function leaveSpriteMode() {
    if (!spriteMode) return;
    spriteMode = false;
    updatePortraitModeControls();
    playSoundEffect("page");
    portraitStage.classList.remove("sprite-mode","sprite-transition");
    if (reducedMotion.matches) portraitCanvas.getContext("2d").clearRect(0,0,portraitCanvas.width,portraitCanvas.height);
    else window.setTimeout(() => portraitCanvas.getContext("2d").clearRect(0,0,portraitCanvas.width,portraitCanvas.height), 470);
  }

  function toggleSpriteMode() {
    if (spriteMode) leaveSpriteMode();
    else enterSpriteMode();
  }

  portraitButton.addEventListener("pointerdown", (event) => { lastPointerType = event.pointerType || ""; });
  portraitButton.addEventListener("click", (event) => {
    // On touch, the portrait reveals the details; the dedicated ball toggles sprite mode.
    if (event.detail > 0 && (lastPointerType === "touch" || coarsePointer.matches)) {
      if (detailsOpen) closeStageDetails(); else openStageDetails({ instant: true });
      return;
    }
    toggleSpriteMode();
  });
  portraitBall.addEventListener("click", toggleSpriteMode);

  // The small ball has its own transform and timer, separate from all portrait transitions.
  function stopBallWobbleTimer() {
    window.clearTimeout(wobbleTimer);
    window.clearTimeout(wobbleEndTimer);
    wobbleTimer = 0; wobbleEndTimer = 0;
    portraitBall.classList.remove("is-wobbling");
  }
  function ballIsBusy() {
    return portraitBall.matches(":hover") || portraitBall === document.activeElement || spriteMode || detailsOpen || document.hidden || activeIndex !== 0 || reducedMotion.matches;
  }
  function startBallWobbleTimer() {
    stopBallWobbleTimer();
    if (ballIsBusy()) return;
    wobbleTimer = window.setTimeout(performBallWobble, CONFIG.ballWobbleInterval);
  }
  function performBallWobble() {
    if (ballIsBusy()) return;
    portraitBall.classList.add("is-wobbling");
    wobbleEndTimer = window.setTimeout(() => {
      portraitBall.classList.remove("is-wobbling");
      wobbleEndTimer = 0;
    }, 980);
    wobbleTimer = window.setTimeout(performBallWobble, CONFIG.ballWobbleInterval);
  }
  portraitBall.addEventListener("pointerenter", stopBallWobbleTimer);
  portraitBall.addEventListener("pointerleave", startBallWobbleTimer);
  portraitBall.addEventListener("focus", stopBallWobbleTimer);
  portraitBall.addEventListener("blur", startBallWobbleTimer);

  // Project selector: honest status and detail copy stay in this data block.
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

  // Lab steps share one viewport, so only one content panel is displayed at a time.
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

  // EDIT HERE: standard Pokédex IDs and English names for the decorative sprite strip.
  const pokemon = [
    [1, "Bulbasaur"], [4, "Charmander"], [6, "Charizard"], [7, "Squirtle"], [25, "Pikachu"],
    [39, "Jigglypuff"], [54, "Psyduck"], [94, "Gengar"], [130, "Gyarados"], [133, "Eevee"],
    [143, "Snorlax"], [149, "Dragonite"], [150, "Mewtwo"], [151, "Mew"], [152, "Chikorita"],
    [155, "Cyndaquil"], [158, "Totodile"], [175, "Togepi"], [196, "Espeon"], [197, "Umbreon"],
    [258, "Mudkip"], [384, "Rayquaza"], [448, "Lucario"], [650, "Chespin"], [653, "Fennekin"],
    [656, "Froakie"], [658, "Greninja"], [722, "Rowlet"], [725, "Litten"], [728, "Popplio"]
  ];

  function shuffled(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function rowCountForViewport() {
    if (smallScreen.matches) return CONFIG.spriteRows.phone;
    return window.innerHeight >= 768 ? CONFIG.spriteRows.desktop : CONFIG.spriteRows.short;
  }

  function spriteSourceFor(id) {
    return (window.DAVIN_SPRITE_URLS && window.DAVIN_SPRITE_URLS[id]) || `./sprites/${id}.png`;
  }

  function createSpriteSet(entries, spriteSize) {
    const set = document.createElement("div");
    set.className = "sprite-set";
    set.setAttribute("aria-hidden", "true");
    entries.forEach(([id, name]) => {
      const item = document.createElement("span");
      item.className = "sprite-item";
      item.dataset.spriteId = String(id);
      const image = document.createElement("img");
      image.src = spriteSourceFor(id);
      image.width = 96;
      image.height = 96;
      image.alt = "";
      image.decoding = "async";
      const label = document.createElement("span");
      label.className = "sprite-name";
      label.textContent = name;
      item.append(image, label);
      set.append(item);
    });
    set.style.setProperty("--sprite-size", `${spriteSize}px`);
    return set;
  }

  function preloadOneSprite([id, name]) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve([id, name, true]);
      image.onerror = () => resolve([id, name, false]);
      image.src = spriteSourceFor(id);
    });
  }

  function updateSpritePlayback() {
    if (!spriteBand || !spriteToggle) return;
    const autoPaused = document.hidden || activeIndex !== 0 || reducedMotion.matches;
    const paused = userPausedSprites || autoPaused;
    spriteBand.classList.toggle("is-paused", paused);
    spriteBand.classList.toggle("is-static", reducedMotion.matches);
    spriteToggle.setAttribute("aria-pressed", String(userPausedSprites));
    spriteToggle.setAttribute("aria-label", userPausedSprites ? "Play sprite animation" : "Pause sprite animation");
    spriteToggle.title = userPausedSprites ? "Play sprite animation" : "Pause sprite animation";
    spriteToggle.textContent = userPausedSprites ? "▶" : "Ⅱ";
    if (paused) stopSpriteSparkles();
    else startSpriteSparkles();
  }

  function createSpriteRows(available, count) {
    spriteRows.replaceChildren();
    const perSet = Math.max(1, Math.floor(80 / count));
    for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
      const row = document.createElement("div");
      row.className = "sprite-row";
      const progress = count === 1 ? 1 : rowIndex / (count - 1);
      const spriteSize = smallScreen.matches
        ? Math.round(32 + (14 * progress))
        : Math.round(48 + (48 * progress));
      const opacity = 0.34 + (0.56 * progress);
      const duration = Math.round(CONFIG.spriteSpeeds.far - ((CONFIG.spriteSpeeds.far - CONFIG.spriteSpeeds.near) * progress));
      const shuffledEntries = shuffled(available).slice(0, Math.min(perSet, available.length));
      const track = document.createElement("div");
      track.className = `sprite-track ${rowIndex % 2 ? "moves-right" : "moves-left"}`;
      row.style.top = `${((rowIndex + 0.5) / count) * 100}%`;
      row.style.opacity = String(opacity);
      row.style.setProperty("--row-speed", `${duration}s`);
      row.style.setProperty("--row-size", `${spriteSize}px`);
      row.style.setProperty("--row-delay", `${-((rowIndex * 7) % duration)}s`);
      track.append(createSpriteSet(shuffledEntries, spriteSize), createSpriteSet(shuffledEntries, spriteSize));
      row.append(track);
      spriteRows.append(row);
    }
    spriteRowsCount = count;
    spriteToggle.hidden = false;
    updateSpritePlayback();
  }

  async function buildSpriteBand(force = false) {
    if (!spriteBand || !spriteRows || (!force && spriteRowsCount === rowCountForViewport())) return;
    if (spriteBuildPromise) return spriteBuildPromise;
    spriteBuildPromise = (async () => {
      const results = await Promise.all(pokemon.map(preloadOneSprite));
      const available = results.filter((item) => item[2]).map(([id, name]) => [id, name]);
      if (!available.length) {
        spriteBand.remove();
        spriteToggle.hidden = true;
        return;
      }
      createSpriteRows(available, rowCountForViewport());
      spriteBand.hidden = false;
    })();
    await spriteBuildPromise;
    spriteBuildPromise = null;
  }

  function stopSpriteSparkles() {
    window.clearTimeout(sparkleTimer);
    spriteBand.querySelectorAll(".sparkling").forEach((item) => item.classList.remove("sparkling"));
  }

  function scheduleSpriteSparkle() {
    window.clearTimeout(sparkleTimer);
    if (document.hidden || activeIndex !== 0 || reducedMotion.matches || userPausedSprites) return;
    sparkleTimer = window.setTimeout(() => {
      const items = Array.from(spriteBand.querySelectorAll(".sprite-item"));
      if (items.length) {
        const item = items[Math.floor(Math.random() * items.length)];
        item.classList.add("sparkling");
        window.setTimeout(() => item.classList.remove("sparkling"), 260);
      }
      scheduleSpriteSparkle();
    }, 4000);
  }

  function startSpriteSparkles() {
    if (!sparkleTimer && !document.hidden && activeIndex === 0 && !reducedMotion.matches && !userPausedSprites) scheduleSpriteSparkle();
  }

  if (spriteToggle) {
    spriteToggle.addEventListener("click", () => {
      userPausedSprites = !userPausedSprites;
      updateSpritePlayback();
    });
  }
  buildSpriteBand();
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => buildSpriteBand(true), 200);
  }, { passive: true });

  // Pointer parallax is a small transform-only response; reduced motion leaves rows still.
  homePage.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reducedMotion.matches || activeIndex !== 0) return;
    pendingSpriteOffset = ((event.clientX / window.innerWidth) - 0.5) * 12;
    if (spriteParallaxFrame) return;
    spriteParallaxFrame = window.requestAnimationFrame(() => {
      const rows = Array.from(spriteRows.querySelectorAll(".sprite-row"));
      rows.forEach((row, index) => {
        const depth = 0.45 + (index / Math.max(1, rows.length - 1)) * 0.55;
        const direction = index % 2 ? -1 : 1;
        row.style.setProperty("--pointer-y", `${pendingSpriteOffset * depth * direction}px`);
      });
      spriteParallaxFrame = 0;
    });
  });
  homePage.addEventListener("pointerleave", () => {
    if (spriteParallaxFrame) window.cancelAnimationFrame(spriteParallaxFrame);
    spriteParallaxFrame = 0;
    spriteRows.querySelectorAll(".sprite-row").forEach((row) => row.style.setProperty("--pointer-y", "0px"));
  });

  // Desktop-only parallax: move the portrait and offset frame by at most six pixels.
  let photoParallaxFrame = 0;
  let pendingPhotoX = 0;
  let pendingPhotoY = 0;
  portraitStage.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reducedMotion.matches || activeIndex !== 0) return;
    pendingPhotoX = ((event.clientX / window.innerWidth) - .5) * 12;
    pendingPhotoY = ((event.clientY / window.innerHeight) - .5) * 12;
    if (photoParallaxFrame) return;
    photoParallaxFrame = window.requestAnimationFrame(() => {
      portraitStage.style.setProperty("--photo-x", `${pendingPhotoX * .5}px`);
      portraitStage.style.setProperty("--photo-y", `${pendingPhotoY * .5}px`);
      portraitStage.style.setProperty("--frame-x", `${pendingPhotoX * -.5}px`);
      portraitStage.style.setProperty("--frame-y", `${pendingPhotoY * -.5}px`);
      photoParallaxFrame = 0;
    });
  });
  portraitStage.addEventListener("pointerleave", () => {
    if (photoParallaxFrame) window.cancelAnimationFrame(photoParallaxFrame);
    photoParallaxFrame = 0;
    portraitStage.style.setProperty("--photo-x", "0px");
    portraitStage.style.setProperty("--photo-y", "0px");
    portraitStage.style.setProperty("--frame-x", "0px");
    portraitStage.style.setProperty("--frame-y", "0px");
  });

  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("tab-hidden", document.hidden);
    updateSpritePlayback();
    if (document.hidden) {
      stopBallWobbleTimer();
      if (photoParallaxFrame) window.cancelAnimationFrame(photoParallaxFrame);
      photoParallaxFrame = 0;
      window.clearTimeout(detailIntentTimer);
      window.clearTimeout(detailHideTimer);
      pauseAudioForHiddenTab();
    } else {
      if (activeIndex === 0) startBallWobbleTimer();
      resumeAudioForVisibleTab();
    }
  });

  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      document.body.classList.remove("transitioning");
      if (spriteParallaxFrame) window.cancelAnimationFrame(spriteParallaxFrame);
      spriteParallaxFrame = 0;
      spriteRows.querySelectorAll(".sprite-row").forEach((row) => row.style.setProperty("--pointer-y", "0px"));
      stopBallWobbleTimer();
      if (photoParallaxFrame) window.cancelAnimationFrame(photoParallaxFrame);
      photoParallaxFrame = 0;
      portraitStage.style.setProperty("--photo-x", "0px"); portraitStage.style.setProperty("--photo-y", "0px");
      portraitStage.style.setProperty("--frame-x", "0px"); portraitStage.style.setProperty("--frame-y", "0px");
      stopSpriteSparkles();
      window.clearTimeout(detailIntentTimer);
      window.clearTimeout(detailHideTimer);
      if (detailsOpen) {
        prepareBioWords();
        homePage.classList.add("bio-instant","bio-revealed");
      }
    } else {
      if (activeIndex === 0) startBallWobbleTimer();
      updateSpritePlayback();
    }
  });
})();