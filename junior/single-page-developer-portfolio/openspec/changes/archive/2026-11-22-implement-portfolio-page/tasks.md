# Tasks

> A suíte da change 1 é o critério de pronto: nenhuma tarefa altera um teste. Os testes já existem; as tarefas abaixo só escrevem código de produção e rodam a suíte. Antes de começar, a change 1 precisa estar aprovada e commitada.

## 1. Build do Sass e fundamentos

- [x] 1.1 Adicionar `sass` como devDependency e o script `build` (`sass scss/main.scss style.css --no-source-map`) ao `package.json`; verificar com `npm ls sass` e `grep '"build"' package.json`
- [x] 1.2 Criar `scss/main.scss` (só `@use`), `_tokens.scss` (cores, tipografia com `clamp()`, espaçamento, raio), `_breakpoints.scss` (`$bp-tablet: 48em`, `$bp-desktop: 64em` e mixin `up`) e `_base.scss` (`@font-face` Space Grotesk, reset, foco visível global, rolagem suave sob `prefers-reduced-motion: no-preference`); verificar com `npm run build` sem erro e `style.css` gerado

## 2. Módulo de validação

- [x] 2.1 Criar `js/validation.js` (ES module, ES6+) com `validateName`, `validateEmail`, `validateMessage` e `validateForm` conforme o design da change 1; verificar com `npm run test:unit` totalmente verde, sem alterar `tests/unit/validation.test.js`

## 3. Estrutura HTML

- [x] 3.1 Reescrever `index.html` com `<header>`, `<main>` (seções "Hero", "Skills", "Projects" e "Contact" como `region`), `<footer>`, logo e quatro ícones sociais acessíveis no header e no footer, retrato em `<picture>`, seis `<article>` com nome acessível exato e os links "View project"/"View code" (`href="#"`), os dois CTAs `href="#contact"`, link para `style.css` e o script do formulário; verificar com `npx playwright test tests/e2e/contact-form.spec.js -g "estrutura"` verde
- [x] 3.2 Criar o formulário "Contact form" (`novalidate`, três campos com `<label>`, botão "Send message", `role="status"` logo após o botão) e a atribuição do footer (links `target="_blank"` e `rel="noopener"`); verificar com os testes de rótulos e `novalidate` de `contact-form.spec.js` verdes

## 4. Script do formulário

- [x] 4.1 Criar `js/form.js` (ES6+): no `submit`, `preventDefault`, limpar o sucesso, validar com `validateForm`, mostrar erros na ordem com `aria-invalid`/`aria-describedby`, focar o primeiro inválido ou, se válido, limpar os campos e exibir o sucesso; verificar com `npx playwright test tests/e2e/contact-form.spec.js` verde
- [x] 4.2 No evento `input`, limpar só o erro do campo e a mensagem de sucesso, sem revalidar; verificar com os testes de correção, `adam@` e "sucesso some ao digitar" de `contact-form.spec.js` verdes

## 5. Estilos por seção

- [x] 5.1 Criar `_button.scss` e `_header-footer.scss` (logo, ícones com hover verde e foco, atribuição de 11px centralizada com contraste AA); verificar com `npm run build` e conferência visual do header e do footer em 375, 768 e 1440px contra `design/`
- [x] 5.2 Criar `_hero.scss` (retrato por breakpoint, título com sublinhado verde, padrões decorativos); verificar com `npm run build` e conferência visual em 320, 375, 768 e 1440px contra `design/`
- [x] 5.3 Criar `_skills.scss` (grade de 1, 2 e 3 colunas); verificar com `npm run build` e conferência visual em 375, 768 e 1440px
- [x] 5.4 Criar `_projects.scss` (cabeçalho com CTA, grade de 1 e 2 colunas, links sempre visíveis até o tablet e revelados por `:hover`/`:focus-within` sobre a imagem no desktop); verificar com `npm run build`, conferência visual contra `design/Home - Desktop - Active.png` e `npx playwright test tests/e2e/navigation.spec.js` verde
- [x] 5.5 Criar `_contact.scss` (layout texto à esquerda/formulário à direita no desktop, campos só com linha inferior, estado ativo, erro com cor e ícone de alerta no Email, sucesso legível); verificar com `npm run build` e conferência visual contra `design/Design System.png`
- [x] 5.6 Conferir 320px sem rolagem horizontal nem quebra e ajustar os parciais; verificar com `document.documentElement.scrollWidth <= window.innerWidth` em 320px no Chrome DevTools

## 6. Integração e acessibilidade

- [x] 6.1 Rodar `npx playwright test tests/e2e/a11y.spec.js` nos dois viewports e corrigir contraste (placeholder, erro, sucesso, atribuição) alterando só os estilos; verificar com a suíte axe verde
- [x] 6.2 Rodar `npm run build`, `npm run test:unit` e `npm run test:e2e` completos e verificar tudo verde, com `git status` mostrando nenhum arquivo de `tests/` alterado
- [x] 6.3 Revisar o código: nenhum `var`, `==`/`!=` ou `@import`; nenhuma edição manual de `style.css`; caminhos relativos (`grep -rnE "\bvar\b|@import" js scss`)
- [x] 6.4 Parar para revisão humana; só após a aprovação, comentar o código e fazer o commit incluindo o `style.css` compilado

## Workflow follow-up

- Rodar a suíte inteira de novo, nos dois viewports, antes de arquivar esta change (e a change 1, que só arquiva depois desta passar), conforme o design da change 1.
- Depois de arquivadas, `openspec/specs/` passa a ser a fonte do comportamento e `decisoes-do-projeto.md` não deve ser mantido em paralelo.
