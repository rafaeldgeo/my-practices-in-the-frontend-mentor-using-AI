# projects-section Specification

## Purpose

Define a seção Projects do portfólio: título, CTA de contato, seis cards de projeto e a disposição dos links de cada card por tamanho de tela.

## Requirements

### Requirement: Cabeçalho da seção Projects
A região "Projects" SHALL exibir o título "Projects" e, ao lado dele, o CTA "Contact me", em todos os tamanhos de tela.

#### Scenario: Título e CTA lado a lado
- **WHEN** a página é aberta em 375px, 768px ou 1440px de largura
- **THEN** o CTA "Contact me" aparece ao lado do título "Projects"

### Requirement: Seis cards de projeto
A seção SHALL exibir seis cards na ordem Design portfolio, E-learning landing page, Todo web app, Entertainment web app, Memory Game e Art gallery showcase. Cada card tem miniatura (com texto alternativo vazio, pois o nome do projeto já descreve o card), o nome em caixa alta, as tecnologias e os links "View project" e "View code".

#### Scenario: Conteúdo de um card
- **WHEN** a página é carregada
- **THEN** o card "Design portfolio" mostra miniatura, nome, "HTML CSS" e os links "View project" e "View code"

#### Scenario: Tecnologias por card
- **WHEN** a página é carregada
- **THEN** Design portfolio e E-learning landing page listam "HTML CSS" e os outros quatro listam "HTML CSS JavaScript"

### Requirement: Disposição dos cards
Os cards SHALL ficar em 1 coluna no mobile e em 2 colunas no tablet e no desktop. Os links "View project" e "View code" SHALL levar a `#` enquanto não houver URLs reais.

#### Scenario: Colunas dos cards
- **WHEN** a página é aberta em 375px, 768px e 1440px de largura
- **THEN** os cards aparecem em 1, 2 e 2 colunas, respectivamente

### Requirement: Links dos cards por tamanho de tela
No mobile e no tablet, os links "View project" e "View code" SHALL ficar sempre visíveis abaixo das tecnologias. No desktop, SHALL aparecer sobre a imagem, centralizados, ao receber hover ou foco por teclado no card.

#### Scenario: Links visíveis no mobile e no tablet
- **WHEN** a página é aberta em 375px ou 768px de largura
- **THEN** os links de todos os cards estão visíveis sem hover nem foco

#### Scenario: Links revelados no desktop por hover
- **WHEN** o usuário passa o mouse sobre um card em 1440px de largura
- **THEN** os links aparecem sobre a imagem, centralizados

#### Scenario: Links revelados no desktop por foco
- **WHEN** o usuário foca com Tab um link de um card em 1440px de largura
- **THEN** os links do card ficam visíveis
