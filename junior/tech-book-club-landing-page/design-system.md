# Design system — Tech book club landing page

Tokens extraídos de `design/colors.svg`, `design/spacing.svg`, `design/radius.svg` e `design/typography.svg`. Os nomes seguem exatamente os definidos nas imagens; as custom properties são a convenção proposta para o CSS.

## Cores

Códigos em HEX.

### Neutral

| Nome        | HEX       | RGB           | HSL           | Custom property       |
| ----------- | --------- | ------------- | ------------- | --------------------- |
| Neutral 900 | `#062630` | 6, 38, 48     | 194, 78%, 11% | `--color-neutral-900` |
| Neutral 700 | `#385159` | 56, 81, 89    | 195, 23%, 28% | `--color-neutral-700` |
| Neutral 200 | `#E6E1DF` | 230, 225, 223 | 17, 12%, 89%  | `--color-neutral-200` |
| Neutral 100 | `#FAF5F3` | 250, 245, 243 | 17, 41%, 97%  | `--color-neutral-100` |
| Neutral 0   | `#FFFFFF` | 255, 255, 255 | 0, 0%, 100%   | `--color-neutral-0`   |

### Light Salmon

| Nome             | HEX       | RGB           | HSL           | Custom property            |
| ---------------- | --------- | ------------- | ------------- | -------------------------- |
| Light Salmon 500 | `#FEA36F` | 254, 163, 111 | 22, 99%, 72%  | `--color-light-salmon-500` |
| Light Salmon 100 | `#FFE2D1` | 255, 226, 209 | 22, 100%, 91% | `--color-light-salmon-100` |
| Light Salmon 50  | `#FFF5EF` | 255, 245, 239 | 23, 100%, 97% | `--color-light-salmon-50`  |

### Gradient

| Nome          | CSS                                                        | Custom property         |
| ------------- | ---------------------------------------------------------- | ----------------------- |
| Text Gradient | `linear-gradient(107deg, #FF9A60 -11.37%, #062630 61.84%)` | `--gradient-text`       |
| Gradient      | `linear-gradient(90deg, #FFE2D1 0%, #FFF5EF 100%)`         | `--gradient-background` |

> **Atenção:** no swatch do "Text Gradient" o SVG usa `#FEA36F` (Light Salmon 500) como cor inicial, mas o texto de especificação da própria imagem indica `#FF9A60`. Este documento segue o CSS escrito na imagem (`#FF9A60`). Se o visual final ficar diferente do design, troque por `var(--color-light-salmon-500)`.

O `--gradient-text` é pensado para texto: aplique com `background: var(--gradient-text); background-clip: text; -webkit-background-clip: text; color: transparent;`.

## Spacing

| Nome         | Pixels | rem      | Custom property   |
| ------------ | ------ | -------- | ----------------- |
| spacing-0    | 0      | 0        | `--spacing-0`     |
| spacing-025  | 2px    | 0.125rem | `--spacing-025`   |
| spacing-050  | 4px    | 0.25rem  | `--spacing-050`   |
| spacing-075  | 6px    | 0.375rem | `--spacing-075`   |
| spacing-100  | 8px    | 0.5rem   | `--spacing-100`   |
| spacing-150  | 12px   | 0.75rem  | `--spacing-150`   |
| spacing-200  | 16px   | 1rem     | `--spacing-200`   |
| spacing-250  | 20px   | 1.25rem  | `--spacing-250`   |
| spacing-300  | 24px   | 1.5rem   | `--spacing-300`   |
| spacing-400  | 32px   | 2rem     | `--spacing-400`   |
| spacing-500  | 40px   | 2.5rem   | `--spacing-500`   |
| spacing-600  | 48px   | 3rem     | `--spacing-600`   |
| spacing-800  | 64px   | 4rem     | `--spacing-800`   |
| spacing-1000 | 80px   | 5rem     | `--spacing-1000`  |

## Radius

