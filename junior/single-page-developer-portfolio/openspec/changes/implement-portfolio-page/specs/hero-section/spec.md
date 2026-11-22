# Spec Delta

## Purpose

Define a seção Hero do portfólio: apresentação de Adam Keyes, CTA para contato e retrato adequado a cada tamanho de tela.

## ADDED Requirements

### Requirement: Conteúdo do hero
A região "Hero" SHALL exibir o título "Nice to meet you! I'm Adam Keyes." com "Adam Keyes" sublinhado em verde, o parágrafo "Based in the UK, I'm a front-end developer passionate about building accessible web apps that users love." e o CTA "Contact me".

#### Scenario: Conteúdo exibido
- **WHEN** a página é carregada
- **THEN** a região "Hero" mostra o título, o parágrafo e o CTA "Contact me", com "Adam Keyes" destacado por sublinhado verde

### Requirement: Retrato por tamanho de tela
O hero SHALL exibir um retrato de Adam Keyes com texto alternativo descritivo, usando uma imagem diferente para mobile, tablet e desktop. No mobile o retrato fica no topo e os textos centralizados; no tablet e no desktop o texto fica à esquerda e o retrato à direita.

#### Scenario: Mobile
- **WHEN** a página é aberta em 375px de largura
- **THEN** o retrato aparece acima do texto e o texto está centralizado

#### Scenario: Tablet e desktop
- **WHEN** a página é aberta em 768px ou 1440px de largura
- **THEN** o texto está à esquerda e o retrato à direita

### Requirement: Padrões decorativos ocultos da tecnologia assistiva
Os padrões decorativos (anéis e círculo) SHALL ser apenas visuais e não SHALL ser expostos à tecnologia assistiva.

#### Scenario: Decoração ignorada
- **WHEN** a árvore de acessibilidade da página é lida
- **THEN** nenhum padrão decorativo aparece nela
