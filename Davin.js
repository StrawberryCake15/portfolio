/* Davin the Project — Build 02. Beginner note: this file wires page, theme, sound, and home interactions. */
(() => {
  "use strict";

  // EDIT HERE: personalize the story and tune the lightweight homepage effects.
  const CONFIG = {
    bioText: "I'm Daveen, a Computer Science student who learns by making. Science, problem-solving, and creative technology pull me in, and I'm working toward game development and machine learning. I want to build games that entertain, teach, and spark curiosity in the next generation, and I'm using every project, mistake, and rebuild to get there.",
    bioTypingEnabled: true,
    themeNames: ["night", "parchment", "slate"],
    spriteRows: { desktop: 8, short: 6, phone: 4 },
    spriteSpeeds: { far: 110, near: 55 },
    soundDefault: false,
    audioFile: "",
    idleDelay: 5000,
    ballWobbleInterval: 3000
  };

  // Reserved paste points for optional supplied data. Keep the placeholder line when sharing this source.
  // EDIT HERE: the supplied image data is in portrait_inline.js, loaded immediately before this file.
  /* PASTE PORTRAIT DATA HERE */
  const PORTRAIT_SRC = window.DAVIN_PORTRAIT_SRC || "";

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

  // EDIT HERE: page slugs must match section IDs and navigation links.
  const pages = ["home", "builds", "lab", "davin", "contact"];
  const pageNames = ["Home", "Builds", "Lab", "Davin", "Contact"];
  const pageElements = pages.map((id) => document.getElementById(id));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const pageCurrent = document.getElementById("page-current");
  const pagePrev = document.getElementById("page-prev");
  const pageNext = document.getElementById("page-next");
  const pagePrevLabel = document.getElementById("page-prev-label");
  const pageNextLabel = document.getElementById("page-next-label");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const smallScreen = window.matchMedia("(max-width: 600px)");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const homePage = document.getElementById("home");
  const heroTitle = homePage.querySelector(".hero-title");
  const headlineTrigger = document.getElementById("headline-trigger");
  const bioPanel = document.getElementById("bio-panel");
  const bioTypedText = document.getElementById("bio-typed-text");
  const bioClose = document.getElementById("bio-close");
  const trainerBall = document.getElementById("trainer-ball");
  const trainerCard = document.getElementById("trainer-card");
  const closeCardButton = document.getElementById("close-trainer-card");
  const profilePeek = document.getElementById("profile-peek");
  const ballHit = document.getElementById("ball-hit");
  const ballWobble = document.getElementById("ball-wobble");
  const ballScrim = document.getElementById("ball-scrim");
  const closePeekButton = document.getElementById("close-profile-peek");
  const identityZone = document.getElementById("identity-zone");
  const identityMeta = document.getElementById("identity-meta");
  const cornerControls = document.querySelector(".corner-controls");
  const appHeader = document.querySelector(".app-header");
  // Portals keep the peek and trainer card outside the clipped page stage.
  document.body.append(ballScrim, profilePeek, trainerCard);
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
  let pointerFrame = 0;
  let spriteParallaxFrame = 0;
  let pendingSpriteOffset = 0;
  let pointerX = 0;
  let pointerY = 0;
  let bioTypingTimer = 0;
  let bioHideTimer = 0;
  let bioOpenedByCoarseFocus = false;
  let bioWordsPrepared = false;
  let bioWasRevealed = false;
  let bioTouchHandled = false;
  let vaultCloseTimer = 0;
  let vaultIntentTimer = 0;
  let vaultCloseFinishTimer = 0;
  let vaultPeekTimer = 0;
  let cardRevealTimer = 0;
  let ballFocusInside = false;
  let suppressPeekOnNextFocus = false;
  let idleTimer = 0;
  let idleWasShown = false;
  try {
    idleWasShown = sessionStorage.getItem("davin-idle-bio-shown") === "true";
  } catch (_error) {
    // The one-time idle panel still works for this page when session storage is blocked.
  }
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
  let audioEnabled = false; // Always OFF on load; no saved state and no autoplay.
  let audioTrack = null;
  let audioFadeTimer = 0;
  let beatIndex = 0;
  let nextBeatTime = 0;

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
    closeTrainerCard();
    hideProfilePeek();
    ballHit.classList.remove("vault-open");
    closeBioPanel();
    setMobileMenu(false);
    document.body.classList.toggle("home-active", activeIndex === 0);
    updateSpritePlayback();
    stopIdleTimer();
    if (activeIndex === 0) resetIdleTimer();
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

  document.querySelectorAll("a.nav-tile, a.brand, a.text-link").forEach((link) => {
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
      if (!trainerCard.hidden || trainerBall.getAttribute("aria-expanded") === "true") {
        closeTrainerCard({ returnFocus: true });
      } else if (!profilePeek.hidden) {
        finishVaultClose();
        focusBallAfterPopoverClose();
      } else if (bioPanel.dataset.open === "true") {
        closeBioPanel();
      }
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

  // Pointer tilt is limited to Home and transform-only updates.
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
  }
  finePointer.addEventListener?.("change", (event) => {
    if (!event.matches) clearTilt();
  });

  // portrait_inline.js exposes the supplied data URI as window.DAVIN_PORTRAIT_SRC.
  // Keep the D monogram visible unless the image has decoded successfully.
  function applyPortraitSource() {
    const portraitData = typeof PORTRAIT_SRC === "string" ? PORTRAIT_SRC.trim() : "";
    document.querySelectorAll(".portrait-frame img").forEach((image) => {
      const frame = image.closest(".portrait-frame");
      if (!frame) return;
      image.alt = "Portrait of Daveen";
      image.width = 96;
      image.height = 96;
      image.decoding = "async";
      const revealImage = () => {
        if (image.naturalWidth > 0 && image.naturalHeight > 0) frame.classList.add("is-loaded");
      };
      const keepMonogram = () => {
        frame.classList.remove("is-loaded");
        image.removeAttribute("src");
      };
      image.addEventListener("load", revealImage, { once: true });
      image.addEventListener("error", keepMonogram, { once: true });
      frame.classList.remove("is-loaded");
      if (!portraitData.startsWith("data:image/")) return;
      image.src = portraitData;
      if (typeof image.decode === "function") {
        image.decode().then(revealImage).catch(() => {
          if (image.complete && image.naturalWidth === 0) keepMonogram();
        });
      } else if (image.complete) {
        if (image.naturalWidth > 0) revealImage();
        else keepMonogram();
      }
    });
  }
  applyPortraitSource();

  // BIO PANEL: render every word immediately, then fade each in with a bounded stagger.
  function prepareBioWords() {
    if (!CONFIG.bioTypingEnabled) {
      bioTypedText.textContent = CONFIG.bioText;
      bioWordsPrepared = false;
      return;
    }
    const words = CONFIG.bioText.trim().split(/\s+/);
    const stagger = words.length > 1 ? Math.min(20, 800 / (words.length - 1)) : 0;
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "bio-word";
      span.textContent = `${word}${index === words.length - 1 ? "" : " "}`;
      span.style.setProperty("--word-delay", `${Math.round(index * stagger)}ms`);
      fragment.append(span);
    });
    bioTypedText.replaceChildren(fragment);
    bioWordsPrepared = true;
  }

  function rememberBioReveal() {
    bioWasRevealed = true;
    try { sessionStorage.setItem("davin-bio-revealed", "true"); } catch (_error) { /* The current page still remembers the reveal. */ }
  }

  function completeBioText() {
    window.clearTimeout(bioTypingTimer);
    bioPanel.classList.add("bio-revealed", "bio-instant");
    if (!CONFIG.bioTypingEnabled) {
      bioTypedText.textContent = CONFIG.bioText;
      rememberBioReveal();
      return;
    }
    bioWordsPrepared = false;
    prepareBioWords();
    rememberBioReveal();
  }

  function revealBioWords() {
    window.clearTimeout(bioTypingTimer);
    bioWordsPrepared = false;
    if (!CONFIG.bioTypingEnabled) {
      bioTypedText.textContent = CONFIG.bioText;
      bioPanel.classList.remove("bio-instant", "bio-revealed");
      requestAnimationFrame(() => bioPanel.classList.add("bio-revealed"));
      rememberBioReveal();
      return;
    }
    prepareBioWords();
    bioPanel.classList.remove("bio-instant", "bio-revealed");
    requestAnimationFrame(() => bioPanel.classList.add("bio-revealed"));
    const wordCount = bioTypedText.children.length;
    const finalDelay = wordCount > 1 ? Math.min(800, (wordCount - 1) * Math.min(20, 800 / (wordCount - 1))) : 0;
    bioTypingTimer = window.setTimeout(rememberBioReveal, Math.ceil(finalDelay + 190));
  }

  function openBioPanel({ instant = false } = {}) {
    window.clearTimeout(bioHideTimer);
    if (!trainerCard.hidden) closeTrainerCard();
    hideProfilePeek();
    ballHit.classList.remove("vault-open");
    bioPanel.dataset.open = "true";
    if (instant || reducedMotion.matches) completeBioText();
    else revealBioWords();
  }

  function closeBioPanel() {
    if (!bioPanel) return;
    window.clearTimeout(bioHideTimer);
    window.clearTimeout(bioTypingTimer);
    bioOpenedByCoarseFocus = false;
    bioTouchHandled = false;
    bioPanel.dataset.open = "false";
  }

  function scheduleBioHide() {
    if (!finePointer.matches) return;
    window.clearTimeout(bioHideTimer);
    bioHideTimer = window.setTimeout(() => {
      const pointerStillInside = headlineTrigger.matches(":hover") || bioPanel.matches(":hover");
      const focusStillInside = headlineTrigger.contains(document.activeElement) || bioPanel.contains(document.activeElement);
      if (!pointerStillInside && !focusStillInside) closeBioPanel();
    }, 400);
  }

  function toggleBioPanel() {
    if (bioPanel.dataset.open === "true") closeBioPanel();
    else openBioPanel();
  }

  headlineTrigger.addEventListener("pointerenter", (event) => {
    if (finePointer.matches && event.pointerType !== "touch") openBioPanel();
  });
  headlineTrigger.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch" || !finePointer.matches) return;
    if (event.relatedTarget && bioPanel.contains(event.relatedTarget)) return;
    scheduleBioHide();
  });
  headlineTrigger.addEventListener("focusin", () => {
    if (!finePointer.matches && bioPanel.dataset.open !== "true") bioOpenedByCoarseFocus = true;
    openBioPanel();
  });
  headlineTrigger.addEventListener("focusout", (event) => {
    if (!finePointer.matches) return;
    if (event.relatedTarget && (bioPanel.contains(event.relatedTarget) || headlineTrigger.contains(event.relatedTarget))) return;
    scheduleBioHide();
  });
  headlineTrigger.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    bioTouchHandled = true;
    toggleBioPanel();
  });
  headlineTrigger.addEventListener("click", () => {
    if (bioTouchHandled) { bioTouchHandled = false; return; }
    if (!finePointer.matches) {
      if (bioOpenedByCoarseFocus) { bioOpenedByCoarseFocus = false; return; }
      toggleBioPanel();
    }
  });
  bioPanel.addEventListener("pointerenter", () => window.clearTimeout(bioHideTimer));
  bioPanel.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch" || !finePointer.matches) return;
    scheduleBioHide();
  });
  bioPanel.addEventListener("focusin", () => window.clearTimeout(bioHideTimer));
  bioPanel.addEventListener("focusout", (event) => {
    if (!finePointer.matches) return;
    if (event.relatedTarget && (headlineTrigger.contains(event.relatedTarget) || bioPanel.contains(event.relatedTarget))) return;
    scheduleBioHide();
  });
  bioPanel.addEventListener("click", (event) => {
    if (event.target.closest("#bio-close")) return;
    completeBioText();
  });
  bioClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeBioPanel();
  });
  document.addEventListener("pointerdown", (event) => {
    if (bioPanel.dataset.open === "true" && !headlineTrigger.contains(event.target) && !bioPanel.contains(event.target)) closeBioPanel();
  });

  // One-time idle assist. The message appears instantly after the configured quiet period.
  function stopIdleTimer() { window.clearTimeout(idleTimer); }
  function resetIdleTimer() {
    stopIdleTimer();
    if (activeIndex !== 0 || idleWasShown || document.hidden) return;
    idleTimer = window.setTimeout(() => {
      if (activeIndex === 0 && !idleWasShown && trainerCard.hidden && profilePeek.hidden) {
        idleWasShown = true;
        try { sessionStorage.setItem("davin-idle-bio-shown", "true"); } catch (_error) { /* Session storage is optional. */ }
        openBioPanel({ instant: true });
      }
    }, CONFIG.idleDelay);
  }
  function noteActivity() { if (activeIndex === 0 && !idleWasShown) resetIdleTimer(); }
  ["pointermove", "pointerdown", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, noteActivity, { passive: eventName !== "keydown" });
  });

  // BALL: a fixed-size hit target never moves; only the inner wobble and vault layers animate.
  function panelForbiddenRects() {
    const selectors = [
      ".app-header", ".corner-controls", "#identity-meta", "#ball-hit", ".ball-caption", ".home-divider", ".eyebrow",
      ".hero-line-one", ".hero-line-two", ".hero-line-three", ".tagline", ".hero-subline", ".bio-hint", ".sprite-toggle", ".bio-panel"
    ];
    return selectors.map((selector) => document.querySelector(selector)).filter(Boolean)
      .filter((element) => {
        const style = getComputedStyle(element);
        return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01;
      })
      .map((element) => element.getBoundingClientRect()).filter((rect) => rect.width && rect.height);
  }

  function rectsOverlap(a, b, gap = 6) {
    return a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;
  }

  function positionBallPanel(panel) {
    if (!panel) return;
    panel.hidden = false;
    panel.classList.remove("is-mobile-sheet", "is-modal", "is-measuring");
    panel.style.position = "fixed";
    panel.style.left = "0px";
    panel.style.top = "0px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.transform = "none";

    // Apply the desktop width and height limit before measuring so collision checks use the final box.
    panel.style.width = "clamp(300px, 26vw, 400px)";
    panel.style.maxWidth = "calc(100vw - 48px)";
    panel.style.maxHeight = "min(58dvh, calc(100dvh - var(--header-height) - var(--corner-h) - 32px))";
    panel.classList.add("is-measuring");
    const measured = panel.getBoundingClientRect();
    const panelWidth = Math.min(measured.width || Math.min(400, Math.max(300, window.innerWidth * 0.26)), window.innerWidth - 48);
    const panelHeight = measured.height || 180;
    panel.classList.remove("is-measuring");

    if (window.innerWidth <= 700) {
      panel.classList.add("is-mobile-sheet");
      panel.style.left = "12px";
      panel.style.right = "12px";
      panel.style.top = "auto";
      panel.style.bottom = "calc(var(--corner-h) + 12px)";
      panel.style.width = "auto";
      panel.style.maxHeight = "45dvh";
      panel.style.transform = "none";
      ballScrim.hidden = false;
      panel.setAttribute("aria-modal", "true");
      return;
    }

    const identity = identityMeta.getBoundingClientRect();
    const zone = identityZone.getBoundingClientRect();
    const header = appHeader.getBoundingClientRect();
    const footer = cornerControls.getBoundingClientRect();
    const forbidden = panelForbiddenRects();
    const preferredLeft = identity.right + 32;
    const candidates = [
      { left: preferredLeft, top: zone.top, name: "right" },
      { left: preferredLeft, top: zone.top - panelHeight - 16, name: "above-right" }
    ];
    const valid = candidates.find((candidate) => {
      const rect = { left: candidate.left, right: candidate.left + panelWidth, top: candidate.top, bottom: candidate.top + panelHeight };
      if (rect.left < 24 || rect.right > window.innerWidth - 24) return false;
      if (rect.top < header.bottom + 12 || rect.bottom > footer.top - 12) return false;
      return !forbidden.some((blocked) => rectsOverlap(rect, blocked, 8));
    });

    if (valid) {
      panel.classList.remove("is-modal");
      panel.style.left = `${valid.left}px`;
      panel.style.top = `${valid.top}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.transform = "none";
      panel.dataset.placement = valid.name;
      ballScrim.hidden = true;
      panel.setAttribute("aria-modal", "false");
    } else {
      panel.classList.add("is-modal");
      panel.style.left = "50%";
      panel.style.top = "50%";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.width = "min(400px, calc(100vw - 48px))";
      panel.style.maxHeight = "min(58dvh, calc(100dvh - var(--header-height) - var(--corner-h) - 32px))";
      panel.style.transform = "translate(-50%, -50%)";
      panel.dataset.placement = "modal";
      ballScrim.hidden = false;
      panel.setAttribute("aria-modal", "true");
    }
  }

  function setBallPopoverClosed() {
    ballScrim.hidden = true;
    profilePeek.hidden = true;
    trainerCard.hidden = true;
    profilePeek.classList.remove("is-mobile-sheet", "is-modal");
    trainerCard.classList.remove("is-mobile-sheet", "is-modal", "card-revealed");
    profilePeek.style.cssText = "";
    trainerCard.style.cssText = "";
    trainerCard.setAttribute("aria-modal", "false");
  }

  function hideProfilePeek() {
    window.clearTimeout(vaultPeekTimer);
    profilePeek.hidden = true;
    profilePeek.classList.remove("is-mobile-sheet", "is-modal");
    ballScrim.hidden = true;
  }

  function stopBallWobbleTimer() {
    window.clearTimeout(wobbleTimer);
    window.clearTimeout(wobbleEndTimer);
    wobbleTimer = 0;
    wobbleEndTimer = 0;
    ballWobble.classList.remove("is-wobbling");
  }

  function startBallWobbleTimer() {
    stopBallWobbleTimer();
    const pointerInside = ballHit.matches(":hover") || ballHit.contains(document.activeElement);
    const ballBusy = pointerInside || !trainerCard.hidden || ballHit.classList.contains("vault-open") || ballHit.classList.contains("vault-closing");
    if (reducedMotion.matches || document.hidden || activeIndex !== 0 || ballBusy) return;
    wobbleTimer = window.setTimeout(performBallWobble, CONFIG.ballWobbleInterval);
  }

  function performBallWobble() {
    const pointerInside = ballHit.matches(":hover") || ballHit.contains(document.activeElement);
    const ballBusy = pointerInside || !trainerCard.hidden || ballHit.classList.contains("vault-open") || ballHit.classList.contains("vault-closing");
    if (!ballBusy && !reducedMotion.matches && !document.hidden && activeIndex === 0) {
      ballWobble.classList.add("is-wobbling");
      wobbleEndTimer = window.setTimeout(() => {
        ballWobble.classList.remove("is-wobbling");
        wobbleEndTimer = 0;
      }, 1650);
    }
    if (!reducedMotion.matches && !document.hidden && activeIndex === 0) {
      wobbleTimer = window.setTimeout(performBallWobble, CONFIG.ballWobbleInterval);
    } else {
      wobbleTimer = 0;
    }
  }

  function cancelVaultClose() {
    window.clearTimeout(vaultCloseTimer);
    window.clearTimeout(vaultCloseFinishTimer);
    vaultCloseTimer = 0;
    vaultCloseFinishTimer = 0;
    ballHit.classList.remove("vault-closing");
  }

  function finishVaultClose() {
    hideProfilePeek();
    const wasOpen = ballHit.classList.contains("vault-open");
    if (!wasOpen) {
      ballHit.classList.remove("vault-closing");
      startBallWobbleTimer();
      return;
    }
    ballHit.classList.add("vault-closing");
    ballHit.classList.remove("vault-open");
    window.clearTimeout(vaultCloseFinishTimer);
    // The closing CSS transition is 300ms; restart idle motion only after it completes.
    vaultCloseFinishTimer = window.setTimeout(() => {
      ballHit.classList.remove("vault-closing");
      vaultCloseFinishTimer = 0;
      startBallWobbleTimer();
    }, reducedMotion.matches ? 0 : 320);
  }

  function showVaultPeek() {
    if (!trainerCard.hidden) return;
    if (!(ballHit.matches(":hover") || ballFocusInside)) return;
    cancelVaultClose();
    ballHit.classList.add("vault-open");
    window.clearTimeout(vaultPeekTimer);
    vaultPeekTimer = window.setTimeout(() => {
      if (trainerCard.hidden && (ballHit.matches(":hover") || ballFocusInside)) {
        profilePeek.hidden = false;
        positionBallPanel(profilePeek);
      } else {
        closeVaultAfterLeave();
      }
    }, 250);
  }

  function closeVaultAfterLeave() {
    window.clearTimeout(vaultIntentTimer);
    window.clearTimeout(vaultCloseTimer);
    vaultCloseTimer = window.setTimeout(() => {
      const pointerInside = ballHit.matches(":hover") || identityZone.matches(":hover") || profilePeek.matches(":hover");
      const focusInside = ballHit.contains(document.activeElement) || profilePeek.contains(document.activeElement);
      if (pointerInside || focusInside || !trainerCard.hidden) return;
      finishVaultClose();
    }, 180);
  }

  function scheduleVaultPeek() {
    cancelVaultClose();
    window.clearTimeout(vaultIntentTimer);
    window.clearTimeout(vaultPeekTimer);
    stopBallWobbleTimer();
    if (!trainerCard.hidden) return;
    // Do not open the ball after the pointer has already left the static hit area.
    vaultIntentTimer = window.setTimeout(() => {
      if (ballHit.matches(":hover") || ballFocusInside) showVaultPeek();
    }, 150);
  }

  ballHit.addEventListener("pointerenter", (event) => {
    if (finePointer.matches && event.pointerType !== "touch") scheduleVaultPeek();
  });
  ballHit.addEventListener("pointerleave", (event) => {
    if (event.relatedTarget && (identityZone.contains(event.relatedTarget) || profilePeek.contains(event.relatedTarget))) return;
    closeVaultAfterLeave();
  });
  identityZone.addEventListener("pointerleave", (event) => {
    if (event.relatedTarget && profilePeek.contains(event.relatedTarget)) return;
    closeVaultAfterLeave();
  });
  ballHit.addEventListener("focusin", () => {
    ballFocusInside = true;
    if (suppressPeekOnNextFocus) return;
    scheduleVaultPeek();
  });
  ballHit.addEventListener("focusout", (event) => {
    ballFocusInside = Boolean(event.relatedTarget && ballHit.contains(event.relatedTarget));
    if (!ballFocusInside && (!event.relatedTarget || !profilePeek.contains(event.relatedTarget))) closeVaultAfterLeave();
  });
  profilePeek.addEventListener("pointerenter", () => window.clearTimeout(vaultCloseTimer));
  profilePeek.addEventListener("pointerleave", closeVaultAfterLeave);
  if (closePeekButton) {
    closePeekButton.addEventListener("click", () => {
      finishVaultClose();
      focusBallAfterPopoverClose();
    });
  }

  function focusBallAfterPopoverClose() {
    // Return keyboard focus without immediately reopening the hover/focus peek.
    suppressPeekOnNextFocus = true;
    trainerBall.focus({ preventScroll: true });
    window.requestAnimationFrame(() => { suppressPeekOnNextFocus = false; });
  }

  function openTrainerCard() {
    window.clearTimeout(cardRevealTimer);
    window.clearTimeout(vaultIntentTimer);
    window.clearTimeout(vaultPeekTimer);
    cancelVaultClose();
    closeBioPanel();
    hideProfilePeek();
    stopBallWobbleTimer();
    ballHit.classList.add("vault-open");
    trainerBall.classList.add("is-open");
    trainerBall.setAttribute("aria-expanded", "true");
    trainerBall.setAttribute("aria-label", "Close trainer card for Daveen Raphael A. Peñaranda");
    playSoundEffect("latch");
    cardRevealTimer = window.setTimeout(() => {
      trainerCard.hidden = false;
      positionBallPanel(trainerCard);
      trainerCard.classList.remove("card-revealed");
      requestAnimationFrame(() => trainerCard.classList.add("card-revealed"));
      closeCardButton.focus({ preventScroll: true });
    }, reducedMotion.matches ? 0 : 420);
  }

  function closeTrainerCard({ returnFocus = false } = {}) {
    if (!trainerCard || !trainerBall) return;
    window.clearTimeout(cardRevealTimer);
    window.clearTimeout(vaultIntentTimer);
    const wasOpen = trainerBall.getAttribute("aria-expanded") === "true" || !trainerCard.hidden;
    trainerCard.hidden = true;
    trainerCard.classList.remove("card-revealed", "is-mobile-sheet", "is-modal");
    trainerCard.style.cssText = "";
    trainerBall.classList.remove("is-open");
    trainerBall.setAttribute("aria-expanded", "false");
    trainerBall.setAttribute("aria-label", "Open trainer card for Daveen Raphael A. Peñaranda");
    if (returnFocus) focusBallAfterPopoverClose();
    const shouldStayOpen = ballHit.matches(":hover") || (!returnFocus && ballHit.contains(document.activeElement));
    if (shouldStayOpen) {
      cancelVaultClose();
      ballHit.classList.add("vault-open");
    } else if (wasOpen) {
      finishVaultClose();
    } else {
      ballScrim.hidden = true;
    }
  }

  trainerBall.addEventListener("click", () => {
    if (trainerBall.getAttribute("aria-expanded") === "true") closeTrainerCard({ returnFocus: true });
    else openTrainerCard();
  });
  closeCardButton.addEventListener("click", () => closeTrainerCard({ returnFocus: true }));
  document.addEventListener("pointerdown", (event) => {
    if (ballScrim.contains(event.target)) return;
    if ((trainerBall.getAttribute("aria-expanded") === "true" || !trainerCard.hidden)
      && !trainerCard.contains(event.target) && !ballHit.contains(event.target)) {
      closeTrainerCard();
      return;
    }
    if (!profilePeek.hidden && !profilePeek.contains(event.target) && !ballHit.contains(event.target)) {
      finishVaultClose();
    }
  });
  ballScrim.addEventListener("click", () => {
    if (!trainerCard.hidden || trainerBall.getAttribute("aria-expanded") === "true") closeTrainerCard({ returnFocus: true });
    else finishVaultClose();
  });
  // Reposition an open popover whenever the viewport changes.
  window.addEventListener("resize", () => {
    if (!profilePeek.hidden) positionBallPanel(profilePeek);
    if (!trainerCard.hidden) positionBallPanel(trainerCard);
  }, { passive: true });

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

  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("tab-hidden", document.hidden);
    updateSpritePlayback();
    if (document.hidden) {
      stopBallWobbleTimer();
      window.clearTimeout(vaultIntentTimer);
      window.clearTimeout(vaultPeekTimer);
      window.clearTimeout(vaultCloseTimer);
      stopIdleTimer();
      pauseAudioForHiddenTab();
    } else {
      if (activeIndex === 0) {
        startBallWobbleTimer();
        resetIdleTimer();
      }
      resumeAudioForVisibleTab();
    }
  });

  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      document.body.classList.remove("transitioning");
      clearTilt();
      if (spriteParallaxFrame) window.cancelAnimationFrame(spriteParallaxFrame);
      spriteParallaxFrame = 0;
      spriteRows.querySelectorAll(".sprite-row").forEach((row) => row.style.setProperty("--pointer-y", "0px"));
      stopBallWobbleTimer();
      stopSpriteSparkles();
      window.clearTimeout(vaultIntentTimer);
      window.clearTimeout(vaultPeekTimer);
      window.clearTimeout(vaultCloseTimer);
      window.clearTimeout(vaultCloseFinishTimer);
      ballHit.classList.remove("vault-closing");
      ballWobble.classList.remove("is-wobbling");
      window.clearTimeout(bioTypingTimer);
      if (bioPanel.dataset.open === "true") completeBioText();
    } else {
      if (activeIndex === 0) startBallWobbleTimer();
      updateSpritePlayback();
    }
  });
})();
