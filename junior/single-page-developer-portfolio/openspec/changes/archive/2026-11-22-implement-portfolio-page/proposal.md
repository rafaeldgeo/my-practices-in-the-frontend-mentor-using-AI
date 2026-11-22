# Proposal

## Why

A change 1 (`add-contact-form-tests`) fixou o contrato do formulário em testes que falham por ausência de implementação, e o `index.html` ainda só tem texto solto. Seguindo o plano em `decisoes-do-projeto.md`, esta change entrega a página inteira (HTML, SCSS e JS) até a suíte da change 1 passar, sem alterar nenhum teste.

## What Changes

**Pertence à change 2 do plano (implementação).** Cumpre a spec `contact-form` da change 1 sem alterá-la; não antecipa a change 3 (evolução, ainda não definida).

- Página única com header, hero, skills, projects, contact e footer, com o conteúdo do design (Adam Keyes), layout responsivo de 320px ao desktop (referências 375, 768 e 1440px) e estados de hover e foco em todo elemento interativo.
- Módulo de validação (ES module) e script do formulário que cumprem o contrato da change 1.
- Folhas de estilo em Sass compiladas para `style.css` (versionado), com tokens do Design System, e o script `npm run build`.
- Atribuição do desafio no rodapé.
- Critério de pronto: `npm run test:unit` e `npm run test:e2e` (incluindo axe) verdes nos dois viewports, sem alterar os testes da change 1, e `npm run build` sem erro.

**Dentro do escopo:** HTML, SCSS, JS de produção e a configuração do build do Sass. **Fora do escopo:** backend (nada é enviado nem armazenado); troca do conteúdo; alteração da spec `contact-form` ou de qualquer teste da change 1 (se um teste estiver errado, o ajuste volta para a change 1); trocar a imagem, skills e projetos por dados próprios; a change 3.

## Capabilities

### New Capabilities
- `site-header-footer`: logo e ícones sociais com nome acessível, hover e foco, e a atribuição do desafio no rodapé.
- `hero-section`: título, apresentação, CTA "Contact me" e retrato por tamanho de tela.
- `skills-section`: os seis itens de habilidade e a grade por tamanho de tela.
- `projects-section`: título, CTA e seis cards com a revelação dos links por tamanho de tela.
- `contact-section`: apresentação visual da seção Contact (layout, campos, botão e estilo do erro); o comportamento do formulário continua na `contact-form`.
- `responsive-layout`: ausência de rolagem horizontal e quebra de layout de 320px ao desktop, e respeito a `prefers-reduced-motion`.

### Modified Capabilities

Nenhuma. A `contact-form` (criada na change 1) é apenas cumprida.

## Impact

- Novos arquivos: `js/validation.js`, script do formulário, `scss/` (entrada e parciais), `style.css` compilado, fontes e imagens já existentes em `assets/` passam a ser usadas.
- Alterados: `index.html`, `package.json` (script `build` e devDependency `sass`) e `README.md` se necessário.
- Nenhum teste é alterado.
- Dependência da change 1: ela precisa estar aprovada e commitada (tarefa 5.2 dela) antes de começar a apply desta.
