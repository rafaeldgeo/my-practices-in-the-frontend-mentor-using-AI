# Design

## Context

O site é estático (GitHub Pages) e o tema dark vive em custom properties de `:root` (`scss/_tokens.scss`), consumidas por quase todo o SCSS. Motivação e escopo: ver proposal.md; comportamento: specs `theme-toggle` e `site-header-footer`. Três coisas fogem dos tokens: o véu `rgba(21, 21, 21, 0.6)` dos cards (`_projects.scss`), os traços `#FFF` de `pattern-rings.svg` e `pattern-circle.svg` (entram por `<img>`, o CSS não alcança por dentro) e o nome `--color-white`, usado como cor de texto. O `<script type="module">` é deferido, então sozinho deixaria o tema errado aparecer antes de trocar. Esta é a change 3 do plano; o design de referência (`design/`) só tem dark.

## Goals / Non-Goals

**Goals:**
- Tema light com contraste AA, sem alterar a aparência do dark nem os testes atuais.
- Tema aplicado antes do primeiro desenho, sem piscar.
- Lógica de escolha do tema testável em `node --test`, sem DOM.

**Non-Goals:**
- Seguir `prefers-color-scheme` (dark fixo na primeira visita, decidido com o humano); mais de dois temas; transição animada entre temas; trocar o conteúdo; framework ou bundler.

## Decisions

**Mecanismo: atributo `data-theme` no `<html>`.** Valores `dark` e `light`. O dark continua sendo o `:root` atual (sem atributo ele também vale); o light é um bloco `:root[data-theme="light"]` que só redefine tokens. Alternativa descartada: classe no `body` (o inline do `<head>` roda antes de o `body` existir). Cada tema declara `color-scheme` (`dark` ou `light`) para scrollbar e controles nativos.

**Estrutura de arquivos.**
- `js/theme.js` (funções puras, sem DOM nem `localStorage`, importável no `node --test`; mesma separação de `validation.js`): exporta `resolveTheme(stored)` (devolve `"light"` só se `stored === "light"`, senão `"dark"`), `toggleTheme(current)` (devolve o oposto) e a constante `THEME_KEY = "theme"`.
- `js/theme-toggle.js` (só DOM, como `form.js`; carregado com `<script type="module" src="./js/theme-toggle.js">`): importa de `theme.js`, lê o `localStorage`, aplica `data-theme`, liga o clique do botão, grava a escolha e atualiza o nome acessível. Não é testado no Node; o e2e o cobre.
- Script inline no `<head>`, antes do `<link rel="stylesheet">`: lê `localStorage` dentro de `try/catch` (navegação privada ou armazenamento bloqueado), valida o valor e define `data-theme` na hora. Em ES6+ (`const`, arrow). Duplica de propósito a regra de duas linhas de `resolveTheme`, porque um script bloqueante não importa módulo.
- `assets/images/icon-theme-sun.svg` e `icon-theme-moon.svg` (traço único 24×24, só o alfa importa).
- Parciais novos: nenhum. O botão entra em `_header-footer.scss`; os temas em `_tokens.scss`.

**Botão.** `<button type="button" class="theme-toggle">` dentro de um `<li>` extra do `ul.social` do header, depois do Twitter. O ícone é um `<span class="theme-toggle__icon" aria-hidden="true">` desenhado por `mask`, como os sociais (herda `currentColor`, hover e foco iguais). O nome acessível é `aria-label` ("Switch to light theme" no HTML, que nasce dark; o `theme-toggle.js` o troca para "Switch to dark theme" no light). Sem `aria-pressed`: o nome já diz a ação, e juntar os dois anunciaria duas vezes. A troca sol/lua é feita por CSS a partir de `data-theme`, sem depender do JS. Alternativa descartada: um só SVG girado ou duas imagens no HTML.

**Tokens (custom properties).** `--color-white` vira `--color-text` (mesmo valor no dark; ~10 usos em `_base`, `_button`, `_contact`, `_header-footer`). Novo `--color-overlay`. Nada mais é renomeado.

