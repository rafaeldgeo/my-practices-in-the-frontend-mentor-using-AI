# Decisões do projeto — Single-page developer portfolio

> **Papel deste documento.** É a semente do `openspec-propose` e a base para reescrever
> o `openspec/config.yaml`. Vale até a change 2 ser arquivada. Depois disso, o
> comportamento passa a ser definido pelas specs em `openspec/specs/`, e este documento
> **não** deve ser mantido em paralelo.
>
> **Legenda das decisões:** `[confirmado]` foi decidido na conversa; `[proposta]` é
> sugestão padrão a confirmar antes de virar spec; `[em aberto]` ainda não tem resposta.
>
> **Destino** de cada seção: `specs` (comportamento observável), `design/tasks`
> (stack e arquitetura), `config` (regras do OpenSpec), `CLAUDE.md` (regras para
> sessões fora do OpenSpec).

---

## 1. O que é o projeto  → config (context)

- Desafio Frontend Mentor "Single-page developer portfolio" (nível junior). Objetivo:
  ficar o mais próximo possível do design, com o layout correto em cada tamanho de tela
  e estados de hover e foco em todo elemento interativo.
- O repositório agrupa desafios por nível (`newbie/`, `junior/`, `intermediate/`).
- Site estático, publicado no GitHub Pages direto do repositório em
  `https://rafaeldgeo.github.io/my-practices-in-the-frontend-mentor-using-AI/<nível>/<desafio>/`.
  **Todos os caminhos de assets são relativos.**
- O texto exibido na página é em inglês (`lang="en"`), como no design. Os artefatos do
  OpenSpec são escritos em português do Brasil.

## 2. Escopo  → specs / proposal

**Dentro** `[confirmado]`:
- Página única com header, hero, skills, projects, contact e footer.
- Layout responsivo (mobile, tablet, desktop), de 320px até desktop.
- Hover e foco visíveis em todos os elementos interativos.
- Validação do formulário no navegador, com mensagem de erro e estado de sucesso.
- Testes automatizados: unitários, de fluxo na tela e de acessibilidade.

**Fora** `[confirmado]`:
- **Sem backend.** O formulário valida e mostra o sucesso na tela. Nada é enviado nem
  armazenado. O bônus de "enviar e guardar a consulta" não faz parte desta rodada.
- O bônus de trocar imagem, skills e projetos pelos dados próprios também fica fora:
  o conteúdo é o do design (Adam Keyes).

## 3. Plano de changes  → proposal de cada change

```
change 1  testes (TDD)      escreve testes, roda, mostra que FALHAM por ausencia
   |                        de implementacao. Nao escreve codigo de producao.
   v
change 2  implementacao     HTML, SCSS e JS ate TODOS os testes da change 1 passarem
   |
   v
change 3  evolucao          NAO definida agora. Nao planejar nem antecipar na 1 e na 2,
                            alem de manter o conteudo (skills e projetos) fora das
                            regras de teste de forma que nao atrapalhe a evolucao.
```

### Change 1 — testes `[confirmado]`
- Cobre **as três camadas** de teste (unit, e2e, axe), mais a configuração de teste
  (`package.json`, `playwright.config`, scripts npm). Configuração não é código de produção.
- Não cria HTML, SCSS nem o módulo de validação.
- Os testes devem falhar **por ausência de implementação** e não por erro de
  configuração. Isso precisa ser demonstrado rodando-os.
- Define o **contrato** que a change 2 deve cumprir (ver 3.3).
- Capacidade de spec criada aqui: `contact-form`.

### Change 2 — implementação `[confirmado]`
- Implementa a página inteira até a suíte da change 1 passar, **sem alterar os testes**.
- Acrescenta as demais capacidades (ver seção 4). Não altera a spec `contact-form`,
  só a cumpre. Se um teste da change 1 estiver errado, isso volta para a change 1.

### 3.3 Contrato entre as changes  `[proposta]`, a fixar na change 1
Fixar como spec e nos testes, para a change 2 só implementar:
- caminho do módulo de validação e nomes das funções puras (ver seção 6);
- rótulos acessíveis dos campos: **Name**, **Email**, **Message**;
- texto exato de cada mensagem de erro (ver seção 5);
- texto, papel (`role="status"`) e posição da mensagem de sucesso;
- nome acessível do botão de envio ("Send message") e dos CTAs ("Contact me");
- a ordem em que os erros aparecem e para onde vai o foco após o envio inválido.

