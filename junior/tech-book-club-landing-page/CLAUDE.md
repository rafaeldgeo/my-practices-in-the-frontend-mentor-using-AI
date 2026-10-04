# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A solution to the Frontend Mentor premium **Tech book club landing page** challenge (junior level), one folder in a repo of practice challenges grouped by level (`newbie/`, `junior/`, `intermediate/`). Goal: match the design as closely as possible, with the right layout per screen size and hover/focus states on every interactive element. `preview.jpg` is the design preview; the full Figma file is not in the repo.

No build, package manager, linter or tests — it is plain static HTML/CSS (JS only if needed). Preview by opening `index.html` or serving the folder (`python3 -m http.server`). The finished sites are hosted on GitHub Pages straight from the repo (`https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<level>/<challenge>/`), so keep every asset path relative.

## Current state

`index.html` is still the **unstyled content skeleton** supplied by the challenge: a `<head>` with only the favicon and title, and the page copy as bare text in `<body>` (no semantic markup, no stylesheet, no fonts). Sections in order: hero, "Read together, grow together" (4 benefits), "Not your average book club", "Your tech reading journey" (4 numbered steps), "Membership options" (Starter / Pro / Enterprise), testimonial, closing CTA, footer. The work is to add semantic markup, `style.css`, and responsive images (the favicon link already works, since `assets/` is in place).

## Layout

`assets/` sits directly beside `index.html` (as in the finished `newbie/grid-landing-page-main`), so `./assets/images/favicon-32x32.png` and every other path `index.html` uses resolves. The challenge's `starter-code/` folder and `README-template.md` were removed; do not recreate them.

`design-system.md` holds the design tokens (colors, gradients, spacing, radius, typography presets) with the proposed CSS custom properties and a ready-to-paste `:root` block — use it as the source for `style.css`. It says the tokens were read from `design/*.svg`, but that folder is not in the repo.

insert in footer  ```<div class="attribution">
    Challenge by
    <a
      href="https://www.frontendmentor.io/profile/rafaeldgeo"
      target="_blank"
      rel="noopener"
      >Frontend Mentor</a>. Coded by
    <a
      href="https://www.linkedin.com/in/rafaeldgeo/"
      target="_blank"
      rel="noopener"
      >Rafael Dias de Almeida</a>.
  </div>```, align in center and bottom, size font 11px and colors combine with layout.

What is in `assets/`:

- Images come in `-mobile` / `-tablet` / `-desktop` `.webp` variants for the hero, "read together" and "not average" sections — use `<picture>`/`srcset` rather than one image plus CSS resizing. Other images are SVG icons/logos/patterns plus `pattern-circle.png`.
- Fonts are local **Inter** (variable + static Regular/SemiBold) and **Martian Mono** (variable + static Regular/SemiBold/Bold). Only those static weights ship; the newbie challenge linked Google Fonts instead, and either is allowed.

## Conventions (carried over from `newbie/grid-landing-page-main`)

- Semantic HTML5, `lang="en"`, WCAG-minded (labels, `aria-*`, focus visibility).
- Plain external `style.css`; design tokens as CSS custom properties on `:root` (colors, spacing, type scale, with `clamp()` for fluid sizes); **BEM** class names; **mobile-first** with `min-width` media queries in `em` (the newbie challenge used `48em` and `75em`).
- **JavaScript is ES6+ only** — `const`/`let` (never `var`), arrow functions, template literals, `===`/`!==`. Apply this from the first draft, not only when asked.

## Repo rules

- **Do not edit or remove `.gitignore`.** The challenge requires it as-is; it stops design files (`*.fig`, `*.sketch`, `*.xd`) from being committed. Never commit design files.
  -Regarding Figma calls: Never call a reading tool a "page node"; use only "frame" and "boundary error"—stop and report, without repeating or persisting.
