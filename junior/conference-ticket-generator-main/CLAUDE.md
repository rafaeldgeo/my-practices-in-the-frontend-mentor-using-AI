# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## O que é isto [defualt]

Uma solução para o site Frontend Mentor. O repositório de desafios de prática agrupados por nível (`newbie/`, `junior/`, `intermediate/`). Objetivo: ficar o mais próximo possível do design, com o layout correto para cada tamanho de tela e estados de hover em todos os elementos interativos. `preview.jpg` é a prévia do design;

Os sites finalizados são publicados no GitHub Pages direto do repositório (`https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<nível>/<desafio>/`), então mantenha todos os caminhos de assets relativos.

## Desafio [Estrutura e pontos de atenção são gerados pelo claude code]

### Estrutura pontos de atenção

**Arquivos**
- `index.html` — página única, ainda o **rascunho do template** (texto cru, sem `<main>`/`<form>`/`<label>`, `<style>` inline e rodapé fora do padrão da seção "Atribuição no rodapé"). Estilo deve ir para o SCSS.
- `assets/images/` — `logo-full.svg` (logo + "Coding Conf"), `logo-mark.svg` (só o ícone, usado no ticket), `icon-upload/info/github.svg`, `image-avatar.jpg` (avatar de exemplo), `background-mobile/tablet/desktop.png` (fundo por viewport), `pattern-*.svg` (círculos, linhas verticais, linhas onduladas topo/base, moldura do ticket), `favicon-32x32.png`.
- `assets/fonts/` — Inconsolata local (variável + `static/` Regular/Medium/Bold/ExtraBold, com `OFL.txt`); carregar via `@font-face` com caminho relativo.
- `design/` — PNGs exportados (sem `.fig`): `layout/` (mobile 375, tablet 768, desktop 1440 em três estados: `input`, `filled`, `output`), `interaction/` (input hover/focus/error), `components/` (button, input, ticket, upload), `style_guide/` (color, radius, spacing, typography). Consulte-os antes de implementar, em vez do MCP do Figma.
- `registros.txt` — anotações pessoais do processo; não faz parte do site.
- **Ainda não existem** `package.json`, `scss/`, `css/` nem `js/`. Segundo `registros.txt` a fundação é manual: `npm init -y`, `sass` como devDependency, parciais SCSS e scripts `build` (`sass scss/main.scss:css/style.css --style=compressed --no-source-map`) e `watch`. Crie-os seguindo a pasta irmã `../intro-section-with-dropdown-navigation-main`.

**Design**
- Fonte **Inconsolata** (sem fallback sans — monoespaçada). Presets (desktop → mobile; line-height / letter-spacing): P1 ExtraBold 60→30px, 110%, -1px (título principal); P2 Bold 40→24px, 110%, -1px; P3 Bold 30→22px, 110%, -1px; P4 Medium 24→20px, 120%, -0.5px; P5 Medium 20px, 110%, -0.5px (também ExtraBold, -0.3px); P6 Medium 18→14px, 120%, 0; P7 Regular 12px, 120%, -0.2px (dica do upload). Use `clamp()` entre mobile e desktop.
- Cores: Neutral 900 `#0D082D`, 700 `#4B4869`, 500 `#8784A5`, 300 `#D1D0D5`, 0 `#FFFFFF`; Orange 700 `#E1604F`, 500 `#F57463`; Gradient 01 `linear-gradient(90deg, #F37362 0%, #FFF 100%)` (nome no ticket / realces). Tema escuro: fundo é imagem roxo/azul-marinho.
- Spacing: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px (`spacing-0`…`spacing-1000`). Radius: 0, 4, 6, 8, 10, 12, 16, 20, 24, full (999px).
- Layouts em 375 / 768 / 1440; breakpoints em `em` como variáveis Sass (tablet `48em`, desktop `90em` só se o layout mudar de fato; container `max-width: 90rem`, centralizado).

**Pontos de atenção**
- **Duas telas, uma página**: formulário e ticket gerado alternam sem recarregar (JS ES6+ no submit: `preventDefault`, validar, ocultar o form, preencher e mostrar o ticket). Título e subtítulo mudam ("Congrats, **Nome**! Your ticket is ready." com nome e e-mail em laranja).
- **Upload de avatar** (dropzone com borda tracejada): clique **e** drag-and-drop, acessível por teclado (`<input type="file">` real com `<label>`, foco visível, Enter/Espaço). Aceitar só JPG/PNG até **500KB**; erro de tipo/tamanho mostra mensagem no lugar da dica (`icon-info.svg`). Após escolher: pré-visualização da imagem + ações de remover/trocar. Gerar a prévia com `URL.createObjectURL`/`FileReader`; o avatar também vai para o ticket.
- **Validação**: nome obrigatório, e-mail com formato válido, GitHub username obrigatório (placeholder `@yourusername`), avatar obrigatório. Mensagens por campo (`aria-describedby`, `aria-invalid`, `role="alert"`/`aria-live`) e anunciadas por leitor de tela; usar `novalidate` no form para controlar as mensagens. Estados de input: default, hover, focus, error (ver `design/interaction/`); botão "Generate My Ticket" laranja com hover e foco visíveis. Tudo operável só com teclado.
- **Ticket**: moldura em `pattern-ticket.svg` com entalhes (recortes) no topo/base da divisória tracejada; lado esquerdo com logo, "Jan 31, 2025 / Austin, TX", avatar, nome e `@usuário` com `icon-github.svg`; lado direito com número de série vertical (`#01609`, gerar número com zero-padding). Em mobile/tablet o ticket reduz proporcionalmente — confira `layout_*_output.png`.
- **Fundo decorativo**: imagem de fundo diferente por viewport (`background-mobile/tablet/desktop.png`) + `pattern-*.svg` posicionados de forma absoluta; todos decorativos (`alt=""`/`aria-hidden`), sem afetar o fluxo nem causar scroll horizontal em 320px. Atribuição do rodapé fica legível sobre o fundo escuro.
- `README.md` ainda é o stub do template. O `.gitignore` da pasta já cobre `*.fig/*.sketch/*.xd` — nada a avisar. Caminhos de assets relativos (GitHub Pages).

## Atribuição no rodapé [defualt]

insert in footer ```<div class="attribution">
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
