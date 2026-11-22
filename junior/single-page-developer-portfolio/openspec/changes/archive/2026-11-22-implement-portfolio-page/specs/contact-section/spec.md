# Spec Delta

## Purpose

Define a apresentação visual da seção Contact do portfólio (layout, campos, botão e estilo do erro). O comportamento do formulário é da spec contact-form.

## ADDED Requirements

### Requirement: Conteúdo e layout da seção Contact
A região "Contact" SHALL exibir o título "Contact", o texto "I would love to hear about your project and how I could help. Please fill in the form, and I'll get back to you as soon as possible." e o formulário. No desktop o texto fica à esquerda e o formulário à direita; no mobile e no tablet tudo fica centralizado.

#### Scenario: Desktop
- **WHEN** a página é aberta em 1440px de largura
- **THEN** o texto da seção está à esquerda do formulário

#### Scenario: Mobile e tablet
- **WHEN** a página é aberta em 375px ou 768px de largura
- **THEN** o título, o texto e o formulário estão centralizados, um sobre o outro

### Requirement: Aparência dos campos e do botão
Os campos SHALL ter apenas linha inferior, com o rótulo exibido em caixa alta onde ficaria o texto de ajuda, mantendo o rótulo acessível. Ao receber foco, o campo SHALL mostrar texto branco e linha inferior mais clara. O botão "Send message" SHALL ter texto em caixa alta, sublinhado verde e texto verde no hover, além de foco visível.

#### Scenario: Campo ativo
- **WHEN** o usuário foca um campo
- **THEN** a linha inferior do campo fica mais clara que a do estado de repouso e o foco é visível

#### Scenario: Hover do botão
- **WHEN** o usuário passa o mouse sobre "Send message"
- **THEN** o texto do botão fica verde

### Requirement: Aparência do erro
Um campo com erro SHALL ter linha inferior vermelha e a mensagem em vermelho, pequena e alinhada à direita, abaixo do campo; o campo Email com erro SHALL mostrar também um ícone de alerta à direita. A cor do erro SHALL ter contraste de texto AA sobre o fundo da seção.

#### Scenario: Erro visível
- **WHEN** o formulário é enviado vazio
- **THEN** cada campo mostra linha inferior vermelha e a mensagem em vermelho alinhada à direita abaixo dele

### Requirement: Aparência da mensagem de sucesso
A mensagem de sucesso SHALL aparecer logo abaixo do botão, com contraste de texto AA sobre o fundo da seção.

#### Scenario: Sucesso legível
- **WHEN** o formulário é enviado com valores válidos
- **THEN** a mensagem aparece abaixo do botão e é legível
