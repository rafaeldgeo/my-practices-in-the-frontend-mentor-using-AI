# site-header-footer Specification

## Purpose

Define o cabeçalho e o rodapé do portfólio: logo, ícones sociais acessíveis com estados de hover e foco, e a atribuição do desafio.

## Requirements

### Requirement: Logo e ícones sociais no header e no footer
O header e o footer SHALL exibir o logo em texto "adamkeyes" e quatro links de ícone com nome acessível "GitHub", "Frontend Mentor", "LinkedIn" e "Twitter". Os ícones são só imagem: o nome vem do link, e a imagem em si não é lida por tecnologia assistiva.

#### Scenario: Ícones nomeados
- **WHEN** a página é carregada
- **THEN** o header e o footer têm, cada um, o logo "adamkeyes" e os links "GitHub", "Frontend Mentor", "LinkedIn" e "Twitter"

### Requirement: Estados de hover e foco dos ícones
Cada ícone social SHALL mudar para a cor de destaque verde (`#4EE1A0`) ao receber hover e SHALL ter indicador de foco visível ao receber foco por teclado.

#### Scenario: Hover no ícone
- **WHEN** o usuário passa o mouse sobre um ícone social
- **THEN** o ícone fica na cor de destaque verde

#### Scenario: Foco no ícone
- **WHEN** o usuário foca um ícone social com Tab
- **THEN** há um indicador de foco visível sobre o ícone

### Requirement: Atribuição do desafio no rodapé
O footer SHALL exibir, centralizada na parte de baixo e em fonte de 11px, a atribuição "Challenge by Frontend Mentor. Coded by Rafael Dias de Almeida.", com os dois nomes como links que abrem em nova aba, sem dar acesso à janela de origem.

#### Scenario: Atribuição presente
- **WHEN** a página é carregada
- **THEN** o footer mostra "Challenge by Frontend Mentor. Coded by Rafael Dias de Almeida." com o link "Frontend Mentor" para o perfil `https://www.frontendmentor.io/profile/rafaeldgeo` e o link "Rafael Dias de Almeida" para `https://www.linkedin.com/in/rafaeldgeo/`, ambos com `target="_blank"` e `rel` contendo `noopener`

#### Scenario: Texto legível
- **WHEN** a atribuição é exibida
- **THEN** seu contraste com o fundo atende WCAG AA
