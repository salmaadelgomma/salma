/* ============================================
   Salma Adel Portfolio — script.js
   ============================================ */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav__link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const scrollTopBtn = document.getElementById('scrollTop');
  const typingText = document.getElementById('typingText');
  const copyEmailBtn = document.getElementById('copyEmail');
  const emailText = document.getElementById('emailText');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.getElementById('carouselDots');
  const statNumbers = document.querySelectorAll('.stat-card__number');
  const skillBars = document.querySelectorAll('.skill-card__progress');
  const cursorGlow = document.getElementById('cursorGlow');
  const particleCanvas = document.getElementById('particleCanvas');
  const shapes = document.querySelectorAll('.shape');

  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const revealElements = document.querySelectorAll(revealSelectors);

  /* ---------- Theme Toggle ---------- */
  const THEME_KEY = 'salma-portfolio-theme';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  initTheme();

  /* ---------- Mobile Nav ---------- */
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.className = navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.querySelector('i').className = 'fas fa-bars';
    });
  });

  /* ---------- Scroll: Header, Top Button, Active Nav ---------- */
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 50);
    scrollTopBtn.classList.toggle('visible', scrollY > 400);

    const offset = 100;
    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Typing Effect ---------- */
  const phrases = ['UI/UX Designer', 'Product Designer', 'Creative Thinker'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = phrases[phraseIndex];
    let speed = 100;

    if (isDeleting) {
      typingText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 50;
    } else {
      typingText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  /* ---------- Staggered Scroll Reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stat-card')) {
              entry.target.classList.add('visible');
            }
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };
      update();
    });
    countersAnimated = true;
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.unobserve(statsSection);
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ---------- Skill Bars ---------- */
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = `${bar.getAttribute('data-progress')}%`;
          skillsObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => skillsObserver.observe(bar));

  /* ---------- Carousel ---------- */
  const slides = carouselTrack.querySelectorAll('.carousel__slide');
  let currentSlide = 0;
  let autoPlayInterval;

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    carouselDots.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel__dot');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
    carouselDots.appendChild(dot);
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  carouselPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoPlay(); });
  carouselNext.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoPlay(); });
  startAutoPlay();

  let touchStartX = 0;
  carouselTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carouselTrack.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(currentSlide + (diff > 0 ? 1 : -1));
      resetAutoPlay();
    }
  }, { passive: true });

  /* ---------- Copy Email ---------- */
  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  copyEmailBtn.addEventListener('click', async () => {
    const email = emailText.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Email copied to clipboard!');
    }
  });

  /* ---------- Colorful Particle Background ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    const colors = ['#8b5e3c', '#d3d4c0', '#f3e4c9', '#0a2947', '#c9a87c', '#a67c52'];

    function resizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }

    function createParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          radius: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas.height;
        if (p.y > particleCanvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles(window.innerWidth < 768 ? 40 : 70);
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles(window.innerWidth < 768 ? 40 : 70);
    });
  }

  /* ---------- Cursor Glow (desktop only) ---------- */
  if (!prefersReducedMotion && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowActive = false;

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      if (!glowActive) {
        cursorGlow.classList.add('active');
        glowActive = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
      glowActive = false;
    });
  }

  /* ---------- Parallax Floating Shapes ---------- */
  if (!prefersReducedMotion && shapes.length) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 12;
        shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  /* ---------- Magnetic Buttons ---------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn--primary, .btn--outline').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Tilt Effect on Cards ---------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .service-card, .stat-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
