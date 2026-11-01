const path = require('path');
const express = require('express');
const { validarFormulario } = require('./validacao');
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
// ATENÇÃO: a resposta válida abaixo é PROVISÓRIA; #09 a troca por res.redirect('/sucesso')
// (Post/Redirect/Get).
app.post('/', (req, res) => {
  // req.body pode ser undefined (ex.: Content-Type que o parser acima não lê)
  const dados = req.body || {};
  const { ok, erros, valores } = validarFormulario(dados);

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

  res.status(200).send('ok');
});

// Render define PORT; localmente cai para 3000. 0.0.0.0 aceita conexões externas.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
