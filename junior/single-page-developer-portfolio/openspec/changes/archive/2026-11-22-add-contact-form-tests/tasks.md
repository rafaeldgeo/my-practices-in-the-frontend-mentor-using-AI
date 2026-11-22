# Tasks

## 1. Configuração de teste

- [x] 1.1 Criar `package.json` (`"type": "module"`, scripts `test:unit` e `test:e2e`) e `.gitignore` (node_modules, test-results, playwright-report); verificar com `node -e "JSON.parse(require('fs').readFileSync('package.json'))"`
- [x] 1.2 Instalar devDependencies `@playwright/test`, `@axe-core/playwright` e `http-server` e o Chromium (`npx playwright install chromium`); verificar com `npx playwright --version`
- [x] 1.3 Criar `playwright.config.js` (só Chromium, `webServer` com `http-server` na porta 4173 e `reuseExistingServer: false`, `baseURL`); verificar com `npx playwright test --list`

## 2. Testes unitários (escrevem só testes)

- [x] 2.1 Escrever `tests/unit/validation.test.js` para `validateName`, `validateEmail`, `validateMessage` (vazio, só espaços, `undefined`/`null` como vazio, válido, e-mails inválidos e os limites `a@b.c`, `a@@b.com`, `a@b.`, `a@.com`, `a@b..com`) e `validateForm` (erros por campo); verificar que `npm run test:unit` falha com módulo `js/validation.js` não encontrado

## 3. Testes de fluxo na tela (escrevem só testes)

- [x] 3.1 Escrever `tests/e2e/contact-form.spec.js`: regiões, formulário e `novalidate`, rótulos e botão, nada validado antes do envio, campos vazios, espaços, e-mail inválido, ordem dos erros, `aria-invalid`/descrição, foco no primeiro inválido, correção limpando só o erro do campo sem revalidar (`adam@`), sucesso (`role="status"`, campos limpos, sem requisição) e some ao digitar ou ao novo envio; verificar que os testes falham por elemento não encontrado
- [x] 3.2 Escrever `tests/e2e/navigation.spec.js`: CTA da região "Hero" e CTA da região "Projects" levam ao formulário; links "View project"/"View code" de cada card (`article`) alcançáveis e visíveis com Tab em 375×812 e 1440×900; verificar que falham por elemento não encontrado

## 4. Testes de acessibilidade (escrevem só testes)

- [x] 4.1 Escrever `tests/e2e/a11y.spec.js` com axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) nos estados inicial (exigindo antes o formulário "Contact form", para não passar sem implementação), com erros e sucesso, em 375×812 e 1440×900; verificar que falham por ausência da UI e não por erro de configuração

## 5. Estado vermelho e revisão

- [x] 5.1 Rodar `npm run test:unit` e confirmar que falha com `ERR_MODULE_NOT_FOUND` para `js/validation.js`; rodar `npx playwright test --list` e confirmar que os 3 arquivos e2e carregam sem erro de configuração; verificar com `git status` que nenhum arquivo de produção (`js/`, SCSS, HTML) foi criado ou alterado
- [x] 5.2 Parar para revisão humana; só após a aprovação, comentar o código dos testes e fazer o commit

## Workflow follow-up

- A execução do e2e (`npm run test:e2e`) fica na change 2, como critério de aceite: lá, a suíte e2e e a de acessibilidade (nos dois viewports) precisa passar sem alterar os testes. Ao criar a change 2, registrar isso nas tarefas dela.
- Ao fim da change 2, rodar a suíte inteira de novo nos dois viewports (axe com contraste, links dos cards no foco, CTA rolando) e só então arquivar esta change, conforme as regras do projeto.
- Testes de layout (colunas por breakpoint, sem rolagem horizontal em 320px, links no hover do desktop) não fazem parte desta change; decidir na proposta da change 2 se entram como tarefas de teste anteriores ao SCSS ou como conferência visual com `design/`.
