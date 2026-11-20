# Tasks

## 1. Configuração de teste

- [ ] 1.1 Criar `package.json` (`"type": "module"`, scripts `test:unit` e `test:e2e`) e `.gitignore` (node_modules, test-results, playwright-report); verificar com `node -e "JSON.parse(require('fs').readFileSync('package.json'))"`
- [ ] 1.2 Instalar devDependencies `@playwright/test`, `@axe-core/playwright` e `http-server` e o Chromium (`npx playwright install chromium`); verificar com `npx playwright --version`
- [ ] 1.3 Criar `playwright.config.js` (só Chromium, `webServer` com `http-server`, `baseURL`); verificar com `npx playwright test --list`

## 2. Testes unitários (escrevem só testes)

- [ ] 2.1 Escrever `tests/unit/validation.test.js` para `validateName`, `validateEmail`, `validateMessage` (vazio, só espaços, válido, e-mails inválidos) e `validateForm` (erros por campo); verificar que `npm run test:unit` falha com módulo `js/validation.js` não encontrado

## 3. Testes de fluxo na tela (escrevem só testes)

- [ ] 3.1 Escrever `tests/e2e/contact-form.spec.js`: rótulos e botão, nada validado antes do envio, campos vazios, espaços, e-mail inválido, ordem dos erros, `aria-invalid`/descrição, foco no primeiro inválido, correção limpando só o erro do campo, sucesso (`role="status"`, campos limpos, sem requisição); verificar que os testes falham por elemento não encontrado
- [ ] 3.2 Escrever `tests/e2e/navigation.spec.js`: CTA do hero e CTA de Projects levam ao formulário; links "View project"/"View code" alcançáveis e visíveis com Tab; verificar que falham por elemento não encontrado

## 4. Testes de acessibilidade (escrevem só testes)

- [ ] 4.1 Escrever `tests/e2e/a11y.spec.js` com axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) nos estados inicial, com erros e sucesso, em 375×812 e 1440×900; verificar que falham por ausência da UI e não por erro de configuração

## 5. Estado vermelho e revisão

- [ ] 5.1 Rodar `npm run test:unit` e `npm run test:e2e`, registrar a saída e confirmar que toda falha é por ausência de implementação; verificar que nenhum arquivo de produção (`js/`, SCSS, HTML) foi criado ou alterado (`git status`)
- [ ] 5.2 Parar para revisão humana; só após a aprovação, comentar o código dos testes e fazer o commit

## Workflow follow-up

- Arquivar a change depois da change 2 cumprir a suíte, conforme as regras do projeto.
