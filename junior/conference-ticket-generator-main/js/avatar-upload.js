const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 500 * 1024;

const ERRORS = {
  type: 'File type not supported. Please upload a JPG or PNG photo.',
  size: 'File too large. Please upload a photo under 500KB.',
};

const validate = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) return ERRORS.type;
  if (file.size > MAX_SIZE) return ERRORS.size;
  return null;
};

export const initAvatarUpload = () => {
  const dropzone = document.querySelector('.dropzone');
  const input = dropzone.querySelector('.dropzone__input');
  const preview = dropzone.querySelector('.dropzone__preview');
  const image = dropzone.querySelector('.dropzone__image');
  const removeButton = dropzone.querySelector('.dropzone__action--remove');
  const changeButton = dropzone.querySelector('.dropzone__action--change');
  const hint = document.getElementById('avatar-hint');
  const error = document.getElementById('avatar-error');

  let currentFile = null;
  let previewUrl = null;

  // Keeps the real input (read by the form) in step with the accepted file
  const syncInput = (file) => {
    if (!file) {
      input.value = '';
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
  };

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
    hint.hidden = true;
    dropzone.classList.add('dropzone--error');
    input.setAttribute('aria-invalid', 'true');
    // Hidden elements still feed aria-describedby, so point only at the visible one
    input.setAttribute('aria-describedby', 'avatar-error');
  };

  const clearError = () => {
    error.textContent = '';
    error.hidden = true;
    hint.hidden = false;
    dropzone.classList.remove('dropzone--error');
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', 'avatar-hint');
  };

  const revokePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  };

  const setFile = (file) => {
    const message = validate(file);

    // A rejected file never replaces the avatar already chosen
    if (message) {
      syncInput(currentFile);
      showError(message);
      return;
    }

    revokePreview();
    currentFile = file;
    previewUrl = URL.createObjectURL(file);
    image.src = previewUrl;
    preview.hidden = false;
    dropzone.classList.add('dropzone--filled');
    syncInput(file);
    clearError();
  };

  const reset = () => {
    revokePreview();
    currentFile = null;
    image.removeAttribute('src');
    preview.hidden = true;
    dropzone.classList.remove('dropzone--filled');
    syncInput(null);
    clearError();
  };

  input.addEventListener('change', () => {
    const [file] = input.files;
    if (file) setFile(file);
  });

  changeButton.addEventListener('click', () => input.click());
  removeButton.addEventListener('click', () => {
    reset();
    input.focus();
  });

  // Dragging a file from the desktop onto the dropzone
  ['dragenter', 'dragover'].forEach((type) => {
    dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      dropzone.classList.add('dropzone--dragover');
    });
  });

  dropzone.addEventListener('dragleave', (event) => {
    if (!dropzone.contains(event.relatedTarget)) {
      dropzone.classList.remove('dropzone--dragover');
    }
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('dropzone--dragover');
    const [file] = event.dataTransfer.files;
    if (file) setFile(file);
  });

  // A file dropped outside the dropzone must not navigate away from the page
  ['dragover', 'drop'].forEach((type) => {
    window.addEventListener(type, (event) => event.preventDefault());
  });

  return {
    getFile: () => currentFile,
    getPreviewUrl: () => previewUrl,
    showError,
    focus: () => input.focus(),
    reset,
  };
};
