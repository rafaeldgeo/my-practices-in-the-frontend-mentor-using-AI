// Regras de validação do formulário, versão do NAVEGADOR.
//
// ESPELHO de /validacao.js (servidor). O servidor é a autoridade: este módulo só dá feedback
// rápido de UX e pode ser desligado ou burlado. Não dá para importar validacao.js aqui (é
// CommonJS, roda só no Node), então regras e mensagens são repetidas de propósito.
// QUALQUER mudança em validacao.js deve ser refletida neste arquivo.
//
// São funções puras: recebem o valor digitado e devolvem a mensagem do primeiro problema
// ou null se o campo está ok. Sem acesso ao DOM, o que as torna testáveis no Node.

const CALLSIGN_MIN = 3;
const CALLSIGN_MAX = 20;
const SENHA_MIN = 8;
const EMAIL_MAX = 254;
const CALLSIGN_VALIDO = /^[A-Za-z0-9_-]+$/;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MENSAGENS = {
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

// Callsign e email levam trim (espaço nas pontas é digitação acidental, como no servidor).
export const validarCallsign = (valor) => {
  const callsign = valor.trim();
  if (callsign === '') return MENSAGENS.callsignVazio;
  if (callsign.length < CALLSIGN_MIN) return MENSAGENS.callsignCurto;
  if (callsign.length > CALLSIGN_MAX) return MENSAGENS.callsignLongo;
  if (!CALLSIGN_VALIDO.test(callsign)) return MENSAGENS.callsignInvalido;
  return null;
};

export const validarEmail = (valor) => {
  const email = valor.trim();
  if (email === '') return MENSAGENS.emailVazio;
  if (email.length > EMAIL_MAX || !EMAIL_VALIDO.test(email)) return MENSAGENS.emailInvalido;
  return null;
};

// Senha e confirmação NÃO levam trim: espaço pode fazer parte da senha.
export const validarSenha = (senha) => {
  if (senha === '') return MENSAGENS.senhaVazia;
  if (senha.length < SENHA_MIN) return MENSAGENS.senhaCurta;
  return null;
};

export const validarConfirmacao = (confirmacao, senha) => {
  if (confirmacao === '') return MENSAGENS.confirmacaoVazia;
  if (confirmacao !== senha) return MENSAGENS.confirmacaoDiferente;
  return null;
};

export const validarTermos = (marcado) => (marcado ? null : MENSAGENS.termos);
