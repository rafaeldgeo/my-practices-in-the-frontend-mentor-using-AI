const SERIAL_DIGITS = 5;

// Random serial with zero-padding, e.g. #01609
const generateSerial = () => {
  const max = 10 ** SERIAL_DIGITS - 1;
  const value = Math.floor(Math.random() * max) + 1;
  return `#${String(value).padStart(SERIAL_DIGITS, '0')}`;
};

export const initTicket = () => {
  const formScreen = document.getElementById('form-screen');
  const ticketScreen = document.getElementById('ticket-screen');
  const title = document.getElementById('ticket-title');

  const show = ({ name, email, github, avatarUrl }) => {
    document.getElementById('ticket-name-title').textContent = name;
    document.getElementById('ticket-email').textContent = email;
    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-github').textContent = github;
    document.getElementById('ticket-serial').textContent = generateSerial();

    const avatar = document.getElementById('ticket-avatar');
    avatar.src = avatarUrl;
    avatar.alt = `Photo of ${name}`;

    formScreen.hidden = true;
    ticketScreen.hidden = false;
    // Moves keyboard and screen reader users to the new screen
    title.focus();
  };

  return { show };
};
