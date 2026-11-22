# Spec Delta

## MODIFIED Requirements

### Requirement: Estados de hover e foco dos ícones
Cada ícone social SHALL mudar para a cor de destaque verde ao receber hover e SHALL ter indicador de foco visível ao receber foco por teclado. No tema dark o verde é `#4EE1A0`; no tema light é o verde de destaque mais escuro do tema, com contraste suficiente sobre o fundo claro. Do tablet em diante o header fica sobre a foto escura do hero: ali os ícones e o botão de tema SHALL manter a cor clara e o verde `#4EE1A0` também no tema light.

#### Scenario: Hover no ícone
- **WHEN** o usuário passa o mouse sobre um ícone social
- **THEN** o ícone fica na cor de destaque verde do tema aplicado

#### Scenario: Header sobre a foto no tema light
- **WHEN** o tema light está aplicado e a largura é de tablet ou desktop
- **THEN** os ícones e o botão de tema do header continuam claros, visíveis sobre a foto, e o hover deles é o verde `#4EE1A0`

#### Scenario: Foco no ícone
- **WHEN** o usuário foca um ícone social com Tab
- **THEN** há um indicador de foco visível sobre o ícone
