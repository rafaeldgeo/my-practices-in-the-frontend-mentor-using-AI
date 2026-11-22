# Proposal

## Why

O portfólio só existe no tema dark, o do design do desafio. Quem prefere um fundo claro não tem alternativa, e o projeto não exercita temas, algo comum em sites reais. Esta evolução acrescenta o tema light como opção, escolhida por um botão no header, sem alterar o visual de quem o ignora.

## What Changes

- Botão de alternar tema no header, logo depois do ícone do Twitter, com ícone de sol (no dark, para ir ao light) e de lua (no light, para ir ao dark) e nome acessível que diz a ação.
- Tema light com paleta própria. O design de referência só tem dark, então a paleta é proposta por nós, com contraste WCAG AA verificado por cálculo (verde de destaque mais escuro, texto auxiliar mais escuro, fundo e superfície claros).
- Primeira visita sempre em dark. A escolha do botão é gravada no navegador e reaplicada nas visitas seguintes, sem piscar o tema errado ao carregar.
- Valores de cor hoje fixos fora dos tokens passam a depender do tema: o véu sobre as miniaturas dos projetos e os traços dos padrões decorativos (anéis e círculo).
- Os tokens de cor ganham nomes semânticos (o atual `--color-white` é usado como cor de texto e viraria "escuro" no light).
- A varredura de acessibilidade passa a cobrir o tema light.
- **Fora do escopo:** seguir `prefers-color-scheme` do sistema (decisão: dark fixo na primeira visita); backend; trocar o conteúdo (é o do design, de Adam Keyes); novos layouts por breakpoint; framework ou bundler de JS.

**Posição no plano:** esta é a **change 3** (evolução). Segue o TDD: os grupos de testes vêm antes dos de produção em `tasks.md`, e os testes escritos só são alterados pela change que os criou.

## Capabilities

### New Capabilities
- `theme-toggle`: alternar entre os temas dark e light por botão no header, tema inicial dark, persistência da escolha, e página sem violações de acessibilidade WCAG AA nos dois temas.

### Modified Capabilities
- `site-header-footer`: o requisito de hover dos ícones cita o verde `#4EE1A0` literal, que passa a valer só no tema dark; no light o destaque é um verde mais escuro. O header passa a conter também o botão de tema.

## Impact

- **Código:** `index.html` (script inline no `<head>` e botão no header), `scss/_tokens.scss` (tema light e tokens semânticos), `_base`, `_button`, `_contact`, `_hero`, `_skills`, `_projects`, `_header-footer` (renomeação e valores fixos), novo `js/theme.js` com função pura de resolução do tema, novos `assets/images/icon-theme-sun.svg` e `icon-theme-moon.svg`, padrões decorativos (`pattern-rings.svg`, `pattern-circle.svg`) adaptados ao tema, e `style.css` recompilado com `npm run build`.
- **Specs:** nova `theme-toggle`; delta em `site-header-footer`.
- **Testes:** novos unitários (resolução do tema), e2e (alternar, persistir, nome acessível do botão) e axe no tema light; a suíte atual continua valendo no dark sem alteração.
- **Dependências:** nenhuma nova.
