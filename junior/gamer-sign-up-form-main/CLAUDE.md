# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## O que é isto [defualt]

Uma solução para o site Frontend Mentor. O repositório de desafios de prática agrupados por nível (`newbie/`, `junior/`, `intermediate/`). Objetivo: ficar o mais próximo possível do design, com o layout correto para cada tamanho de tela e estados de hover em todos os elementos interativos. `preview.jpg` é a prévia do design;

**Este desafio é prática de front end com retorno dos dados usando back end. Quero entender o mecanismo de envio de formulário e renderização no servidor. Não otimize por brevidade: explique cada decisão e pare ao fim de cada etapa do back end após implementar o código.**

## Desafio [Estrutura, design e pontos de atenção são gerados pelo claude code]

### Estrutura

Tudo ainda a criar (hoje só existem `index.html` starter, `assets/`, `design/`, `preview.jpg`). Estrutura planejada:

```
server.js            # Express: GET /, POST /, GET /sucesso; PORT + 0.0.0.0
validacao.js         # validarFormulario(dados) -> { ok, erros, valores }
views/
  index.ejs          # página principal (coluna da marca/readout + painel)
  erro.ejs           # tela simples de erro (ver Pontos de atenção)
  partials/          # brand/readout, form, sucesso
scss/
  main.scss          # só @use dos parciais
  _tokens.scss _mixins.scss _base.scss _backdrop.scss _brand.scss
  _readout.scss _panel.scss _field.scss _strength.scss _checkbox.scss
  _button.scss _success.scss _error.scss
public/
  style.css          # gerado pelo Sass, nunca editar
  js/                # ES6+, somente UI/feedback em tempo real
  assets/            # fontes e imagens (hoje em assets/)
tests/               # Playwright + Chromium + axe-core
package.json         # scripts: start, build (sass)
```

Etapas do back end (explicar cada decisão e parar ao fim de cada uma):
1. Servidor Express + `GET /` renderizando EJS.
2. `POST /` + `validarFormulario` (função pura, fora da rota).
3. Erro de validação: re-renderiza o formulário no próprio POST com valores e mensagens.
4. PRG: sucesso redireciona para `GET /sucesso`.
5. Tela simples de erro para o caso que o design não cobre.
6. Deploy no Render.

O `index.html` do starter serve de referência de textos/estados; o conteúdo migra para `views/`.

**Design**

- Tema escuro NEONCORE, **todos os cantos retos** (radius 0: painel, inputs, checkbox, botões, segmentos do medidor). Painel do formulário à direita com cantos decorativos lime; coluna da marca à esquerda (logo, título "// Join the nexus", readout Operator ID); fundo com `assets/images/pattern-backdrop.svg`.
- Cores (tokens): Neutral 950 `#060A0E`, 900 `#0B1219`, 800 `#17212B`, 700 `#303D4B`, 600 `#586B7E`, 500 `#6E7F91`, 400 `#7D8C9B`, 300 `#9FADBC`, 100 `#E1EBF5`, 50 `#F3F8FC`; Lime 500 `#BFF538`, Lime 700 `#80A621`; Red 400 `#FF837A` (erro); Amber 400 `#FFC44D` (força Fair); Navy 950 `#020508`; Lime Alpha 60 `#BFF53899` e 40 `#BFF53866`; Navy Alpha 80 `#020508CC` e 60 `#02050899`.
- Tipografia: Orbitron ExtraBold (título 72px desktop / 40px tablet / 36px mobile, uppercase, tracking 2.88/1.6/1.44px; 24px tracking 0.96px; 16px tracking 2.56px) e JetBrains Mono 400/700 (16px corpo e inputs; 16px mascarado tracking 2.56px; 14px; 14px bold uppercase tracking 2.24px; 12px uppercase tracking 1.92px; 12px). Tamanhos fluidos com `clamp()`. Fontes locais em `assets/fonts` (`@font-face`).
- Espaçamento: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. 2px é a folga entre controle e anel de foco; o anel do botão de revelar senha fica 4px por dentro.
- Efeitos: `shadow-panel` (0 24px 64px -16px Navy Alpha 80); `shadow-well` (inset 0 2px 4px Navy Alpha 60, nos inputs; checkbox sem sombra); `shadow-button-hover` (4px 4px 0 Lime Alpha 40, no botão de enviar e em "Continue to log in", nunca durante o loading); `glow-neon` (blur 16px; em `filter: drop-shadow` usar 8px) no hex-check do sucesso.
- Layouts de referência em `design/layout/`: desktop, tablet e mobile nos estados vazio, preenchido, erro e sucesso; interação (focus, hover, strength weak/fair/good, password visible, terms error, submitting). Em tablet/mobile o readout vira uma faixa de uma linha (Operator ID + callsign) e o cabeçalho do painel mostra "All required".

**Pontos de atenção**

