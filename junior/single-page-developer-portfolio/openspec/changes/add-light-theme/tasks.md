# Tasks

> TDD: os grupos 1 e 2 só escrevem testes (nenhum código de produção) e terminam em revisão humana. O grupo 3 em diante só escreve produção, e a suíte do grupo 1 e 2 é o critério de pronto: nenhuma tarefa altera um teste para fazê-lo passar (se um teste estiver errado, o ajuste volta ao grupo que o criou). A suíte atual (dark) continua verde sem alteração.

## 1. Testes unitários e de fluxo (sem código de produção)

- [x] 1.1 Escrever `tests/unit/theme.test.js` para `resolveTheme` (`"light"` → light; `"dark"`, `null`, `""`, `"blue"` → dark) e `toggleTheme` (dark ↔ light), importando de `js/theme.js`; verificar com `npm run test:unit` falhando só por `js/theme.js` não existir (módulo ausente), e não por configuração
- [x] 1.2 Escrever `tests/e2e/theme.spec.js` com os cenários da spec `theme-toggle`: botão "Switch to light theme" depois do link "Twitter"; alternar nos dois sentidos e nomes do botão; persistir ao recarregar (`page.reload()`); valor inválido gravado antes do carregamento (`addInitScript`) abre no dark; `emulateMedia({ colorScheme: "light" })` continua no dark; foco e acionamento por Enter/Espaço; `body` com fundo `rgb(255, 255, 255)` e texto `rgb(21, 21, 21)` no light e o inverso no dark; verificar com `npx playwright test tests/e2e/theme.spec.js` falhando porque o botão e o tema light não existem

## 2. Testes de acessibilidade no light (sem código de produção)

- [x] 2.1 Escrever `tests/e2e/a11y-light.spec.js` com os três estados (inicial, com erros, com sucesso) nos viewports mobile 375×812 e desktop 1440×900, gravando `theme=light` por `addInitScript` antes do `goto`; cada teste afirma primeiro que o light está aplicado (fundo `rgb(255, 255, 255)`), para falhar por ausência de implementação em vez de passar varrendo o dark; verificar com `npx playwright test tests/e2e/a11y-light.spec.js` falhando nessa afirmação
- [x] 2.2 Rodar `npm run test:unit` e `npm run test:e2e`, confirmar que só os testes novos falham (os atuais seguem verdes) e parar para revisão humana; só após a aprovação, comentar os testes e fazer o commit; verificar com `git status` mostrando só arquivos novos em `tests/`

## 3. Ícones, HTML e script do tema

- [ ] 3.1 Criar `assets/images/icon-theme-sun.svg` e `icon-theme-moon.svg` (traço único 24×24, caminhos relativos); verificar abrindo cada arquivo no navegador e com `ls assets/images | grep icon-theme`
- [ ] 3.2 Criar `js/theme.js` (ES6+, só funções puras, sem DOM) com `THEME_KEY`, `resolveTheme` e `toggleTheme` exportadas; verificar com `npm run test:unit` verde, sem alterar `tests/unit/theme.test.js`
- [ ] 3.3 Criar `js/theme-toggle.js` (ES6+, só DOM, importa de `theme.js`): ler `localStorage` em `try/catch`, aplicar `data-theme`, ligar o clique, gravar a escolha e trocar o `aria-label` do botão; verificar com `node --check js/theme-toggle.js` sem erro (o comportamento é verificado na 3.4)
- [ ] 3.4 Em `index.html`, adicionar o script inline (ES6+, `try/catch`, valida o valor) no `<head>` antes do `<link rel="stylesheet">`, o `<script type="module" src="./js/theme-toggle.js">` e o `<li>` com `<button type="button" class="theme-toggle" aria-label="Switch to light theme">` e `span` do ícone depois do Twitter no header; verificar com `npx playwright test tests/e2e/theme.spec.js -g "botão"` verde

## 4. Tokens e tema light

- [ ] 4.1 Em `scss/_tokens.scss`, renomear `--color-white` para `--color-text`, adicionar `--color-overlay` e o bloco `:root[data-theme="light"]` com a paleta do design (e `color-scheme` em cada tema); trocar os usos de `--color-white` em `_base`, `_button`, `_contact` e `_header-footer`; verificar com `grep -rn "color-white" scss` sem resultado, `npm run build` sem erro e `npm run test:e2e` da suíte atual (dark) verde
- [ ] 4.2 Em `_projects.scss`, trocar o `rgba(21, 21, 21, 0.6)` por `var(--color-overlay)` e, em `_base.scss`, aplicar `filter: invert(1)` em `.decor` no light; verificar com `npm run build` e conferência visual do véu e dos padrões nos dois temas
- [ ] 4.3 Em `_header-footer.scss`, estilizar `.theme-toggle` (sem borda e fundo nativos, ícone por `mask` herdando `currentColor`, tamanho dos ícones sociais, hover verde, foco visível) e trocar sol/lua por `data-theme`; verificar com `npm run build` e conferência visual do header em 320, 375, 768 e 1440px nos dois temas contra `design/`

## 5. Integração e acessibilidade

- [ ] 5.1 Rodar `npx playwright test tests/e2e/theme.spec.js tests/e2e/a11y-light.spec.js` e ajustar só tokens e estilos (verde, `muted`, `field-line`, erro, sucesso) até a suíte ficar verde; verificar também a suíte `a11y.spec.js` do dark verde
- [ ] 5.2 Conferir a aparência do light em 320, 375, 768 e 1440px (hero em tons de cinza, miniaturas, 320px sem rolagem horizontal com `document.documentElement.scrollWidth <= window.innerWidth`) e resolver as Open Questions do design; verificar com screenshots dos dois temas lado a lado
- [ ] 5.3 Rodar `npm run build`, `npm run test:unit` e `npm run test:e2e` completos e verificar tudo verde, com `git status` mostrando nenhum teste do grupo 1 e 2 alterado
- [ ] 5.4 Revisar o código: nenhum `var`, `==`/`!=` ou `@import`; nenhuma edição manual de `style.css`; caminhos relativos (`grep -rnE "\bvar\b|@import" js scss` e conferir o script inline); atualizar o `README.md` com o tema light se ele descrever funcionalidades
- [ ] 5.5 Parar para revisão humana; só após a aprovação, comentar o código e fazer o commit incluindo o `style.css` compilado

## Workflow follow-up

- Sincronizar as specs e arquivar a change `add-light-theme` após a revisão (`openspec-archive-change`).
- Verificar o resultado arquivado em `openspec/specs/theme-toggle/` e no requisito atualizado de `site-header-footer`.
