/* Davin the Project: cinematic layer ("the director").
 *
 * ARCHITECTURE
 *   Davin.js    = game state: routing, theme, sound, data. It announces what happens via events:
 *                 davin:intro-done, davin:pagechange {index, previous}.  It plays sound on davin:sfx.
 *   davin-fx.js = this file. It listens to those events and never reaches into Davin.js internals.
 *   anime.js    = the timeline director (DOM, SVG and the 3D ball state all run on anime timelines).
 *   Three.js    = renders the Poké Ball only (vendor/davin-ball3d.js, lazy-loaded, optional).
 *
 * SAFETY RULES (a portfolio must never break)
 *   1. Everything is optional: no anime.js means no FX and the site works exactly as before.
 *   2. No WebGL, a failed script load, or ?fx=lite means the ball falls back to a CSS ball. The intro still plays.
 *   3. Reduced-motion users get no intros and no typing; content is simply there.
 *   4. Every entrance animation cleans up its inline styles, so hover/tilt CSS keeps working afterwards.
 *   5. Cutscenes are skippable (click, Enter, Space, Esc, arrows) and play in full only once per session.
 */
(() => {
  "use strict";
  const A = window.anime;
  const root = document.documentElement;
  if (!A) return;
  root.classList.add("fx");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const rand = (a, b) => a + Math.random() * (b - a);
  const sfx = (kind) => document.dispatchEvent(new CustomEvent("davin:sfx", { detail: kind }));
  const isLite = () => root.classList.contains("fx-lite");
  const store = {
    get(key) { try { return window.sessionStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { window.sessionStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
  };
  const clearInline = (els, props) => els.forEach((el) => props.forEach((p) => el.style.removeProperty(p)));
  const ROUTES = ["home", "personal", "education", "family"];

  /* ------------------------------------------------------------------ */
  /* 1. TITLE SCREEN: letter slam-in, staggered HUD, one portrait scan.   */
  /* ------------------------------------------------------------------ */
  const Title = (() => {
    const lines = $$("#home-title .name-line");
    let played = false;

    function split() {
      lines.forEach((line) => {
        if (line.dataset.fxText) return;
        const text = line.textContent.normalize("NFC");
        line.dataset.fxText = text;
        line.textContent = "";
        Array.from(text).forEach((ch) => {
          const span = document.createElement("span");
          span.className = "fx-ch";
          span.setAttribute("aria-hidden", "true");
          span.textContent = ch;
          line.append(span);
        });
      });
    }
    function restore() {
      lines.forEach((line) => { if (line.dataset.fxText) { line.textContent = line.dataset.fxText; delete line.dataset.fxText; } });
      root.classList.remove("fx-title-pending");
    }
    function tape() {
      const home = $("#home");
      if (!home || $(".fx-tape", home)) return;
      const run = "<span>WHERE IDEAS WARP INTO REALITY &#10022; DAVIN THE PROJECT &#10022;</span>".repeat(4);
      const node = document.createElement("div");
      node.className = "fx-tape";
      node.setAttribute("aria-hidden", "true");
      node.innerHTML = '<div class="fx-tape-track">' + run + run + "</div>";
      home.prepend(node);
    }
    function prepare() {
      if (reduced.matches || !lines.length) return;
      tape();
      split();
      root.classList.add("fx-title-pending");           // letters stay invisible until play() runs
      window.setTimeout(restore, 12000);                 // failsafe: the name can never stay hidden
    }
    function scan() {
      const stage = $("#portrait-stage");
      if (!stage) return;
      if (!$(".fx-scan", stage)) { const beam = document.createElement("span"); beam.className = "fx-scan"; beam.setAttribute("aria-hidden", "true"); stage.append(beam); }
      stage.classList.remove("fx-scan-run");
      void stage.offsetWidth;
      stage.classList.add("fx-scan-run");
      window.setTimeout(() => stage.classList.remove("fx-scan-run"), 1500);
    }
    function play() {
      if (reduced.matches || !lines.length) { restore(); return; }
      scan();
      if (played) return;
      played = true;
      split();
      const chars = $$("#home-title .fx-ch");
      const copy = ["#home .home-eyebrow", "#home .about-slot", "#home .home-cta", "#home .prepared-for"].flatMap((s) => $$(s));
      const chips = $$("#home .role-chips li");
      A.set(chars, { opacity: 0 });
      root.classList.remove("fx-title-pending");
      root.classList.add("fx-title-run");
      const clean = () => { restore(); root.classList.remove("fx-title-run"); clearInline(copy.concat(chips), ["transform", "opacity"]); };
      A.timeline({ easing: "easeOutExpo", complete: clean })
        .add({ targets: chars, translateY: ["72%", "0%"], skewX: ["-26deg", "0deg"], opacity: [0, 1], duration: 780, delay: A.stagger(34) })
        .add({ targets: copy, translateX: [-28, 0], opacity: [0, 1], duration: 560, delay: A.stagger(70) }, 300)
        .add({ targets: chips, translateX: [-28, 0], skewX: ["-8deg", "-8deg"], opacity: [0, 1], duration: 560, delay: A.stagger(70) }, 380);
    }
    return { prepare, play };
  })();

  /* ------------------------------------------------------------------ */
  /* 2. DRIFT: tiny pixel Poké Balls floating up behind the title screen. */
  /* ------------------------------------------------------------------ */
  const Drift = (() => {
    let anims = [];
    let host = null;
    function build() {
      const home = $("#home");
      if (!home || reduced.matches || window.innerWidth <= 600) return;
      host = document.createElement("div");
      host.className = "fx-drift";
      host.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 6; i += 1) {
        const ball = document.createElement("i");
        ball.style.left = (8 + i * 16 + rand(-4, 4)).toFixed(1) + "%";
        ball.style.setProperty("--size", Math.round(rand(16, 30)) + "px");
        host.append(ball);
      }
      home.prepend(host);
      const height = () => host.clientHeight || window.innerHeight;
      anims = $$("i", host).map((ball, i) => A({
        targets: ball, translateY: [height() + 40, -60], rotate: [0, (i % 2 ? -1 : 1) * 360],
        duration: rand(16000, 26000), delay: rand(0, 9000), easing: "linear", loop: true, autoplay: false
      }));
    }
    const toggle = (on) => anims.forEach((a) => (on && !isLite() ? a.play() : a.pause()));
    return { build, toggle };
  })();

  /* ------------------------------------------------------------------ */
  /* 3. PERSONAL INFORMATION: NPC dialogue strip (typewriter + choices).  */
  /* ------------------------------------------------------------------ */
  const Dialogue = (() => {
    const SCRIPT = [
      "Hey, I'm Daveen. I'm a Computer Science student who learns by making.",
      "My loop: test an idea, see what happens, build again.",
      "I'm exploring game development and AI / machine learning.",
      "I hope to build games that entertain, teach, and spark curiosity.",
      "So, where to next?"
    ];
    let box = null, textEl = null, choices = null, tween = null, autoTimer = 0, line = 0, typing = false;

    function build() {
      const heading = $("#personal .page-heading");
      const note = heading && $(".heading-note", heading);
      if (!heading || !note) return;
      box = document.createElement("div");
      box.className = "fx-dlg";
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", "Dialogue with Daveen");
      box.dataset.auditBox = "dialogue";
      box.innerHTML =
        '<span class="fx-dlg-face" aria-hidden="true"><b>D</b><img alt="" src="assets/about-portrait-800.webp" /></span>' +
        '<div class="fx-dlg-main"><span class="fx-dlg-name" aria-hidden="true">DAVEEN <i>/ PLAYER 001</i></span>' +
        '<div class="fx-dlg-body"><p class="fx-dlg-text" aria-hidden="true"></p>' +
        '<span class="fx-dlg-choices"><button type="button" data-go="2">ACHIEVEMENTS</button><button type="button" data-go="3">FAMILY &amp; FRIENDS</button></span></div></div>' +
        '<button class="fx-dlg-next" type="button" aria-label="Next line of dialogue">&#9660;</button>' +
        '<p class="sr-only">' + SCRIPT.slice(0, -1).join(" ") + "</p>";
      heading.insertBefore(box, note);
      emblem();
      textEl = $(".fx-dlg-text", box);
      choices = $(".fx-dlg-choices", box);
      const face = $(".fx-dlg-face img", box);
      face.addEventListener("error", () => face.remove());
      $(".fx-dlg-next", box).addEventListener("click", () => advance());
      box.addEventListener("click", (event) => { if (!event.target.closest("button")) advance(); });
      box.addEventListener("pointerenter", () => window.clearTimeout(autoTimer));
      box.addEventListener("pointerleave", () => { if (!typing) schedule(); });
      $$("[data-go]", box).forEach((button) => button.addEventListener("click", () => {
        const link = $('a.nav-tile[data-nav="' + button.dataset.go + '"]');
        if (link) link.click();
      }));
    }
    function emblem() {
      // Depth layer: a faint rotating lens ring sits behind the Dossier text (z-index -1), filling the dead space with atmosphere.
      const dossier = $("#personal .agent-dossier");
      if (!dossier || $(".fx-emblem", dossier)) return;
      const node = document.createElement("span");
      node.className = "fx-emblem";
      node.setAttribute("aria-hidden", "true");
      node.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="38" stroke-dasharray="3 5"/><path d="M4 50h30M66 50h30"/><circle cx="50" cy="50" r="16"/><circle cx="50" cy="50" r="7"/></svg>';
      dossier.append(node);
    }
    function stopTween() { if (tween) { tween.pause(); tween = null; } }
    function show(text) {
      textEl.textContent = text;
      typing = false;
      box.classList.remove("is-typing");
      box.classList.toggle("is-last", line >= SCRIPT.length - 1);
    }
    function say(index) {
      window.clearTimeout(autoTimer);
      stopTween();
      line = Math.max(0, Math.min(SCRIPT.length - 1, index));
      const text = SCRIPT[line];
      if (reduced.matches) { show(text); return; }
      typing = true;
      box.classList.add("is-typing");
      box.classList.toggle("is-last", line >= SCRIPT.length - 1);
      const o = { n: 0 };
      let last = -1;
      tween = A({
        targets: o, n: text.length, round: 1, easing: "linear", duration: Math.max(380, text.length * 24),
        update: () => {
          if (o.n === last) return;
          last = o.n;
          textEl.textContent = text.slice(0, o.n);
          if (o.n % 3 === 1) sfx("blip");
        },
        complete: () => { show(text); schedule(); }
      });
    }
    function schedule() {
      window.clearTimeout(autoTimer);
      if (reduced.matches || line >= SCRIPT.length - 1) return;
      autoTimer = window.setTimeout(() => say(line + 1), 2600);
    }
    function advance() {
      if (typing) { stopTween(); show(SCRIPT[line]); schedule(); return; }
      say(line >= SCRIPT.length - 1 ? 0 : line + 1);
    }
    function start() {
      if (!box) return;
      window.clearTimeout(autoTimer);
      autoTimer = window.setTimeout(() => say(0), reduced.matches ? 0 : 750);
    }
    function stop() {
      window.clearTimeout(autoTimer);
      stopTween();
      if (box) { typing = false; box.classList.remove("is-typing", "is-last"); textEl.textContent = ""; }
    }
    return { build, start, stop };
  })();

  /* ------------------------------------------------------------------ */
  /* 4. ACHIEVEMENTS: records "load in" one by one.                       */
  /* ------------------------------------------------------------------ */
  const Achievements = (() => {
    let anim = null;
    function enter() {
      if (reduced.matches) return;
      if (anim) anim.pause();
      const items = $$("#education .school-record-list > *, #education .achievement-index > *");
      if (!items.length) return;
      A.set(items, { opacity: 0 });
      window.setTimeout(() => clearInline(items, ["transform", "opacity"]), 3500);   // failsafe: records can never stay hidden
      anim = A({
        targets: items, opacity: [0, 1], translateY: [16, 0], duration: 520, easing: "easeOutCubic",
        delay: A.stagger(45, { start: 220 }), complete: () => clearInline(items, ["transform", "opacity"])
      });
    }
    return { enter };
  })();

  /* ------------------------------------------------------------------ */
  /* 5. FAMILY & FRIENDS: battle entry, capture, camera-shutter reveal.   */
  /* ------------------------------------------------------------------ */
  const FamilyIntro = (() => {
    const SEEN = "davin-fi-seen";
    const TURN = Math.PI * 4;                           // two full spins in flight, so the ball always lands red-side up
    const RB = 0.2;                                      // ball radius in normalised screen units (matches ball3d.js)
    const KEYS = ["Enter", " ", "Escape", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "PageDown", "PageUp"];
    let el = null, ui = null, tl = null, ball = null, S = null, raf = 0, active = false;
    let W = 0, H = 0, ballLoad = null, targets = null, failsafe = 0, started = 0, seekAt = 0, glFailed = false, slowRun = 0, lastTs = 0;
    const iris = { r: 0, a: 0 };

    /* --- lazy Three.js loader: preloaded when idle, optional at play time --- */
    function loadBall() {
      if (window.DavinBall) return Promise.resolve(window.DavinBall);
      if (ballLoad) return ballLoad;
      ballLoad = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "vendor/davin-ball3d.js";
        script.onload = () => resolve(window.DavinBall || null);
        script.onerror = () => resolve(null);
        document.head.append(script);
      });
      return ballLoad;
    }
    function preload() {
      if (reduced.matches || isLite()) return;
      const go = () => loadBall();
      if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 4000 });
      else window.setTimeout(go, 1500);
    }

    /* --- coordinate helpers: normalised screen space (-1..1) <-> pixels --- */
    const ndcX = (x) => (x / W) * 2 - 1;
    const ndcY = (y) => 1 - (y / H) * 2;
    const pxX = (nx) => ((nx + 1) / 2) * W;
    const pxY = (ny) => ((1 - ny) / 2) * H;
    const newState = () => ({ nx: -1.3, ny: -0.6, z: 0, rx: 0.3, ry: -0.3, rz: 0, s: 1, lid: 0, glow: 0, ground: 0, shadow: 0, visible: 0 });

    function paintCss() {
      const d = RB * 2 * (H / 2);
      const node = ui.css;
      node.style.opacity = S.visible ? "1" : "0";
      node.style.width = node.style.height = d + "px";
      node.style.marginLeft = node.style.marginTop = -d / 2 + "px";
      node.style.transform = "translate(" + pxX(S.nx).toFixed(1) + "px," + pxY(S.ny).toFixed(1) + "px) rotate(" + S.rz.toFixed(3) + "rad) scale(" + S.s.toFixed(3) + ")";
      node.style.setProperty("--lid", S.lid.toFixed(3));
      node.style.setProperty("--glow", S.glow.toFixed(3));
    }
    function frame(ts) {
      if (!active) return;
      if (ball) {
        // Performance watchdog: three consecutive slow frames (>220 ms) and the 3D ball hands over to the CSS ball.
        slowRun = lastTs && ts - lastTs > 220 ? slowRun + 1 : 0;
        lastTs = ts;
        if (slowRun >= 3) dropBall();
        else { Object.assign(ball.S, S); ball.render(); }   // S is the single source of truth; the renderer mirrors it
      } else paintCss();
      raf = window.requestAnimationFrame(frame);
    }
    function dropBall() {
      glFailed = true;
      disposeBall();
      if (el) el.classList.remove("fi-gl");
    }
    function paintIris() {
      const cx = W / 2, cy = H / 2;
      const pts = [];
      for (let k = 0; k < 6; k += 1) {
        const t = iris.a + (k * Math.PI) / 3;
        pts.push((cx + iris.r * Math.cos(t)).toFixed(1) + " " + (cy + iris.r * Math.sin(t)).toFixed(1));
      }
      const hex = "M" + pts.join("L") + "Z";
      ui.irisFill.setAttribute("d", "M0 0H" + W + "V" + H + "H0Z" + hex);
      ui.irisEdge.setAttribute("d", hex);
      ui.irisGlow.setAttribute("d", hex);
    }
    function measure() {
      W = window.innerWidth;
      H = window.innerHeight;
      ui.iris.setAttribute("viewBox", "0 0 " + W + " " + H);
      ui.iris.setAttribute("width", W);
      ui.iris.setAttribute("height", H);
      if (ball) ball.resize(W, H, window.devicePixelRatio || 1);
      paintIris();
    }

    /* --- overlay DOM --- */
    function build(quick) {
      el = document.createElement("div");
      el.className = "fi" + (quick ? " fi-quick" : "");
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "Family and Friends introduction. Press Enter or Escape to skip.");
      el.innerHTML =
        '<div class="fi-scene">' +
          '<div class="fi-sky"></div><div class="fi-speed"></div><div class="fi-floor"></div>' +
          '<div class="fi-plat fi-plat-enemy"></div><div class="fi-plat fi-plat-player"></div>' +
          '<div class="fi-crew"><i></i><i></i><i></i><i></i></div>' +
          '<div class="fi-plate"><b>INNER CIRCLE</b><em>Lv.&infin;</em><span class="fi-hp"><u>HP</u><i></i></span></div>' +
          '<canvas class="fi-canvas" aria-hidden="true"></canvas>' +
          '<span class="fi-cssball" aria-hidden="true"><i></i></span>' +
          '<span class="fi-glow"></span><span class="fi-sparks"></span>' +
          '<div class="fi-dialog"><p class="fi-text"></p><i class="fi-more">&#9660;</i></div>' +
          '<div class="fi-bars">' + "<i></i>".repeat(9) + "</div>" +
        "</div>" +
        '<svg class="fi-iris" aria-hidden="true"><path class="fi-iris-fill" fill-rule="evenodd"></path><path class="fi-iris-glow"></path><path class="fi-iris-edge"></path></svg>' +
        '<div class="fi-vf" aria-hidden="true">' +
          '<i class="fi-c fi-c-tl"></i><i class="fi-c fi-c-tr"></i><i class="fi-c fi-c-bl"></i><i class="fi-c fi-c-br"></i>' +
          '<span class="fi-rec"><b></b>REC</span><span class="fi-roll">35MM / FRAME 03</span>' +
          '<span class="fi-tc">00:00:00:00</span><span class="fi-af">AF</span>' +
          '<i class="fi-perf fi-perf-l"></i><i class="fi-perf fi-perf-r"></i>' +
        "</div>" +
        '<div class="fi-flash"></div>' +
        '<button class="fi-skip" type="button">SKIP <kbd>ENTER</kbd></button>';
      document.body.append(el);
      ui = {
        scene: $(".fi-scene", el), canvas: $(".fi-canvas", el), css: $(".fi-cssball", el),
        platE: $(".fi-plat-enemy", el), crew: $$(".fi-crew i", el), plate: $(".fi-plate", el),
        platP: $(".fi-plat-player", el),
        glow: $(".fi-glow", el), sparks: $(".fi-sparks", el), dialog: $(".fi-dialog", el), text: $(".fi-text", el),
        bars: $$(".fi-bars i", el), iris: $(".fi-iris", el), irisFill: $(".fi-iris-fill", el), irisEdge: $(".fi-iris-edge", el), irisGlow: $(".fi-iris-glow", el),
        vf: $(".fi-vf", el), tc: $(".fi-tc", el), flash: $(".fi-flash", el), skip: $(".fi-skip", el)
      };
      ui.skip.addEventListener("click", (event) => { event.stopPropagation(); skip(); });
      el.addEventListener("click", skip);
    }

    /* --- the real page content that the cutscene reveals --- */
    function collectTargets() {
      const page = $("#family");
      const squadFrames = $$(".squad-photo-frame", page);
      squadFrames.forEach((frame) => {
        if (getComputedStyle(frame).position === "static") frame.style.position = "relative";
        const pop = document.createElement("i");
        pop.className = "fx-pop";
        pop.setAttribute("aria-hidden", "true");
        frame.append(pop);
      });
      targets = {
        heading: $$(".page-heading > *", page),
        panels: $$(".family-panel", page),
        cards: $$(".foundation-card", page),
        squad: $$(".squad-photo-card", page),
        msg: $$(".squad-message", page),
        pops: $$(".fx-pop", page)
      };
      targets.all = [].concat(targets.heading, targets.panels, targets.cards, targets.squad, targets.msg);
      A.set(targets.all, { opacity: 0 });
    }
    function cleanupContent() {
      if (!targets) return;
      clearInline(targets.all, ["transform", "opacity", "filter"]);
      targets.pops.forEach((pop) => pop.remove());
      targets = null;
    }
    function addEntrance(at) {
      const t = targets;
      tl.add({ targets: t.heading, opacity: [0, 1], translateY: [-16, 0], duration: 520, easing: "easeOutCubic", delay: A.stagger(80) }, at)
        .add({ targets: t.panels, opacity: [0, 1], duration: 420, easing: "easeOutQuad", delay: A.stagger(110) }, at + 60)
        .add({ targets: t.cards, opacity: [0, 1], translateY: [70, 0], rotate: [-5, 0], scale: [0.9, 1], duration: 760, easing: "easeOutBack", delay: A.stagger(130) }, at + 160)
        .add({ targets: t.squad, opacity: [0, 1], scale: [1.08, 1], duration: 560, easing: "easeOutCubic", delay: A.stagger(150) }, at + 300)
        .add({ targets: t.pops, opacity: [0.95, 0], duration: 520, easing: "easeOutQuad", delay: A.stagger(150) }, at + 300)
        .add({ targets: t.msg, opacity: [0, 1], translateY: [14, 0], duration: 500, easing: "easeOutCubic" }, at + 620);
    }

    /* --- lock the page behind the cutscene --- */
    function lock(on) {
      ["#main-content", ".app-header", ".corner-controls", "#mobile-menu"].forEach((selector) => {
        const node = $(selector);
        if (!node) return;
        if ("inert" in node) node.inert = on;
      });
      document.body.classList.toggle("fi-on", on);
    }
    function onKey(event) {
      if (!active || !KEYS.includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      skip();
    }
    function onWheel(event) { if (active) { event.preventDefault(); event.stopPropagation(); } }

    function attachBall() {
      if (!active || ball || glFailed || isLite() || !window.DavinBall) return;
      const t0 = performance.now();
      try {
        ball = window.DavinBall.create(ui.canvas);
        ball.resize(W, H, window.devicePixelRatio || 1);
        el.classList.add("fi-gl");
      } catch (e) { ball = null; glFailed = true; }        // no WebGL: the CSS ball keeps playing
      if (ball && performance.now() - t0 > 1200) dropBall();   // context creation stalled (software GL / weak device)
    }

    /* --- teardown --- */
    function disposeBall() {
      if (ball) { try { ball.dispose(); } catch (e) { /* already lost */ } ball = null; }
    }
    function finish(immediate, restoreFocus) {
      if (!active) return;
      active = false;
      window.clearTimeout(failsafe);
      window.cancelAnimationFrame(raf);
      if (tl) { tl.pause(); tl = null; }
      disposeBall();
      cleanupContent();
      lock(false);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("resize", measure);
      const node = el;
      el = null;
      if (node) {
        if (immediate) node.remove();
        else { node.classList.add("is-leaving"); window.setTimeout(() => node.remove(), 240); }
      }
      if (restoreFocus) {
        const heading = $("#family-title");
        if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      }
    }
    function skip() { finish(false, true); }
    function cancel() { finish(true, false); }

    /* --- the cutscene --- */
    function typeInto(text, at, perChar) {
      const o = { n: 0 };
      let last = -1;
      tl.add({
        targets: o, n: [0, text.length], round: 1, easing: "linear", duration: text.length * perChar,
        begin: () => { ui.text.textContent = ""; ui.dialog.classList.remove("is-done"); },
        update: () => {
          if (o.n === last) return;
          last = o.n;
          ui.text.textContent = text.slice(0, o.n);
          if (o.n % 3 === 1) sfx("blip");
        },
        complete: () => { ui.text.textContent = text; ui.dialog.classList.add("is-done"); }
      }, at);
    }
    function sparkBurst() {
      const x = pxX(S.nx), y = pxY(S.ny);
      for (let i = 0; i < 10; i += 1) {
        const spark = document.createElement("i");
        spark.style.left = x + "px";
        spark.style.top = y + "px";
        ui.sparks.append(spark);
        const angle = (i / 10) * Math.PI * 2 + rand(-0.2, 0.2);
        const dist = rand(70, 150) * (H / 900 + 0.4);
        A({
          targets: spark, translateX: [0, Math.cos(angle) * dist], translateY: [0, Math.sin(angle) * dist],
          scale: [1, 0.2], opacity: [1, 0], rotate: [0, 120], duration: 640, easing: "easeOutCubic",
          complete: () => spark.remove()
        });
      }
    }
    function runFull() {
      const platRect = ui.platE.getBoundingClientRect();
      const platX = platRect.left + platRect.width / 2, platY = platRect.top + platRect.height / 2;
      const rects = ui.crew.map((fig) => fig.getBoundingClientRect());
      const centers = rects.map((r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
      const hitX = centers.reduce((s, c) => s + c.x, 0) / centers.length;
      const hitY = centers.reduce((s, c) => s + c.y, 0) / centers.length;
      const hit = { nx: ndcX(hitX), ny: ndcY(hitY) };
      const rest = { nx: ndcX(platX), ny: ndcY(platY) + RB * 0.92 };
      Object.assign(S, { ground: ndcY(platY), visible: 0 });

      const bgDark = [ui.platE, ui.platP, ui.plate];
      A.set(ui.crew, { opacity: 0, translateY: 30, scale: 0.7 });
      A.set(bgDark, { opacity: 0 });
      A.set(ui.dialog, { opacity: 0 });
      ui.platE.style.transform = "translateX(" + W * 0.7 + "px)";
      ui.platP.style.transform = "translateX(" + -W * 0.7 + "px)";

      const barsOut = ui.bars.map((_, i) => (i % 2 ? 1 : -1) * W * 1.05);
      tl = A.timeline({ easing: "easeOutQuad", autoplay: true, complete: () => finish(true, true) });

      // A) battle transition: double flash, then stripes sweep away
      tl.add({ targets: ui.flash, opacity: [{ value: 0.8, duration: 70 }, { value: 0, duration: 90 }, { value: 0.8, duration: 70 }, { value: 0, duration: 110 }], easing: "linear" }, 0)
        .add({ targets: ui.bars, translateX: (el, i) => [0, barsOut[i]], duration: 460, easing: "easeInQuart", delay: A.stagger(36) }, 300);

      // B) the field slides in; the wild crew and its HP plate appear
      tl.add({ targets: ui.platE, translateX: [W * 0.7, 0], opacity: [0, 1], duration: 620, easing: "easeOutCubic" }, 420)
        .add({ targets: ui.platP, translateX: [-W * 0.7, 0], opacity: [0, 1], duration: 620, easing: "easeOutCubic" }, 480)
        .add({ targets: ui.crew, opacity: [0, 1], translateY: [30, 0], scale: [0.7, 1], duration: 460, easing: "easeOutBack", delay: A.stagger(70) }, 820)
        .add({ targets: ui.plate, opacity: [0, 1], translateX: [-60, 0], duration: 420, easing: "easeOutCubic" }, 940);

      // C) dialogue line 1
      tl.add({ targets: ui.dialog, opacity: [0, 1], translateY: [16, 0], duration: 240, easing: "easeOutQuad" }, 980);
      typeInto("A wild INNER CIRCLE appeared!", 1160, 26);

      // D) throw: a real 3D ball on a parabolic arc, spinning
      tl.add({ targets: ui.dialog, opacity: [1, 0], duration: 200, easing: "linear" }, 1900)
        .add({
          targets: S, nx: [-1.25, hit.nx], duration: 520, easing: "easeOutSine",
          begin: () => { S.visible = 1; S.shadow = 0; }
        }, 1960)
        .add({ targets: S, ny: [{ value: -0.55, duration: 0 }, { value: Math.max(hit.ny, -0.2) + 0.5, duration: 260, easing: "easeOutQuad" }, { value: hit.ny, duration: 260, easing: "easeInQuad" }] }, 1960)
        .add({ targets: S, rz: [0, -TURN], rx: [0.3, 0.3], duration: 520, easing: "linear" }, 1960);

      // E) the ball opens, pulls the crew into red light, closes
      tl.add({ targets: S, lid: [0, 0.9], glow: [0, 1], duration: 150, easing: "easeOutQuad", begin: () => { sfx("open"); ui.crew.forEach((f) => f.classList.add("is-captured")); } }, 2500)
        .add({ targets: ui.crew, translateX: (f, i) => [0, hitX - centers[i].x], translateY: (f, i) => [0, hitY - centers[i].y], scale: [1, 0.06], opacity: [1, 0], duration: 380, easing: "easeInCubic", delay: A.stagger(30) }, 2560)
        .add({ targets: ui.plate, opacity: [1, 0], duration: 260, easing: "linear" }, 2560)
        .add({ targets: S, lid: [0.9, 0], glow: [1, 0], duration: 170, easing: "easeInQuad" }, 2900);

      // F) fall and bounce onto the platform
      tl.add({ targets: S, shadow: [0, 1], duration: 400, easing: "linear" }, 2920)
        .add({
          targets: S, ny: [
            { value: rest.ny, duration: 260, easing: "easeInQuad" }, { value: rest.ny + 0.1, duration: 160, easing: "easeOutQuad" },
            { value: rest.ny, duration: 160, easing: "easeInQuad" }, { value: rest.ny + 0.03, duration: 90, easing: "easeOutQuad" },
            { value: rest.ny, duration: 90, easing: "easeInQuad" }]
        }, 2920)
        .add({ targets: S, nx: [hit.nx, rest.nx], rz: [-TURN, -TURN + 0.5], rx: [0.3, 0.35], duration: 760, easing: "easeOutQuad" }, 2920);

      // G) three shakes, like every capture ever
      const rz0 = -TURN + 0.5;
      for (let k = 0; k < 3; k += 1) {
        const at = 3820 + k * 420;
        tl.add({
          targets: S, rz: [{ value: rz0 - 0.4, duration: 90, easing: "easeOutQuad" }, { value: rz0 + 0.4, duration: 170, easing: "easeInOutQuad" }, { value: rz0, duration: 90, easing: "easeInQuad" }],
          begin: () => sfx("shake")
        }, at);
      }

      // H) click: sparks, button blink, dialogue line 2, ball glides to centre and grows
      tl.add({ targets: S, glow: [{ value: 1, duration: 90 }, { value: 0.45, duration: 240 }], duration: 330, easing: "easeOutQuad", begin: () => { sfx("catch"); sparkBurst(); } }, 5080);
      tl.add({ targets: ui.dialog, opacity: [0, 1], translateY: [16, 0], duration: 220, easing: "easeOutQuad" }, 5160);
      typeInto("Gotcha! INNER CIRCLE joined my team!", 5300, 22);
      tl.add({ targets: S, nx: [rest.nx, 0], ny: [rest.ny, 0.05], s: [1, Math.min(2.5, (4 * W) / H)], shadow: [1, 0], duration: 780, easing: "easeInOutCubic" }, 5440)
        .add({ targets: S, rz: [rz0, rz0 + 0.3, -TURN], rx: [0.35, 0.18], ry: [-0.3, 0], duration: 780, easing: "easeInOutCubic" }, 5440);

      // I) the ball opens like a lens: white-out, then the camera shutter reveals the page
      const rFull = Math.hypot(W, H) * 0.64;
      tl.add({ targets: S, lid: [0, 1.15], glow: [0.45, 1.6], duration: 380, easing: "easeInQuad", begin: () => sfx("open") }, 6260)
        .add({ targets: ui.glow, opacity: [0, 1], scale: [0.4, 7], duration: 420, easing: "easeInQuad", begin: () => { ui.glow.style.left = pxX(S.nx) + "px"; ui.glow.style.top = pxY(S.ny) + "px"; } }, 6240)
        .add({ targets: ui.flash, opacity: [0, 1], duration: 170, easing: "easeInQuad" }, 6540)
        .add({
          targets: ui.flash, opacity: [1, 0], duration: 360, easing: "easeOutQuad",
          begin: () => {
            ui.scene.style.visibility = "hidden";
            el.style.background = "transparent";            // from here the shutter's dark fill is the only cover
            ui.iris.classList.add("is-on");
            ui.vf.classList.add("is-on");
            disposeBall();
            Object.assign(iris, { r: 1, a: 0.2 });
            paintIris();
            started = performance.now();
          }
        }, 6720)
        .add({
          targets: iris, r: [1, rFull], a: [0.2, 1.25], duration: 1000, easing: "easeInOutCubic", update: paintIris,
          begin: () => { sfx("open"); const h = $("#family .page-title"); if (h) { h.classList.remove("title-glitch"); void h.offsetWidth; h.classList.add("title-glitch"); } }
        }, 6860)
        .add({ targets: [ui.irisEdge, ui.irisGlow], opacity: [1, 0], duration: 500, easing: "linear" }, 7500)
        .add({ targets: ui.vf, opacity: [1, 0], duration: 520, easing: "easeInQuad" }, 7500);
      addEntrance(7050);
    }
    function runQuick() {
      const rFull = Math.hypot(W, H) * 0.64;
      el.style.background = "transparent";
      ui.iris.classList.add("is-on");
      ui.vf.classList.add("is-on");
      Object.assign(iris, { r: 1, a: 0.2 });
      paintIris();
      started = performance.now();
      tl = A.timeline({ easing: "easeOutQuad", autoplay: true, complete: () => finish(true, true) });
      tl.add({ targets: iris, r: [1, rFull], a: [0.2, 1.2], duration: 760, easing: "easeInOutCubic", update: paintIris, begin: () => sfx("open") }, 80)
        .add({ targets: [ui.irisEdge, ui.irisGlow], opacity: [1, 0], duration: 400, easing: "linear" }, 520)
        .add({ targets: ui.vf, opacity: [1, 0], duration: 420, easing: "easeInQuad" }, 480);
      addEntrance(260);
    }

    function play(kind) {
      if (reduced.matches) return;
      cancel();
      seekAt = 0;
      glFailed = false;
      slowRun = 0;
      lastTs = 0;
      const quick = kind === "quick";
      active = true;
      build(quick);
      measure();
      collectTargets();
      lock(true);
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("wheel", onWheel, { capture: true, passive: false });
      window.addEventListener("resize", measure);
      ui.skip.focus({ preventScroll: true });
      S = newState();
      if (!quick && !isLite()) {
        attachBall();
        if (!ball && !glFailed) loadBall().then(attachBall);   // late load: the CSS ball hands over to the 3D ball mid-flight
      }
      failsafe = window.setTimeout(skip, 16000);           // armed after any GL start-up cost, so a slow device can't eat it
      if (!quick) frame();
      // Timecode in the viewfinder ticks at 24 fps while the shutter is open.
      const tick = () => {
        if (!active) return;
        if (started) {
          const ms = performance.now() - started, f = Math.floor((ms % 1000) / (1000 / 24)), s = Math.floor(ms / 1000);
          ui.tc.textContent = "00:00:" + String(s % 60).padStart(2, "0") + ":" + String(f).padStart(2, "0");
        }
        window.requestAnimationFrame(tick);
      };
      tick();
      if (quick) runQuick(); else runFull();
    }

    /* Entry point from the router. First visit in a session = full cutscene; later visits = quick shutter. */
    function enter() {
      if (reduced.matches) return;
      const first = !store.get(SEEN);
      store.set(SEEN, "1");
      play(first ? "full" : "quick");
    }
    function addReplayButton() {
      const note = $("#family .heading-note");
      if (!note || $(".fx-replay")) return;
      const wrap = document.createElement("div");
      wrap.className = "fx-head-right";
      note.replaceWith(wrap);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "fx-replay";
      button.setAttribute("aria-label", "Replay the Family and Friends intro");
      button.innerHTML = "&#9654; REPLAY INTRO";
      button.addEventListener("click", () => play("full"));
      wrap.append(note, button);
    }
    /* QA scrubber: jump the cutscene to any millisecond (pauses it). Used by window.DavinFX.seekFamilyIntro(ms). */
    function seek(ms) {
      if (!tl) return;
      window.clearTimeout(failsafe);
      tl.pause();
      let t = seekAt;
      while (tl && t < ms) { t = Math.min(ms, t + 40); tl.seek(t); }   // step like real playback so begin/update callbacks fire
      seekAt = ms;
    }
    return { enter, cancel, preload, addReplayButton, play, seek, isActive: () => active };
  })();

  /* ------------------------------------------------------------------ */
  /* ROUTING: react to Davin.js events                                    */
  /* ------------------------------------------------------------------ */
  let ready = reduced.matches;
  let lastIndex = -1;
  let pendingIndex = null;
  const hashIndex = () => Math.max(0, ROUTES.indexOf(window.location.hash.replace(/^#/, "")));

  function handle(index) {
    if (index === lastIndex) return;
    const previous = lastIndex;
    lastIndex = index;
    if (previous === 3 && index !== 3) FamilyIntro.cancel();
    Drift.toggle(index === 0);
    if (index === 0) Title.play();
    if (index === 1) Dialogue.start(); else Dialogue.stop();
    if (index === 2) Achievements.enter();
    if (index === 3) FamilyIntro.enter();
  }

  document.addEventListener("davin:pagechange", (event) => {
    const index = event.detail.index;
    if (!ready) { pendingIndex = index; return; }
    handle(index);
  });

  function becomeReady() {
    if (ready && lastIndex !== -1) return;
    ready = true;
    FamilyIntro.preload();
    handle(pendingIndex === null ? hashIndex() : pendingIndex);
  }

  /* ------------------------------------------------------------------ */
  /* INIT                                                                  */
  /* ------------------------------------------------------------------ */
  try {
    Title.prepare();
    Drift.build();
    Dialogue.build();
    FamilyIntro.addReplayButton();
  } catch (error) {
    root.classList.remove("fx-title-pending");
    if (window.console) console.warn("Davin FX: enhancement skipped.", error);
  }

  if (reduced.matches) becomeReady();
  else {
    document.addEventListener("davin:intro-done", becomeReady, { once: true });
    window.setTimeout(becomeReady, 9000);                // failsafe if the boot intro never reports
  }

  window.DavinFX = { replayFamilyIntro: () => FamilyIntro.play("full"), skipFamilyIntro: () => FamilyIntro.cancel(), seekFamilyIntro: (ms) => FamilyIntro.seek(ms) };
})();
