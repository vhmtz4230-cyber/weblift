// Cambia solo este número para actualizar todos los enlaces de WhatsApp del sitio.
const WHATSAPP_NUMBER = '525610310050';

function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || 'Hola, me gustaría más información.');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function initWhatsAppLinks() {
  document.querySelectorAll('.js-whatsapp').forEach((link) => {
    link.href = buildWhatsAppLink(link.dataset.message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initCarousels() {
  document.querySelectorAll('.carousel-section').forEach((section) => {
    const track = section.querySelector('.carousel-track');
    const prev = section.querySelector('.carousel-arrow.prev');
    const next = section.querySelector('.carousel-arrow.next');
    if (!track) return;
    const scrollByOne = (dir) => {
      const slide = track.querySelector('.carousel-slide');
      const amount = slide ? slide.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    if (prev) prev.addEventListener('click', () => scrollByOne(-1));
    if (next) next.addEventListener('click', () => scrollByOne(1));
  });
}

function initFadeSlideshows() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const gsapReady = typeof gsap !== 'undefined';
  const interval = 3500;

  document.querySelectorAll('.fade-slideshow').forEach((el) => {
    const slides = el.querySelectorAll('img');
    if (slides.length < 2) return;
    let index = Array.from(slides).findIndex((img) => img.classList.contains('is-active'));
    if (index < 0) index = 0;

    // Ken Burns: zoom lento y continuo mientras cada foto está activa.
    const kenBurns = (img) => {
      if (!gsapReady) return;
      gsap.fromTo(img, { scale: 1 }, { scale: 1.08, duration: (interval + 700) / 1000, ease: 'none' });
    };
    kenBurns(slides[index]);

    setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
      kenBurns(slides[index]);
    }, interval);
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    });
  });
}

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof gsap !== 'undefined' && !reduceMotion;

  function openPanel(trigger, panel) {
    if (!panel) return;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    if (!gsapReady) return;
    gsap.killTweensOf(panel);
    gsap.fromTo(
      panel,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  }

  function closePanel(trigger, panel) {
    if (!panel) return;
    trigger.setAttribute('aria-expanded', 'false');
    if (!gsapReady) {
      panel.hidden = true;
      return;
    }
    gsap.killTweensOf(panel);
    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => { panel.hidden = true; },
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((other) => {
        if (other !== trigger && other.getAttribute('aria-expanded') === 'true') {
          closePanel(other, document.getElementById(other.getAttribute('aria-controls')));
        }
      });

      if (isOpen) {
        closePanel(trigger, panel);
      } else {
        openPanel(trigger, panel);
      }
    });
  });
}

// Envuelve cada palabra en una máscara (overflow hidden) para que el texto
// entre "subiendo" desde el clip, no solo con fade — efecto más cinematográfico.
function splitWordsMasked(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((word) => `<span class="word-mask"><span class="word-inner">${word}</span></span>`)
    .join(' ');
  return el.querySelectorAll('.word-inner');
}

function initHeroIntro() {
  const badge = document.querySelector('.hero-logo-badge');
  const heading = document.querySelector('.hero h1');
  const subtitle = document.querySelector('.hero-subtitle');
  const actions = gsap.utils.toArray('.hero-actions > *');
  const trust = document.querySelector('.trust-bar');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (badge) {
    gsap.set(badge, { opacity: 0, scale: 0.55, rotate: -10 });
    tl.to(badge, { opacity: 1, scale: 1, rotate: 0, duration: 0.9 }, 0.1);
  }

  if (heading) {
    const words = splitWordsMasked(heading);
    gsap.set(words, { yPercent: 130 });
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.055 }, 0.35);
  }

  if (subtitle) {
    gsap.set(subtitle, { opacity: 0, y: 20 });
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.9 }, 0.85);
  }

  if (actions.length) {
    gsap.set(actions, { opacity: 0, y: 18 });
    tl.to(actions, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.0);
  }

  if (trust) {
    gsap.set(trust, { opacity: 0 });
    tl.to(trust, { opacity: 1, duration: 0.8 }, 1.25);
  }
}

function initScrollReveal(revealEls) {
  gsap.set(revealEls, { opacity: 0, y: 40, scale: 0.96 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.12,
      overwrite: true,
    }),
  });
}

// Botones magnéticos: se desplazan levemente hacia el cursor y regresan con rebote.
function initMagneticButtons() {
  document.querySelectorAll('.btn').forEach((btn) => {
    const strength = 0.3;
    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: relX * strength,
        y: relY * strength - 2,
        scale: 1.04,
        duration: 0.5,
        ease: 'power2.out',
      });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    btn.addEventListener('blur', onLeave);
  });
}

// Zoom sutil en las capturas del carrusel al pasar el cursor.
// (Las de alt-media tienen su propio parallax continuo — ver initAltMediaParallax.)
function initCardHoverZoom() {
  document.querySelectorAll('.carousel-slide .shot-frame').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;
    const enter = () => gsap.to(img, { scale: 1.06, duration: 0.7, ease: 'power3.out' });
    const leave = () => gsap.to(img, { scale: 1, duration: 0.6, ease: 'power3.out' });
    frame.addEventListener('mouseenter', enter);
    frame.addEventListener('mouseleave', leave);
  });
}

// Parallax: la foto se mueve más lento que el scroll dentro de su marco,
// dando sensación de profundidad al pasar por cada sección alternada.
function initAltMediaParallax() {
  gsap.utils.toArray('.alt-media .shot-frame img').forEach((img) => {
    gsap.set(img, { scale: 1.15 });
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.alt-section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

function initGsapAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  // Sin GSAP (CDN caído) o con reduced-motion: mostrar todo directo, sin animar.
  if (!gsapReady || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  initHeroIntro();
  initScrollReveal(revealEls);
  initMagneticButtons();
  initCardHoverZoom();
  initAltMediaParallax();

  // Las imágenes lazy-load cambian el alto del documento: recalcular posiciones de trigger.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initHeaderScroll();
  initCarousels();
  initFadeSlideshows();
  initMobileMenu();
  initAccordion();
  initGsapAnimations();
});
