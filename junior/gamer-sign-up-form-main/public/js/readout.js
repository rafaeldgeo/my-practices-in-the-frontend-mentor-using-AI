// Readout "Operator ID" da coluna da marca, versão do NAVEGADOR (só UX, nunca envia nada).
// Espelha montarReadout e CODIGOS_FALHA de /readout.js (servidor).
//
// Estado inicial: vem do HTML que o servidor já renderizou (linhas .readout__row[data-field]).
// Assim, depois de um POST inválido, o readout do cliente começa igual ao do servidor, e só a
// linha do campo que o usuário validar muda. Nada é recalculado do zero.

import { MENSAGENS } from './regras.js';

// Mensagem de erro -> código curto mostrado na linha (igual a CODIGOS_FALHA do servidor)
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

const readout = document.querySelector('.readout');
const contagem = readout?.querySelector('.readout__count');
const callsign = readout?.querySelector('.readout__callsign');
const linhas = readout ? readout.querySelectorAll('.readout__row') : [];
const TOTAL = linhas.length;

const linhaDe = (nome) => readout?.querySelector(`.readout__row[data-field="${nome}"]`);

const trocarEstado = (linha, estado) => {
  linha.classList.remove('readout__row--pending', 'readout__row--ok', 'readout__row--error');
  linha.classList.add(`readout__row--${estado}`);
};

// Chamada por validacao.js sempre que o resultado de um campo muda.
//   erro: mensagem da regra, ou null se o campo está válido.
export const atualizarReadout = (nome, erro) => {
  const linha = linhaDe(nome);
  if (!linha) return;

  trocarEstado(linha, erro ? 'error' : 'ok');
  linha.querySelector('.readout__status').textContent = erro ? CODIGOS_FALHA[erro] : 'OK';

  // "N/5 ready": quantas linhas estão OK; lime quando todas estão
  const prontas = readout.querySelectorAll('.readout__row--ok').length;
  contagem.textContent = `${prontas}/${TOTAL} ready`;
  contagem.classList.toggle('readout__count--ready', prontas === TOTAL);

  // Callsign: "Unassigned" até a linha do callsign estar OK; depois mostra o valor (trim)
  if (nome === 'callsign') {
    const valor = document.getElementById('callsign')?.value.trim() ?? '';
    const atribuido = !erro && valor !== '';
    callsign.textContent = atribuido ? valor : 'Unassigned';
    callsign.classList.toggle('readout__callsign--unassigned', !atribuido);
  }
};
