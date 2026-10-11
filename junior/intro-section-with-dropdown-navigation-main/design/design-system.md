# Design System — Intro section with dropdown navigation

Referência para a criação dos estilos (SCSS). Nomenclatura dos tokens segue o Figma.
Fontes: `design/style-guide/*` e valores confirmados pelo autor (**exatos**) e `design/home`, `design/menu`, `design/components` (valores **estimados** — marcados com `~`).

Decisões: só cores usadas · nomes do Figma · unidades em `rem` (1rem = 16px) · tokens em `:root` num parcial próprio · breakpoints como variáveis Sass.

---

## 1. Cores (exatas — style guide)

Apenas as usadas. (Black `#000000` e Violet 500 `#726CEE` existem no guia, mas não foram usadas — fora por enquanto.)

| Token | HEX | HSL | Uso |
|---|---|---|---|
| `--color-white` | `#FFFFFF` | 0°, 0%, 100% | Painel do menu mobile/tablet, cartões dos dropdowns |
| `--color-gray-950` | `#151515` | 0°, 0%, 8% | Logo, títulos, botão "Learn more", ícone hambúrguer/fechar, bordas do botão outline em hover |
| `--color-gray-500` | `#686868` | 0°, 0%, 41% | Parágrafo, itens do menu/dropdown, "Careers" desktop, borda do botão Register |
| `--color-gray-400` | `#ADADAD` | 0°, 0%, 68% | Logos de clientes |
| `--color-gray-200` | `#D8D8D8` | 0°, 0%, 85% | Reservado: bordas sutis (confirmar uso) |
| `--color-gray-50` | `#FAFAFA` | 0°, 0%, 98% | Fundo da página |
| `--color-blue-400` | `#4BB1DA` | 197°, 66%, 57% | Ícones Todo List / Calendar (já embutidos nos SVGs) |
| `--color-yellow-300` | `#EDD556` | 50°, 81%, 63% | Ícone Reminders (SVG) |
| `--color-purple-600` | `#8E4CB6` | 277°, 42%, 51% | Ícone Planning (SVG) |

> Blue/Yellow/Purple vêm dentro dos SVGs/imagens; os tokens existem por completude do design, mas provavelmente não serão consumidos no CSS.

### Cores estimadas (não constam no guia)

| Token | Valor | Uso |
|---|---|---|
| `--color-overlay` | `hsl(0 0% 0% / 0.6)` ~ | Fundo escurecido atrás do menu mobile/tablet |

---

## 2. Espaçamento (exato — style guide)

| Token | px | rem |
|---|---|---|
| `--spacing-0` | 0 | `0` |
| `--spacing-100` | 8 | `0.5rem` |
| `--spacing-200` | 16 | `1rem` |
| `--spacing-300` | 24 | `1.5rem` |
| `--spacing-400` | 32 | `2rem` |
| `--spacing-500` | 40 | `2.5rem` |
| `--spacing-600` | 48 | `3rem` |
| `--spacing-700` | 56 | `3.5rem` |
| `--spacing-800` | 64 | `4rem` |
| `--spacing-900` | 72 | `4.5rem` |

---

## 3. Tipografia

### Família e pesos (exatos)

| Token | Valor |
|---|---|
| `--font-family` | `'Epilogue', sans-serif` (Google Fonts, pesos 500 e 700) |
| `--fw-medium` | `500` |
| `--fw-bold` | `700` |

### Presets (exatos — valores de **desktop** do style guide)

| Preset | px / rem | Peso | Line-height | Letter-spacing |
|---|---|---|---|---|
| `preset-1` | 80 / `5rem` | Bold | 100% (`1`) | -1px (`-0.0625rem`) |
| `preset-2` | 64 / `4rem` | Bold | 100% | -1px |
| `preset-3` | 36 / `2.25rem` | Bold | 100% | -1px |
| `preset-4-bold` | 18 / `1.125rem` | Bold | 155% (`1.55`) | -0.25px (`-0.015625rem`) |
| `preset-4` | 18 / `1.125rem` | Medium | 155% | 0 |
| `preset-5-bold` | 16 / `1rem` | Bold | 155% | -0.25px |
| `preset-5` | 16 / `1rem` | Medium | 155% | 0 |
| `preset-6` | 14 / `0.875rem` | Medium | 115% (`1.15`) | 0 |

