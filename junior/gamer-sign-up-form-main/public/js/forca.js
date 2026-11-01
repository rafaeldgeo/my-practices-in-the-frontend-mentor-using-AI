// Força da senha (só AVISO: nunca bloqueia o envio). ESPELHO de calcularForca em /readout.js
// (servidor); mudanças lá devem ser repetidas aqui. Função pura, sem DOM.
//   vazia      -> nível 0 (sem rótulo)
//   menos de 8 -> nível 1 (Weak)
//   8 ou mais  -> um ponto para cada: 8+, 12+, maiúscula e minúscula, número, símbolo
//                 (máximo 4: Weak / Fair / Good / Strong)

const ROTULOS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export const calcularForca = (senha) => {
  if (senha === '') return { nivel: 0, rotulo: ROTULOS[0] };
  if (senha.length < 8) return { nivel: 1, rotulo: ROTULOS[1] };

  const pontos = [
    true, // 8+ (garantido pelo if acima)
    senha.length >= 12,
    /[a-z]/.test(senha) && /[A-Z]/.test(senha),
    /\d/.test(senha),
    /[^A-Za-z0-9]/.test(senha),
  ].filter(Boolean).length;

  const nivel = Math.min(4, pontos);
  return { nivel, rotulo: ROTULOS[nivel] };
};
