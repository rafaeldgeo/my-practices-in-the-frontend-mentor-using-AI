// UI da senha: medidor de força e botões de mostrar/ocultar. Só muda atributos e texto da
// página; nunca envia nada. O CSS já desenha tudo a partir de data-level e aria-pressed.

import { calcularForca } from './forca.js';

const senha = document.querySelector('#password');
const medidor = document.querySelector('.strength');
const rotulo = document.querySelector('#password-strength');

// Medidor: a cada tecla recalcula o nível (0 a 4) e escreve nos dois elementos que o CSS lê.
if (senha && medidor && rotulo) {
  senha.addEventListener('input', () => {
    const { nivel, rotulo: texto } = calcularForca(senha.value);
    medidor.dataset.level = nivel;
    rotulo.dataset.level = nivel;
    // O rótulo é uma região aria-live: só é reescrito quando muda (não a cada tecla)
    if (rotulo.textContent !== texto) rotulo.textContent = texto;
  });
}

// Mostrar/ocultar: o botão aponta o input por aria-controls. Trocar type password <-> text
// não altera o valor digitado nem tira o foco do botão.
document.querySelectorAll('.field__reveal').forEach((botao) => {
  const campo = document.getElementById(botao.getAttribute('aria-controls'));
  const icone = botao.querySelector('.field__reveal-icon');
  if (!campo) return;

  // O nome do botão NÃO muda ("Show password"): quem informa o estado é aria-pressed. Mudar o
  // nome e o aria-pressed ao mesmo tempo faria o leitor de tela dizer "Hide password, pressed".
  botao.addEventListener('click', () => {
    const visivel = campo.type === 'password';
    campo.type = visivel ? 'text' : 'password';
    botao.setAttribute('aria-pressed', String(visivel));
    if (icone) icone.src = `/assets/images/icon-eye${visivel ? '-off' : ''}.svg`;
  });
});
