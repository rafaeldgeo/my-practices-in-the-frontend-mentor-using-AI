// Botão de envio: "Transmitting_" enquanto o navegador envia o formulário.
// O envio continua sendo o POST NATIVO do <form>: aqui não há preventDefault no primeiro
// submit, nem fetch. O JS só mostra o estado de loading (CSS: .button[aria-busy='true']).

const form = document.querySelector('form.form');
const botao = form?.querySelector('button[type="submit"]');
const rotulo = botao?.querySelector('.button__label');

if (form && botao && rotulo) {
  const textoOriginal = rotulo.textContent;

  const ocupado = () => botao.getAttribute('aria-busy') === 'true';

  // Durante o envio os campos ficam SOMENTE LEITURA (visual dimmed do design). Nunca disabled:
  // um campo desabilitado não entra no corpo do POST e o servidor receberia o formulário vazio.
  const campos = form.querySelectorAll('.field__input');
  const travar = (travado) => {
    campos.forEach((campo) => { campo.readOnly = travado; });
    form.toggleAttribute('aria-busy', travado);
  };

  form.addEventListener('submit', (evento) => {
    // Segundo submit enquanto o primeiro está em andamento (duplo clique/Enter): cancela
    // só este, para não enviar o formulário duas vezes. O primeiro segue normalmente.
    if (ocupado()) {
      evento.preventDefault();
      return;
    }
    // Senhas reveladas voltam a ficar ocultas ANTES do envio. O valor não muda (só o type), então
    // o POST leva a mesma senha. Reaproveita o clique do olho (senha.js): mesmo type, aria-pressed
    // e ícone, sem duplicar a lógica. Motivos: a senha não fica legível na tela durante
    // "Transmitting_" (ombro, gravação de tela, captura) nem na página restaurada ao voltar
    // pelo histórico, e o gerenciador de senhas do navegador reconhece o campo type=password
    // no envio (com type=text ele pode não oferecer salvar a credencial).
    form.querySelectorAll('.field__reveal[aria-pressed="true"]').forEach((olho) => olho.click());

    botao.setAttribute('aria-busy', 'true');
    rotulo.textContent = 'Transmitting_';
    travar(true);
  });

  // Voltar pelo histórico pode restaurar a página (bfcache) com o botão ainda ocupado
  window.addEventListener('pageshow', (evento) => {
    if (!evento.persisted) return;
    botao.removeAttribute('aria-busy');
    rotulo.textContent = textoOriginal;
    travar(false);
  });
}
