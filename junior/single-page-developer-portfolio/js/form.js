import { validateForm } from "./validation.js";

// Referências do formulário, da área de sucesso e dos campos validados, na ordem de exibição
const form = document.querySelector(".form");
const success = form.querySelector('[role="status"]');
const FIELDS = ["name", "email", "message"];

// Acesso ao campo e ao elemento de erro pela chave (name) do campo
const getField = (key) => form.elements[key];
const getError = (key) => document.getElementById(`${key}-error`);

// Remove a mensagem, a marcação de erro e a associação do campo com ela
const clearError = (key) => {
  const field = getField(key);
  const error = getError(key);
  error.textContent = "";
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  field.closest(".form__field").classList.remove("form__field--invalid");
};

// Mostra a mensagem, marca o campo como inválido e o associa ao erro para leitores de tela
const showError = (key, message) => {
  const field = getField(key);
  getError(key).textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", `${key}-error`);
  field.closest(".form__field").classList.add("form__field--invalid");
};

// Envio: valida tudo, foca o primeiro campo inválido ou, se válido, limpa e exibe o sucesso
form.addEventListener("submit", (event) => {
  event.preventDefault();
  success.textContent = "";
  FIELDS.forEach(clearError);

  const values = Object.fromEntries(FIELDS.map((key) => [key, getField(key).value]));
  const errors = validateForm(values);
  const invalidKeys = FIELDS.filter((key) => key in errors);

  if (invalidKeys.length > 0) {
    invalidKeys.forEach((key) => showError(key, errors[key]));
    getField(invalidKeys[0]).focus();
    return;
  }

  form.reset();
  success.textContent = "Thanks for getting in touch! I'll get back to you soon.";
});

// Corrigir um campo limpa só o erro dele e o sucesso, sem revalidar
form.addEventListener("input", (event) => {
  const key = event.target.name;
  if (FIELDS.includes(key)) clearError(key);
  success.textContent = "";
});
