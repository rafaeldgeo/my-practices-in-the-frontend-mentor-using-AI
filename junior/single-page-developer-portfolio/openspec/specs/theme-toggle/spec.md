# theme-toggle Specification

## Purpose
Permite ao visitante alternar a página entre os temas dark e light por um botão no header, lembrando a escolha nas visitas seguintes, com a página acessível nos dois temas.

## Requirements

### Requirement: Botão de tema no header
O header SHALL ter um botão de alternar tema, posicionado logo depois do link "Twitter", com ícone de sol enquanto o tema é dark e de lua enquanto é light. O nome acessível do botão SHALL dizer a ação: "Switch to light theme" no tema dark e "Switch to dark theme" no tema light. O ícone é só imagem: o nome vem do botão.

#### Scenario: Botão presente no tema dark
- **WHEN** a página é carregada pela primeira vez
- **THEN** o header tem um botão chamado "Switch to light theme", depois do link "Twitter" na ordem de leitura

#### Scenario: Botão acessível por teclado
- **WHEN** o usuário foca o botão com Tab e aciona com Enter ou Espaço
- **THEN** o botão mostra indicador de foco visível e o tema é alternado

### Requirement: Tema inicial dark
Na primeira visita, sem escolha gravada, a página SHALL abrir no tema dark, independentemente da preferência de cor do sistema do visitante.

#### Scenario: Primeira visita
- **WHEN** a página é aberta sem nenhuma escolha de tema gravada
- **THEN** o tema aplicado é o dark e o botão se chama "Switch to light theme"

#### Scenario: Sistema em modo claro
- **WHEN** a página é aberta sem escolha gravada e o sistema do visitante prefere o modo claro
- **THEN** o tema aplicado continua sendo o dark

### Requirement: Alternar entre dark e light
Ao acionar o botão, a página SHALL trocar de tema na hora, sem recarregar, e o botão SHALL passar a ter o nome e o ícone da ação oposta. Acionar de novo SHALL voltar ao tema anterior.

#### Scenario: Dark para light
- **WHEN** o usuário aciona o botão "Switch to light theme"
- **THEN** a página passa a usar o tema light e o botão se chama "Switch to dark theme"

#### Scenario: Light para dark
- **WHEN** o usuário aciona o botão "Switch to dark theme"
- **THEN** a página volta ao tema dark e o botão se chama "Switch to light theme"

### Requirement: Escolha de tema persistente
A escolha do tema SHALL ser lembrada pelo navegador e reaplicada ao recarregar ou reabrir a página, desde o primeiro desenho, sem exibir antes o outro tema. Um valor gravado desconhecido ou inválido SHALL ser ignorado e a página abre no dark.

#### Scenario: Light persiste ao recarregar
- **WHEN** o usuário escolhe o tema light e recarrega a página
- **THEN** a página abre no tema light, com o botão "Switch to dark theme"

#### Scenario: Dark escolhido persiste
- **WHEN** o usuário escolhe o light, depois volta ao dark e recarrega a página
- **THEN** a página abre no tema dark

#### Scenario: Valor gravado inválido
- **WHEN** a página é aberta com um valor de tema gravado que não é dark nem light
- **THEN** a página abre no tema dark

### Requirement: Aparência do tema light
No tema light, a página SHALL usar fundo e superfícies claras, texto escuro e um verde de destaque mais escuro que o do tema dark, mantendo o mesmo conteúdo, layout e estados de hover e foco. Os elementos decorativos (anéis, círculo e véu sobre as miniaturas dos projetos) SHALL continuar visíveis e coerentes com o fundo. O tema dark SHALL permanecer idêntico ao design do desafio.

#### Scenario: Cores do tema light
- **WHEN** o tema light está aplicado
- **THEN** o fundo da página é claro e o texto principal é escuro

#### Scenario: Decoração visível no light
- **WHEN** o tema light está aplicado
- **THEN** os anéis e o círculo decorativos continuam visíveis sobre o fundo claro

#### Scenario: Dark inalterado
- **WHEN** o tema dark está aplicado, na primeira visita ou após alternar de volta
- **THEN** a página tem a mesma aparência do design do desafio

### Requirement: Acessibilidade nos dois temas
A página SHALL não ter violações de acessibilidade WCAG 2.0 e 2.1 níveis A e AA, incluindo contraste, em ambos os temas, no estado inicial, com erros do formulário exibidos e com a mensagem de sucesso, em viewport mobile e desktop.

#### Scenario: Estado inicial no light
- **WHEN** o tema light está aplicado em viewport mobile ou desktop
- **THEN** a verificação de acessibilidade não encontra violações

#### Scenario: Com erros no light
- **WHEN** o tema light está aplicado e o formulário é enviado vazio, em viewport mobile ou desktop
- **THEN** a verificação de acessibilidade não encontra violações

#### Scenario: Com sucesso no light
- **WHEN** o tema light está aplicado e o formulário é enviado com valores válidos, em viewport mobile ou desktop
- **THEN** a verificação de acessibilidade não encontra violações
