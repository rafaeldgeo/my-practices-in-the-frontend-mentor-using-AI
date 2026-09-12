/* ============================================================
   Navigation menu — one header button opens AND closes it
   ============================================================ */
(function () {
  "use strict";

  const toggle = document.querySelector(".nav__toggle");
  const toggleIcon = toggle && toggle.querySelector(".nav__toggle-icon");
  const menu = document.getElementById("menu");

  if (!toggle || !menu) {
    return;
  }

  const ICON_OPEN = "./assets/images/icon-menu.svg";
  const ICON_CLOSE = "./assets/images/icon-close.svg";

  function isOpen() {
    return !menu.hidden;
  }

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    if (toggleIcon) {
      toggleIcon.src = ICON_CLOSE;
    }
    document.body.style.overflow = "hidden";

    const firstLink = menu.querySelector("a[href]");
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (toggleIcon) {
      toggleIcon.src = ICON_OPEN;
    }
    document.body.style.overflow = "";
    toggle.focus();
  }

  // The header hamburger is the single open/close control.
  toggle.addEventListener("click", function () {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Click on the dimmed backdrop (the .menu element itself, not the panel).
  menu.addEventListener("click", function (event) {
    if (event.target === menu) {
      closeMenu();
    }
  });

  // Escape closes the menu.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      closeMenu();
    }
  });

  // Keep Tab focus inside the menu while it is open.
  menu.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = menu.querySelectorAll("a[href], button");
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
