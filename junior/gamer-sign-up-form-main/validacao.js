// Validação do formulário de cadastro.
//
// validarFormulario é uma função PURA: só olha o argumento `dados` e devolve um resultado novo.
// Não conhece req/res, não lê nem grava nada fora dela e não faz log. Por isso:
//   - dá para testá-la chamando direto no Node, sem subir o servidor;
//   - dá para reaproveitá-la depois (ex.: com fetch), como pede o CLAUDE.md;
//   - a senha nunca vaza para um log ou para a resposta por descuido.
//
// O servidor é a AUTORIDADE da validação: o JS do navegador (issues #11/#12) só espelha estas
// regras para dar feedback rápido, mas pode ser desligado ou burlado.

const CALLSIGN_MIN = 3;
const CALLSIGN_MAX = 20;
const SENHA_MIN = 8;
const EMAIL_MAX = 254; // limite prático de um endereço de email (RFC 5321)

// Letras, números, _ ou - (sem espaços nem acentos)
const CALLSIGN_VALIDO = /^[A-Za-z0-9_-]+$/;

// Formato pragmático: algo@algo.algo, sem espaços. Cobrir a RFC inteira seria enorme e ainda
// assim não prova que o endereço existe; quem prova isso é um email de confirmação.
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mensagens exatas do design (index.html). Ficam num só lugar para que o readout (readout.js)
// possa associar cada mensagem ao seu código de falha sem repetir os textos.
const MENSAGENS = {
  callsignVazio: 'Enter a callsign',
  callsignCurto: 'Use at least 3 characters',
  callsignLongo: 'Use 20 characters or fewer',
  callsignInvalido: 'Use letters, numbers, _ or - only',
  emailVazio: 'Enter your email',
  emailInvalido: 'Enter a valid email, like you@example.com',
  senhaVazia: 'Enter a password',
  senhaCurta: 'Use at least 8 characters',
  confirmacaoVazia: 'Confirm your password',
  confirmacaoDiferente: "Passwords don't match",
  termos: 'Accept the terms to continue',
};

// Os dados vêm de req.body e podem ser qualquer coisa: o campo pode faltar, ou chegar como
// array (callsign=a&callsign=b) ou objeto. Só um string é aceito; o resto vira '' (vazio),
// o que evita TypeError ao chamar .trim() ou .length e cai na mensagem "Enter ...".
const texto = (valor) => (typeof valor === 'string' ? valor : '');

// Cada função devolve a mensagem do primeiro problema encontrado, ou null se o campo está ok.
// A ordem dos if importa: vazio -> curto -> longo -> caractere inválido.

const validarCallsign = (callsign) => {
  if (callsign === '') return MENSAGENS.callsignVazio;
  if (callsign.length < CALLSIGN_MIN) return MENSAGENS.callsignCurto;
  if (callsign.length > CALLSIGN_MAX) return MENSAGENS.callsignLongo;
  if (!CALLSIGN_VALIDO.test(callsign)) return MENSAGENS.callsignInvalido;
  return null;
};

const validarEmail = (email) => {
  if (email === '') return MENSAGENS.emailVazio;
  if (email.length > EMAIL_MAX || !EMAIL_VALIDO.test(email)) {
    return MENSAGENS.emailInvalido;
  }
  return null;
};

const validarSenha = (senha) => {
  if (senha === '') return MENSAGENS.senhaVazia;
  if (senha.length < SENHA_MIN) return MENSAGENS.senhaCurta;
  return null;
};

const validarConfirmacao = (confirmacao, senha) => {
  if (confirmacao === '') return MENSAGENS.confirmacaoVazia;
  if (confirmacao !== senha) return MENSAGENS.confirmacaoDiferente;
  return null;
};

const validarFormulario = (dados) => {
  const entrada = dados && typeof dados === 'object' ? dados : {};

  // Callsign e email: trim (espaços nas pontas são digitação acidental).
  // Senha e confirmação NÃO levam trim: espaço pode fazer parte de uma senha.
  const callsign = texto(entrada.callsign).trim();
  const email = texto(entrada.email).trim();
  const senha = texto(entrada.password);
  const confirmacao = texto(entrada.confirm);

  // Um checkbox só é enviado pelo navegador quando está marcado (com o value do HTML, "on").
  const terms = entrada.terms === 'on';

  const resultados = {
    callsign: validarCallsign(callsign),
    email: validarEmail(email),
    password: validarSenha(senha),
    confirm: validarConfirmacao(confirmacao, senha),
    terms: terms ? null : MENSAGENS.termos,
  };

  // erros: só os campos que falharam ({} quando está tudo certo)
  const erros = Object.fromEntries(
    Object.entries(resultados).filter(([, mensagem]) => mensagem !== null)
  );

  return {
    ok: Object.keys(erros).length === 0,
    erros,
    // Só o que pode voltar ao HTML. A senha e a confirmação NÃO entram aqui: assim é
    // impossível devolvê-las ao navegador por engano ao re-renderizar o formulário.
    valores: { callsign, email, terms },
  };
};

module.exports = { validarFormulario, MENSAGENS };
