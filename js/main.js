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

  document.querySelectorAll('.fade-slideshow').forEach((el) => {
    const slides = el.querySelectorAll('img');
    if (slides.length < 2) return;
    let index = Array.from(slides).findIndex((img) => img.classList.contains('is-active'));
    if (index < 0) index = 0;

    setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 3500);
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

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((other) => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initHeaderScroll();
  initCarousels();
  initFadeSlideshows();
  initMobileMenu();
  initAccordion();
  initScrollReveal();
});
