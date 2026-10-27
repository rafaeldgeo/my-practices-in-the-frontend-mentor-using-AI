const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "@" is mandatory; the username follows GitHub's rules: 1-39 characters,
// letters, digits and single hyphens, never starting or ending with a hyphen
const GITHUB_PATTERN = /^@(?=.{1,39}$)[a-z\d]+(?:-[a-z\d]+)*$/i;

const MESSAGES = {
  name: 'Please enter your full name.',
  emailRequired: 'Please enter your email address.',
  emailFormat: 'Please enter a valid email address.',
  githubRequired: 'Please enter your GitHub username.',
  githubFormat: 'Use @ followed by a valid GitHub username (e.g. @yourusername).',
  avatar: 'Please upload your photo.',
};

const validateName = (value) => (value ? null : MESSAGES.name);

const validateEmail = (value) => {
  if (!value) return MESSAGES.emailRequired;
  return EMAIL_PATTERN.test(value) ? null : MESSAGES.emailFormat;
};

const validateGithub = (value) => {
  if (!value) return MESSAGES.githubRequired;
  return GITHUB_PATTERN.test(value) ? null : MESSAGES.githubFormat;
};

export const initFormValidation = ({ form, avatar, onValid }) => {
  const fields = [
    { input: form.elements.name, validate: validateName },
    { input: form.elements.email, validate: validateEmail },
    { input: form.elements.github, validate: validateGithub },
  ].map((field) => ({
    ...field,
    error: document.getElementById(`${field.input.id}-error`),
  }));

  let submitted = false;

  const showError = ({ input, error }, message) => {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = ({ input, error }) => {
    error.textContent = '';
    error.hidden = true;
    input.removeAttribute('aria-invalid');
  };

  const checkField = (field) => {
    const message = field.validate(field.input.value.trim());
    if (message) showError(field, message);
    else clearError(field);
    return !message;
  };

  const checkAvatar = () => {
    if (avatar.getFile()) return true;
    avatar.showError(MESSAGES.avatar);
    return false;
  };

  fields.forEach((field) => {
    // Once a field was flagged, typing fixes it live; before that, stay quiet
    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true') checkField(field);
    });
    field.input.addEventListener('blur', () => {
      if (submitted) checkField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;

    const avatarOk = checkAvatar();
    const results = fields.map((field) => ({ field, valid: checkField(field) }));
    const firstInvalid = results.find(({ valid }) => !valid);

    if (!avatarOk) {
      avatar.focus();
      return;
    }
    if (firstInvalid) {
      firstInvalid.field.input.focus();
      return;
    }

    onValid({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      github: form.elements.github.value.trim(),
      avatarUrl: avatar.getPreviewUrl(),
    });
  });
};
