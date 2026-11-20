# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Desafio Frontend Mentor "Single-page developer portfolio" (junior): site estático, sem backend,
publicado no GitHub Pages direto do repositório. **Todos os caminhos de assets são relativos.**
O texto da página é em inglês (`lang="en"`); os artefatos do OpenSpec são em português do Brasil.

Contexto, regras por artefato e orientação por operação estão em `openspec/config.yaml`.
Não duplique esse conteúdo aqui. O comportamento observável vive em `openspec/specs/`
e os layouts (mobile, tablet, desktop, estado ativo e design system) em `design/`.

## Comandos

- `npm run build`: compila o SCSS para `style.css`. É a única forma de validar a compilação.
- `npm run test:unit`: testes unitários (`node --test`, em `tests/unit/`).
  Um arquivo só: `node --test tests/unit/<arquivo>.test.js`.
- `npm run test:e2e`: fluxo na tela e acessibilidade (Playwright, só Chromium, com `webServer`
  servindo o site estático; `@axe-core/playwright` na parte de acessibilidade). Um arquivo só:
  `npx playwright test tests/e2e/<arquivo>`.
- **Nunca rode `sass --watch`**: ele bloqueia a sessão e roda em terminal próprio.

## Stack e convenções

- HTML5 semântico, atento a WCAG (labels, `aria-*`, foco visível).
- Sass (SCSS) compilado para `style.css`, que é **versionado**. **Nunca edite o `.css`.**
- `main.scss` só contém `@use` dos parciais. Use `@use`/`@forward`, nunca `@import`.
- Tokens de design como custom properties em `:root`, num parcial de tokens.
- Breakpoints como variáveis Sass (`$`) consumidas por mixin: custom property não vale em `@media`.
- BEM nas classes. Mobile-first com `min-width` em `em`. Sem quebra a partir de 320px.
- JavaScript somente ES6+: `const`/`let` (nunca `var`), arrow functions, template literals,
  `===`/`!==`. Aplique desde o primeiro rascunho, sem que seja pedido.

## Processo (TDD)

- Na sessão que escreve testes, é proibido escrever código de produção.
- Rode os testes e mostre que falham por ausência de implementação, não por erro de
  configuração. Pare para revisão humana.
- Só após a aprovação do humano: comente o código e faça o commit.
- Tarefas que escrevem testes vêm antes das que escrevem código de produção e não se misturam.
- Nunca altere um teste para fazê-lo passar; se o teste estiver errado, o ajuste volta para a
  change que o criou.
