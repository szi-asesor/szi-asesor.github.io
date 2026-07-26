document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ RENDER / LOADING SCREEN ============ */
  const renderScreen = document.getElementById('render-screen');
  const renderFill = document.getElementById('render-fill');
  const renderPct = document.getElementById('render-pct');

  document.body.style.overflow = 'hidden';

  if (prefersReducedMotion) {
    renderScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
  } else {
    let pct = 0;
    const renderInterval = setInterval(() => {
      pct += Math.random() * 18 + 6;
      if (pct >= 100) {
        pct = 100;
        clearInterval(renderInterval);
        setTimeout(() => {
          renderScreen.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }, 300);
      }
      renderFill.style.width = pct + '%';
      renderPct.textContent = Math.floor(pct) + '%';
    }, 180);
  }

  /* ============ WAVEFORM GENERATION (hero) ============ */
  const waveBars = document.getElementById('wave-bars');
  if (waveBars) {
    const barCount = window.innerWidth < 600 ? 28 : 60;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('span');
      const duration = (1.2 + Math.random() * 1.4).toFixed(2);
      const delay = (Math.random() * 1.5).toFixed(2);
      const height = 20 + Math.random() * 80;
      bar.style.height = height + '%';
      bar.style.animationDuration = duration + 's';
      bar.style.animationDelay = delay + 's';
      waveBars.appendChild(bar);
    }
  }

  /* ============ MOBILE MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* ============ SMOOTH SCROLL FOR NAV / MARKERS ============ */
  document.querySelectorAll('a[href^="#"], .marker').forEach(el => {
    el.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href') || ('#' + this.dataset.section);
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 90,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ============ TIMELINE SCRUBBER: progress, playhead, timecode, active marker ============ */
  const timelineProgress = document.getElementById('timeline-progress');
  const playhead = document.getElementById('playhead');
  const timecodeEl = document.getElementById('timecode');
  const sections = document.querySelectorAll('.section');
  const markers = document.querySelectorAll('.marker');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const backToTopBtn = document.getElementById('back-to-top');

  const FPS = 30;
  const TOTAL_SECONDS = 180; // 3-minute "runtime" mapped to full page scroll
  const TOTAL_FRAMES = FPS * TOTAL_SECONDS;

  function formatTimecode(frame) {
    const totalSeconds = Math.floor(frame / FPS);
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    const ff = Math.floor(frame % FPS);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  }

  function updateTimeline() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;

    if (timelineProgress) timelineProgress.style.width = (scrollFraction * 100) + '%';
    if (playhead) playhead.style.left = (scrollFraction * 100) + '%';
    if (timecodeEl) timecodeEl.textContent = formatTimecode(scrollFraction * TOTAL_FRAMES);

    // Active section detection
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
        current = section.id;
      }
    });

    markers.forEach(m => m.classList.toggle('active', m.dataset.section === current));
    mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));

    backToTopBtn.classList.toggle('show', window.scrollY > 500);
  }

  window.addEventListener('scroll', updateTimeline);
  window.addEventListener('resize', updateTimeline);
  updateTimeline();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ============ TYPEWRITER EFFECT ============ */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    "Video Editor // Frame by frame storytelling",
    "Graphic Designer // Visuals with intent",
    "CS Student // Building the systems behind it"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 25 : 55;
    setTimeout(typeLoop, speed);
  }

  if (prefersReducedMotion) {
    typewriterEl.textContent = phrases[0];
  } else {
    setTimeout(typeLoop, 1600);
  }

  /* ============ SECTION FADE-IN ON SCROLL ============ */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ============ COUNTER ANIMATION ============ */
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = +counter.dataset.target;
          let count = 0;
          const increment = Math.max(target / 60, 0.3);

          const updateCounter = () => {
            count += increment;
            if (count < target) {
              counter.textContent = Math.ceil(count);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) counterObserver.observe(statsGrid);

  /* ============ SKILL BARS ANIMATION ============ */
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillFills.forEach(fill => {
          const width = fill.dataset.width;
          setTimeout(() => { fill.style.width = width + '%'; }, 150);
        });
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ============ WORK TRACK FILTERING ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        card.classList.toggle('hidden-card', !(filter === 'all' || filter === category));
      });
    });
  });

  /* ============ CONTACT FORM (DEMO SUBMIT) ============ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';

    setTimeout(() => {
      formStatus.textContent = "Message sent — I'll get back to you soon.";
      contactForm.reset();
      setTimeout(() => { formStatus.textContent = ''; }, 5000);
    }, 1000);
  });

});