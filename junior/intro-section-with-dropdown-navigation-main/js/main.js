const toggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.nav');
const overlay = document.querySelector('.overlay');
const triggers = document.querySelectorAll('.nav__trigger');

// mesmo valor de $breakpoints.desktop (scss/_variables.scss)
const desktopQuery = window.matchMedia('(min-width: 64em)');

const isOpen = () => nav.classList.contains('nav--open');

const setSubmenu = (trigger, open) => {
  trigger.closest('.nav__item').classList.toggle('nav__item--open', open);
  trigger.setAttribute('aria-expanded', String(open));
};

const closeSubmenus = () => {
  triggers.forEach((trigger) => setSubmenu(trigger, false));
};

const setMenu = (open) => {
  nav.classList.toggle('nav--open', open);
  overlay.classList.toggle('overlay--visible', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';

  if (!open) closeSubmenus();
};

toggle.addEventListener('click', () => setMenu(!isOpen()));

overlay.addEventListener('click', () => setMenu(false));

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isOpen()) {
    setMenu(false);
    toggle.focus();
  }
});

// submenus: independentes; no desktop a abertura é por hover (CSS)
triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (desktopQuery.matches) return;

    const open = trigger.getAttribute('aria-expanded') !== 'true';
    setSubmenu(trigger, open);
  });
});

// evita menu travado aberto ao redimensionar/rotacionar para desktop
desktopQuery.addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});