| Nome        | Pixels | Custom property  |
| ----------- | ------ | ---------------- |
| radius-0    | 0      | `--radius-0`     |
| radius-4    | 4px    | `--radius-4`     |
| radius-6    | 6px    | `--radius-6`     |
| radius-8    | 8px    | `--radius-8`     |
| radius-10   | 10px   | `--radius-10`    |
| radius-12   | 12px   | `--radius-12`    |
| radius-16   | 16px   | `--radius-16`    |
| radius-20   | 20px   | `--radius-20`    |
| radius-24   | 24px   | `--radius-24`    |
| radius-full | 999px  | `--radius-full`  |

## Typography

Famílias: **Martian Mono** e **Inter** (ambas locais em `assets/fonts/`). Pesos: Regular `400`, SemiBold `600`, Bold `700`.

Line height em porcentagem no design, convertida para valor sem unidade (120% → `1.2`).

| Preset                   | Fonte                     | Font size | Line height | Letter spacing |
| ------------------------ | ------------------------- | --------- | ----------- | -------------- |
| Text Preset 1            | Martian Mono, Bold        | 62px      | 120%        | -2px           |
| Text Preset 1 (Mobile)   | Martian Mono, Bold        | 38px      | 120%        | -2px           |
| Text Preset 2            | Martian Mono, SemiBold    | 50px      | 130%        | -2px           |
| Text Preset 2 (Mobile)   | Martian Mono, SemiBold    | 34px      | 130%        | -2px           |
| Text Preset 3            | Martian Mono, SemiBold    | 34px      | 130%        | -1px           |
| Text Preset 3 (Mobile)   | Martian Mono, SemiBold    | 24px      | 110%        | -1px           |
| Text Preset 4            | Martian Mono, SemiBold    | 24px      | 110%        | -1px           |
| Text Preset 4 (Regular)  | Martian Mono, Regular     | 24px      | 110%        | -1px           |
| Text Preset 5            | Inter, Regular            | 20px      | 140%        | -0.5px         |
| Text Preset 5 (SemiBold) | Inter, SemiBold           | 20px      | 140%        | -0.5px         |
| Text Preset 6            | Martian Mono, SemiBold    | 18px      | 130%        | -1px           |
| Text Preset 6 (Mobile)   | Martian Mono, SemiBold    | 16px      | 130%        | -1px           |
| Text Preset 7            | Martian Mono, Regular     | 14px      | 120%        | -1px           |

Observações:

- Só os presets **1, 2, 3 e 6** têm versão mobile. Os presets 4, 5 e 7 mantêm o mesmo tamanho em todas as telas.
- As variantes **4 (Regular)** e **5 (SemiBold)** diferem do preset base apenas no peso: use `--font-weight-regular` / `--font-weight-semibold` em vez do token de peso do preset.
- O preset 2 (Mobile) tem o mesmo tamanho e line height do preset 3, mas letter spacing `-2px` (o preset 3 usa `-1px`).
- Os SVGs não informam o breakpoint entre mobile e desktop. No bloco abaixo foi usado `48em`, o mesmo do desafio `newbie/grid-landing-page-main`; ajuste se o layout pedir outro.

## Tokens para o CSS

Abordagem mobile-first: os tokens de tipografia guardam os valores mobile e são sobrescritos em `min-width: 48em`. Espaçamentos e tamanhos de fonte estão em `rem` (1rem = 16px), a unidade que respeita a preferência de fonte do usuário; letter spacing e raios ficam em `px`, como no design.

