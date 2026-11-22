# responsive-layout Specification

## Purpose

Define a adaptação do portfólio aos tamanhos de tela e às preferências de movimento do usuário, sem quebra de layout.

## Requirements

### Requirement: Sem rolagem horizontal nem quebra de 320px ao desktop
A página SHALL se adaptar de 320px até telas largas sem rolagem horizontal, sem texto cortado e sem elementos sobrepostos.

#### Scenario: Largura mínima
- **WHEN** a página é aberta em 320px de largura
- **THEN** a largura do conteúdo não excede a da janela e nenhum texto ou controle fica cortado

#### Scenario: Larguras de referência
- **WHEN** a página é aberta em 375px, 768px e 1440px de largura
- **THEN** o layout corresponde ao design de referência de cada tamanho (`design/`) e não há rolagem horizontal

### Requirement: Rolagem suave respeita a preferência de movimento
A rolagem até o formulário SHALL ser suave, exceto quando o usuário pede movimento reduzido, caso em que SHALL ser imediata.

#### Scenario: Movimento reduzido
- **WHEN** o usuário com preferência por movimento reduzido aciona um CTA "Contact me"
- **THEN** a página chega ao formulário sem animação de rolagem

### Requirement: Foco visível em todo elemento interativo
Todo elemento interativo (links, ícones, CTAs, campos e botão) SHALL ter estado de hover e foco visível, e o foco nunca SHALL ser removido sem um substituto visível.

#### Scenario: Navegação por teclado
- **WHEN** o usuário percorre a página com Tab
- **THEN** cada elemento focado exibe um indicador de foco visível
