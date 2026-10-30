# Frontend Mentor - Gamer sign-up form

![Design preview for the Gamer sign-up form coding challenge](./preview.jpg)

## Welcome! 👋

Thanks for checking out this coding challenge.

[Frontend Mentor](https://www.frontendmentor.io) challenges help you improve your coding skills by building realistic projects.

**To do this challenge, you need a basic understanding of HTML, CSS and JavaScript.**

## The challenge

Build a sign-up form for NEONCORE, a competitive-gaming network, and get it looking as close to the design as possible.

Most of the work is in the form's states. Every field validates, the password field has a strength meter and a show/hide button, and the submit button has loading and success states. Building all of that so it works for keyboard and screen reader users is the real practice here.

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Your users should be able to:

- Fill in the form with a callsign, email, password, and password confirmation, and accept the terms
- Receive form validation messages if:
  - Any field is missed
  - The callsign is shorter than 3 characters, longer than 20, or uses anything other than letters, numbers, `_` or `-`
  - The email address is not formatted correctly
  - The password is shorter than 8 characters
  - The passwords don't match
  - The terms checkbox isn't ticked
- Show and hide each password with the eye button
- See a password strength meter update as they type
- See a loading state on the button while the form submits, then a success message
- Complete the form only using their keyboard
- Have inputs, hints, error messages, and the success message announced on their screen reader
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

The Operator ID readout beside the form on desktop is an optional extra. It mirrors what's happening in the form, so you can build it once the form itself works.

## How the form behaves

The designs show each state, but a still image can't show when one state turns into the next. Here's how the form should behave.

### When fields are checked

- A field is checked when it loses focus with something in it. Leaving a field that was never filled shows nothing.
- Once a field has been checked, it re-checks on every keystroke. An error clears as soon as it's fixed, and the check icon appears as soon as the value is valid.
- Before a field has been checked, its empty-field message only appears on submit.
- Trim the callsign before checking it, so a callsign of only spaces counts as empty.
- Typing in the password re-checks the confirm field, if that has already been checked.
- The terms error only appears on submit, and clears as soon as the checkbox changes.

### Password strength

- The meter updates from the first character as the user types. An empty field shows no segments and no label.
- A password under 8 characters is always Weak.
- From 8 characters, score one point each for: 8 or more characters, 12 or more characters, both uppercase and lowercase letters, a number, and a symbol. Cap the score at 4: 1 is Weak, 2 is Fair, 3 is Good, and 4 is Strong.
- For example, `neoncore` is Weak, `neoncore99` is Fair, `Neoncore99` is Good, and `Tr4nsm1t!Nexus` is Strong.
- Strength is advice only. The one password rule is 8 or more characters.

### Submitting

- On an invalid submit, check every field, move focus to the first invalid one, and announce how many fields need attention, for example "3 fields need attention".
- On a valid submit, hide any revealed passwords, lock the fields, and show `Transmitting_` on the button. There's no server for this challenge, so wait a moment before showing the success message.
- On success, the success message replaces the form in the same panel, and focus moves to the success heading.

