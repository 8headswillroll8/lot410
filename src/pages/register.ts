import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu.ts";
import { register } from "../api/auth.ts";

setupMobileMenu();

const registerForm = document.querySelector<HTMLFormElement>("#register-form");
const registerUsername =
  document.querySelector<HTMLInputElement>("#register-username");
const registerEmail =
  document.querySelector<HTMLInputElement>("#register-email");
const registerPassword =
  document.querySelector<HTMLInputElement>("#register-password");
const registerConfirmPassword = document.querySelector<HTMLInputElement>(
  "#register-confirm-password",
);
const registerAlert = document.querySelector<HTMLDivElement>("#register-alert");
const registerAlertText = document.querySelector<HTMLParagraphElement>(
  "#register-alert-text",
);
const registerIcon = document.querySelector<HTMLImageElement>("#register-icon");

if (
  !registerForm ||
  !registerUsername ||
  !registerEmail ||
  !registerPassword ||
  !registerConfirmPassword ||
  !registerAlert ||
  !registerAlertText ||
  !registerIcon
) {
  throw new Error("Register form elements not found");
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = registerUsername.value.trim().toLowerCase();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value.trim();
  const confirmPassword = registerConfirmPassword.value.trim();
  const validUsername = /^[a-zA-Z0-9_]+$/.test(username);

  if (username === "") {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Your username is missing";
    return;
  }

  if (username.length < 3) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Give us at least 3 characters";
    return;
  }

  if (!validUsername) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Letters, numbers and underscores only";
    return;
  }

  if (username.length > 20) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Easy there, 20 characters max";
    return;
  }

  if (email === "") {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "We need your student email";
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent =
      "That doesn't look like a Noroff student email";
    return;
  }

  if (password === "") {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Your password is missing";
    return;
  }

  if (password.length < 8) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Give us at least 8 characters";
    return;
  }

  if (password !== confirmPassword) {
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Those passwords are not twins";
    return;
  }

  try {
    await register(username, email, password);
    registerIcon.src = "../src/assets/icons/smiley.svg";
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "You're in. Off to login.";

    setTimeout(() => {
      window.location.href = "../login/";
    }, 1500);
  } catch {
    registerIcon.src = "../src/assets/icons/alert-circle.svg";
    registerAlert.classList.remove("hidden");
    registerAlert.classList.add("flex");
    registerAlertText.textContent = "Something went wrong. Try again.";
  }
});
