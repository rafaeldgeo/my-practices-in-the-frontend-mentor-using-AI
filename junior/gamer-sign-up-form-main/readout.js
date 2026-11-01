// Cálculos de apresentação que dependem do resultado da validação: força da senha e readout
// "Operator ID". São funções PURAS (como validacao.js): recebem dados e devolvem dados.
// A validação decide se o envio passa; aqui só se calcula o que a tela mostra.

const { MENSAGENS } = require('./validacao');

const ROTULOS_FORCA = ['', 'Weak', 'Fair', 'Good', 'Strong'];

// Força da senha. É só um AVISO: nunca bloqueia o envio (quem bloqueia é validarFormulario).
//   vazia        -> nível 0 (sem rótulo)
//   menos de 8   -> nível 1 (Weak)
//   8 ou mais    -> um ponto para cada: 8+, 12+, maiúscula e minúscula, número, símbolo
//                   (máximo 4: Weak / Fair / Good / Strong)
const calcularForca = (senha) => {
  const texto = typeof senha === 'string' ? senha : '';
  if (texto === '') return { nivel: 0, rotulo: ROTULOS_FORCA[0] };
  if (texto.length < 8) return { nivel: 1, rotulo: ROTULOS_FORCA[1] };

  const pontos = [
    true, // 8+ (já garantido pelo if acima)
    texto.length >= 12,
    /[a-z]/.test(texto) && /[A-Z]/.test(texto),
    /\d/.test(texto),
    /[^A-Za-z0-9]/.test(texto),
  ].filter(Boolean).length;

  const nivel = Math.min(4, pontos);
  return { nivel, rotulo: ROTULOS_FORCA[nivel] };
};

// Código curto de falha mostrado na linha do readout, um por mensagem de erro.
const CODIGOS_FALHA = {
  [MENSAGENS.callsignVazio]: 'Missing',
  [MENSAGENS.callsignCurto]: 'Too short',
  [MENSAGENS.callsignLongo]: 'Too long',
  [MENSAGENS.callsignInvalido]: 'Bad character',
  [MENSAGENS.emailVazio]: 'Missing',
  [MENSAGENS.emailInvalido]: 'Malformed',
  [MENSAGENS.senhaVazia]: 'Missing',
  [MENSAGENS.senhaCurta]: 'Too short',
  [MENSAGENS.confirmacaoVazia]: 'Missing',
  [MENSAGENS.confirmacaoDiferente]: 'Mismatch',
  [MENSAGENS.termos]: 'Required',
};

const LINHAS = [
  { id: 'callsign', rotulo: 'Callsign' },
  { id: 'email', rotulo: 'Email' },
  { id: 'password', rotulo: 'Password' },
  { id: 'confirm', rotulo: 'Confirm' },
  { id: 'terms', rotulo: 'Terms' },
];

// Monta o objeto que views/partials/readout.ejs espera, a partir do resultado de
// validarFormulario. Depois de um envio, cada linha está OK ou com o código da falha.
const montarReadout = ({ erros, valores }) => {
  const linhas = LINHAS.map(({ id, rotulo }) => {
    const mensagem = erros[id];
    return {
      id,
      rotulo,
      status: mensagem ? CODIGOS_FALHA[mensagem] : 'OK',
      erro: Boolean(mensagem),
    };
  });

  return {
    pronto: linhas.filter((linha) => !linha.erro).length,
    // "Unassigned" até o callsign ser válido
    callsign: erros.callsign ? null : valores.callsign,
    provisionado: false,
    linhas,
  };
};

module.exports = { calcularForca, montarReadout, CODIGOS_FALHA };
