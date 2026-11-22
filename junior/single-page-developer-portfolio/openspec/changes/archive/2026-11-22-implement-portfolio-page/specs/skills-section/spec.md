# Spec Delta

## Purpose

Define a seção Skills do portfólio: os seis itens de habilidade com seu tempo de experiência e a grade por tamanho de tela.

## ADDED Requirements

### Requirement: Seis habilidades com tempo de experiência
A região "Skills" SHALL listar HTML, CSS, JavaScript, Accessibility, React e Sass, nessa ordem, cada uma com o texto de experiência: "4 Years Experience" para as quatro primeiras e "3 Years Experience" para React e Sass.

#### Scenario: Itens exibidos
- **WHEN** a página é carregada
- **THEN** a região "Skills" mostra os seis itens, na ordem indicada, cada um com seu tempo de experiência

### Requirement: Grade de habilidades por tamanho de tela
Os itens de habilidade SHALL ser dispostos em 1 coluna no mobile, 2 no tablet e 3 no desktop.

#### Scenario: Colunas por tamanho
- **WHEN** a página é aberta em 375px, 768px e 1440px de largura
- **THEN** os itens aparecem em 1, 2 e 3 colunas, respectivamente
