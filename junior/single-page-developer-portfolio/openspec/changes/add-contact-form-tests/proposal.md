# Proposal

## Why

O portfólio ainda não tem implementação: `index.html` contém só texto solto. Seguindo TDD, primeiro fixamos o comportamento do formulário de contato (a única parte com lógica) em testes automatizados que falham por ausência de implementação. Isso dá à change 2 um critério objetivo de pronto e um contrato claro.

## What Changes

**Pertence à change 1 do plano (testes/TDD).** Não antecipa a change 2 (implementação) nem a 3 (evolução).

- Nova spec `contact-form` com o contrato observável: rótulos, mensagens de erro, ordem dos erros, foco após envio inválido, limpeza do erro ao corrigir, estado de sucesso.
- Configuração de teste: `package.json` (`"type": "module"`, scripts `test:unit` e `test:e2e`), `playwright.config` com `webServer` estático, dependências de desenvolvimento.
- Testes unitários (`node --test`) das funções puras de validação.
- Testes de fluxo na tela (Playwright, só Chromium): envio válido, cada erro, correção limpando o erro, CTA rolando até o formulário, links dos cards acessíveis por teclado.
- Testes de acessibilidade (`@axe-core/playwright`, WCAG 2 A/AA e 2.1 A/AA) em três estados (inicial, com erros, sucesso) e dois viewports (mobile e desktop).
- Demonstração de que a suíte falha **por ausência de implementação** e não por erro de configuração; depois, parada para revisão humana.

**Dentro do escopo:** testes e configuração de teste. **Fora do escopo:** HTML, SCSS e módulo de validação (change 2); backend (o formulário não envia nem armazena nada); troca do conteúdo (é o do design, de Adam Keyes); changes futuras.

## Capabilities

### New Capabilities
- `contact-form`: formulário de contato (Name, Email, Message) com validação ao enviar, mensagens de erro, foco no primeiro campo inválido, limpeza do erro ao corrigir e estado de sucesso, além do acesso a ele pelos CTAs "Contact me".

### Modified Capabilities

Nenhuma.

## Impact

- Novos arquivos: `package.json`, `playwright.config.js`, `tests/unit/`, `tests/e2e/`, `.gitignore` (node_modules, relatórios do Playwright).
- Novas dependências de desenvolvimento: `@playwright/test`, `@axe-core/playwright`, servidor estático.
- Nenhum código de produção é criado ou alterado.
