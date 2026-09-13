import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { showAlert } from "../components/alert";
import { login } from "../api/auth";

renderHeader();
setupMobileMenu();

const baseURL = import.meta.env.BASE_URL;

const loginForm = document.querySelector<HTMLFormElement>("#login-form");

const loginEmail = document.querySelector<HTMLInputElement>("#login-email");

const loginPassword =
  document.querySelector<HTMLInputElement>("#login-password");

const loginAlert = document.querySelector<HTMLElement>("#login-alert");

if (!loginForm || !loginEmail || !loginPassword || !loginAlert) {
  throw new Error("Login form elements not found");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  if (email === "") {
    showAlert(loginAlert, "error", "We need your student email");
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    showAlert(
      loginAlert,
      "error",
      "That doesn't look like a Noroff student email",
    );
    return;
  }

  if (password === "") {
    showAlert(loginAlert, "error", "Your password is missing");
    return;
  }

  try {
    const data = await login(email, password);

    const accessToken = data.data.accessToken;
    const name = data.data.name;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("name", name);

    showAlert(loginAlert, "success", "Welcome. Let the bidding begin.");

    setTimeout(() => {
      window.location.href = `${baseURL}listings/index.html`;
    }, 1500);
  } catch {
    showAlert(loginAlert, "error", "Nope. Email or password isn't right.");
  }
});
