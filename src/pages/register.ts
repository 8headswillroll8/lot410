import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { showAlert } from "../components/alert";
import { register } from "../api/auth";

renderHeader();
setupMobileMenu();

const baseURL = import.meta.env.BASE_URL;

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

const registerAlert = document.querySelector<HTMLElement>("#register-alert");

if (
  !registerForm ||
  !registerUsername ||
  !registerEmail ||
  !registerPassword ||
  !registerConfirmPassword ||
  !registerAlert
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
    showAlert(registerAlert, "error", "Your username is missing");

    return;
  }

  if (username.length < 3) {
    showAlert(registerAlert, "error", "Give us at least 3 characters");

    return;
  }

  if (!validUsername) {
    showAlert(registerAlert, "error", "Letters, numbers and underscores only");

    return;
  }

  if (username.length > 20) {
    showAlert(registerAlert, "error", "Easy there, 20 characters max");

    return;
  }

  if (email === "") {
    showAlert(registerAlert, "error", "We need your student email");

    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    showAlert(
      registerAlert,
      "error",
      "That doesn't look like a Noroff student email",
    );

    return;
  }

  if (password === "") {
    showAlert(registerAlert, "error", "Your password is missing");

    return;
  }

  if (password.length < 8) {
    showAlert(registerAlert, "error", "Give us at least 8 characters");

    return;
  }

  if (password !== confirmPassword) {
    showAlert(registerAlert, "error", "Those passwords are not twins");

    return;
  }

  try {
    await register(username, email, password);

    showAlert(registerAlert, "success", "You're in. Off to login.");

    setTimeout(() => {
      window.location.href = `${baseURL}login/index.html`;
    }, 1500);
  } catch {
    showAlert(registerAlert, "error", "Something went wrong. Try again.");
  }
});
