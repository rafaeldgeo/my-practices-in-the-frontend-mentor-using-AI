# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## O que é isto [defualt]

Uma solução para o site Frontend Mentor. O repositório de desafios de prática agrupados por nível (`newbie/`, `junior/`, `intermediate/`). Objetivo: ficar o mais próximo possível do design, com o layout correto para cada tamanho de tela e estados de hover em todos os elementos interativos. `preview.jpg` é a prévia do design;

Os sites finalizados são publicados no GitHub Pages direto do repositório (`https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<nível>/<desafio>/`), então mantenha todos os caminhos de assets relativos.

## Desafio [Estrutura e pontos de atenção são gerados pelo claude code]

### Estrutura pontos de atenção

**Design**

**Pontos de atenção**

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
