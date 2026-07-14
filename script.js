document.addEventListener('DOMContentLoaded', () => {

  /* ============ BOOT SCREEN ============ */
  const bootScreen = document.getElementById('boot-screen');
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 3000);
  document.body.style.overflow = 'hidden';

  /* ============ NAVBAR SCROLL EFFECT ============ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    toggleBackToTop();
    highlightActiveNav();
  });

  /* ============ MOBILE MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ============ SMOOTH SCROLL FOR NAV LINKS ============ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============ ACTIVE NAV HIGHLIGHT ============ */
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === current) {
        item.classList.add('active');
      }
    });
  }

  /* ============ TYPEWRITER EFFECT ============ */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    "SOFTWARE ENGINEER // DIGITAL SYSTEMS SPECIALIST",
    "FULL-STACK DEVELOPER // PROBLEM SOLVER",
    "BUILDING RESILIENT DIGITAL SYSTEMS"
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
        setTimeout(typeLoop, 2200);
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

    const speed = isDeleting ? 30 : 60;
    setTimeout(typeLoop, speed);
  }

  setTimeout(typeLoop, 3200);

  /* ============ INTERSECTION OBSERVER: FADE-IN SECTIONS ============ */
  const observerOptions = { threshold: 0.15 };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

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
          const increment = target / 60;

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
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 150);
        });
        typeTerminalSkills();
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ============ TERMINAL SKILL PRINTOUT ============ */
  function typeTerminalSkills() {
    const terminalBody = document.getElementById('terminal-body');
    const lines = [
      "> SCANNING PERSONNEL RECORD...",
      "> HTML/CSS ......... [ONLINE]",
      "> JAVASCRIPT ....... [ONLINE]",
      "> REACT ............ [ONLINE]",
      "> NODE.JS .......... [ONLINE]",
      "> PYTHON ........... [ONLINE]",
      "> DATABASE MODULES . [ONLINE]",
      "> ALL SYSTEMS NOMINAL. READY FOR DEPLOYMENT."
    ];

    let lineIndex = 0;

    function printNextLine() {
      if (lineIndex < lines.length) {
        const p = document.createElement('p');
        p.textContent = lines[lineIndex];
        terminalBody.appendChild(p);
        lineIndex++;
        setTimeout(printNextLine, 350);
      }
    }

    setTimeout(printNextLine, 400);
  }

  /* ============ PROJECT FILTERING ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || filter === category) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  /* ============ CONTACT FORM (DEMO SUBMIT) ============ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '> TRANSMITTING...';

    setTimeout(() => {
      formStatus.textContent = '> MESSAGE RECEIVED. UPLINK CONFIRMED. STANDBY FOR RESPONSE.';
      contactForm.reset();

      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
    }, 1200);
  });

  /* ============ BACK TO TOP BUTTON ============ */
  const backToTopBtn = document.getElementById('back-to-top');

  function toggleBackToTop() {
    backToTopBtn.classList.toggle('show', window.scrollY > 500);
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ RANDOM SIGNAL FLICKER (ATMOSPHERE) ============ */
  const signalEl = document.getElementById('signal-strength');
  const signalStates = ['STABLE', 'STABLE', 'STABLE', 'FLUCTUATING', 'STABLE'];

  setInterval(() => {
    const random = signalStates[Math.floor(Math.random() * signalStates.length)];
    signalEl.textContent = random;
    signalEl.style.color = random === 'STABLE' ? '#3ee06f' : '#ffb454';
  }, 6000);

  /* ============ OCCASIONAL SCREEN FLICKER ============ */
  function randomFlicker() {
    const delay = 4000 + Math.random() * 8000;
    setTimeout(() => {
      document.body.style.opacity = '0.92';
      setTimeout(() => {
        document.body.style.opacity = '1';
        randomFlicker();
      }, 80);
    }, delay);
  }
  randomFlicker();

});