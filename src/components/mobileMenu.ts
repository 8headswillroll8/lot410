export function setupMobileMenu() {
  const menuButton = document.getElementById("menu-button");
  const closeButton = document.getElementById("close-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      mobileMenu?.classList.remove("hidden");
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      mobileMenu?.classList.add("hidden");
    });
  }
}
