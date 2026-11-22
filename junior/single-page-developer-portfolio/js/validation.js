// Mensagens de erro exibidas no formulário
const EMPTY = "Can't be empty";
const INVALID_EMAIL = "Sorry, invalid format here";
// Algo@dominio.sufixo, sem espaços, um único "@" e sem pontos vazios no domínio
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

// Converte para texto e remove espaços das pontas; null/undefined viram ""
const normalize = (value) => (value ?? "").toString().trim();

// Validadores de campo: devolvem a mensagem de erro ou null quando válido
export const validateName = (value) => (normalize(value) === "" ? EMPTY : null);

export const validateMessage = (value) => (normalize(value) === "" ? EMPTY : null);

export const validateEmail = (value) => {
  const email = normalize(value);
  if (email === "") return EMPTY;
  return EMAIL_PATTERN.test(email) ? null : INVALID_EMAIL;
};

// Devolve só as chaves inválidas; objeto vazio significa formulário válido
export const validateForm = ({ name, email, message }) => {
  const results = {
    name: validateName(name),
    email: validateEmail(email),
    message: validateMessage(message),
  };
  return Object.fromEntries(Object.entries(results).filter(([, error]) => error !== null));
};
