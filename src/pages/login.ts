import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";

setupMobileMenu();

const loginForm = document.querySelector<HTMLFormElement>("#login-form");
const loginEmail = document.querySelector<HTMLInputElement>("#login-email");
const loginPassword =
  document.querySelector<HTMLInputElement>("#login-password");
const loginAlert = document.querySelector<HTMLDivElement>("#login-alert");
const loginAlertText =
  document.querySelector<HTMLParagraphElement>("#login-alert-text");

if (
  !loginForm ||
  !loginEmail ||
  !loginPassword ||
  !loginAlert ||
  !loginAlertText
) {
  throw new Error("Login form elements not found");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  if (email === "") {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "You have to put in an email";
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "You'll need a noroff student email for this";
    return;
  }

  if (password === "") {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "You have to put in a password";
    return;
  }

  console.log("ready to log in");
});