Tokens auxiliares: `--lh-tight: 1`, `--lh-body: 1.55`, `--lh-small: 1.15`, `--ls-tight: -0.0625rem`, `--ls-snug: -0.015625rem`.

### Escala fluida (decidido)

Objetivo do projeto: **fluidez** — o título quebra/escala suavemente entre os breakpoints, sem saltos. Âncoras (confirmadas): título **36px @375**, **64px @768**, **80px @1440**. Abaixo de 375 fica travado em 36px (quebra de linha natural até 320px); acima de 1440 fica em 80px.

Como as âncoras não são lineares, a interpolação é em **dois trechos** (um `clamp()` por faixa, a segunda dentro do breakpoint de 768):

| Trecho | Intervalo | Fórmula (`vw` + offset) | Token |
|---|---|---|---|
| Título A | 375 → 768 | `clamp(2.25rem, 7.125vw + 0.58rem, 4rem)` | `--fs-hero` (base, mobile-first) |
| Título B | 768 → 1440 | `clamp(4rem, 2.381vw + 2.857rem, 5rem)` | `--fs-hero` (redefinido em `@include respond-to(tablet)`) |
| Parágrafo A | 375 → 768 | `clamp(1rem, 0.509vw + 0.881rem, 1.125rem)` | `--fs-body` |
| Parágrafo B | ≥ 768 | `1.125rem` fixo | `--fs-body` (redefinido em `tablet`) |

Conferência: A @375 = 36px, @768 = 64px · B @768 = 64px, @1440 = 80px · parágrafo A @375 = 16px, @768 = 18px.

Demais elementos (sem fluidez, valores por breakpoint — estimados):

| Elemento | Mobile 375 | Tablet 768 | Desktop 1440 |
|---|---|---|---|
| Botão "Learn more" | ~16px bold (preset-5-bold) | ~16px bold | 18px bold (preset-4-bold) |
| Links da navbar / itens do menu | 16px medium (preset-5) | 16px | 16px |
| Login / Register no menu mobile/tablet | 14px medium (preset-6) | 14px | — (na navbar: 16px) |

---

## 4. Radius (confirmados)

| Token | Valor | Uso |
|---|---|---|
| `--radius-button` | `0.9375rem` (15px) — confirmado | "Learn more", "Register" |
| `--radius-dropdown` | `0.625rem` (10px) — confirmado | Cartões dos dropdowns desktop e menu |

---

## 5. Sombra (confirmada)

