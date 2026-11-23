/* Davin the Project — Build 02. Beginner note: this file wires page, theme, sound, and home interactions. */
(() => {
  "use strict";

  // EDIT HERE: personalize the homepage and tune its light effects.
  const CONFIG = {
    displayName: ["DAVEEN", "PEÑARANDA"],
    showProjectHeadline: false,
    trainerSpriteSrc: "",
    themeNames: ["parchment", "night", "slate"],
    spriteRows: { desktop: 4, short: 3, phone: 2 },
    spriteSpeeds: { far: 110, near: 55 },
    soundDefault: false,
    audioFile: "",
    ballWobbleInterval: 7000,
    detailIntentDelay: 120,
    detailHideDelay: 300,
    education: [
      { level: "Grade School", years: "2015–2020", school: "Don Mariano Marcos Memorial State University", campus: "South La Union Campus", status: "COMPLETED", schoolKey: "dmmmsu", proofImage: "assets/proofs/grade-school-dmmmsu.jpg", proofAlt: "Grade-school education at DMMMSU South La Union Campus" },
      { level: "Junior High School", years: "2020–2024", school: "Don Mariano Marcos Memorial State University", campus: "South La Union Campus", status: "COMPLETED", schoolKey: "dmmmsu", proofImage: "assets/proofs/junior-high-dmmmsu.jpg", proofAlt: "Junior-high graduation photo labeled Grade 10, Batch 2023–2024" },
      { level: "Senior High School", years: "2024–2026", school: "Don Mariano Marcos Memorial State University", campus: "South La Union Campus", status: "COMPLETED", schoolKey: "dmmmsu", proofImage: "assets/proofs/senior-high-dmmmsu.jpg", proofAlt: "Senior-high graduation portrait labeled Grade 12 STEM, Batch 2026" },
      { level: "College", years: "AUG 2026–PRESENT", school: "University of the Cordilleras", program: "Computer Science", status: "IN SESSION", schoolKey: "uc" }
    ],
    proofTapeMoments: [
      { title: "DMMMSU Campus · Profile", image: "assets/proofs/dmmmsu-campus-profile.jpg", alt: "Daveen in school uniform at the DMMMSU-SLUC campus entrance, looking toward the campus sign" },
      { title: "DMMMSU Campus · Portrait", image: "assets/proofs/dmmmsu-campus-portrait.jpg", alt: "Daveen wearing his school uniform and medal at the DMMMSU-SLUC campus entrance" }
    ],
    achievements: [
      { id: "academic", title: "Academic Excellence Award", category: "ACADEMICS", stage: "GRADE SCHOOL / HIGH SCHOOL", years: [], note: "Recognized throughout grade school and high school.", icon: "star", proofImages: [
        { title: "Medal Presentation", src: "assets/proofs/academic-excellence-medal-presentation.jpg", alt: "Daveen receives a medal from an educator during a graduation recognition ceremony" },
        { title: "Graduation Day", src: "assets/proofs/academic-excellence-graduation.jpg", alt: "Daveen stands with classmates and educators at a graduation ceremony" }
      ] },
      { id: "journalist", title: "Campus Journalist", category: "MEDIA", stage: "THE FORUMN / SCHOOL PUBLICATION", years: [], note: "Campus journalist for The Forumn school publication.", icon: "quill", proofImage: "assets/proofs/the-climb-journalism.jpg", proofAlt: "The Climb: Journey Beyond the Goal, a feature story about graduates" },
      { id: "broadcaster", title: "Broadcaster", category: "MEDIA", stage: "BROADCASTING", years: [], note: "Experience as a campus broadcaster.", icon: "mic" },
      { id: "milo", title: "MILO Little Olympics 2019", category: "ATHLETICS", stage: "GRADE SCHOOL", years: ["2019"], note: "Qualified and competed in the MILO Little Olympics in 2019.", icon: "medal" },
      { id: "divisions", title: "Division Meet · Volleyball (Men's)", category: "ATHLETICS", stage: "JUNIOR HIGH / SENIOR HIGH", years: ["2023", "2025"], note: "Qualified and competed in the men's volleyball Division Meet in 2023 and 2025.", icon: "medal", proofImage: "assets/proofs/athletics-volleyball-team.jpg", proofAlt: "The volleyball team huddles together after a match" }
    ],
    certificates: [
      { id: "certificate-placeholder-01", title: "CERTIFICATE — TO BE ADDED", issuer: "", date: "", fileUrl: "", previewImage: "", previewAlt: "Certificate placeholder" },
      { id: "certificate-placeholder-02", title: "CERTIFICATE — TO BE ADDED", issuer: "", date: "", fileUrl: "", previewImage: "", previewAlt: "Certificate placeholder" }
    ],
    family: [
      { name: "MY MAMA", relation: "FAMILY / 01", photo: "assets/family/my-mama.webp", alt: "Daveen with his mother", note: "Thank you for your unconditional love, sacrifices, and unwavering support. I am grateful for everything you have done and continue to do for me." },
      { name: "MY PAPA", relation: "FAMILY / 02", photo: "assets/family/my-papa.webp", alt: "Daveen with his father", note: "Thank you for your protection, guidance, and support. Your presence and the ways you look after me mean more than words can express." },
      { name: "MY ADING", relation: "FAMILY / 03", photo: "assets/family/my-ading.webp", alt: "Daveen with his sibling", note: "You inspire me to keep becoming a better kuya. I want to continue growing, improving, and becoming someone you can always look up to." }
    ],
    friends: [
      { title: "THE SQUAD / 01", photo: "assets/friends/squad-01.webp", alt: "Daveen with friends at school" },
      { title: "THE SQUAD / 02", photo: "assets/friends/squad-02.webp", alt: "A group photograph with friends" },
      { title: "THE SQUAD / 03", photo: "assets/friends/squad-03.webp", alt: "Friends together during a karaoke outing" }
    ],
    supplementaryPhotos: [
  {
    photo: "assets/family/memory-01.jpg"
  },
  {
    photo: "assets/family/memory-02.jpg"
  },
  {
    photo: "assets/family/memory-03.jpg"
  },
  {
    photo: "assets/family/memory-04.jpg"
  }
    ],
    partyNote: "These people have been a blessing in my life. Their presence, encouragement, and determination continually push and inspire me to pursue excellence. I am grateful to have people who challenge me to grow, celebrate progress, and strive for something greater together.",
    contact: { email: "dap1801@students.uc-bcf.edu.ph" }
  };

  document.body.classList.add("js");

  // Apply the editable display name from CONFIG to the two visible name lines.
  document.querySelectorAll("#home-title .name-line").forEach((line, index) => {
    if (CONFIG.displayName[index]) line.textContent = CONFIG.displayName[index];
  });

  // EDIT HERE: the order here controls hashes, keys, indicators, and corner navigation.
  const pages = ["home", "personal", "education", "family"];
  const pageNames = ["Home", "Personal Information", "Education", "Family & Friends"];
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
  const personalPage = document.getElementById("personal");
  const educationPage = document.getElementById("education");
  const personalStepTabs = Array.from(document.querySelectorAll("[data-personal-step]"));
  const educationStepTabs = Array.from(document.querySelectorAll("[data-education-step]"));
  function updateCompactTabs(page, tabs, attribute, value) {
    if (!page) return;
    page.dataset.step = value;
    tabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab.getAttribute(attribute) === value)));
  }
  personalStepTabs.forEach((tab) => tab.addEventListener("click", () => updateCompactTabs(personalPage, personalStepTabs, "data-personal-step", tab.getAttribute("data-personal-step"))));
  educationStepTabs.forEach((tab) => tab.addEventListener("click", () => updateCompactTabs(educationPage, educationStepTabs, "data-education-step", tab.getAttribute("data-education-step"))));
  const aboutProfileCard = document.getElementById("agent-profile");
  const aboutPhotoToggle = document.getElementById("about-photo-toggle");
  const siteIntro = document.getElementById("site-intro");
  let introStartTimer = 0;
  let introFinishTimer = 0;
  function finishSiteIntro() {
    window.clearTimeout(introStartTimer);
    window.clearTimeout(introFinishTimer);
    if (siteIntro) siteIntro.hidden = true;
    document.body.classList.remove("intro-playing");
  }
  function startSiteIntro() {
    if (!siteIntro || reducedMotion.matches) return;
    siteIntro.hidden = false;
    document.body.classList.add("intro-playing");
    introStartTimer = window.setTimeout(() => {
      siteIntro.classList.add("is-exiting");
      introFinishTimer = window.setTimeout(finishSiteIntro, 380);
    }, 1540);
  }
  const aboutProfilePhoto = document.getElementById("about-profile-photo");
  const aboutPhotoMode = document.getElementById("about-photo-mode");
  const portraitModeLabel = document.getElementById("portrait-mode-label");
  const portraitDetails = document.getElementById("portrait-details");
  const detailsClose = document.getElementById("details-close");
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
  let userPausedSprites = false;
  let spriteMotionOverride = false;
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
  let trainerSpriteImage = null;
  let trainerSpritePromise = null;
  let lastPointerType = "";


  // THEMES: start in PARCHMENT unless a previous theme choice was saved by this site.
  function readSavedTheme() {
    try {
      const saved = localStorage.getItem("davin-theme");
      return CONFIG.themeNames.includes(saved) ? saved : "parchment";
    } catch (_error) {
      return "parchment";
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
    const short = smallScreen.matches;
    const prevLabels = ["", "< HOME", "< PERSONAL INFORMATION", "< EDUCATION"];
    const nextLabels = ["TO PERSONAL INFORMATION >", "TO EDUCATION >", "TO FAMILY & FRIENDS >", "BACK TO HOME"];
    const compact = (label) => {
      if (!short) return label;
      if (label === "TO PERSONAL INFORMATION >") return "PERSONAL INFO >";
      if (label === "TO FAMILY & FRIENDS >") return "FAMILY & FRIENDS >";
      return label.replace("PERSONAL INFORMATION", "PERSONAL INFO");
    };
    pagePrev.hidden = activeIndex === 0;
    pagePrevLabel.textContent = compact(prevLabels[activeIndex]);
    pagePrev.setAttribute("aria-label", activeIndex === 0 ? "Previous page unavailable" : "Previous page: " + pageNames[activeIndex - 1]);
    pageNextLabel.textContent = compact(nextLabels[activeIndex]);
    pageNext.setAttribute("aria-label", activeIndex === 3 ? "Back to Home" : "Next page: " + pageNames[activeIndex + 1]);
  }

  function syncPage({ focusHeading = false } = {}) {
    activeIndex = indexFromHash();
    const pageStage = document.querySelector(".page-stage");
    if (pageStage) pageStage.scrollTop = 0;
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
    if (activeIndex === 1) {
      updateCompactTabs(personalPage, personalStepTabs, "data-personal-step", "identity");
      runAboutEntry();
    } else if (activeIndex === 2) {
      updateCompactTabs(educationPage, educationStepTabs, "data-education-step", "journey");
    } else {
      window.clearTimeout(aboutEntryTimer);
      if (personalPage) personalPage.classList.remove("is-entering");
    }
    closeStageDetails();
    setMobileMenu(false);
    document.body.classList.toggle("home-active", activeIndex === 0);
    document.body.classList.remove("personal-scroll-active");
    setSpritePage(activeIndex);
    updateSpritePlayback();
    updatePokedexAutoplay();
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
  // Initial sync runs after the page data is ready.

  // One wheel gesture changes one page; wait for trackpad inertia to settle.
  window.addEventListener("wheel", (event) => {
    const stage = document.querySelector(".page-stage");
    const maxScroll = stage ? Math.max(0, stage.scrollHeight - stage.clientHeight) : 0;
    const profileCanScroll = activeIndex === 1 && maxScroll > 2 &&
      ((event.deltaY > 0 && stage.scrollTop < maxScroll - 2) || (event.deltaY < 0 && stage.scrollTop > 2));
    if (profileCanScroll || Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
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
    } else if (/^[1-4]$/.test(event.key)) {
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
    if (!personalPage) return;
    window.clearTimeout(aboutEntryTimer);
    personalPage.classList.remove("is-entering");
    if (reducedMotion.matches) return;
    requestAnimationFrame(() => personalPage.classList.add("is-entering"));
    aboutEntryTimer = window.setTimeout(() => personalPage.classList.remove("is-entering"), 900);
  }

  function openStageDetails() {
    window.clearTimeout(detailIntentTimer);
    window.clearTimeout(detailHideTimer);
    if (detailsOpen) return;
    detailsOpen = true;
    portraitDetails.hidden = false;
    portraitDetails.classList.remove("is-visible");
    requestAnimationFrame(() => portraitDetails.classList.add("is-visible"));
  }

  function closeStageDetails({ returnFocus = false } = {}) {
    window.clearTimeout(detailIntentTimer);
    window.clearTimeout(detailHideTimer);
    if (!detailsOpen && portraitDetails.hidden) return;
    detailsOpen = false;
    portraitDetails.classList.remove("is-visible");
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
      if (detailsOpen) closeStageDetails(); else openStageDetails();
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


  // EDUCATION + FAMILY: all editable class data is kept in CONFIG above.
  const routeList = document.getElementById("education-route");
  const achievementIndex = document.getElementById("achievement-index");
  const achievementTotal = document.getElementById("achievement-total");
  const pokedexPanel = document.querySelector(".pokedex-panel");
  const pokedexCarousel = document.getElementById("pokedex-carousel");
  const pokedexCount = document.getElementById("pokedex-count");
  const pokedexProgress = document.getElementById("pokedex-progress");
  const proofRibbonTrack = document.getElementById("proof-ribbon-track");
  const proofRibbonCount = document.getElementById("proof-ribbon-count");
  let proofSlides = [];
  let activeProofIndex = 0;
  let proofAutoplayTimer = 0;
  let proofExitTimer = 0;
  const badgeIcons = {
    star: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 4 5.8 12 13.2 1.9-9.5 9.3 2.2 13.1L24 34.1l-11.7 6.2 2.2-13.1L5 17.9 18.2 16 24 4Z"/></svg>',
    quill: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M39 5C23 6 12 11 9 23c-2 8 5 12 11 8-1 6-5 9-9 11m5-12 12-11M12 36l-4 4m20-24 7 6"/></svg>',
    mic: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="17" y="5" width="14" height="24" rx="7"/><path d="M11 22v2a13 13 0 0 0 26 0v-2M24 37v7m-9 0h18"/></svg>',
    ball: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6a18 18 0 0 1 0 36"/><circle cx="24" cy="24" r="5"/></svg>',
    medal: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m14 5 10 9 10-9 5 2-4 17H13L9 7l5-2Z"/><circle cx="24" cy="33" r="10"/><path d="m24 27 2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4Z"/></svg>'
  };
  const schoolLogos = {
    dmmmsu: { src: "assets/logo-dmmmsu.jpg", alt: "Don Mariano Marcos Memorial State University logo" },
    uc: { src: "assets/logo-uc.jpg", alt: "University of the Cordilleras logo" }
  };
  function addText(parent, tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    parent.append(node);
    return node;
  }
  function renderRoute() {
    routeList.replaceChildren();
    const groups = new Map();
    CONFIG.education.forEach((entry) => {
      const key = entry.schoolKey || entry.school;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });

    groups.forEach((entries, key) => {
      const first = entries[0];
      const row = document.createElement("li");
      row.className = "school-record";
      row.dataset.school = key;

      const logoFrame = document.createElement("span");
      logoFrame.className = "school-record-logo";
      logoFrame.dataset.school = key;
      const logo = schoolLogos[key];
      if (logo) {
        const initials = key === "dmmmsu" ? "DMMMSU" : "UC";
        const fallback = addText(logoFrame, "span", "school-record-initial", initials);
        const image = document.createElement("img");
        image.src = logo.src;
        image.alt = logo.alt;
        image.width = 192;
        image.height = 192;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("load", () => { fallback.hidden = true; }, { once: true });
        image.addEventListener("error", () => { image.remove(); }, { once: true });
        logoFrame.append(image);
      } else {
        logoFrame.setAttribute("aria-hidden", "true");
        addText(logoFrame, "span", "school-record-initial", first.school.slice(0, 1));
      }

      const heading = document.createElement("div");
      heading.className = "school-record-heading";
      const headingLine = document.createElement("div");
      headingLine.className = "school-record-title-line";
      addText(headingLine, "h3", "school-record-name", first.school);
      const inSession = entries.some((entry) => entry.status === "IN SESSION");
      addText(headingLine, "span", "school-status" + (inSession ? " is-current" : ""), inSession ? "IN SESSION" : "COMPLETED");
      heading.append(headingLine);
      const context = [...new Set(entries.flatMap((entry) => [entry.campus, entry.program]).filter(Boolean))];
      if (context.length) addText(heading, "p", "school-record-context", context.join(" · "));

      const stages = document.createElement("ol");
      stages.className = "school-stage-list";
      entries.forEach((entry) => {
        const stage = document.createElement("li");
        stage.className = "school-stage";
        addText(stage, "span", "school-stage-level", entry.level);
        addText(stage, "span", "school-stage-years", entry.years);
        stages.append(stage);
      });

      const details = document.createElement("div");
      details.className = "school-record-details";
      details.append(heading, stages);
      row.append(logoFrame, details);
      routeList.append(row);
    });
  }
  function renderAchievementIndex() {
    achievementIndex.replaceChildren();
    CONFIG.achievements.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "achievement-index-item";
      addText(item, "span", "achievement-index-number", String(index + 1).padStart(2, "0"));
      const details = document.createElement("span");
      details.className = "achievement-index-details";
      addText(details, "span", "achievement-index-title", entry.title);
      addText(details, "span", "achievement-index-category", entry.category + ((entry.years || []).length ? " · " + entry.years.join(", ") : ""));
      item.append(details);
      achievementIndex.append(item);
    });
    achievementTotal.textContent = CONFIG.achievements.length + (CONFIG.achievements.length === 1 ? " RECORD" : " RECORDS");
  }
  function appendProofImage(art, src, alt, options = {}) {
    const images = Array.isArray(src) ? src : [{ src, alt }];
    if (images.length > 1) art.classList.add("is-photo-pair");
    images.forEach((proof) => {
      const photo = document.createElement("span");
      photo.className = "pokedex-proof-photo" + (options.fit === "contain" ? " is-document" : "");

      const backdrop = document.createElement("img");
      backdrop.className = "pokedex-proof-backdrop";
      backdrop.src = proof.src;
      backdrop.alt = "";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.decoding = "async";
      backdrop.loading = "eager";
      backdrop.draggable = false;

      const image = document.createElement("img");
      image.className = "pokedex-proof-image";
      image.src = proof.src;
      image.alt = proof.alt || alt || "Portfolio proof photo";
      image.decoding = "async";
      image.loading = "eager";
      image.draggable = false;
      image.addEventListener("error", () => {
        photo.replaceChildren();
        photo.classList.add("is-unavailable");
        addText(photo, "span", "pokedex-proof-placeholder", "PROOF PHOTO / TO RESTORE");
      }, { once: true });

      photo.append(backdrop, image);
      art.append(photo);
    });
  }
  function makeProofSlide(record, index, total) {
    const slide = document.createElement("article");
    slide.className = "pokedex-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", (index + 1) + " of " + total + ": " + record.title);
    slide.setAttribute("aria-hidden", String(index !== 0));
    slide.inert = index !== 0;

    const art = document.createElement("div");
    const hasImageProof = (record.type === "school" && record.entry.proofImage) || (record.type === "achievement" && (record.entry.proofImage || record.entry.proofImages)) || (record.type === "certificate" && record.entry.previewImage);
    art.className = "pokedex-art" + (record.type === "achievement" ? " is-achievement" : "") + (hasImageProof ? " is-photo-proof" : record.type === "certificate" ? " is-certificate-proof" : "");
    art.dataset.school = record.schoolKey || "";
    addText(art, "span", "pokedex-art-label", record.type === "school" ? "SCHOOL PROOF" : record.type === "certificate" ? "CERTIFICATE PROOF" : "ACHIEVEMENT PROOF");

    if (record.type === "school") {
      if (record.entry.proofImage) {
        appendProofImage(art, record.entry.proofImage, record.entry.proofAlt || record.entry.level + " graduation proof");
      } else {
        const frame = document.createElement("span");
        frame.className = "pokedex-emblem";
        frame.dataset.school = record.schoolKey;
        const logo = schoolLogos[record.schoolKey];
        if (logo) {
          const image = document.createElement("img");
          image.src = logo.src;
          image.alt = logo.alt;
          image.width = 192;
          image.height = 192;
          image.loading = "eager";
          image.decoding = "async";
          image.addEventListener("error", () => { image.hidden = true; }, { once: true });
          frame.append(image);
        }
        art.append(frame);
      }
    } else if (record.type === "achievement") {
      if (record.entry.proofImages || record.entry.proofImage) {
        const proof = record.entry.proofImages || record.entry.proofImage;
        appendProofImage(art, proof, record.entry.proofAlt || record.entry.title + " proof");
      } else {
        const emblem = document.createElement("span");
        emblem.className = "pokedex-achievement-emblem";
        emblem.innerHTML = badgeIcons[record.entry.icon] || badgeIcons.star;
        art.append(emblem);
      }
    } else if (record.entry.previewImage) {
      appendProofImage(art, record.entry.previewImage, record.entry.previewAlt || record.entry.title + " preview", { fit: "contain" });
    } else if (record.entry.fileUrl) {
      const documentFrame = document.createElement("iframe");
      documentFrame.className = "pokedex-document-frame";
      documentFrame.title = record.entry.title;
      documentFrame.src = record.entry.fileUrl + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";
      documentFrame.loading = "eager";
      documentFrame.tabIndex = -1;
      documentFrame.setAttribute("scrolling", "no");
      art.append(documentFrame);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "pokedex-certificate-placeholder";
      placeholder.textContent = "CERTIFICATE / TO BE ADDED";
      art.append(placeholder);
    }

    const copy = document.createElement("div");
    copy.className = "pokedex-copy";
    addText(copy, "span", "pokedex-copy-kicker", record.kicker);
    addText(copy, "h3", "pokedex-copy-title", record.title);
    if (record.type === "school") {
      if (record.context) addText(copy, "p", "pokedex-copy-context", record.context);
      addText(copy, "span", "pokedex-copy-years", record.years);
    } else if (record.type === "achievement") {
      addText(copy, "p", "pokedex-copy-context", record.entry.stage);
      addText(copy, "p", "pokedex-copy-note", record.entry.note);
      if ((record.entry.years || []).length) addText(copy, "span", "pokedex-copy-years", record.entry.years.join(" · "));
    } else {
      if (record.entry.issuer) addText(copy, "p", "pokedex-copy-context", record.entry.issuer);
      if (record.entry.date) addText(copy, "span", "pokedex-copy-years", record.entry.date);
    }
    slide.append(art, copy);
    return slide;
  }
  function updatePokedexDisplay() {
    if (!proofSlides.length) return;
    pokedexCount.textContent = String(activeProofIndex + 1).padStart(2, "0") + " / " + String(proofSlides.length).padStart(2, "0");
    pokedexProgress.style.width = ((activeProofIndex + 1) / proofSlides.length * 100) + "%";
  }
  function showProofSlide(nextIndex) {
    if (proofSlides.length < 2) return;
    const normalized = (nextIndex + proofSlides.length) % proofSlides.length;
    if (normalized === activeProofIndex) return;
    const previous = proofSlides[activeProofIndex];
    const next = proofSlides[normalized];
    previous.classList.remove("is-active", "is-exiting");
    previous.setAttribute("aria-hidden", "true");
    previous.inert = true;
    if (!reducedMotion.matches) previous.classList.add("is-exiting");
    next.classList.remove("is-exiting");
    next.classList.add("is-active");
    next.setAttribute("aria-hidden", "false");
    next.inert = false;
    activeProofIndex = normalized;
    updatePokedexDisplay();
    window.clearTimeout(proofExitTimer);
    proofExitTimer = window.setTimeout(() => previous.classList.remove("is-exiting"), 520);
  }
  function updatePokedexAutoplay() {
    window.clearTimeout(proofAutoplayTimer);
    const paused = document.hidden || !educationPage.classList.contains("active") || proofSlides.length < 2;
    pokedexPanel.classList.toggle("is-paused", paused);
    if (paused) return;
    proofAutoplayTimer = window.setTimeout(() => {
      showProofSlide(activeProofIndex + 1);
      updatePokedexAutoplay();
    }, 5400);
  }
  function renderPokedex() {
    pokedexCarousel.replaceChildren();
    const records = [];
    CONFIG.education.forEach((entry) => {
      const context = [entry.campus, entry.program].filter(Boolean).join(" · ");
      records.push({ type: "school", kicker: entry.level.toUpperCase(), title: entry.school, schoolKey: entry.schoolKey, context, years: entry.years, entry });
    });
    CONFIG.achievements.forEach((entry) => records.push({ type: "achievement", kicker: entry.category, title: entry.title, entry }));
    CONFIG.certificates.forEach((entry) => records.push({ type: "certificate", kicker: "ONLINE CERTIFICATE", title: entry.title, entry }));
    proofSlides = records.map((record, index) => makeProofSlide(record, index, records.length));
    proofSlides.forEach((slide, index) => {
      if (index === 0) slide.classList.add("is-active");
      pokedexCarousel.append(slide);
    });
    activeProofIndex = 0;
    updatePokedexDisplay();
    updatePokedexAutoplay();
  }
  function renderProofRibbon() {
    const educationRecords = CONFIG.education.map((entry) => {
      const logo = schoolLogos[entry.schoolKey];
      const image = entry.proofImage || (logo && logo.src);
      if (!image) return null;
      return {
        kind: "EDUCATION",
        title: entry.level,
        image,
        alt: entry.proofAlt || (logo ? logo.alt : entry.level + " proof")
      };
    }).filter(Boolean);
    const achievementRecords = CONFIG.achievements.flatMap((entry) => {
      const proofs = entry.proofImages || (entry.proofImage ? [{ src: entry.proofImage, alt: entry.proofAlt, title: "" }] : []);
      return proofs.map((proof) => ({
        kind: "ACHIEVEMENT",
        title: [entry.title, proof.title].filter(Boolean).join(" · "),
        image: proof.src,
        alt: proof.alt || entry.proofAlt || entry.title + " proof"
      }));
    });
    const campusRecords = (CONFIG.proofTapeMoments || []).map((entry) => ({
      kind: "EDUCATION",
      title: entry.title,
      image: entry.image,
      alt: entry.alt
    }));
    const certificateRecords = CONFIG.certificates.map((entry) => ({
      kind: "CERTIFICATE",
      title: entry.title,
      image: entry.previewImage,
      alt: entry.previewAlt || entry.title + " preview",
      mark: "ADD"
    }));
    const records = educationRecords.concat(campusRecords, achievementRecords, certificateRecords);
    proofRibbonCount.textContent = String(records.length).padStart(2, "0");

    function buildCycle(isDuplicate) {
      const cycle = document.createElement("div");
      cycle.className = "proof-ribbon-cycle" + (isDuplicate ? " is-duplicate" : "");
      cycle.setAttribute("role", "list");
      if (isDuplicate) {
        cycle.setAttribute("aria-hidden", "true");
        cycle.inert = true;
      } else {
        cycle.setAttribute("aria-label", "Education photos first, followed by achievement photos and certificate previews");
      }
      records.forEach((record, index) => {
        const item = document.createElement("article");
        item.className = "proof-ribbon-item";
        item.dataset.kind = record.kind.toLowerCase();
        item.setAttribute("role", "listitem");

        let media;
        if (record.image) {
          media = document.createElement("img");
          media.className = "proof-ribbon-image" + (record.kind === "CERTIFICATE" ? " is-document" : "");
          media.src = record.image;
          media.alt = isDuplicate ? "" : record.alt;
          media.loading = "eager";
          media.decoding = "async";
          media.draggable = false;
          media.addEventListener("error", () => {
            media.remove();
            item.classList.add("media-unavailable");
          }, { once: true });
        } else {
          media = document.createElement("span");
          media.className = "proof-ribbon-document-preview";
          media.setAttribute("aria-hidden", "true");
          addText(media, "b", "proof-ribbon-document-type", "PDF");
          addText(media, "span", "proof-ribbon-document-mark", record.mark);
        }

        const copy = document.createElement("span");
        copy.className = "proof-ribbon-copy";
        addText(copy, "span", "proof-ribbon-kind", record.kind);
        addText(copy, "span", "proof-ribbon-name", record.title);
        addText(item, "span", "proof-ribbon-number", String(index + 1).padStart(2, "0"));
        item.append(media, copy);
        cycle.append(item);
      });
      return cycle;
    }

    proofRibbonTrack.replaceChildren(buildCycle(false), buildCycle(true));
  }
  const familyGrid = document.getElementById("family-grid");
  const friendPhotoGrid = document.getElementById("friend-photo-grid");
  const familyFilmWindow = document.getElementById("family-film-window");
  const familyFilmTrack = document.getElementById("family-film-track");

  function makeGalleryImage(src, alt, className) {
    const image = document.createElement("img");
    image.className = className || "";
    image.src = src;
    image.alt = alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    image.addEventListener("error", () => {
      image.hidden = true;
      image.parentElement?.classList.add("image-unavailable");
    }, { once: true });
    return image;
  }

  function drawFoundationCard(member, index) {
    const card = document.createElement("article");
    card.className = "foundation-card";
    card.dataset.auditBox = "";
    const photo = document.createElement("div");
    photo.className = "foundation-photo";
    photo.setAttribute("aria-hidden", "true");
    addText(photo, "span", "foundation-monogram", String(index + 1).padStart(2, "0"));
    if (member.photo) photo.append(makeGalleryImage(member.photo, member.alt, ""));
    const copy = document.createElement("div");
    copy.className = "foundation-copy";
    addText(copy, "span", "foundation-relation", member.relation || "FOUNDATION");
    addText(copy, "h3", "foundation-name", member.name);
    addText(copy, "p", "foundation-note", member.note || "");
    card.append(photo, copy);
    return card;
  }

  function drawSquadPhoto(photo, index) {
    const figure = document.createElement("figure");
    figure.className = "squad-photo-card";
    const frame = document.createElement("div");
    frame.className = "squad-photo-frame";
    addText(frame, "span", "squad-photo-number", String(index + 1).padStart(2, "0"));
    frame.append(makeGalleryImage(photo.photo, photo.alt || photo.title, ""));
    const caption = document.createElement("figcaption");
    caption.textContent = photo.title || ("MEMORY / " + String(index + 1).padStart(2, "0"));
    figure.append(frame, caption);
    return figure;
  }

  function renderMemoryFilm() {
    familyFilmTrack.replaceChildren();
    const photos = Array.isArray(CONFIG.supplementaryPhotos) ? CONFIG.supplementaryPhotos.filter((item) => item && item.photo) : [];
    if (!photos.length) {
      familyFilmWindow.classList.add("is-empty");
      const empty = document.createElement("div");
      empty.className = "film-empty-state";
      [1, 2, 3, 4].forEach((number) => {
        const frame = document.createElement("span");
        frame.className = "film-empty-frame";
        addText(frame, "b", "film-frame-number", "FRAME " + String(number).padStart(2, "0"));
        addText(frame, "i", "film-frame-placeholder", "PHOTO TO COME");
        empty.append(frame);
      });
      familyFilmTrack.append(empty);
      return;
    }
    familyFilmWindow.classList.remove("is-empty");
    for (let cycleIndex = 0; cycleIndex < 2; cycleIndex += 1) {
      const cycle = document.createElement("div");
      cycle.className = "family-film-cycle";
      cycle.setAttribute("aria-hidden", cycleIndex === 1 ? "true" : "false");
      if (cycleIndex === 1) cycle.inert = true;
      photos.forEach((item, index) => {
        const frame = document.createElement("figure");
        frame.className = "family-film-frame";
        frame.append(makeGalleryImage(item.photo, cycleIndex ? "" : (item.alt || item.title || "Additional memory"), ""));
        const caption = document.createElement("figcaption");
        caption.textContent = item.title || ("MEMORY / " + String(index + 1).padStart(2, "0"));
        frame.append(caption);
        cycle.append(frame);
      });
      familyFilmTrack.append(cycle);
    }
    familyFilmWindow.classList.add("has-frames");
  }

  function renderFamily() {
    familyGrid.replaceChildren(...CONFIG.family.map(drawFoundationCard));
    friendPhotoGrid.replaceChildren(...CONFIG.friends.map(drawSquadPhoto));
    document.getElementById("squad-caption").textContent = CONFIG.partyNote;
    document.getElementById("squad-closing").textContent = "Always hoping we all excel!";
    renderMemoryFilm();
  }

  if (CONFIG.contact && CONFIG.contact.email) {
    const email = document.getElementById("personal-email");
    email.href = "mailto:" + CONFIG.contact.email;
    email.textContent = CONFIG.contact.email;
    document.getElementById("personal-contact").hidden = false;
  }
  document.querySelectorAll(".logo-frame img").forEach((image) => { image.addEventListener("error", () => { image.hidden = true; }, { once: true }); });
  renderRoute(); renderAchievementIndex(); renderPokedex(); renderProofRibbon(); renderFamily();


  // One shared sprite ribbon is moved to the active page and repopulated from local files.
  const homePokemon = [
    [1,"Bulbasaur"],[4,"Charmander"],[6,"Charizard"],[7,"Squirtle"],[25,"Pikachu"],
    [39,"Jigglypuff"],[54,"Psyduck"],[94,"Gengar"],[130,"Gyarados"],[133,"Eevee"],
    [143,"Snorlax"],[149,"Dragonite"],[150,"Mewtwo"],[151,"Mew"],[152,"Chikorita"],
    [155,"Cyndaquil"],[158,"Totodile"],[175,"Togepi"],[196,"Espeon"],[197,"Umbreon"],
    [258,"Mudkip"],[384,"Rayquaza"],[448,"Lucario"],[650,"Chespin"],[653,"Fennekin"],
    [656,"Froakie"],[658,"Greninja"],[722,"Rowlet"],[725,"Litten"],[728,"Popplio"]
  ];
  const pageSpriteIds = {
    personal: [3,9,26,37,52,63,66,74,95,104,123,129,131,132,137,144,147],
    education: [172,179,183,194,212,248,249,252,254,255,257,282,359,373,385,387,390],
    family: [393,443,445,475,495,498,501,570,571,678,681,700,724,727,730,745]
  };
  let spritePageKey = "";
  function spriteSourceFor(id) { return "./sprites/" + id + ".png"; }
  function rowCountForViewport(pageId) {
    if (pageId === "home") {
      if (smallScreen.matches) return CONFIG.spriteRows.phone;
      return window.innerHeight >= 768 ? CONFIG.spriteRows.desktop : CONFIG.spriteRows.short;
    }
    return window.innerHeight >= 900 ? 3 : 2;
  }
  let spriteImageTotal = 0;
  let spriteImageSettled = 0;
  let spriteImageLoaded = 0;
  function updateSpriteAvailability() {
    if (spriteImageSettled < spriteImageTotal) return;
    const available = spriteImageLoaded > 0;
    spriteBand.hidden = !available;
    spriteToggle.hidden = !available;
  }
  function makeSpriteItem(entry, background) {
    const item = document.createElement("span");
    item.className = "sprite-item";
    item.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = spriteSourceFor(entry[0]);
    image.width = 96; image.height = 96; image.alt = ""; image.decoding = "async";
    image.addEventListener("load", () => {
      spriteImageLoaded += 1;
      spriteImageSettled += 1;
      spriteBand.hidden = false;
      spriteToggle.hidden = false;
    }, { once: true });
    image.addEventListener("error", () => {
      item.remove();
      spriteImageSettled += 1;
      updateSpriteAvailability();
    }, { once: true });
    item.append(image);
    if (!background) {
      const label = document.createElement("span");
      label.className = "sprite-name";
      label.textContent = entry[1];
      item.append(label);
    }
    return item;
  }
  function buildSpriteRows(entries, count, background, span) {
    spriteImageTotal = entries.length;
    spriteImageSettled = 0;
    spriteImageLoaded = 0;
    spriteBand.hidden = entries.length === 0;
    spriteToggle.hidden = entries.length === 0;
    spriteRows.replaceChildren();
    const rows = Array.from({length:count}, () => []);
    entries.forEach((entry, index) => rows[index % count].push(entry));
    rows.forEach((list, index) => {
      const row = document.createElement("div");
      row.className = "sprite-row";
      const track = document.createElement("div");
      track.className = "sprite-track " + (index % 2 ? "moves-right" : "moves-left");
      const set = document.createElement("div");
      set.className = "sprite-set";
      set.style.minWidth = span + "px";
      set.style.justifyContent = "space-around";
      list.forEach((entry) => set.append(makeSpriteItem(entry, background)));
      track.append(set, set.cloneNode(true)); row.append(track);
      row.style.top = ((index + 0.5) / count * 100) + "%";
      row.style.setProperty("--row-speed", (background ? (index % 2 ? "62s" : "48s") : (index % 2 ? "68s" : "52s")));
      row.style.setProperty("--row-size", (background ? "48px" : (smallScreen.matches ? "48px" : "72px")));
      spriteRows.append(row);
    });
  }
  function setSpritePage(index) {
    if (!spriteBand || !spriteRows || !spriteToggle) return;
    const pageId = pages[index] || "home";
    const parent = pageId === "home" ? portraitStage : pageElements[index];
    if (!parent) return;
    const controlsParent = pageId === "personal" ? (parent.querySelector(".page-heading") || parent) : parent;
    const rowCount = rowCountForViewport(pageId);
    const key = pageId + ":" + rowCount;
    if (spritePageKey !== key) {
      spriteBand.classList.remove("is-visible");
      spriteBand.dataset.context = pageId;
      spriteBand.dataset.background = String(pageId !== "home");
      const entries = pageId === "home" ? homePokemon : (pageSpriteIds[pageId] || []).map((id) => [id, ""]);
      const span = Math.max(1, Math.ceil(parent.getBoundingClientRect().width || window.innerWidth));
      buildSpriteRows(entries, rowCount, pageId !== "home", span);
      spritePageKey = key;
    }
    if (spriteBand.parentElement !== parent) {
      parent.insertBefore(spriteBand, parent.firstElementChild);
      controlsParent.append(spriteToggle);
    }
    spriteBand.hidden = spriteImageLoaded === 0 && spriteImageSettled >= spriteImageTotal && spriteImageTotal > 0;
    spriteToggle.hidden = spriteBand.hidden || spriteImageTotal === 0;
    requestAnimationFrame(() => spriteBand.classList.add("is-visible"));
    updateSpritePlayback();
  }
  function updateSpritePlayback() {
    if (!spriteBand || !spriteToggle) return;
    const reduceMotionPause = reducedMotion.matches && !spriteMotionOverride;
    const paused = userPausedSprites || document.hidden || reduceMotionPause || pages[activeIndex] !== spriteBand.dataset.context;
    spriteBand.classList.toggle("is-paused", paused);
    spriteBand.classList.toggle("is-static", reduceMotionPause);
    spriteToggle.setAttribute("aria-pressed", String(paused));
    spriteToggle.setAttribute("aria-label", paused ? "Play sprite ribbon" : "Pause sprite ribbon");
    spriteToggle.title = paused ? "Play sprite ribbon" : "Pause sprite ribbon";
    spriteToggle.textContent = paused ? "▶" : "Ⅱ";
  }
  if (spriteToggle) spriteToggle.addEventListener("click", () => {
    const reduceMotionPause = reducedMotion.matches && !spriteMotionOverride;
    if (reduceMotionPause && !userPausedSprites) {
      spriteMotionOverride = true;
      userPausedSprites = false;
    } else {
      userPausedSprites = !userPausedSprites;
    }
    updateSpritePlayback();
  });
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      spritePageKey = "";
      setSpritePage(activeIndex);
    }, 200);
  }, {passive:true});

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
    updatePokedexAutoplay();
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
      finishSiteIntro();
      document.body.classList.remove("transitioning");
      if (spriteParallaxFrame) window.cancelAnimationFrame(spriteParallaxFrame);
      spriteParallaxFrame = 0;
      spriteRows.querySelectorAll(".sprite-row").forEach((row) => row.style.setProperty("--pointer-y", "0px"));
      stopBallWobbleTimer();
      if (photoParallaxFrame) window.cancelAnimationFrame(photoParallaxFrame);
      photoParallaxFrame = 0;
      portraitStage.style.setProperty("--photo-x", "0px"); portraitStage.style.setProperty("--photo-y", "0px");
      portraitStage.style.setProperty("--frame-x", "0px"); portraitStage.style.setProperty("--frame-y", "0px");
      window.clearTimeout(detailIntentTimer);
      window.clearTimeout(detailHideTimer);
    } else {
      if (activeIndex === 0) startBallWobbleTimer();
      updateSpritePlayback();
    }
    updatePokedexAutoplay();
  });
  syncPage();
  document.documentElement.classList.add("js-ready");
  window.requestAnimationFrame(startSiteIntro);
})();