```css
:root {
  /* Colors — Neutral */
  --color-neutral-900: #062630;
  --color-neutral-700: #385159;
  --color-neutral-200: #e6e1df;
  --color-neutral-100: #faf5f3;
  --color-neutral-0: #ffffff;

  /* Colors — Light Salmon */
  --color-light-salmon-500: #fea36f;
  --color-light-salmon-100: #ffe2d1;
  --color-light-salmon-50: #fff5ef;

  /* Gradients */
  --gradient-text: linear-gradient(107deg, #ff9a60 -11.37%, #062630 61.84%);
  --gradient-background: linear-gradient(90deg, #ffe2d1 0%, #fff5ef 100%);

  /* Spacing */
  --spacing-0: 0;
  --spacing-025: 0.125rem; /* 2px */
  --spacing-050: 0.25rem; /* 4px */
  --spacing-075: 0.375rem; /* 6px */
  --spacing-100: 0.5rem; /* 8px */
  --spacing-150: 0.75rem; /* 12px */
  --spacing-200: 1rem; /* 16px */
  --spacing-250: 1.25rem; /* 20px */
  --spacing-300: 1.5rem; /* 24px */
  --spacing-400: 2rem; /* 32px */
  --spacing-500: 2.5rem; /* 40px */
  --spacing-600: 3rem; /* 48px */
  --spacing-800: 4rem; /* 64px */
  --spacing-1000: 5rem; /* 80px */

  /* Radius */
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

  /* Typography — families and weights */
  --font-martian-mono: "Martian Mono", monospace;
  --font-inter: "Inter", sans-serif;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Text Preset 1 (mobile) */
  --text-preset-1-font-family: var(--font-martian-mono);
  --text-preset-1-font-weight: var(--font-weight-bold);
  --text-preset-1-font-size: 2.375rem; /* 38px */
  --text-preset-1-line-height: 1.2;
  --text-preset-1-letter-spacing: -2px;

  /* Text Preset 2 (mobile) */
  --text-preset-2-font-family: var(--font-martian-mono);
  --text-preset-2-font-weight: var(--font-weight-semibold);
  --text-preset-2-font-size: 2.125rem; /* 34px */
  --text-preset-2-line-height: 1.3;
  --text-preset-2-letter-spacing: -2px;

  /* Text Preset 3 (mobile) */
  --text-preset-3-font-family: var(--font-martian-mono);
  --text-preset-3-font-weight: var(--font-weight-semibold);
  --text-preset-3-font-size: 1.5rem; /* 24px */
  --text-preset-3-line-height: 1.1;
  --text-preset-3-letter-spacing: -1px;

  /* Text Preset 4 (Regular: use --font-weight-regular) */
  --text-preset-4-font-family: var(--font-martian-mono);
  --text-preset-4-font-weight: var(--font-weight-semibold);
  --text-preset-4-font-size: 1.5rem; /* 24px */
  --text-preset-4-line-height: 1.1;
  --text-preset-4-letter-spacing: -1px;

  /* Text Preset 5 (SemiBold: use --font-weight-semibold) */
  --text-preset-5-font-family: var(--font-inter);
  --text-preset-5-font-weight: var(--font-weight-regular);
  --text-preset-5-font-size: 1.25rem; /* 20px */
  --text-preset-5-line-height: 1.4;
  --text-preset-5-letter-spacing: -0.5px;

  /* Text Preset 6 (mobile) */
  --text-preset-6-font-family: var(--font-martian-mono);
  --text-preset-6-font-weight: var(--font-weight-semibold);
  --text-preset-6-font-size: 1rem; /* 16px */
  --text-preset-6-line-height: 1.3;
  --text-preset-6-letter-spacing: -1px;

  /* Text Preset 7 */
  --text-preset-7-font-family: var(--font-martian-mono);
  --text-preset-7-font-weight: var(--font-weight-regular);
  --text-preset-7-font-size: 0.875rem; /* 14px */
  --text-preset-7-line-height: 1.2;
  --text-preset-7-letter-spacing: -1px;
}

/* Desktop overrides — only presets 1, 2, 3 and 6 change */
@media (min-width: 48em) {
  :root {
    --text-preset-1-font-size: 3.875rem; /* 62px */

    --text-preset-2-font-size: 3.125rem; /* 50px */

    --text-preset-3-font-size: 2.125rem; /* 34px */
    --text-preset-3-line-height: 1.3;

    --text-preset-6-font-size: 1.125rem; /* 18px */
  }
}
```
