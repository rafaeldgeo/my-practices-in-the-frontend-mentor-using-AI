# Design

## Context

O repositório é estático (GitHub Pages) e o `index.html` só tem texto solto. A suíte da change 1 (`tests/unit/`, `tests/e2e/`) já existe e é o critério de pronto; o contrato de nomes, textos e rótulos está em `add-contact-form-tests/specs/contact-form/spec.md` e no design dela. Esta change só cumpre esse contrato. Motivação: ver proposal.md. Layouts de referência em `design/` (mobile 375, tablet 768, desktop 1440, desktop ativo e Design System); imagens e fontes em `assets/`.

## Goals / Non-Goals

**Goals:**
- Suíte da change 1 verde (unit, e2e e axe, nos dois viewports) sem alterar nenhum teste.
- Página próxima do design em cada tamanho de tela, de 320px ao desktop.

**Non-Goals:**
- Alterar a spec `contact-form` ou os testes; backend; trocar o conteúdo; framework ou bundler de JS; a change 3.

## Decisions

**Estrutura de arquivos.**
- `index.html` na raiz, `style.css` compilado na raiz (versionado, nunca editado à mão).
- `scss/main.scss` só com `@use`; parciais em `scss/`: `_tokens.scss`, `_breakpoints.scss` (variáveis `$` e mixin), `_base.scss`, `_header-footer.scss`, `_hero.scss`, `_skills.scss`, `_projects.scss`, `_contact.scss`, `_button.scss`.
- `js/validation.js` (funções puras, contrato do design da change 1) e `js/form.js` (DOM), carregado com `<script type="module" src="./js/form.js">`. Todos os caminhos relativos.
- Script `build`: `sass scss/main.scss style.css --no-source-map`, com `sass` como devDependency. Nunca `--watch`.

**Separação validação × DOM.** `form.js` importa `validateForm` de `validation.js` e só cuida de DOM: lê os campos, mostra e limpa erros, move o foco, exibe o sucesso. Isso mantém a lógica testável em `node --test` sem DOM.

**Formulário (cumpre o contrato da change 1).**
- `<form novalidate aria-label="Contact form">` dentro de `<section id="contact" aria-label="Contact">`; os campos são `<input type="text">`/`<input type="email">`/`<textarea>` com `<label>` real, visualmente integrado ao campo (rótulo em caixa alta onde fica o placeholder, sem depender de `placeholder`).
- Erro: `<p>` com id próprio abaixo do campo; `aria-invalid="true"` e `aria-describedby` no campo. Ordem Name, Email, Message; foco no primeiro inválido via `focus()`.
- `input` em um campo remove só o erro dele (e o `aria-invalid`) e a mensagem de sucesso, sem revalidar. O envio limpa a mensagem de sucesso antes de validar.
- Sucesso: `<p role="status">` logo após o botão, vazio até o sucesso. Só um `role="status"` na página (os testes usam `getByRole("status")`). `submit` chama `preventDefault()`: nenhuma requisição.
- Ícone de alerta no erro do Email: decorativo (`aria-hidden`), via CSS, para não alterar a descrição acessível.

**Semântica.** `<header>`, `<main>`, `<footer>`; seções com `aria-label` "Hero", "Skills", "Projects", "Contact" (viram `region`); cada card é `<article aria-label="<projeto>">` com o nome exato do projeto. O nome em caixa alta é feito com `text-transform` no CSS, para o nome acessível ficar como no teste (ex.: "Design portfolio"). Os CTAs são `<a href="#contact">`. Miniaturas com `alt=""` e padrões decorativos com `alt=""`/`aria-hidden`. Os dois CTAs "Contact me" ficam cada um na sua região. Os quatro ícones sociais no header e no footer são `<a>` com `aria-label` e a imagem decorativa dentro.

**Retrato e miniaturas.** `<picture>` com `source media` para tablet e desktop e `img` mobile como padrão; miniaturas `-small`/`-large` com `srcset`/`sizes`; `width`/`height` declarados para evitar salto de layout.

**Tokens (custom properties em `:root`, `_tokens.scss`).** Cores: fundo `#151515`, destaque `#4EE1A0`, superfície `#242424`, cinza claro `#D9D9D9`, branco `#FFFFFF`, erro (ver Open Questions). Tipografia: Space Grotesk local (`@font-face` do `assets/fonts/SpaceGrotesk-VariableFont_wght.ttf`, `font-display: swap`); Heading XL 88/88 (-2.5px), L 48/56 (-1.5px), M 24/32 e Body L 18/28, com `clamp()` entre mobile e desktop. Espaçamento e raio também como tokens.

**Breakpoints.** Variáveis Sass `$bp-tablet: 48em` e `$bp-desktop: 64em`, consumidas por um mixin `@mixin up($bp)` com `min-width` em `em`. Mobile-first; base serve a 320px (20em). Custom property não vale em `@media`.

**Links dos cards no desktop.** Do desktop em diante, os links ficam sobre a imagem, centralizados, escondidos por opacidade e revelados com `:hover` e `:focus-within` no card. Escondê-los com `opacity` (e não `display: none`/`visibility: hidden`) mantém-nos focáveis por Tab, que é o que `navigation.spec.js` exige. Abaixo do desktop ficam sempre visíveis abaixo das tecnologias.

**Foco e hover.** Um estilo `:focus-visible` global (contorno verde com `outline-offset`) e hover verde em ícones, CTAs e botão; nenhum `outline: none` sem substituto.

**Rolagem.** `html { scroll-behavior: smooth }` somente dentro de `@media (prefers-reduced-motion: no-preference)`.

**Testes de layout.** A change 1 deixou a decisão para esta (tarefa "Workflow follow-up" dela). Decisão: **sem testes novos** nesta change, para não misturar teste e produção nem mexer na suíte-critério; o layout por breakpoint (colunas, 320px sem rolagem horizontal, links no hover do desktop) é conferido visualmente contra `design/` com screenshots do Chrome DevTools em 320, 375, 768 e 1440px. Alternativa descartada: escrever specs Playwright de layout aqui, o que exigiria uma sessão de testes própria antes do SCSS.

## Risks / Trade-offs

- [Axe falhar por contraste (placeholder cinza, erro, sucesso, atribuição de 11px)] → escolher cores com contraste ≥ 4.5:1 sobre `#242424` e `#151515` e rodar o axe cedo, ainda no grupo de estilos.
- [Teste da change 1 errado ou inalcançável] → não alterar o teste; registrar e devolver o ajuste para a change 1.
- [`opacity: 0` nos links do desktop fazer `toBeVisible` passar sem estar à vista] → o teste exige `toBeInViewport` com foco; garantir que `:focus-within` leva a opacidade a 1.
- [Layout conferido só visualmente] → conferência em quatro larguras e registro dos screenshots comparados; testes de layout automatizados ficam para a change 3, se desejados.
- [Source map do Sass poluir o repositório] → `--no-source-map`.

## Open Questions

Propostas em `decisoes-do-projeto.md`, ainda não confirmadas; ficam como padrão desta change e mudam sem afetar specs nem tarefas:
- Cor de erro: coral próximo de `#FF6F5B`, extraída do design e com contraste AA sobre `#242424`; se não atingir, escurecer/clarear até atingir.
- Breakpoints 48em (tablet) e 64em (desktop).
- Destino de "View project" e "View code": `#` até haver URLs (já na spec `projects-section`).
