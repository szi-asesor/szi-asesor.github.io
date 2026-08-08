(function () {
  "use strict";

  /* ============================================================
     0. CONFIG
  ============================================================ */
  var THICK = 64;   // px — thick bar while cursor is moving
  var THIN = 3;     // px — thin bar while cursor is idle
  var IDLE_MS = 260;
  var FLOOD_IN_FRAC = 0.10;   // fraction of zone progress spent flooding in
  var FLOOD_OUT_FRAC = 0.10;  // fraction of zone progress spent flooding out

  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var body = document.body;

  var cursorBar = document.getElementById("cursorBar");
  var anchorMarker = document.getElementById("anchorMarker");
  var contentEl = document.getElementById("content");
  var invertedEl = document.getElementById("contentInverted");
  var cinematic = document.getElementById("cinematic");

  /* ============================================================
     1. GALLERY DATA + BUILD 3D WALLS
  ============================================================ */
  var videos = [
    "https://www.tiktok.com/@one_hee/video/7663869968500395272",
    "https://www.tiktok.com/@one_hee/video/7659033656966663442",
    "https://www.tiktok.com/@one_hee/video/7658178130552835336",
    "https://www.tiktok.com/@one_hee/video/7652736403293441300",
    "https://www.tiktok.com/@one_hee/video/7629185484635491605",
    "https://www.instagram.com/reel/DXBZVwwiZR5/",
    "https://www.instagram.com/reel/DTIns0NCUm5/"
  ];
  var designs = [
    "https://www.facebook.com/share/p/1BYUqK4ZpL/",
    "https://www.facebook.com/szianzey.asesor/posts/pfbid0PjeYpwDPskMYPr52JffCpcEXw2HBMQRLDepxrnjfHX2VpxcP6jBYjgGpqkkXPau2l",
    "https://www.facebook.com/share/p/1CQjKYMYY8/",
    "https://www.facebook.com/szianzey.asesor/posts/pfbid02dShKJfWKHxKZKy52VX3Lyt2epFmu7jwZaAxgRoaQmYmMMjFLt7NdMJ8KPnZ8bU58l",
    "https://www.facebook.com/share/1SA6nnn771/",
    "https://www.facebook.com/share/1BYDNiAjuh/",
    "https://www.facebook.com/share/1BAEwdK4MU/",
    "https://www.facebook.com/share/19NYk2bBQu/",
    "https://www.facebook.com/photo.php?fbid=25650543877929535&set=a.477377415672862&type=3",
    "https://www.facebook.com/szianzey.asesor/posts/pfbid026CnrdSLaZ9gBs46fnAAMTYwKiVdUdz8CtoHqpzJZVNHQsAA7gXhHbjzVpTUfwscdl",
    "https://www.facebook.com/share/p/1EeSmx3JtB/",
    "https://www.facebook.com/share/p/1Bh9fBsLBd/",
    "https://canva.link/6ief1z24lwpp1wz",
    "https://canva.link/p8bl43bz2k3o9w7"
  ];

  function categoryFor(url) {
    if (url.indexOf("tiktok.com") > -1) return "TikTok";
    if (url.indexOf("instagram.com") > -1) return "Instagram";
    if (url.indexOf("canva.link") > -1) return "Canva";
    if (url.indexOf("facebook.com") > -1) return "Facebook";
    return "Link";
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function buildWall(trackId, items, label, icon) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var html = "";
    items.forEach(function (url, i) {
      html +=
        '<a class="wall-card" href="' + url + '" target="_blank" rel="noopener">' +
        '<div class="wc-idx mono">' + pad(i + 1) + " / " + pad(items.length) + "</div>" +
        '<div class="wc-icon">' + icon + "</div>" +
        '<div class="wc-cat mono">' + categoryFor(url) + "</div>" +
        '<div class="wc-name">' + label + " " + pad(i + 1) + "</div>" +
        "</a>";
    });
    track.innerHTML = html;
  }

  buildWall("trackVideo", videos, "Edit", "▶");
  buildWall("trackDesign", designs, "Design", "✎");

  /* ============================================================
     2. INVERTED CLONE (for cursor text-invert effect)
  ============================================================ */
  var clone = contentEl.cloneNode(true);
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach(function (n) { n.removeAttribute("id"); });
  clone.querySelectorAll("a").forEach(function (n) { n.setAttribute("tabindex", "-1"); });
  invertedEl.appendChild(clone);

  /* ============================================================
     3. CURSOR BAR — thick while moving, thin while idle,
        DISABLED while the cinematic flood zone is active.
  ============================================================ */
  var pointerEnabled = canHover.matches && !reducedMotion.matches;
  var zoneActive = false; // true whenever flood amount > 0 — freezes pointer control
  var lastCursorX = window.innerWidth * 0.6;

  var targetX = lastCursorX;
  var currentX = targetX;
  var targetW = THIN;
  var currentW = THIN;
  var idleTimer = null;
  var cursorRaf = null;

  function setIdle() { targetW = THIN; }

  function onPointerMove(e) {
    lastCursorX = e.clientX;
    if (zoneActive) return; // scrolling owns the bar right now
    targetX = e.clientX;
    targetW = THICK;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(setIdle, IDLE_MS);
    if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorTick);
  }

  function cursorTick() {
    if (zoneActive) { cursorRaf = null; return; }

    currentX += (targetX - currentX) * 0.22;
    currentW += (targetW - currentW) * 0.16;

    var half = currentW / 2;
    var left = currentX - half;
    var right = currentX + half;

    cursorBar.style.left = left + "px";
    cursorBar.style.width = currentW + "px";

    var vw = window.innerWidth;
    var clipLeft = Math.max(0, left);
    var clipRight = Math.max(0, vw - right);
    invertedEl.style.clipPath = "inset(0 " + clipRight + "px 0 " + clipLeft + "px)";

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetW - currentW) > 0.05) {
      cursorRaf = requestAnimationFrame(cursorTick);
    } else {
      cursorRaf = null;
    }
  }

  if (pointerEnabled) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    cursorRaf = requestAnimationFrame(cursorTick);
  } else {
    cursorBar.style.display = "none";
    invertedEl.style.display = "none";
  }

  /* ============================================================
     4. COLOR LERP for the scroll-driven flood
  ============================================================ */
  function hexToRgb(hex) {
    var v = parseInt(hex.replace("#", ""), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function rgbStr(rgb) { return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"; }
  function lerpRgb(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }
  var BG_A = hexToRgb("#f2f1eb"), BG_B = hexToRgb("#FF0000");
  var TX_A = hexToRgb("#000000"), TX_B = hexToRgb("#f2f1eb");
  var AC_A = hexToRgb("#FF0000"), AC_B = hexToRgb("#101010");

  /* ============================================================
     5. SCROLLJACK STAGES (About / Achievements / Early Builds)
  ============================================================ */
  var stages = [
    { el: document.getElementById("stage-about"), rail: document.getElementById("rail-about"), n: 2 },
    { el: document.getElementById("stage-ach"), rail: document.getElementById("rail-ach"), n: 4 },
    { el: document.getElementById("stage-eb"), rail: document.getElementById("rail-eb"), n: 3 }
  ];

  function updateStage(stage) {
    if (!stage.el) return;
    var rect = stage.el.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var p = scrollable > 0 ? (-rect.top) / scrollable : 0;
    p = Math.min(Math.max(p, 0), 1);

    var seg = 1 / stage.n;
    var activeIndex = Math.min(Math.floor(p / seg), stage.n - 1);
    if (p >= 1) activeIndex = stage.n - 1;

    var slides = stage.el.querySelectorAll(".slide");
    slides.forEach(function (s) {
      var idx = parseInt(s.getAttribute("data-slide"), 10);
      s.classList.toggle("active", idx === activeIndex && rect.bottom > 0 && rect.top < window.innerHeight);
    });

    var bars = stage.rail ? stage.rail.querySelectorAll("i b") : [];
    bars.forEach(function (b, i) {
      var segProgress = Math.min(Math.max((p - i * seg) / seg, 0), 1);
      b.style.transform = "scaleX(" + segProgress + ")";
    });
  }

  /* ============================================================
     6. FLOOD — tied to the whole cinematic zone, spreads from the
        cursor's last known x, holds red through the zone, then
        un-floods back to the normal background before Projects.
  ============================================================ */
  function updateFlood() {
    if (!cinematic) return;
    var rect = cinematic.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var zoneProgress = scrollable > 0 ? (-rect.top) / scrollable : 0;
    zoneProgress = Math.min(Math.max(zoneProgress, 0), 1);

    var inZoneRange = rect.bottom > 0 && rect.top < window.innerHeight;

    var floodAmount;
    if (zoneProgress <= FLOOD_IN_FRAC) {
      floodAmount = zoneProgress / FLOOD_IN_FRAC;
    } else if (zoneProgress >= 1 - FLOOD_OUT_FRAC) {
      floodAmount = (1 - zoneProgress) / FLOOD_OUT_FRAC;
    } else {
      floodAmount = 1;
    }
    if (!inZoneRange && rect.top >= window.innerHeight) floodAmount = 0; // not reached yet
    if (!inZoneRange && rect.bottom <= 0) floodAmount = 0;               // already passed

    floodAmount = Math.min(Math.max(floodAmount, 0), 1);
    zoneActive = floodAmount > 0.001;

    // continuously interpolate the palette with scroll — no fixed-duration transition
    var bg = rgbStr(lerpRgb(BG_A, BG_B, floodAmount));
    var tx = rgbStr(lerpRgb(TX_A, TX_B, floodAmount));
    var ac = rgbStr(lerpRgb(AC_A, AC_B, floodAmount));
    document.documentElement.style.setProperty("--bg", bg);
    document.documentElement.style.setProperty("--text", tx);
    document.documentElement.style.setProperty("--accent", ac);

    body.classList.toggle("flooded", floodAmount >= 0.995);

    // grow/shrink the bar from the cursor's frozen last position out to full-bleed
    if (pointerEnabled) {
      if (floodAmount > 0.001 && floodAmount < 0.999) {
        var vw = window.innerWidth;
        var half = Math.max(lastCursorX, vw - lastCursorX) * floodAmount + THIN / 2;
        var left = Math.max(0, lastCursorX - half);
        var width = Math.min(vw, half * 2);
        cursorBar.style.left = left + "px";
        cursorBar.style.width = width + "px";
        invertedEl.style.clipPath = "inset(0 0 0 0)";
        cursorBar.style.opacity = "1";
      } else if (floodAmount >= 0.999) {
        cursorBar.style.opacity = "0"; // merged into the background — "disappears"
      } else {
        cursorBar.style.opacity = "1";
      }
    }

    stages.forEach(updateStage);
  }

  /* ============================================================
     7. 3D GALLERY WALLS — vertical scroll drives horizontal travel
        through a perspective wall of thumbnails.
  ============================================================ */
  var walls = [
    { stage: document.getElementById("wall-video"), track: document.getElementById("trackVideo") },
    { stage: document.getElementById("wall-design"), track: document.getElementById("trackDesign") }
  ];

  function updateWall(wall) {
    if (!wall.stage || !wall.track) return;
    var rect = wall.stage.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var p = scrollable > 0 ? (-rect.top) / scrollable : 0;
    p = Math.min(Math.max(p, 0), 1);

    var viewport = wall.track.parentElement;
    var trackWidth = wall.track.scrollWidth;
    var viewWidth = viewport.clientWidth;
    var maxShift = Math.max(trackWidth - viewWidth * 0.4, 0);
    var shift = -(p * maxShift);

    wall.track.style.transform = "translateX(" + shift + "px)";

    var centerX = window.innerWidth / 2;
    var cards = wall.track.children;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var cr = card.getBoundingClientRect();
      var cardCenter = cr.left + cr.width / 2;
      var dist = (cardCenter - centerX) / centerX; // roughly -1..1
      var clamped = Math.min(Math.max(dist, -1.4), 1.4);
      var rotateY = clamped * -26;
      var scale = 1 - Math.min(Math.abs(clamped), 1) * 0.18;
      var opacity = 1 - Math.min(Math.abs(clamped), 1) * 0.55;
      card.style.transform = "rotateY(" + rotateY + "deg) scale(" + scale + ")";
      card.style.opacity = opacity;
    }
  }

  /* ============================================================
     8. SCROLL LOOP (single rAF-throttled handler for everything)
  ============================================================ */
  var ticking = false;
  function onFrame() {
    ticking = false;
    updateFlood();
    walls.forEach(updateWall);

    var doc = document.documentElement;
    var scrollY = window.scrollY || doc.scrollTop;
    var maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var pageProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    anchorMarker.style.top = (pageProgress * (window.innerHeight - 9)) + "px";
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onFrame();

  /* ============================================================
     9. CONTACT FORM — opens the visitor's mail client with the
        message pre-filled. Replace DEST_EMAIL with a real inbox.
  ============================================================ */
  var DEST_EMAIL = "szianzeyasesor26@gmail.com";
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["message"].value.trim();
      var subject = "Portfolio inquiry from " + name;
      var body = message + "\n\n— " + name + " (" + email + ")";
      var href = "mailto:" + DEST_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    });
  }
})();
