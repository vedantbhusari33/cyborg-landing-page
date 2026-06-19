/* =========================================================
   SYNTH//CORE — Cyborg Landing Page
   Script: particles, typing effect, scroll fx, counters, form
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Set footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  /* ---------- Active nav link highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' }); // triggers when section crosses mid-viewport
  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Custom cursor glow + dot ---------- */
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let glowX = 0, glowY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    });

    // glow lags slightly behind the dot for a smooth, weighty feel
    function animateGlow() {
      glowX += (targetX - glowX) * 0.15;
      glowY += (targetY - glowY) * 0.15;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });
  }

  /* ---------- Mobile menu toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* ---------- Typing effect in hero heading ---------- */
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Become More Than Human.',
    'Merge Mind With Machine.',
    'Evolve Beyond Biology.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800); // pause at full phrase
        return;
      }
      setTimeout(typeLoop, 65);
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(typeLoop, 35);
    }
  }
  typeLoop();

  /* ---------- Scroll-triggered fade-ins (with stagger per grid) ---------- */
  // Group fade-in elements that share a grid parent so they cascade in,
  // instead of every element animating at the same instant.
  const staggerGroups = document.querySelectorAll('.features-grid, .testimonials-grid, .tech-grid, .hero-stats');
  staggerGroups.forEach(group => {
    const items = group.querySelectorAll('.fade-in');
    items.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 0.12}s`);
    });
  });

  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ---------- Counter animation for hero stats ---------- */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* ---------- Technology progress bars + percent counters ---------- */
  const techBars = document.querySelectorAll('.tech-bar');
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const fill = bar.querySelector('.tech-fill');
        const percentEl = bar.querySelector('.tech-percent');
        const target = parseInt(percentEl.dataset.target, 10);

        fill.style.width = target + '%';
        animateCounter(percentEl, target, 1600);
        techObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  techBars.forEach(bar => techObserver.observe(bar));

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const btnText = document.getElementById('form-btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btnText.textContent = 'Transmitting...';
    statusEl.textContent = '';

    setTimeout(() => {
      btnText.textContent = 'Send Transmission';
      statusEl.textContent = '> Transmission received. A liaison will respond shortly.';
      form.reset();
    }, 1200);
  });

  /* ---------- Animated particle background on canvas ---------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((width * height) / 18000); // density scales with screen size
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        glow: Math.random() > 0.5 ? 'rgba(0,240,255,' : 'rgba(138,43,226,'
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.glow + '0.55)';
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.glow + '0.8)';
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

});
