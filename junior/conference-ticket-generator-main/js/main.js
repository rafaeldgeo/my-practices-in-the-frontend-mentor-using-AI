import { initAvatarUpload } from './avatar-upload.js';
import { initFormValidation } from './form-validation.js';

const avatar = initAvatarUpload();

initFormValidation({
  form: document.querySelector('.form'),
  avatar,
  // Ticket generation is wired here in issue #11
  onValid: () => {},
});
