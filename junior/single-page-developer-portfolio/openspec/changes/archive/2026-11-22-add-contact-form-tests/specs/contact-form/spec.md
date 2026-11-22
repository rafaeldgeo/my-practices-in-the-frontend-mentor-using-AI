# Spec Delta

## Purpose

Define o comportamento observável do formulário de contato do portfólio: campos, validação ao enviar, mensagens de erro, foco, limpeza do erro ao corrigir e estado de sucesso, sem envio nem armazenamento de dados.

## ADDED Requirements

### Requirement: Seções e cards localizáveis
As seções da página SHALL ser regiões com nome acessível "Hero", "Skills", "Projects" e "Contact". O formulário SHALL ter nome acessível "Contact form". Cada card de projeto SHALL ser um `article` com o nome do projeto como nome acessível (ex.: "Design portfolio"). Isso permite distinguir elementos com o mesmo nome, como os dois CTAs "Contact me" e os seis pares "View project"/"View code".

#### Scenario: Regiões e cards expostos
- **WHEN** a página é carregada
- **THEN** existem as regiões "Hero", "Skills", "Projects" e "Contact", o formulário "Contact form" e seis `article` com os nomes dos projetos

### Requirement: Campos com rótulo acessível
O formulário SHALL ter três campos de texto com rótulos acessíveis exatamente "Name", "Email" e "Message", e um botão de envio com nome acessível "Send message".

#### Scenario: Campos localizáveis pelo rótulo
- **WHEN** a página é carregada
- **THEN** existem campos rotulados "Name", "Email" e "Message" e um botão "Send message"

### Requirement: CTAs levam ao formulário
Os CTAs com nome acessível "Contact me" (no hero e na seção Projects) SHALL rolar a página até o formulário de contato.

#### Scenario: CTA do hero
- **WHEN** o usuário aciona o CTA "Contact me" da região "Hero"
- **THEN** o formulário de contato fica visível na janela

#### Scenario: CTA da seção Projects
- **WHEN** o usuário aciona o CTA "Contact me" da região "Projects"
- **THEN** o formulário de contato fica visível na janela

### Requirement: Validação ao enviar
O formulário SHALL validar os campos somente ao ser enviado, com a validação nativa do navegador desligada (atributo `novalidate`), de modo que apenas as mensagens do próprio formulário apareçam. Name e Message vazios ou só com espaços SHALL ser inválidos. Email vazio SHALL ser inválido. Email preenchido SHALL ser inválido se não seguir `algo@dominio.tld` (sem espaços, um único `@`, domínio com ao menos um ponto).

#### Scenario: Validação nativa do navegador desligada
- **WHEN** o usuário envia o formulário com Email "adam@invalid"
- **THEN** a mensagem de erro é a do formulário ("Sorry, invalid format here") e o navegador não exibe balão de validação nativa

#### Scenario: Nada é validado antes do envio
- **WHEN** o usuário digita e sai de um campo sem enviar o formulário
- **THEN** nenhuma mensagem de erro é exibida

#### Scenario: Campos vazios
- **WHEN** o usuário envia o formulário com todos os campos vazios
- **THEN** cada campo exibe a mensagem "Can't be empty"

#### Scenario: Campo só com espaços
- **WHEN** o usuário envia o formulário com Name contendo apenas espaços
- **THEN** o campo Name exibe "Can't be empty"

#### Scenario: E-mail em formato inválido
- **WHEN** o usuário envia o formulário com Email "adam@invalid"
- **THEN** o campo Email exibe "Sorry, invalid format here"

#### Scenario: E-mail com espaço
- **WHEN** o usuário envia o formulário com Email "adam @mail.com"
- **THEN** o campo Email exibe "Sorry, invalid format here"

### Requirement: Apresentação e acessibilidade do erro
Cada campo inválido SHALL ser marcado como inválido para tecnologia assistiva e associado à sua mensagem de erro, exibida abaixo do campo. Os erros SHALL aparecer na ordem Name, Email, Message.

