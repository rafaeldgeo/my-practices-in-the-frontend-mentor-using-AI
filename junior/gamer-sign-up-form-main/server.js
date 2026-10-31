const path = require('path');
const express = require('express');

const app = express();

// Motor de templates: res.render('index') procura views/index.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (CSS, JS do cliente, imagens) servidos de public/
app.use(express.static(path.join(__dirname, 'public')));

// GET /: o servidor monta o HTML a partir do template e responde
app.get('/', (req, res) => {
  res.render('index');
});

// Render define PORT; localmente cai para 3000. 0.0.0.0 aceita conexões externas.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