| Token | Valor | Uso |
|---|---|---|
| `--shadow-dropdown` | `0 0.625rem 2.5rem 0 hsl(0 0% 0% / 0.1491)` (X 0, Y 10, blur 40, spread 0, #000 a 14.91%) | Cartões dos dropdowns desktop. Menu mobile/tablet **não** tem sombra — só overlay. |

---

## 6. Breakpoints e layout

| Variável Sass | Valor | Observação |
|---|---|---|
| `tablet` | `48em` (768px) | Início do layout de tablet (âncora de 64px do título). **Menu hambúrguer é mantido até 768px inclusive** |
| `desktop` | `48.0625em` (769px) | Navbar horizontal + dropdowns a partir de 769px (decidido: há espaço horizontal acima de 768px) |
| referência | `90em` (1440px) | Layout de referência do design desktop; não é breakpoint, só âncora do `clamp()` |

Mobile-first (`min-width`, `em`), suportar até 320px (`20em`). Como o menu hambúrguer vale até 768px e o `clamp()` do título muda de trecho em 768px, `tablet` (48em) redefine só tipografia/medidas de layout e `desktop` (48.0625em) troca o menu por navbar.

Medidas estimadas por layout:

| Item | Mobile 375 | Tablet 768 | Desktop 1440 |
|---|---|---|---|
| Header (logo + hambúrguer) | altura ~72px, padding lateral 16px | altura ~84px, padding lateral 40px | logo à esquerda com padding ~40px; Login/Register à direita |
| Hero | imagem full-width **acima** do texto; texto centralizado | imagem full-width acima; texto centralizado | duas colunas: texto à esquerda (alinhado à esquerda), imagem à direita (~480px de largura) |
| Botão "Learn more" | ~136×48px | ~162×56px | ~163×56px |
| Logos de clientes | linha centralizada, ~16px de gap, ~330px total | linha com ~40px de gap, largura ~680px | linha à esquerda, ~48px de gap |
| Painel do menu | ~240px (≈64% da largura), alinhado à direita, altura total | ~283px, alinhado à direita | — (não existe) |

---

## 7. Componentes e estados

### Botão "Learn more" (primário)
- Default: fundo `--color-gray-950`, texto `--color-white`, bold, `--radius-button`.
- Hover/active: fundo transparente/branco, borda 1px `--color-gray-950`, texto `--color-gray-950` (ver `components-button-learn-more-active.png`).

### Botão "Register" (outline)
- Default: borda 1px `--color-gray-500`, texto `--color-gray-500`, fundo transparente, `--radius-button`.
- Hover/active: borda e texto `--color-gray-950` (ver `components-button-registre-active.png`).

### Login
- Link de texto, `--color-gray-500`; hover → `--color-gray-950`.

### Navbar desktop
- Itens: Features ▾, Company ▾ (botões com seta `icon-arrow-down.svg` → `icon-arrow-up.svg` ao abrir), Careers, About (links).
- Default: `--color-gray-500`; hover/ativo: `--color-gray-950`.
- Gap entre itens ~40px (`--spacing-500`).

### Dropdown desktop
- Cartão `--color-white`, `--radius-dropdown`, `--shadow-dropdown`, padding ~24px (`--spacing-300`), gap vertical entre itens ~16px (`--spacing-200`).
- Features: ícone (~16px) + texto, gap ~16px. Company: só texto, alinhado ao mesmo recuo do texto do Features.
- Aparece logo abaixo do gatilho (~8px de distância, `--spacing-100`); alinhado à esquerda do item.

### Menu mobile/tablet
- Painel `--color-white` à direita; overlay `--color-overlay` cobrindo o resto.
- Botão fechar (`icon-close-menu.svg`) no topo direito, alinhado ao mesmo ponto do hambúrguer.
- Itens com gap ~24px; submenus recuados (~24px) com os ícones alinhados; Login centralizado e Register (outline, largura total do painel) no fim.

---

## 8. Decisões registradas

1. Menu hambúrguer até 768px; navbar horizontal a partir de 769px (`48.0625em`).
2. Título fluido em dois trechos (36→64 entre 375–768; 64→80 entre 768–1440); parágrafo 16→18 entre 375–768.
3. Radius: botões 15px, menu/dropdown 10px. Sombra do dropdown: 0 / 10 / 40 / 0, `#000` 14.91%.
4. Medidas de layout (§6) e `--color-overlay` seguem **estimados** — ajustar comparando com o design no navegador.
5. Cores azul/amarelo/roxo mantidas como tokens; `--color-gray-200` mantido só se aparecer uso real (borda).

---

## 9. Blocos BEM e decisões de comportamento (respostas às ambiguidades)

> Esta seção **prevalece** sobre qualquer item anterior que a contradiga.

### 9.1 Blocos BEM

| Bloco | Elementos | Modificadores / estados |
|---|---|---|
| `header` | `__inner`, `__logo`, `__toggle`, `__nav` | – |
| `nav` | `__list`, `__item`, `__link`, `__trigger`, `__arrow`, `__panel`, `__actions` | `nav--open`, `nav__item--open` |
| `dropdown` | `__list`, `__item`, `__link`, `__icon` | `dropdown--icons` (Features), `dropdown--text` (Company) |
| `overlay` | – | `overlay--visible` |
| `button` | `__label` | `button--primary` (Learn more), `button--outline` (Register) |
| `hero` | `__content`, `__title`, `__text`, `__cta`, `__picture`, `__image` | – |
| `clients` | `__list`, `__item`, `__logo` | – |
| `attribution` | – | – (conforme `CLAUDE.md`) |

O botão hambúrguer/fechar é **um único `<button>`** (`header__toggle`) que alterna o ícone (`icon-menu` ↔ `icon-close-menu`).

### 9.2 Breakpoints (atualizado)

| Variável | Valor | Função |
|---|---|---|
| `tablet` | `48em` (768px) | Tipografia/medidas de tablet |
| `desktop` | `48.0625em` (769px) | Navbar horizontal + dropdowns |
| `hero` | `64em` (1024px) | Hero em duas colunas (texto à esquerda, imagem à direita) |

### 9.3 Layout

- **Hero:** abaixo de 64em, empilhado (imagem acima, texto centralizado). A partir de 64em, duas colunas com texto à esquerda. Entre 769px e 1023px a navbar já é horizontal, mas o hero continua empilhado.
- **Imagem do hero:** mobile e tablet usam `image-hero-mobile.png` com largura 100% (sem margens laterais); desktop usa `image-hero-desktop.png`, com tamanho que **escala com a viewport** (~480px @1440).
- **Recuos fluidos:** o recuo lateral do conteúdo do hero (~165px @1440) e a margem direita da imagem (~130px) escalam com `clamp()` — sem valores fixos.
- **Header:** padding lateral 16px (mobile), 40px (tablet e desktop).
- **Título:** quebra forçada "Make / remote work" só no desktop; no mobile/tablet quebra naturalmente (em 320px, duas linhas).
- **Logos de clientes:** `flex-wrap`, sem reduzir abaixo do tamanho de 375px; em < 375px quebram para a linha seguinte.

### 9.4 Menu mobile/tablet

- **Largura do painel:** fluida; em 320px ocupa **100%** da largura. Implementação sugerida: base `100%`; a partir de `23.4375em` (375px) `15rem` (240px); em `tablet` `17.6875rem` (283px). *(Salto entre 320 e 375 aceito para cumprir "100% em 320px" — confirmar se prefere transição contínua.)*
- **Botão fechar:** é o mesmo `header__toggle`, na mesma posição do hambúrguer (por isso o painel não pode cobrir o botão; o botão fica acima do painel/overlay — `z-index` maior).
- **Submenus:** abrem de forma independente; podem ficar abertos ao mesmo tempo (mobile/tablet e desktop). Seta `icon-arrow-down` ↔ `icon-arrow-up`.
- **Hover:** Features, Company, Careers e About têm o mesmo estilo (default `gray-500`, hover `gray-950`). **Itens dos submenus não têm hover.**
- **Login / Register:** ambos em `preset-6` (14px) tanto no menu quanto na navbar desktop. Login centralizado e Register com largura total do painel no mobile/tablet.

### 9.5 Navbar e dropdowns (desktop)

- **Abertura por hover** (não por clique) — evita o usuário precisar clicar fora para fechar. Para acessibilidade, o dropdown também abre com `:focus-within` (navegação por teclado) e o gatilho mantém `aria-expanded`/`aria-haspopup`; `Esc` fecha.
- **Posição dos cartões — reproduzir o desafio:** cartão de Features começa ~75px à esquerda do gatilho; cartão de Company alinhado à borda esquerda do gatilho. (Inconsistência do design mantida de propósito.)
- Careers segue o mesmo estilo dos demais itens (sem dropdown, muda só no hover).
- Cartão: `--color-white`, `--radius-dropdown`, `--shadow-dropdown`.

### 9.6 Botões

- **Learn more:** default preenchido `gray-950`/texto branco; hover/active → fundo transparente, borda **1px** `gray-950`, texto `gray-950`.
- **Register:** default borda 1px `gray-500`, texto `gray-500`; hover/active → borda 1px e texto `gray-950`.
- Alturas (48px mobile, 56px tablet/desktop; Register ~40px) e paddings são **estimados**, ajustar no navegador.
- Foco visível: sem desenho no design → usar `:focus-visible` com outline `gray-950` e `outline-offset`.
