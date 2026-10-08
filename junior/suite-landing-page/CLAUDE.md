# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é isto

Uma solução para o desafio premium **Suite landing page** do Frontend Mentor (nível junior), uma pasta dentro de um repositório de desafios de prática agrupados por nível (`newbie/`, `junior/`, `intermediate/`). Objetivo: ficar o mais próximo possível do design, com o layout correto para cada tamanho de tela e estados de hover em todos os elementos interativos. `preview.jpg` é a prévia do design; o arquivo Figma completo não está no repositório.

Não há build, gerenciador de pacotes, linter nem testes — é HTML/CSS estático puro (JS apenas se necessário). Para visualizar, abra o `index.html` ou sirva a pasta (`python3 -m http.server`). Os sites finalizados são publicados no GitHub Pages direto do repositório (`https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<nível>/<desafio>/`), então mantenha todos os caminhos de assets relativos.

## Estado atual

O `index.html` ainda é o **esqueleto de conteúdo sem estilo** fornecido pelo desafio: um `<head>` apenas com favicon e título, e o texto da página como texto solto no `<body>` (sem marcação semântica, sem stylesheet, sem fontes). Seções em ordem: hero ("A super solution for your business." + botão "Request Beta Access"), estatísticas (2K+ Companies, 8 Languages, 1.2M Leads), depoimento ("It just works." — Jeremy Robinson, CMO, Fylo) e rodapé. O trabalho é adicionar marcação semântica, o `style.css` e imagens responsivas.

## Estrutura e pontos de atenção

- Os assets estão em `images/` (não em `assets/`), mas o `index.html` aponta o favicon para `./assets/favicon-32x32.png`, que **não resolve**. Corrija o caminho (ou mova a pasta) e use caminhos relativos consistentes.
- As imagens vêm em variantes `.png`/`.webp` e `@2x` para hero (`landscape`/`portrait`) e foto do depoimento (`jeremy-small`/`jeremy-large`) — use `<picture>`/`srcset` em vez de uma imagem única redimensionada por CSS. Também há logo, ícones sociais (facebook, instagram, twitter) e padrões SVG (`pattern-blur`, `pattern-curved-line-1/2`).
- `design-system.md` contém os tokens extraídos do Figma (cores, gradiente, tipografia Epilogue com Text Presets 1–8, spacing e radius) já com blocos de custom properties CSS. Use-o como **fonte única** para o `style.css`. Só o Text Preset 1 tem variantes Tablet/Mobile.
- `README-template.md` é o modelo para o README final do projeto; o `README.md` atual é o enunciado do desafio. O README menciona um `AGENTS.md`, mas ele não existe e não será criado: o `CLAUDE.md` é a fonte das instruções para assistentes de IA.

## Atribuição no rodapé

insert in footer  ```<div class="attribution">
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

## Convenções (herdadas de `newbie/grid-landing-page-main` e `junior/tech-book-club-landing-page`)

- HTML5 semântico, `lang="en"`, atento a WCAG (labels, `aria-*`, foco visível).
- `style.css` externo e simples; tokens de design como custom properties em `:root` (cores, spacing, radius, escala tipográfica, com `clamp()` para tamanhos fluidos); classes em **BEM**; **mobile-first** com media queries `min-width` em `em`.
- **JavaScript somente ES6+** — `const`/`let` (nunca `var`), arrow functions, template literals, `===`/`!==`. Aplique desde o primeiro rascunho.

## Regras do repositório

- Nunca faça commit de arquivos de design (`*.fig`, `*.sketch`, `*.xd`). Esta pasta não tem `.gitignore` próprio; se o repositório raiz não cobrir esses arquivos, avise o usuário em vez de criar ou alterar um sem pedir.
- Ao consultar o Figma, use apenas os termos "frame" e "boundary error"; se ocorrer um erro de limite, pare e reporte, sem repetir a chamada.
