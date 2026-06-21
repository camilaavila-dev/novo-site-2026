// script.js — Limpo, sem Lenis, sem bugs

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. GSAP Plugins ───────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }

  // ─── 2. Navbar scroll ──────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ─── 3. Contadores ─────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const observerCounts = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, step);
      observerCounts.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observerCounts.observe(c));

  // ─── 4. FAQ ────────────────────────────────────────
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Abre o clicado (se não estava aberto)
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── 5. GSAP Animações (entra em cena ao scrollar) ─
  function initGSAP() {
    // Anima qualquer elemento com classe .anim-ready
    document.querySelectorAll('.anim-ready').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('visible'),
      });
    });

    // Parallax sutil no vídeo do hero
    const heroVid = document.querySelector('.hero-video-wrap video');
    if (heroVid) {
      gsap.to(heroVid, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }
});
