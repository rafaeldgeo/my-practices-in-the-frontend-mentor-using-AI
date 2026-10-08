# Design System — Suite Landing Page

Fonte: Figma `suite-landing-page` (página "Design System"), frames **Style Guide - Color**, **Style Guide - Typography**, **Style Guide - Spacing** e **Style Guide - Radius**.

Este arquivo é a fonte dos tokens usados pelo `style.css`.

---

## Color

### Neutral

| Nome | HEX | RGB | HSL |
|---|---|---|---|
| Neutral 900 | `#172339` | 23, 35, 57 | 219, 42%, 16% |
| Neutral 500 | `#49566D` | 73, 86, 109 | 218, 20%, 36% |
| Neutral 200 | `#F3EDE7` | 243, 237, 231 | 30, 33%, 93% |
| Neutral 0 | `#FAF8F6` | 250, 248, 246 | 30, 29%, 97% |

Obs.: no Figma, o swatch de Neutral 0 tem sombra `0px 2px 2px 0px rgba(0, 0, 0, 0.25)`.

### Colors

| Nome | HEX | RGB | HSL |
|---|---|---|---|
| Eupatorium Purple 500 | `#CB30E3` | 203, 48, 227 | 292, 76%, 54% |

### Gradient

| Nome | CSS |
|---|---|
| Light Gradient | `linear-gradient(135deg, #A060FF 0%, #CB30E3 49.21%, #FFA84E 100%)` |

### CSS custom properties

```css
:root {
  --color-neutral-900: #172339;
  --color-neutral-500: #49566D;
  --color-neutral-200: #F3EDE7;
  --color-neutral-0: #FAF8F6;

  --color-eupatorium-purple-500: #CB30E3;

  --gradient-light: linear-gradient(135deg, #A060FF 0%, #CB30E3 49.21%, #FFA84E 100%);
}
```

---

## Typography

Fonte: **Epilogue** (Regular = 400, Bold = 700).

Line height em % do tamanho da fonte. Letter spacing em px (valor do Figma) e em `em` (equivalente).

| Preset | Variante | Peso | Font size | Line height | Letter spacing | Text transform |
|---|---|---|---|---|---|---|
| Text Preset 1 | Desktop | Regular / Bold | 72px | 110% | -1px (-0.0139em) | — |
| Text Preset 1 | Tablet | Regular / Bold | 56px | 110% | -0.78px (-0.0139em) | — |
| Text Preset 1 | Mobile | Regular / Bold | 38px | 110% | -0.53px (-0.0139em) | — |
| Text Preset 2 | — | Regular / Bold | 48px | 120% | -0.5px (-0.0104em) | — |
| Text Preset 3 | — | Regular | 20px | 160% | 0.11px (0.0056em) | — |
| Text Preset 4 | — | Bold | 18px | 160% | -0.18px (-0.01em) | uppercase |
| Text Preset 5 | — | Regular | 18px | 160% | 0.1px (0.0056em) | — |
| Text Preset 6 | — | Bold | 16px | 150% | -0.16px (-0.01em) | — |
| Text Preset 7 | — | Regular | 16px | 150% | 2.5px (0.1563em) | uppercase |
| Text Preset 8 | — | Regular | 15px | 160% | 0px | — |

Obs.: o Figma define variantes Tablet e Mobile somente para o Text Preset 1. Os Presets 2 a 8 têm apenas uma versão (desktop).

### CSS custom properties

```css
:root {
  --font-family-epilogue: "Epilogue", sans-serif;

  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Text Preset 1 — Desktop */
  --text-preset-1-size: 72px;
  --text-preset-1-line-height: 1.1;
  --text-preset-1-letter-spacing: -0.0139em;

  /* Text Preset 1 — Tablet */
  --text-preset-1-tablet-size: 56px;

  /* Text Preset 1 — Mobile */
  --text-preset-1-mobile-size: 38px;

  /* Text Preset 2 */
  --text-preset-2-size: 48px;
  --text-preset-2-line-height: 1.2;
  --text-preset-2-letter-spacing: -0.0104em;

  /* Text Preset 3 */
  --text-preset-3-size: 20px;
  --text-preset-3-line-height: 1.6;
  --text-preset-3-letter-spacing: 0.0056em;

  /* Text Preset 4 (uppercase) */
  --text-preset-4-size: 18px;
  --text-preset-4-line-height: 1.6;
  --text-preset-4-letter-spacing: -0.01em;

  /* Text Preset 5 */
  --text-preset-5-size: 18px;
  --text-preset-5-line-height: 1.6;
  --text-preset-5-letter-spacing: 0.0056em;

  /* Text Preset 6 */
  --text-preset-6-size: 16px;
  --text-preset-6-line-height: 1.5;
  --text-preset-6-letter-spacing: -0.01em;

  /* Text Preset 7 (uppercase) */
  --text-preset-7-size: 16px;
  --text-preset-7-line-height: 1.5;
  --text-preset-7-letter-spacing: 0.1563em;

  /* Text Preset 8 */
  --text-preset-8-size: 15px;
  --text-preset-8-line-height: 1.6;
  --text-preset-8-letter-spacing: 0;
}
```

---

## Spacing

| Nome | Pixels |
|---|---|
| spacing-0 | 0 |
| spacing-025 | 2px |
| spacing-050 | 4px |
| spacing-075 | 6px |
| spacing-100 | 8px |
| spacing-125 | 10px |
| spacing-150 | 12px |
| spacing-200 | 16px |
| spacing-250 | 20px |
| spacing-300 | 24px |
| spacing-400 | 32px |
| spacing-500 | 40px |
| spacing-600 | 48px |
| spacing-800 | 64px |
| spacing-1000 | 80px |

### CSS custom properties

```css
:root {
  --spacing-0: 0;
  --spacing-025: 2px;
  --spacing-050: 4px;
  --spacing-075: 6px;
  --spacing-100: 8px;
  --spacing-125: 10px;
  --spacing-150: 12px;
  --spacing-200: 16px;
  --spacing-250: 20px;
  --spacing-300: 24px;
  --spacing-400: 32px;
  --spacing-500: 40px;
  --spacing-600: 48px;
  --spacing-800: 64px;
  --spacing-1000: 80px;
}
```

---

## Radius

| Nome | Pixels |
|---|---|
| radius-0 | 0 |
| radius-4 | 4px |
| radius-6 | 6px |
| radius-8 | 8px |
| radius-10 | 10px |
| radius-12 | 12px |
| radius-16 | 16px |
| radius-20 | 20px |
| radius-24 | 24px |
| radius-full | 999px |

### CSS custom properties

```css
:root {
  --radius-0: 0;
  --radius-4: 4px;
  --radius-6: 6px;
  --radius-8: 8px;
  --radius-10: 10px;
  --radius-12: 12px;
  --radius-16: 16px;
  --radius-20: 20px;
  --radius-24: 24px;
  --radius-full: 999px;
}
```