#### Scenario: Campo marcado e descrito
- **WHEN** o envio deixa o campo Email inválido
- **THEN** o campo Email é exposto como inválido e sua descrição acessível é a mensagem de erro

#### Scenario: Ordem dos erros
- **WHEN** o usuário envia o formulário com todos os campos vazios
- **THEN** as mensagens aparecem na ordem Name, Email, Message

### Requirement: Foco após envio inválido
Após um envio inválido, o foco SHALL ir para o primeiro campo inválido, na ordem Name, Email, Message.

#### Scenario: Foco no primeiro inválido
- **WHEN** o usuário envia o formulário com Name preenchido e Email e Message vazios
- **THEN** o foco está no campo Email

### Requirement: Corrigir o campo limpa o erro dele
Quando o usuário digitar em um campo com erro, o erro desse campo SHALL desaparecer imediatamente (e o campo deixar de ser exposto como inválido), sem novo envio, e os erros dos outros campos SHALL permanecer. O campo SHALL ser revalidado somente no próximo envio, mesmo que o novo valor ainda seja inválido.

#### Scenario: Correção de um campo
- **GIVEN** um envio inválido com erro em Name e em Email
- **WHEN** o usuário preenche Name com um valor válido
- **THEN** o erro de Name desaparece e o erro de Email permanece

#### Scenario: Valor ainda inválido não revalida
- **GIVEN** um envio inválido com erro em Email
- **WHEN** o usuário digita "adam@" em Email
- **THEN** o erro de Email desaparece, o campo deixa de ser exposto como inválido e o erro só volta no próximo envio

### Requirement: Estado de sucesso
Quando todos os campos forem válidos no envio, o formulário SHALL exibir, logo após o botão de envio e dentro da seção Contact, a mensagem de sucesso "Thanks for getting in touch! I'll get back to you soon." com papel `status`, limpar os campos e não enviar nem armazenar dados. A mensagem de sucesso SHALL desaparecer assim que o usuário digitar em qualquer campo ou enviar o formulário de novo.

#### Scenario: Envio válido
- **WHEN** o usuário envia o formulário com Name, Email e Message válidos
- **THEN** a mensagem de sucesso (role "status") é exibida, nenhum erro aparece e os três campos ficam vazios

#### Scenario: Sucesso some ao digitar
- **GIVEN** um envio válido que exibiu a mensagem de sucesso
- **WHEN** o usuário digita em um campo
- **THEN** a mensagem de sucesso deixa de ser exibida

#### Scenario: Sucesso some em novo envio inválido
- **GIVEN** um envio válido que exibiu a mensagem de sucesso
- **WHEN** o usuário envia o formulário vazio
- **THEN** a mensagem de sucesso deixa de ser exibida e os erros aparecem

#### Scenario: Nenhum dado enviado
- **WHEN** o usuário envia o formulário com valores válidos
- **THEN** nenhuma requisição de rede é feita

### Requirement: Links dos cards acessíveis por teclado
Os links "View project" e "View code" de cada card de projeto SHALL ser alcançáveis pelo teclado e visíveis quando recebem foco, em viewport mobile e desktop.

#### Scenario: Foco revela os links
- **WHEN** o usuário navega por Tab até o link "View project" ou "View code" de um card, em viewport mobile ou desktop
- **THEN** o link está visível e focado

### Requirement: Acessibilidade sem violações
A página SHALL não ter violações de acessibilidade WCAG 2.0 e 2.1 níveis A e AA, incluindo contraste, no estado inicial, com erros exibidos e com a mensagem de sucesso, em viewport mobile e desktop.

#### Scenario: Estado inicial
- **WHEN** a página é carregada em viewport mobile ou desktop
- **THEN** o formulário "Contact form" está presente e a verificação de acessibilidade não encontra violações

#### Scenario: Com erros
- **WHEN** o formulário é enviado vazio em viewport mobile ou desktop
- **THEN** a verificação de acessibilidade não encontra violações

#### Scenario: Com sucesso
- **WHEN** o formulário é enviado com valores válidos em viewport mobile ou desktop
- **THEN** a verificação de acessibilidade não encontra violações
