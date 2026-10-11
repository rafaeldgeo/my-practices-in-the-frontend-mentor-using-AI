# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## O que é isto [defualt]

Uma solução para o site Frontend Mentor. O repositório de desafios de prática agrupados por nível (`newbie/`, `junior/`, `intermediate/`). Objetivo: ficar o mais próximo possível do design, com o layout correto para cada tamanho de tela e estados de hover em todos os elementos interativos. `preview.jpg` é a prévia do design; 

Os sites finalizados são publicados no GitHub Pages direto do repositório (`https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<nível>/<desafio>/`), então mantenha todos os caminhos de assets relativos.

## Desafio [Estrutura e pontos de atenção são gerados pelo claude code]

### Estrutura pontos de atenção

**Arquivos**
- `index.html` — página única. `scss/` (`main.scss` + parciais `_variables`, `_mixins`, `_base`, `_layout`, `_components`) → `css/style.css` via `npm run build` (compressed, sem source map). Os parciais ainda são esqueletos (só `_mixins.scss` tem o mixin `respond-to($bp)`, que lê o mapa `$breakpoints` — **ainda não declarado** em `_variables.scss`).
- `images/` — `logo.svg`, `icon-menu/close-menu/arrow-down/arrow-up.svg`, ícones do dropdown (`icon-todo/calendar/reminders/planning.svg`), logos de clientes (`client-databiz/audiophile/meet/maker.svg`), `image-hero-mobile.png`, `image-hero-desktop.png`, `favicon-32x32.png`.
- `design/` — PNGs exportados do Figma (não há `.fig`): `home/` (mobile 375, tablet 768, desktop 1440), `menu/` (mobile/tablet collapsed/expanded, desktop com dropdowns abertos), `components/` (botões e navbar, estados default/active), `style-guide/` (cores, espaçamentos, tipografia). Consulte-os antes de implementar; o MCP do Figma esbarrou em limite de requisições.
- `js/main.js` — abre/fecha o menu mobile/tablet (painel, overlay, `aria-expanded`, `Esc`, submenus independentes); desktop (≥1024px) é só CSS.
- `relatorio.txt` — anotações pessoais do processo; não faz parte do site.

**Design**
- Fonte **Epilogue** (Google Fonts, pesos 500 e 700). Presets: 80px/64px/36px bold, line-height 100%, letter-spacing -1px; 18px e 16px (bold: 155% / -0.25px; medium: 155% / 0); 14px medium 115%. Use `clamp()` entre mobile e desktop.
- Layouts em 3 larguras: 375 (mobile), 768 (tablet), 1440 (desktop). Breakpoints em `em` (mobile-first, variáveis em `scss/_variables.scss`): tablet `48em`; desktop `64em` (1024px) — abaixo disso o menu é o painel hambúrguer, pois a navbar não cabe; container `max-width: 90rem` (1440px) centralizado.
- Fundo da página off-white (não branco puro); botões: "Learn more" preenchido escuro com hover em outline; "Register" outline com hover/active. Confira cores exatas em `style-guide-colors.png`.

**Pontos de atenção**
- **Menu mobile/tablet**: painel lateral à direita sobre overlay escuro, botão hambúrguer ↔ fechar (`icon-menu`/`icon-close-menu`), submenus Features/Company expansíveis com setas up/down, Login (texto) e Register (outline) no fim. Precisa de JS (ES6+): `aria-expanded`, `aria-controls`, fechar com `Esc` e clique no overlay, foco visível, impedir scroll do body com o menu aberto.
- **Desktop**: dropdowns Features (com ícones coloridos) e Company (só texto) abrem com cartão branco e sombra suave, posicionados abaixo do item; usar `<button>` (não `<a>`) para os gatilhos; setas trocam de estado ao abrir; fechar ao clicar fora. Careers/About são links simples com hover.
- **Hero**: imagem diferente por viewport (`<picture>` com `image-hero-mobile.png` / `image-hero-desktop.png`, `alt` descritivo); no mobile a imagem vem **antes** do texto, no desktop fica à direita. Título quebra em "Make / remote work". Logos de clientes (`client-*.svg`) são decorativas ou com `alt` do nome; devem caber em 320px (flex-wrap/redução).
- **Estado atual do `index.html`**: é só um rascunho com texto cru — sem `<header>/<nav>/<main>`, sem imagens, sem listas de menu, sem hero/logos; `<head>` com `<style>` inline e favicon `type="image/png"`; o rodapé está fora do padrão exigido na seção "Atribuição no rodapé" (deve usar o `<div class="attribution">` com os links do Rafael, e o estilo deve ir para o SCSS, não inline).
- `README.md` ainda é o stub do template; `README-template.md` pode ser usado para preencher depois.
- Não commitar `*.fig/*.sketch/*.xd` — o `.gitignore` da pasta já cobre esses arquivos, nada a avisar. Todos os caminhos de assets devem permanecer relativos (GitHub Pages).

## Atribuição no rodapé [defualt]

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

## Convenções [default]

- HTML5 semântico, `lang="en"`, atento a WCAG (labels, `aria-*`, foco visível).
- Estilos em Sass (SCSS), compilado para `style.css` — **nunca edite o `.css`**.
  Entry `main.scss` só com `@use` dos parciais; importação sempre `@use`/`@forward`,
  nunca `@import` (deprecado). Parciais organizados por responsabilidade.
- Tokens de design como custom properties em `:root`, num parcial de tokens
  (cores, spacing, radius, escala tipográfica, com `clamp()` para tamanhos fluidos).
- Breakpoints como variáveis Sass (`$`), consumidos por mixin — custom property
  não é válida na condição de `@media`.
- Classes em **BEM**; **mobile-first** com media queries `min-width` em `em`.
- Responsividade mínima: suportar até 320px (20em) sem quebrar.
- **JavaScript somente ES6+** — `const`/`let` (nunca `var`), arrow functions,
  template literals, `===`/`!==`. Aplique desde o primeiro rascunho.
- **Não inicie `sass --watch`** — o watch roda fora da sessão, em terminal próprio.
  Para validar que o SCSS compila, rode `npm run build` (nunca `--watch`, bloqueante).

## Regras do repositório [defualt]

- Nunca faça commit de arquivos de design (`*.fig`, `*.sketch`, `*.xd`). Esta pasta não tem `.gitignore` próprio; se o repositório raiz não cobrir esses arquivos, avise o usuário em vez de criar ou alterar um sem pedir.