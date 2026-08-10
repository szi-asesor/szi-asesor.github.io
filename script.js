(function () {
  "use strict";

  /* ============================================================
     0. CONFIG
  ============================================================ */
  var THICK = 110; // px — thick bar while cursor is moving
  var THIN = 1; // px — thin bar while cursor is idle
  var IDLE_MS = 800;

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
    {
      url: "https://www.tiktok.com/@one_hee/video/7663869968500395272",
      ratio: "9 / 16",
    },
    {
      url: "https://www.tiktok.com/@one_hee/video/7659033656966663442",
      ratio: "9 / 16",
    },
    {
      url: "https://www.tiktok.com/@one_hee/video/7658178130552835336",
      ratio: "9 / 16",
    },
    {
      url: "https://www.tiktok.com/@one_hee/video/7652736403293441300",
      ratio: "9 / 16",
    },
    {
      url: "https://www.tiktok.com/@one_hee/video/7629185484635491605",
      ratio: "9 / 16",
    },
    { url: "https://www.instagram.com/reel/DXBZVwwiZR5/", ratio: "9 / 16" },
    { url: "https://www.instagram.com/reel/DTIns0NCUm5/", ratio: "9 / 16" },
  ];
  var designs = [
    {
      url: "https://www.facebook.com/photo/?fbid=26896801116637132&set=pcb.26896801989970378", //Yuu Nishinoya.jpg
      imageSrc: "images/Yuu Nishinoya.jpg",
      ratio: "4 / 5",
    },
    {
      url: "https://www.facebook.com/photo/?fbid=26896801766637067&set=pcb.26896801989970378", //David - DBZ.jpg
      imageSrc: "images/David - DBZ.jpg",
      ratio: "4 / 5",
    },
    {
      url: "https://www.facebook.com/szianzey.asesor/posts/pfbid0PjeYpwDPskMYPr52JffCpcEXw2HBMQRLDepxrnjfHX2VpxcP6jBYjgGpqkkXPau2l", //Ophelia.jpg
      imageSrc: "images/Ophelia.jpg",
      ratio: "16 / 9",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25860808020236452&set=pb.100002018240117.-2207520000&type=3", //Godzilla.jpg
      imageSrc: "images/Godzilla.jpg",
      ratio: "8 / 10",
    },
    {
      url: "https://www.facebook.com/szianzey.asesor/posts/pfbid02dShKJfWKHxKZKy52VX3Lyt2epFmu7jwZaAxgRoaQmYmMMjFLt7NdMJ8KPnZ8bU58l", //An Untitled Poster.jpg
      imageSrc: "images/An Untitled Poster.jpg",
      ratio: "4 / 5",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25650545141262742&set=a.477377415672862&type=3&rdid=3vVJYMo1qBIzXf32&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1SA6nnn771%2F#", //DANIELLE.jpg
      imageSrc: "images/DANIELLE.jpg",
      ratio: "1 / 1.414",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25650544811262775&set=pb.100002018240117.-2207520000&type=3", //HAERIN.jpg
      imageSrc: "images/HAERIN.jpg",
      ratio: "1 / 1.414",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25650544401262816&set=pb.100002018240117.-2207520000&type=3", //MINJI.jpg
      imageSrc: "images/MINJI.jpg",
      ratio: "1 / 1.414",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25650544147929508&set=pb.100002018240117.-2207520000&type=3", //HANNI.jpg
      imageSrc: "images/HANNI.jpg",
      ratio: "1 / 1.414",
    },
    {
      url: "https://www.facebook.com/photo.php?fbid=25650543877929535&set=a.477377415672862&type=3", //HYEIN.jpg
      imageSrc: "images/HYEIN.jpg",
      ratio: "1 / 1.414",
    },
    {
      url: "https://www.facebook.com/szianzey.asesor/posts/pfbid026CnrdSLaZ9gBs46fnAAMTYwKiVdUdz8CtoHqpzJZVNHQsAA7gXhHbjzVpTUfwscdl", //new balance.jpg
      imageSrc: "images/new balance.jpg",
      ratio: "4 / 5",
    },
    {
      url: "https://www.facebook.com/share/p/1EeSmx3JtB/",
      imageSrc: "images/hanni poster.jpg",
      ratio: "1 / 1",
    }, //hanni poster.jpg
    {
      url: "https://www.facebook.com/share/p/1Bh9fBsLBd/",
      imageSrc: "images/Roman.jpg",
      ratio: "4 / 5",
    }, //Roman.jpg
    {
      url: "https://canva.link/6ief1z24lwpp1wz",
      imageSrc: "images/LE MANS.jpg",
      ratio: "9 / 16",
    }, //LE MANS.jpg
    {
      url: "https://canva.link/p8bl43bz2k3o9w7",
      imageSrc: "images/feb 14th.jpg",
      ratio: "4 / 5",
    }, //feb 14th.jpg

    {
      url: "https://canva.link/w8398jv97qc0cj5", //MOTO-GP.jpg
      imageSrc: "images/MOTO-GP.jpg",
      ratio: "1 / 1.414",
    },
  ];

  function categoryFor(url) {
    if (url.indexOf("tiktok.com") > -1) return "TikTok";
    if (url.indexOf("instagram.com") > -1) return "Instagram";
    if (url.indexOf("canva.link") > -1) return "Canva";
    if (url.indexOf("facebook.com") > -1) return "Facebook";
    return "Link";
  }
  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function embedFor(url) {
    var instagram = url.match(/instagram\.com\/reel\/([^/?#]+)/);
    if (instagram) {
      return "https://www.instagram.com/reel/" + instagram[1] + "/embed/";
    }

    if (url.indexOf("facebook.com") > -1) {
      return (
        "https://www.facebook.com/plugins/post.php?show_text=false&width=500&href=" +
        encodeURIComponent(url)
      );
    }

    return "";
  }

  function tiktokEmbedMarkup(url) {
    var match = url.match(/tiktok\.com\/(@[^/]+)\/video\/(\d+)/);
    if (!match) return "";

    return (
      '<div class="wall-tiktok"><blockquote class="tiktok-embed" cite="' +
      url +
      '" data-video-id="' +
      match[2] +
      '" data-embed-from="oembed" style="max-width: 100%; min-width: 0; margin: 0;"><section><a target="_blank" rel="noopener" href="https://www.tiktok.com/' +
      match[1] +
      '?refer=embed">View this edit on TikTok</a></section></blockquote></div>'
    );
  }

  function loadTikTokEmbedScript() {
    if (!document.querySelector(".tiktok-embed")) return;
    if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.tiktok.com/embed.js";
    document.body.appendChild(script);
  }

  function buildWall(trackId, items, label, icon) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var html = "";
    items.forEach(function (item, i) {
      var url = typeof item === "string" ? item : item.url;
      var imageSrc = typeof item === "string" ? "" : item.imageSrc || "";
      var ratio = typeof item === "string" ? "4 / 5" : item.ratio || "4 / 5";
      var width =
        typeof item === "string" || !item.width
          ? ""
          : "--card-width: " + item.width + ";";
      var imageMarkup = imageSrc
        ? '<a class="wall-image-link" href="' +
          url +
          '" target="_blank" rel="noopener" aria-label="Open ' +
          label +
          " " +
          pad(i + 1) +
          '"><img class="wall-image" src="' +
          imageSrc +
          '" alt="' +
          label +
          " " +
          pad(i + 1) +
          '" loading="lazy"></a>'
        : "";
      var tiktokMarkup = imageSrc ? "" : tiktokEmbedMarkup(url);
      var embed = imageSrc || tiktokMarkup
        ? ""
        : typeof item === "string"
          ? embedFor(url)
          : item.embed || embedFor(url);
      var embedMarkup = embed
        ? '<div class="wall-embed"><iframe src="' +
          embed +
          '" title="' +
          label +
          " " +
          pad(i + 1) +
          '" loading="lazy" allowfullscreen></iframe></div>'
        : "";
      html +=
        '<article class="wall-card' +
        (imageSrc || tiktokMarkup || embed ? " has-media" : "") +
        '" style="--card-ratio: ' +
        ratio +
        ";" +
        width +
        '">' +
        imageMarkup +
        tiktokMarkup +
        embedMarkup +
        '<div class="wc-idx mono">' +
        pad(i + 1) +
        " / " +
        pad(items.length) +
        "</div>" +
        '<div class="wc-icon">' +
        icon +
        "</div>" +
        '<div class="wc-cat mono">' +
        categoryFor(url) +
        "</div>" +
        '<div class="wc-name">' +
        label +
        " " +
        pad(i + 1) +
        "</div>" +
        '<a class="wall-open" href="' +
        url +
        '" target="_blank" rel="noopener">Open post ↗</a>' +
        "</article>";
    });
    track.innerHTML = html;
  }

  buildWall("trackVideo", videos, "Edit", "▶");
  buildWall("trackDesign", designs, "Design", "✎");
  loadTikTokEmbedScript();

  function ratioValue(value) {
    var parts = value.split("/");
    if (parts.length !== 2) return 4 / 5;
    var width = parseFloat(parts[0]);
    var height = parseFloat(parts[1]);
    return width > 0 && height > 0 ? width / height : 4 / 5;
  }

  function fitWallCards() {
    document.querySelectorAll(".wall-card").forEach(function (card) {
      var viewport = card.closest(".wall-viewport");
      if (!viewport) return;
      var ratio = ratioValue(card.style.getPropertyValue("--card-ratio"));
      var maxWidth = Math.min(window.innerWidth * 0.84, 1200);
      var width = Math.min(maxWidth, viewport.clientHeight * ratio);
      card.style.setProperty("--card-width", width + "px");
    });
  }

  fitWallCards();

  function syncImageRatio(image) {
    if (!image.naturalWidth || !image.naturalHeight) return;
    var card = image.closest(".wall-card");
    if (!card) return;
    card.style.setProperty(
      "--card-ratio",
      image.naturalWidth + " / " + image.naturalHeight,
    );
    fitWallCards();
    onScroll();
  }

  document.querySelectorAll(".wall-image").forEach(function (image) {
    image.addEventListener("load", function () {
      syncImageRatio(image);
    });
    if (image.complete) syncImageRatio(image);
  });

  /* ============================================================
     2. INVERTED CLONE (for cursor text-invert effect)
  ============================================================ */
  var clone = contentEl.cloneNode(true);
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach(function (n) {
    n.removeAttribute("id");
  });
  clone.querySelectorAll("a").forEach(function (n) {
    n.setAttribute("tabindex", "-1");
  });
  clone.querySelectorAll("iframe").forEach(function (n) {
    n.remove();
  });
  invertedEl.appendChild(clone);

  /* ============================================================
     3. CURSOR BAR — thick while moving, thin while idle
  ============================================================ */
  var pointerEnabled = canHover.matches && !reducedMotion.matches;
  var zoneActive = false;
  var barRetired = false;
  var lastCursorX = window.innerWidth * 0.6;

  var targetX = lastCursorX;
  var currentX = targetX;
  var targetW = THIN;
  var currentW = THIN;
  var idleTimer = null;
  var cursorRaf = null;

  function setIdle() {
    targetW = THIN;
  }

  function onPointerMove(e) {
    if (barRetired) return;

    // Lock horizontal position if the user has started scrolling
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 0) return;

    lastCursorX = e.clientX;
    if (zoneActive) return;
    targetX = e.clientX;
    targetW = THICK;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(setIdle, IDLE_MS);
    if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorTick);
  }

  function cursorTick() {
    if (zoneActive || barRetired) {
      cursorRaf = null;
      return;
    }

    currentX += (targetX - currentX) * 0.08;
    currentW += (targetW - currentW) * 0.16;

    var half = currentW / 2;
    var left = currentX - half;
    var right = currentX + half;

    cursorBar.style.left = left + "px";
    cursorBar.style.width = currentW + "px";

    var vw = document.documentElement.clientWidth;
    var clipLeft = Math.max(0, left);
    var clipRight = Math.max(0, vw - right);

    invertedEl.style.clipPath =
      "inset(0 " + clipRight + "px 0 " + clipLeft + "px)";

    if (
      Math.abs(targetX - currentX) > 0.05 ||
      Math.abs(targetW - currentW) > 0.05
    ) {
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
     4. SOLID COLOR DEFINITIONS
  ============================================================ */
  var COLOR_DEFAULT_BG = "#f2f1eb";
  var COLOR_DEFAULT_TEXT = "#000000";
  var COLOR_DEFAULT_ACCENT = "#0033FF";

  var COLOR_FLOOD_BG = "#0033FF";
  var COLOR_FLOOD_TEXT = "#f2f1eb";
  var COLOR_FLOOD_ACCENT = "#0033FF";

  /* ============================================================
     5. SCROLLJACK STAGES
  ============================================================ */
  var stages = [
    {
      el: document.getElementById("stage-about"),
      counter: document.getElementById("cnt-about"),
      n: 5,
      hoverIndex: null,
    },
    {
      el: document.getElementById("stage-ach"),
      counter: document.getElementById("cnt-ach"),
      n: 4,
      hoverIndex: null,
    },
    {
      el: document.getElementById("stage-eb"),
      counter: document.getElementById("cnt-eb"),
      n: 3,
      hoverIndex: null,
    },
  ];

  stages.forEach(function (stage) {
    if (!stage.el) return;
    var rows = stage.el.querySelectorAll(".list-row");
    rows.forEach(function (row) {
      var idx = parseInt(row.getAttribute("data-row"), 10);
      row.addEventListener("mouseenter", function () {
        stage.hoverIndex = idx;
        updateStage(stage);
      });
      row.addEventListener("mouseleave", function () {
        stage.hoverIndex = null;
        updateStage(stage);
      });
    });
  });

  function updateStage(stage) {
    if (!stage.el) return;
    var rect = stage.el.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var p = scrollable > 0 ? -rect.top / scrollable : 0;
    p = Math.min(Math.max(p, 0), 1);

    var seg = 1 / stage.n;
    var scrollIndex = Math.min(Math.floor(p / seg), stage.n - 1);
    if (p >= 1) scrollIndex = stage.n - 1;

    var activeIndex =
      stage.hoverIndex !== null && stage.hoverIndex !== undefined
        ? stage.hoverIndex
        : scrollIndex;

    var rows = stage.el.querySelectorAll(".list-row");
    rows.forEach(function (row) {
      var idx = parseInt(row.getAttribute("data-row"), 10);
      row.classList.toggle("active", idx === activeIndex);
    });

    if (stage.counter) stage.counter.textContent = pad(activeIndex + 1);
  }

  /* ============================================================
     6. FLOOD — cursor-led reveal, then a solid blue work zone
  ============================================================ */
  function updateFlood() {
    if (!cinematic) return;
    var doc = document.documentElement;
    var scrollY = window.scrollY || doc.scrollTop;

    var cinematicEl = document.getElementById("cinematic");
    var contactEl = document.getElementById("contact");

    if (!cinematicEl || !contactEl) return;

    var aboutTop = cinematicEl.offsetTop;
    var contactTop = contactEl.getBoundingClientRect().top + scrollY;

    // Begin spreading on the first scroll pixel and finish at About.
    // The left and right edges cover their remaining distances independently,
    // so they touch the viewport edges at the exact same instant.
    var floodAmount = aboutTop > 0 ? scrollY / aboutTop : 1;
    floodAmount = Math.min(Math.max(floodAmount, 0), 1);

    // Keep the work area blue up to the Contact divider. Contact supplies its
    // own neutral full-width surface, so the visual cut is at that exact line.
    var isFullyFlooded = floodAmount >= 1 && scrollY < contactTop;

    document.documentElement.style.setProperty(
      "--bg",
      isFullyFlooded ? COLOR_FLOOD_BG : COLOR_DEFAULT_BG,
    );
    document.documentElement.style.setProperty(
      "--text",
      isFullyFlooded ? COLOR_FLOOD_TEXT : COLOR_DEFAULT_TEXT,
    );
    document.documentElement.style.setProperty(
      "--accent",
      isFullyFlooded ? COLOR_FLOOD_ACCENT : COLOR_DEFAULT_ACCENT,
    );

    body.classList.toggle("flooded", isFullyFlooded);

    // The bar is only needed while it is expanding. The inverted clone above
    // it keeps all text readable throughout the reveal.
    if (floodAmount >= 1.0) {
      barRetired = true;
    } else {
      barRetired = false;
      if (scrollY <= 0) zoneActive = false;
    }

    if (barRetired) {
      cursorBar.style.display = "none";
      invertedEl.style.display = "none";
    } else {
      cursorBar.style.display = "";
      invertedEl.style.display = "";
    }

    if (pointerEnabled && !barRetired) {
      if (floodAmount > 0) {
        zoneActive = true;

        var vw = window.innerWidth;

        var baseHalf = currentW / 2;
        var startLeft = lastCursorX - baseHalf;
        var startRight = lastCursorX + baseHalf;

        // Each side uses its own remaining distance. A cursor near the right
        // therefore expands farther left than right, but both arrive together.
        var left = Math.floor(startLeft * (1 - floodAmount)) - 1;
        var right = Math.ceil(startRight + (vw - startRight) * floodAmount) + 1;
        var width = right - left;

        cursorBar.style.left = left + "px";
        cursorBar.style.width = width + "px";

        var clipLeft = Math.max(0, left);
        var clipRight = Math.max(0, vw - right);
        invertedEl.style.clipPath =
          "inset(0 " + clipRight + "px 0 " + clipLeft + "px)";

        cursorBar.style.opacity = "1";
      } else {
        if (scrollY > 0) {
          zoneActive = true;
        } else {
          zoneActive = false;
        }
        cursorBar.style.opacity = "1";
      }
    }

    stages.forEach(updateStage);
  }

  /* ============================================================
     7. 3D GALLERY WALLS
  ============================================================ */
  var walls = [
    {
      stage: document.getElementById("wall-video"),
      track: document.getElementById("trackVideo"),
    },
    {
      stage: document.getElementById("wall-design"),
      track: document.getElementById("trackDesign"),
    },
  ];

  function updateWall(wall) {
    if (!wall.stage || !wall.track) return;
    var rect = wall.stage.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var p = scrollable > 0 ? -rect.top / scrollable : 0;
    p = Math.min(Math.max(p, 0), 1);

    var viewport = wall.track.parentElement;
    var cards = wall.track.children;
    var lastCard = cards[cards.length - 1];
    if (!lastCard) return;
    // Finish only when the last gallery item is centered in the viewport.
    var maxShift = lastCard.offsetLeft + lastCard.offsetWidth / 2;
    var shift = -(p * maxShift);

    wall.track.style.transform = "translateX(" + shift + "px)";

    var centerX = window.innerWidth / 2;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var cr = card.getBoundingClientRect();
      var cardCenter = cr.left + cr.width / 2;
      var dist = (cardCenter - centerX) / centerX;
      var clamped = Math.min(Math.max(dist, -1.4), 1.4);
      var rotateY = clamped * -26;
      var scale = 1 - Math.min(Math.abs(clamped), 1) * 0.18;
      var opacity = 1 - Math.min(Math.abs(clamped), 1) * 0.55;
      card.style.transform = "rotateY(" + rotateY + "deg) scale(" + scale + ")";
      card.style.opacity = opacity;
    }
  }

  /* ============================================================
     8. SPINE POSITIONING & CLOCK
  ============================================================ */
  function positionSpine() {
    var ref = document.querySelector(".row-num");
    if (!ref) return;
    var r = ref.getBoundingClientRect();
    var x = r.left + r.width / 2;
    document.documentElement.style.setProperty("--spine-x", x + "px");
  }

  function updateClocks() {
    var formatter = new Intl.DateTimeFormat("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Manila",
    });
    var value = formatter.format(new Date());
    var heroClock = document.getElementById("heroClock");
    var footClock = document.getElementById("footClock");
    if (heroClock) heroClock.textContent = value;
    if (footClock) footClock.textContent = value;
  }

  /* ============================================================
     9. SCROLL LOOP
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
    anchorMarker.style.top = pageProgress * (window.innerHeight - 9) + "px";
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onFrame);
    }
  }
  function onResize() {
    fitWallCards();
    positionSpine();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  positionSpine();
  updateClocks();
  window.setInterval(updateClocks, 15000);
  onFrame();

  /* ============================================================
     10. CONTACT FORM & MENU OVERLAY
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
      var href =
        "mailto:" +
        DEST_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
    });
  }

  var menuToggle = document.getElementById("menuToggle");
  var menuClose = document.getElementById("menuClose");
  var menuOverlay = document.getElementById("menuOverlay");
  var menuLinks = document.querySelectorAll(".menu-link");

  function openMenu() {
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
  }

  if (menuToggle && menuClose && menuOverlay) {
    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);
    menuLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }
})();