## 4. Comportamento esperado  → specs

Capacidades candidatas. Fontes visuais: `design/` (Mobile, Tablet, Desktop, Desktop - Active,
Design System) e `preview.jpg`.

**4.1 Header e footer.**
- Logo em texto "adamkeyes" e quatro ícones sociais (GitHub, Frontend Mentor, LinkedIn,
  Twitter), tanto no header quanto no footer.
- Ícones têm nome acessível e estado de hover (cor de destaque verde) e foco.
- Footer: logo, ícones e a atribuição (ver 4.8).

**4.2 Hero.**
- Título "Nice to meet you! I'm Adam Keyes." com "Adam Keyes" sublinhado em verde,
  parágrafo de apresentação e CTA "Contact me".
- Retrato em três versões (`image-profile-mobile/tablet/desktop.webp`), uma por breakpoint.
- Mobile: retrato no topo, textos centralizados. Tablet e desktop: texto à esquerda e
  retrato à direita. Padrões decorativos (`pattern-rings.svg`, `pattern-circle.svg`)
  são só decoração e ficam escondidos da tecnologia assistiva.

**4.3 Skills.**
- Seis itens: HTML, CSS, JavaScript, Accessibility, React e Sass, cada um com o tempo de
  experiência (4, 4, 4, 4, 3 e 3 anos). Texto de cada item como no design.
- Grade de 1 coluna no mobile, 2 no tablet e 3 no desktop.

**4.4 Projects.**
- Título "Projects" e CTA "Contact me" ao lado dele (tablet e desktop; no mobile o CTA
  fica ao lado do título também, como no design).
- Seis cards, cada um com miniatura (`thumbnail-project-N-small/large.webp`), nome em
  caixa alta, tecnologias e dois links: "View project" e "View code".
  Ordem: Design portfolio, E-learning landing page, Todo web app, Entertainment web app,
  Memory Game, Art gallery showcase.
- 1 coluna no mobile, 2 no tablet e no desktop.
- **Mobile e tablet:** os dois links ficam sempre visíveis abaixo das tecnologias.
- **Desktop:** os links aparecem sobre a imagem, centralizados, ao passar o mouse
  (`Home - Desktop - Active.png`). `[confirmado]` O **foco por teclado** também os revela
  (`:focus-within`), senão os links ficam inalcançáveis visualmente.
- Destino real de "View project" e "View code": `[em aberto]` (usar `#` até haver URLs).

**4.5 Navegação.** O CTA "Contact me" do hero e o da seção Projects rolam até o
formulário de contato. Respeitar `prefers-reduced-motion` na rolagem suave.

**4.6 Contact.**
- Título "Contact", texto de apresentação e formulário com Name, Email e Message.
- Desktop: texto à esquerda, formulário à direita. Mobile e tablet: tudo centralizado.
- Campos só com linha inferior; o rótulo aparece como placeholder em caixa alta.
  O rótulo precisa existir como `<label>` (pode ser visualmente integrado ao campo),
  não só como `placeholder`.
- Botão "Send message", com sublinhado verde e hover verde.
- Validação, mensagens e sucesso: seções 5 e 6.

**4.7 Layout e responsividade.** Mobile-first. Referências do design: 375px (mobile),
768px (tablet), 1440px (desktop). Suporte até 320px sem rolagem horizontal nem quebra.

**4.8 Atribuição no rodapé.** Inserir no footer, centralizada, na parte de baixo, fonte
de 11px, com cores que combinem com o layout:

```html
<div class="attribution">
  Challenge by
  <a href="https://www.frontendmentor.io/profile/rafaeldgeo" target="_blank" rel="noopener">Frontend Mentor</a>.
  Coded by
  <a href="https://www.linkedin.com/in/rafaeldgeo/" target="_blank" rel="noopener">Rafael Dias de Almeida</a>.
</div>
```

**4.9 Hover e foco.** Todo elemento interativo (links, ícones, CTAs, campos, botão, links
dos cards) tem estado de hover e de foco visível. O foco nunca é removido sem substituto.

