import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";

import { login } from "../api/auth";

setupMobileMenu();

const loginForm = document.querySelector<HTMLFormElement>("#login-form");
const loginEmail = document.querySelector<HTMLInputElement>("#login-email");
const loginPassword =
  document.querySelector<HTMLInputElement>("#login-password");
const loginAlert = document.querySelector<HTMLDivElement>("#login-alert");
const loginAlertText =
  document.querySelector<HTMLParagraphElement>("#login-alert-text");
const loginIcon = document.querySelector<HTMLImageElement>("#login-icon");

if (
  !loginForm ||
  !loginEmail ||
  !loginPassword ||
  !loginAlert ||
  !loginAlertText ||
  !loginIcon
) {
  throw new Error("Login form elements not found");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  if (email === "") {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "We need your student email";
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent =
      "That doesn't look like a Noroff student email";
    return;
  }

  if (password === "") {
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "Your password is missing";
    return;
  }

  try {
    const data = await login(email, password);

    const accessToken = data.data.accessToken;

    localStorage.setItem("accessToken", accessToken);

    loginIcon.src = "../src/assets/icons/smiley.svg";
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "Welcome. Let's start the bidding.";

    setTimeout(() => {
      window.location.href = "../listings/index.html";
    }, 1500);
  } catch {
    loginIcon.src = "../src/assets/icons/alert-circle.svg";
    loginAlert.classList.remove("hidden");
    loginAlert.classList.add("flex");
    loginAlertText.textContent = "";
  }
});
