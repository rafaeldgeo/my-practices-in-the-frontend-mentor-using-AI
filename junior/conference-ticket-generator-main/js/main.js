import { initAvatarUpload } from './avatar-upload.js';
import { initFormValidation } from './form-validation.js';
import { initTicket } from './ticket.js';

const avatar = initAvatarUpload();
const ticket = initTicket();

initFormValidation({
  form: document.querySelector('.form'),
  avatar,
  onValid: ticket.show,
});