## 5. Decisões de design do formulário  → specs (contact-form)

- Os erros aparecem **ao enviar** o formulário `[confirmado]`:
  - qualquer campo vazio;
  - e-mail em formato inválido.
- Mensagem para campo vazio: `Can't be empty` `[confirmado, texto a fixar na change 1]`.
- Mensagem para e-mail inválido: `Sorry, invalid format here` (texto do design)
  `[confirmado]`.
- Apresentação do erro (Design System): linha inferior vermelha, mensagem pequena em
  vermelho alinhada à direita, abaixo do campo; no campo de e-mail há também um ícone de
  alerta à direita.
- Acessibilidade do erro `[proposta]`: `aria-invalid="true"` no campo, mensagem ligada por
  `aria-describedby`, e o foco vai para o primeiro campo inválido após o envio.
- **Corrigir o campo limpa o erro dele** `[confirmado]`, sem esperar novo envio (ao
  digitar ou ao sair do campo; fixar qual na change 1). Os erros dos outros campos
  permanecem.
- Estado de sucesso `[confirmado]`: mensagem com `role="status"`; o design não traz esse
  estado. Texto proposto: `Thanks for getting in touch! I'll get back to you soon.`
  `[proposta]`. O formulário é limpo e nada é enviado.
- Estado ativo do campo (Design System): texto branco e linha inferior mais clara.

## 6. Regras de validação  → specs, e módulo puro (design/tasks)  `[proposta]`

Confirmar antes de virar spec:
- **Name e Message:** vazio ou só com espaços em branco é erro. O valor é aparado
  (trim) antes de validar. Sem tamanho mínimo além de "não vazio".
- **Email:** vazio é erro "Can't be empty". Preenchido, precisa seguir `algo@dominio.tld`,
  sem espaços, com um único `@`, e domínio com pelo menos um ponto; caso contrário,
  "Sorry, invalid format here".
- Cada função de validação é **pura**: recebe o valor e devolve resultado (válido, ou a
  mensagem de erro); sem DOM, sem efeitos colaterais. Existe também uma função que valida
  o formulário inteiro e devolve os erros por campo.
- O módulo é ES module e é importado tanto pelo Node (testes) quanto pelo navegador
  (`<script type="module">`), o que exige `"type": "module"` no `package.json`.
- Caminho e nomes exatos das funções: `[em aberto]`, decidir em `design.md` da change 1.

## 7. Estratégia de testes  → tasks (change 1) e config

1. **Unitários** (`tests/unit/`): `node --test`, com `node:test` e `node:assert`, nas
   funções puras de validação.
2. **Fluxo na tela** (`tests/e2e/`): Playwright, **só Chromium**, com `webServer` no
   `playwright.config` servindo o site estático. Cenários: envio válido; cada erro de
   validação visível; correção do campo limpando o erro. Localizadores por papel e rótulo
   (`getByRole`, `getByLabel`). Também cobrir: o CTA rola até o formulário, e os links
   dos cards ficam acessíveis por teclado.
3. **Acessibilidade:** `@axe-core/playwright` com as tags `wcag2a`, `wcag2aa`, `wcag21a` e
   `wcag21aa`, em três estados (inicial, com erros exibidos, sucesso) e em dois viewports
   (mobile e desktop). Contraste é medido por essa suíte, incluindo o cinza do
   placeholder e o vermelho do erro sobre `#242424`.
4. **Scripts npm:** `test:unit` e `test:e2e`.
5. **Servidor estático** para o Playwright: dependência de desenvolvimento (por exemplo
   `serve` ou `http-server`); a escolha fica no `design.md` da change 1.
6. Quem escreve testes não escreve código de produção (ver seção 9).

## 8. Stack e convenções  → design.md e tasks.md (não nas specs)  `[confirmado]`

- **HTML5 semântico**, `lang="en"`, atento a WCAG (labels, `aria-*`, foco visível).
- **Sass (SCSS)** compilado para `style.css`. **Nunca editar o `.css`.** O entry
  `main.scss` só contém `@use` dos parciais. Importação sempre com `@use`/`@forward`,
  nunca `@import`. Parciais organizados por responsabilidade.
- **Tokens de design** como custom properties em `:root`, num parcial de tokens: cores,
  spacing, radius e escala tipográfica (com `clamp()` para tamanhos fluidos).