| Token | Dark (igual ao atual) | Light | Contraste (texto/UI) |
|---|---|---|---|
| `--color-bg` | `#151515` | `#ffffff` | |
| `--color-surface` | `#242424` | `#f2f2f2` | |
| `--color-text` | `#ffffff` | `#151515` | 18,3:1 / 16,3:1 |
| `--color-light` | `#d9d9d9` | `#3d3d3d` | 10,9:1 / 9,7:1 |
| `--color-muted` | `#939393` | `#5f5f5f` | 6,4:1 / 5,7:1 |
| `--color-accent` | `#4ee1a0` | `#087a4a` | 5,4:1 / 4,8:1 |
| `--color-error` | `#ff6f5b` | `#b3261e` | 6,5:1 / 5,8:1 |
| `--color-field-line` | `#c4c4c4` | `#767676` | 4,5:1 / 4,1:1 (borda de campo, mín. 3:1) |
| `--color-line` | `#d9d9d9` | `#8c8c8c` | decorativo |
| `--color-overlay` | `rgba(21,21,21,.6)` | `rgba(255,255,255,.75)` | |

Os contraste de cada par foram calculados (WCAG) sobre `bg` e `surface`, nessa ordem; o axe no tema light confirma na prática.

**Padrões decorativos.** No light, `:root[data-theme="light"] .decor { filter: invert(1) }` troca o traço branco por preto, mantendo a opacidade 25% do SVG. Alternativa descartada: converter os `<img>` em `<span>` com `mask` e `currentColor`, mais "puro", mas mexe no HTML e no layout por breakpoint de três elementos.

**Estratégia de testes (três camadas, TDD: testes antes da produção).**
- Unitários (`node --test`, `tests/unit/theme.test.js`): `resolveTheme` (`"light"`, `"dark"`, `null`, `""`, valor inválido) e `toggleTheme`.
- Fluxo na tela (Playwright, só Chromium, `tests/e2e/theme.spec.js`): nome do botão e posição depois do Twitter; alternar nos dois sentidos; persistir ao recarregar (`page.reload()` no mesmo teste, pois cada teste do Playwright começa com armazenamento limpo); valor inválido gravado antes do carregamento (`page.addInitScript`) abre no dark; `page.emulateMedia({ colorScheme: "light" })` continua abrindo no dark; foco e acionamento por teclado; cores do light checadas pela cor de fundo e de texto calculadas do `body`.
- Acessibilidade (`@axe-core/playwright`, `tests/e2e/a11y-light.spec.js`): mesmos três estados e dois viewports de `a11y.spec.js`, com o light gravado por `addInitScript` antes do `goto`. Arquivo novo, para não alterar a suíte existente, que segue cobrindo o dark.

**Contrato para os testes** (a produção o cumpre sem alterar os testes): chave `theme` do `localStorage` com valores `"dark"`/`"light"`; atributo `data-theme` em `<html>`; módulo puro `js/theme.js` com os nomes acima (o DOM fica em `js/theme-toggle.js`, fora do contrato); nomes acessíveis do botão fixados na spec `theme-toggle`; `body` com fundo `rgb(255, 255, 255)` e texto `rgb(21, 21, 21)` no light, e `rgb(21, 21, 21)`/`rgb(255, 255, 255)` no dark.

## Risks / Trade-offs

- [Pisca do tema errado ao carregar] → script inline e bloqueante antes do CSS; teste e2e confere `data-theme` logo após a carga com o light gravado.
- [Regra de resolução duplicada no inline e em `theme.js`] → são duas linhas; o e2e de persistência (com `theme.js` e `theme-toggle.js` bloqueados) e o de valor inválido cobrem o inline; aceito em troca de não ter fonte síncrona de módulo.
- [Verde `#087a4a` ficar diferente demais do design] → é o menor escurecimento que passa AA no `surface`; ajuste fino é só trocar o token, sem mexer em specs.
- [Renomear `--color-white` quebrar um uso esquecido] → `grep` por `color-white` ao fim da renomeação, `npm run build` e a suíte atual no dark sem alteração.
- [Armazenamento bloqueado ou indisponível] → `try/catch` nos dois pontos de acesso; sem armazenamento, a página funciona em dark e alterna só durante a visita.
- [Hero em tons de cinza sobre fundo branco pode ficar sem contraste de borda] → conferência visual em 375, 768 e 1440px; Open Questions.

## Open Questions

Podem ser resolvidas na implementação sem alterar specs, abordagem ou tarefas:
- Aparência da foto do hero e das miniaturas sobre o fundo claro (borda ou sombra sutil, se parecerem "coladas"); decidida na conferência visual.
- Opacidade final dos anéis e do círculo invertidos, se 25% parecer fraco ou forte demais no light.
- Se vale gravar o tema também em uma mudança de aba aberta (evento `storage`); fora do escopo por ora.
