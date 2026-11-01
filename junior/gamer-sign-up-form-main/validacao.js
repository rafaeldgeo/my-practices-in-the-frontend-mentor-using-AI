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

// Os dados vêm de req.body e podem ser qualquer coisa: o campo pode faltar, ou chegar como
// array (callsign=a&callsign=b) ou objeto. Só um string é aceito; o resto vira '' (vazio),
// o que evita TypeError ao chamar .trim() ou .length e cai na mensagem "Enter ...".
const texto = (valor) => (typeof valor === 'string' ? valor : '');

// Cada função devolve a mensagem do primeiro problema encontrado, ou null se o campo está ok.
// A ordem dos if importa: vazio -> curto -> longo -> caractere inválido.

const validarCallsign = (callsign) => {
  if (callsign === '') return 'Enter a callsign';
  if (callsign.length < CALLSIGN_MIN) return 'Use at least 3 characters';
  if (callsign.length > CALLSIGN_MAX) return 'Use 20 characters or fewer';
  if (!CALLSIGN_VALIDO.test(callsign)) return 'Use letters, numbers, _ or - only';
  return null;
};

const validarEmail = (email) => {
  if (email === '') return 'Enter your email';
  if (email.length > EMAIL_MAX || !EMAIL_VALIDO.test(email)) {
    return 'Enter a valid email, like you@example.com';
  }
  return null;
};

const validarSenha = (senha) => {
  if (senha === '') return 'Enter a password';
  if (senha.length < SENHA_MIN) return 'Use at least 8 characters';
  return null;
};

const validarConfirmacao = (confirmacao, senha) => {
  if (confirmacao === '') return 'Confirm your password';
  if (confirmacao !== senha) return "Passwords don't match";
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
    terms: terms ? null : 'Accept the terms to continue',
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

module.exports = { validarFormulario };
