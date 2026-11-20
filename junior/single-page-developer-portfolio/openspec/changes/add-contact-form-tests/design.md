# Design

## Context

Repositório estático (GitHub Pages), sem build para JS. `index.html` tem só texto solto e `package.json` não existe. Esta change só cria testes e configuração de teste. O contrato observável está em `specs/contact-form/spec.md`; aqui ficam as escolhas técnicas que os testes fixam para a change 2. Motivação: ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Suíte em três camadas que falha por ausência de implementação, não por configuração.
- Contrato técnico explícito (módulo, funções, textos) para a change 2 só cumprir.

**Non-Goals:**
- Escrever HTML, SCSS ou o módulo de validação.
- Testes visuais (comparação de screenshots) ou outros navegadores além de Chromium.

## Decisions

**Stack de testes (três camadas).**
- Unitários: `node --test` com `node:test` e `node:assert/strict`, em `tests/unit/`.
- Fluxo na tela: `@playwright/test`, só Chromium, em `tests/e2e/`, com `getByRole`/`getByLabel`.
- Acessibilidade: `@axe-core/playwright` com tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, em `tests/e2e/a11y.spec.js`; 3 estados × 2 viewports (375×812 e 1440×900).
- Localizadores: seções como `getByRole("region", { name })` ("Hero", "Skills", "Projects", "Contact"), formulário `getByRole("form", { name: "Contact form" })`, cards `getByRole("article", { name: <projeto> })`. Os dois CTAs "Contact me" e os pares "View project"/"View code" são sempre buscados dentro da região ou do card (`within`), nunca globalmente.
- Os testes de links dos cards (foco revela os links) rodam em 375×812 e 1440×900, pois no desktop os links só aparecem em hover/foco e no mobile ficam sempre visíveis.
- Scripts: `test:unit` (`node --test tests/unit/`) e `test:e2e` (`playwright test`).

**Módulo de validação.** `js/validation.js`, ES module (`"type": "module"` no `package.json`), importado por Node e pelo navegador. Exporta funções puras: `validateName(value)`, `validateEmail(value)`, `validateMessage(value)`, cada uma devolvendo `null` se válido ou a mensagem de erro (string); e `validateForm({ name, email, message })`, devolvendo um objeto só com as chaves inválidas, ex.: `{ email: "Sorry, invalid format here" }`. Valor é aparado (`trim`) antes de validar. Alternativa descartada: devolver `{ valid, message }`; `null`/string é mais simples de testar.

**Textos.** Vazio: `Can't be empty`. E-mail inválido: `Sorry, invalid format here`. Sucesso: `Thanks for getting in touch! I'll get back to you soon.`

**Regex do e-mail.** Sem espaços, um `@`, domínio com ao menos um ponto e sem pontos vazios (nem iniciais, finais ou consecutivos): `/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/`. Os testes unitários cobrem os casos da spec e os limites `a@b.c` (válido), `a@@b.com`, `a@b.`, `a@.com` e `a@b..com` (inválidos). Entradas que não são string (`undefined`, `null`) são tratadas como vazias e devolvem `Can't be empty`.

**Limpeza do erro.** Ocorre no evento de digitação (`input`), não ao sair do campo; o teste usa `fill`, que dispara `input`. O `input` remove a mensagem e o `aria-invalid` daquele campo e **não revalida**: um valor ainda inválido (ex.: `adam@`) só volta a dar erro no próximo envio. O `input` em qualquer campo também remove a mensagem de sucesso.

**Validação nativa.** O `<form>` tem `novalidate`. Sem isso, um `type="email"` faria o Chromium bloquear o envio com balão nativo antes do JS, e o erro "Sorry, invalid format here" nunca apareceria. Os testes verificam o atributo e a mensagem própria.

**Ciclo do sucesso.** A mensagem de sucesso desaparece no próximo `input` ou no próximo envio (válido ou inválido), para nunca coexistir com erros.

**Posição do sucesso.** Elemento `role="status"` logo após o botão de envio, dentro de `#contact`. Ele pode existir vazio no DOM, mas só tem texto após sucesso; os testes checam o texto.

**Ligação do erro ao campo.** `aria-invalid="true"` e `aria-describedby` apontando para o elemento da mensagem. Os testes verificam via `toHaveAttribute("aria-invalid", "true")` e `toHaveAccessibleDescription`.

**Servidor estático.** `http-server` como devDependency, servido pelo `webServer` do `playwright.config.js` em `127.0.0.1:4173` (porta incomum) com `reuseExistingServer: false`, para nunca reaproveitar em silêncio outro servidor que esteja na porta. Alternativa: `serve`; `http-server` tem uso mais direto em porta fixa e sem cache (`-c-1`).

**Sem rede.** O teste de "nenhum dado enviado" registra `page.on("request")` após o carregamento e verifica que o envio não gera requisições.

**Prova de falha por ausência.** Antes de parar, rodar `npm run test:unit` e `npm run test:e2e` e mostrar que as falhas são `ERR_MODULE_NOT_FOUND` / elemento não encontrado, e não erro de configuração. Para isso, o Playwright precisa conseguir subir o servidor e abrir `index.html`; os testes devem falhar nas asserções. Atenção ao axe: o `index.html` atual tem `lang` e `title` e nenhuma violação WCAG A/AA, então o teste de estado inicial passaria sem implementação. Por isso ele exige primeiro a presença do formulário "Contact form", o que o faz falhar por ausência de implementação.

## Risks / Trade-offs

- [Testes e2e dependem de rótulos e textos exatos] → o contrato está na spec e neste design; mudanças voltam para a change 1.
- [Falha por configuração confundida com falha por ausência] → inspecionar a saída de cada suíte antes de declarar o estado vermelho.
- [Contraste do placeholder e do erro só é verificado com a UI pronta] → a suíte axe cobre isso na change 2.
- [Testes que só têm significado com a página finalizada: axe com contraste, links dos cards no foco nos dois viewports, CTA rolando até o formulário] → a suíte inteira deve ser rodada de novo, nos dois viewports, ao fim da change 2, antes de arquivar. Testes de layout propriamente ditos (colunas por breakpoint, ausência de rolagem horizontal em 320px, links no hover do desktop) não fazem parte desta change; a decisão fica para a proposta da change 2.
- [Download do Chromium do Playwright pesado] → `npx playwright install chromium` só do navegador necessário.

## Open Questions

Confirmadas pelo humano: regras de validação (trim, sem tamanho mínimo, formato do e-mail), textos de erro e de sucesso e foco no primeiro campo inválido.

Ainda em aberto, fora desta change:
- Cor de erro (coral ~`#FF6F5B`, extrair do design e validar contraste sobre `#242424`): decidida na change 2.
- Destino de "View project" e "View code": `#` até haver URLs (change 2).
- Breakpoints (48em e 64em): decididos na change 2.