- **Duas camadas de validação.** No cliente, JS ES6+ dá feedback em tempo real e controla a UI: validação ao sair do campo e a cada tecla depois de checado, medidor de força, mostrar/ocultar senha, readout do painel esquerdo (contagem "N/5 ready", códigos de falha, "Unassigned" até o callsign ser válido) e "Transmitting_" no botão. Esse JS é só espelho de UX: **nunca envia** o formulário nem usa `fetch`/AJAX. O envio é o `<form method="POST">` nativo e o servidor revalida tudo em `validarFormulario`; ele é a autoridade. Isso não altera as regras default de Arquitetura; só define o papel do JS de UI.
- **Sem JS tudo continua funcionando** (critério de aceite): no POST inválido o servidor renderiza o formulário com valores preservados, mensagens e readout já calculados.
- **Tela simples de erro (sem layout no design).** O design não mostra o retorno "não validado pelo servidor" quando o usuário burla o JS (ou envia dados direto). Criar `views/erro.ejs`: mínima, no estilo NEONCORE com os tokens existentes, listando os erros devolvidos pelo servidor e um link para voltar ao formulário. O formulário com mensagens (layout Error do design) segue como retorno normal do POST inválido; a tela de erro cobre o que o design não prevê. Não existe referência visual: seguir a linguagem do painel de sucesso.
- **Regras de validação** (as mesmas no cliente e no servidor; a fonte da verdade é o servidor): callsign com trim, 3–20 caracteres, só letras, números, `_` ou `-`; email em formato válido; senha com 8+ caracteres; confirmação igual à senha; termos marcados. Usar as mensagens exatas do `index.html`. Força da senha é só aviso: abaixo de 8 é Weak; a partir de 8, um ponto por: 8+, 12+, maiúscula e minúscula, número, símbolo (máx. 4 → Weak/Fair/Good/Strong).
- **Segurança**: nunca devolver senha no HTML ao re-renderizar; demais valores com escape do EJS (`<%= %>`), nunca `<%- %>`.
- **PRG**: sucesso redireciona para `GET /sucesso`, que precisa do callsign (query string ou cookie) para exibir "Operator [callsign] provisioned"; recarregar não reenvia o formulário.
- **Acessibilidade**: `label`/`for`, `aria-invalid`, `aria-describedby` ligando hint/erro, região `aria-live` com "N fields need attention", foco no primeiro campo inválido (também sem JS), foco no título do sucesso, foco visível, SVGs decorativos com `aria-hidden`.
- **Responsividade**: mínimo 320px (20em); mobile-first; mobile mostra "All required" em vez de "All fields required".
- **Testes**: Playwright + axe-core em desktop/tablet/mobile; incluir execução com JS desabilitado e POST com dados inválidos enviado direto (simula JS burlado) para validar a tela de erro.

## Atribuição no rodapé [defualt]

insert in footer ```<div class="attribution">
Challenge by
<a
      href="https://www.frontendmentor.io/profile/rafaeldgeo"
      target="_blank"
      rel="noopener"
      >Frontend Mentor</a>. Coded by
<a
      href="https://www.linkedin.com/in/rafaeldgeo/"
      target="_blank"
      rel="noopener"
      >Rafael Dias de Almeida</a>.

  </div>```, align in center and bottom, size font 11px and colors combine with layout.

## Convenções [default]

- HTML5 semântico, `lang="en"`, atento a WCAG (labels, `aria-*`, foco visível).
- Estilos em Sass (SCSS), compilado para `style.css` — **nunca edite o `.css`**.
  Entry `main.scss` só com `@use` dos parciais; importação sempre `@use`/`@forward`,
  nunca `@import` (deprecado). Parciais organizados por responsabilidade.
- Tokens de design como custom properties em `:root`, num parcial de tokens
  (cores, spacing, radius, escala tipográfica, com `clamp()` para tamanhos fluidos).
- Breakpoints como variáveis Sass (`$`), consumidos por mixin — custom property
  não é válida na condição de `@media`.
- Classes em **BEM**; **mobile-first** com media queries `min-width` em `em`.
- Responsividade mínima: suportar até 320px (20em) sem quebrar.
- **JavaScript somente ES6+** — `const`/`let` (nunca `var`), arrow functions,
  template literals, `===`/`!==`. Aplique desde o primeiro rascunho.
- **Não inicie `sass --watch`** — o watch roda fora da sessão, em terminal próprio.
  Para validar que o SCSS compila, rode `npm run build` (nunca `--watch`, bloqueante).
- Usar testes automatizados Playwright + Chromium e axe-core para validação do layout.

## Arquitetura [default]
- Node + Express + EJS. Renderização no servidor (SSR / MPA).
- Envio nativo de formulário: <form method="POST">, sem JavaScript
  no cliente para o envio.
- Padrão Post/Redirect/Get: sucesso redireciona para GET; erro de
  validação renderiza o formulário no próprio POST, preservando os
  dados digitados e exibindo as mensagens.
- Validação somente no servidor, em função separada da rota
  (validarFormulario(dados) retorna { ok, erros, valores }), para
  que possa reaproveitá-la depois com fetch.

## Proibido neste desafio [default]
fetch/AJAX, jQuery, React, bibliotecas de validação, TypeScript.

## Deploy (Render) [default]
- Servidor escuta em process.env.PORT (com fallback local) e em 0.0.0.0.
- package.json com script "start". Build: npm install. Start: npm start.

## Critérios de aceite [default]
Funciona com JavaScript desabilitado no navegador; recarregar a
página de sucesso não reenvia o formulário; erro mantém os dados
digitados.

## Regras do repositório [defualt]

- Nunca faça commit de arquivos de design (`*.fig`, `*.sketch`, `*.xd`). Esta pasta não tem `.gitignore` próprio; se o repositório raiz não cobrir esses arquivos, avise o usuário em vez de criar ou alterar um sem pedir.
