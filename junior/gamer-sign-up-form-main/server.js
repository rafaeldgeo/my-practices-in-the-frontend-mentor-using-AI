const path = require('path');
const express = require('express');
const { validarFormulario, validarCallsign, requisicaoBemFormada } = require('./validacao');
const { calcularForca, montarReadout } = require('./readout');

const app = express();

// Motor de templates: res.render('index') procura views/index.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (CSS, JS do cliente, imagens) servidos de public/
app.use(express.static(path.join(__dirname, 'public')));

// Lê o corpo de requisições application/x-www-form-urlencoded e o coloca em req.body.
// É esse o formato que o navegador usa ao enviar um <form method="POST"> sem JavaScript:
//   callsign=Vortex_07&email=a%40b.co&password=...&confirm=...&terms=on
// Sem este middleware, req.body seria undefined. extended: false usa o parser simples do
// Node (campos planos, sem objetos aninhados), que é tudo de que o formulário precisa.
app.use(express.urlencoded({ extended: false }));

// GET /: o servidor monta o HTML a partir do template e responde
app.get('/', (req, res) => {
  res.render('index');
});

// POST /: o navegador envia o formulário para cá (action="/" method="POST").
// Fluxo: requisição -> urlencoded (req.body) -> validarFormulario -> resposta.
// Inválido: re-renderiza o formulário NO PRÓPRIO POST (a URL continua /), com os valores
// digitados, as mensagens e o readout já calculados no servidor. Funciona sem JavaScript.
// Válido: Post/Redirect/Get, redireciona para GET /sucesso (ver o fim da rota).
app.post('/', (req, res) => {
  // req.body pode ser undefined (ex.: Content-Type que o parser acima não lê)
  const dados = req.body || {};
  const { ok, erros, valores } = validarFormulario(dados);

  // Decisão: formulário com mensagens OU tela de erro?
  // O servidor não consegue saber se o JS foi burlado: um navegador sem JS e um JS burlado
  // enviam o mesmo POST. Por isso o critério é a FORMA do corpo, não a validade dos dados.
  //   - corpo com os 4 campos de texto (como o formulário real envia): 422 + formulário,
  //     mesmo inválido; é o caminho do usuário sem JS (critério de aceite).
  //   - corpo que o formulário nunca produz (campo ausente, array): 400 + views/erro.ejs
  //     com os erros devolvidos por validarFormulario. Nada do corpo é ecoado além disso.
  if (!requisicaoBemFormada(dados)) {
    return res.status(400).render('erro', {
      mensagens: Object.values(erros),
      titulo: 'Transmission rejected | NEONCORE',
    });
  }

  if (!ok) {
    // A força da senha é calculada aqui, a partir da senha enviada, mas a SENHA em si não é
    // repassada à view: só o rótulo e o nível. Nunca logar req.body (contém a senha).
    const { nivel, rotulo } = calcularForca(dados.password);

    // 422 = os dados chegaram, mas não passaram na validação.
    return res.status(422).render('index', {
      valores,
      erros,
      readout: montarReadout({ erros, valores }),
      forca: rotulo,
      nivelForca: nivel,
    });
  }

  // PRG (Post/Redirect/Get): em vez de responder HTML neste POST, mandamos o navegador fazer
  // um GET em /sucesso. 303 See Other diz exatamente isso: "busque o resultado com GET".
  // Assim a URL final é /sucesso e recarregar a página repete só o GET, nunca o POST.
  // O callsign (já com trim) viaja na query string; URLSearchParams faz o encode correto.
  // A senha NUNCA vai na URL (ficaria em histórico, logs e cabeçalho Referer).
  const query = new URLSearchParams({ callsign: valores.callsign });
  res.redirect(303, `/sucesso?${query}`);
});

// GET /sucesso: tela de confirmação. O callsign vem da query string, que o usuário pode editar
// ou omitir; por isso é revalidado com a MESMA regra do formulário. Se não for um callsign
// válido (ausente, repetido como array, com caracteres proibidos), não há sucesso a mostrar
// e voltamos ao formulário. O valor é escapado na view (<%= %>).
app.get('/sucesso', (req, res) => {
  const { callsign } = req.query;
  if (typeof callsign !== 'string' || validarCallsign(callsign) !== null) {
    return res.redirect('/');
  }
  // Readout no estado final: sem erros todas as linhas ficam OK; provisionado: true troca
  // "5/5 ready" por "Provisioned" e as linhas por "Locked" (a view decide a partir dessa flag).
  const readout = { ...montarReadout({ erros: {}, valores: { callsign } }), provisionado: true };
  res.render('sucesso', { callsign, readout, titulo: 'Handshake complete | NEONCORE' });
});

// Render define PORT; localmente cai para 3000. 0.0.0.0 aceita conexões externas.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