- **Breakpoints** como variáveis Sass (`$`), consumidas por mixin. Custom property não
  vale na condição de `@media`. Valores `[proposta]`: tablet a partir de 48em (768px) e
  desktop a partir de 64em (1024px); fixar em `design.md`.
- **BEM** nas classes. **Mobile-first** com media queries `min-width` em `em`.
- **Responsividade mínima:** 320px (20em) sem quebrar.
- **JavaScript somente ES6+:** `const`/`let` (nunca `var`), arrow functions, template
  literals, `===`/`!==`. Aplicar desde o primeiro rascunho.
- **Não iniciar `sass --watch`:** ele roda fora da sessão, em terminal próprio. Para validar
  que o SCSS compila, rodar `npm run build` (nunca `--watch`, que bloqueia).
- O `style.css` compilado é versionado, pois o GitHub Pages serve os arquivos como estão.

### Design System  → tokens (design.md)
- **Cores:** fundo `#151515`; destaque verde `#4EE1A0`; superfície `#242424` (seção Contact);
  cinza claro `#D9D9D9`; branco `#FFFFFF`. O vermelho de erro não está no Design System:
  extrair do design (aproximadamente um coral, tipo `#FF6F5B`) e validar o contraste.
- **Tipografia:** Space Grotesk (fontes locais em `assets/fonts/`).
  - Heading XL: Bold 88px / linha 88px / espaçamento -2.5px.
  - Heading L: Bold 48px / linha 56px / espaçamento -1.5px.
  - Heading M: Bold 24px / linha 32px.
  - Body L: Medium 18px / linha 28px.
  - Tamanhos fluidos com `clamp()` entre mobile e desktop.
- **Botão ("Contact me" e similares):** texto em caixa alta, com espaçamento entre letras,
  sublinhado verde; no hover o texto fica verde.
- **Campo de texto:** ver seção 5.

## 9. Processo  → config (operations/rules) e CLAUDE.md  `[confirmado]`

- **TDD.** Na sessão que escreve testes, é proibido escrever código de produção.
- Na change 1: rodar os testes e mostrar que falham **por ausência de implementação**, e
  não por erro de configuração. Parar para revisão humana.
- **Após a aprovação do humano**, o assistente comenta o código e faz o commit.
- Em `tasks.md`, as tarefas que escrevem testes vêm antes das que escrevem código de
  produção, e nunca se misturam na mesma tarefa.
- Na change 2, a suíte da change 1 é o critério de pronto: não se altera um teste para
  fazê-lo passar.
- Não rodar `sass --watch`; validar com `npm run build`.
- Código sempre ES6+ sem pedir (nunca `var`).

## 10. Mapa de destino  (para reescrever config.yaml e gerar o CLAUDE.md)

| Conteúdo | specs | design.md / tasks.md | config.yaml | CLAUDE.md |
|---|---|---|---|---|
| O que é o projeto, deploy, idioma dos artefatos | | | `context` | resumo e ponteiro |
| Comportamento observável (seções 4 e 5) | sim | | | |
| Regras de validação (seção 6) | sim | módulo e testes | | |
| Estratégia de testes (seção 7) | | sim | `rules.tasks` | comandos |
| Stack e convenções (seção 8) | não | sim | `context` (resumo) | sim |
| Processo e TDD (seção 9) | | | `operations` e `rules` | sim |

Observações para o `config.yaml`:
- O `context` atual cita o `especificacao.md` como fonte da verdade. Como esse arquivo sai
  do projeto, trocar por este documento (enquanto valer) e por `design/`, e manter o
  trecho de que as specs descrevem comportamento observável e não stack.
- O `context` entra em todo artefato: mantê-lo curto, só com o que não se infere do código.
- O `CLAUDE.md` deve apontar para o `config.yaml` e não copiar o conteúdo dele.

## 11. Pendências

- [ ] Confirmar as regras de validação (seção 6).
- [ ] Confirmar o texto de sucesso e de campo vazio (seção 5).
- [ ] Definir destino real de "View project" e "View code" (4.4).
- [ ] Extrair a cor exata do erro a partir de `design/`.
- [ ] Escolher o servidor estático e o caminho do módulo de validação (design da change 1).
