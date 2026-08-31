const header = document.querySelector("header");
const baseURL = import.meta.env.BASE_URL;

export function renderHeader() {
  if (!header) {
    throw new Error("Header element not found");
  }

  header.innerHTML = `
    <!-- HEADER BAR -->
    <div class="mx-auto flex items-center justify-between px-6 py-6">
      <!-- Logo -->
      <a href="${baseURL}">
        <img
          class="w-18"
          src="${baseURL}src/assets/logo/lot410-logo.svg"
          alt="LOT410"
        />
      </a>

      <!-- MOBILE CONTROLS -->
      <div class="flex gap-6 md:hidden">
        <!-- Logged in -->
        <div
          id="mobile-user-summary"
          class="auth-logged-in hidden items-center gap-1"
        >
          <img class="w-4" src="${baseURL}src/assets/icons/coin-stack.svg" alt="" />
          <p>1,240</p>

          <a href="${baseURL}profile/index.html">
            <img
              class="aspect-square w-10 rounded-full object-cover"
              src="${baseURL}src/assets/images/profile-avatar.webp"
              alt=""
            />
          </a>
        </div>

        <!-- Menu button -->
        <button
          id="menu-button"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          <img class="w-6" src="${baseURL}src/assets/icons/hamburger-menu.svg" alt="" />
        </button>
      </div>

      <!-- DESKTOP NAVIGATION -->
      <nav class="hidden md:block">
        <ul class="flex items-center gap-30 text-brand">
          <li>
            <a href="${baseURL}listings/index.html">Auctions</a>
          </li>

          <!-- Logged in -->
          <li id="desktop-sell-link" class="auth-logged-in hidden">
            <a href="${baseURL}create-listing/index.html">Sell</a>
          </li>

          <li id="desktop-user-summary" class="auth-logged-in hidden">
            <div class="flex items-center gap-1">
              <img class="w-4" src="${baseURL}src/assets/icons/coin-stack.svg" alt="" />
              <p>1,240</p>

              <a href="${baseURL}profile/index.html">
                <img
                  class="aspect-square w-10 rounded-full object-cover"
                  src="${baseURL}src/assets/images/profile-avatar.webp"
                  alt=""
                />
              </a>
            </div>
          </li>

          <!-- Logged out -->
          <li id="desktop-login-link" class="auth-logged-out">
            <a href="${baseURL}login/index.html">Log in</a>
          </li>

          <li id="desktop-register-link" class="auth-logged-out">
            <a href="${baseURL}register/index.html">Register</a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- MOBILE MENU OVERLAY -->
    <nav
      id="mobile-menu"
      class="fixed inset-0 z-40 hidden bg-brand md:hidden"
      aria-label="Mobile navigation"
    >
      <div class="flex h-full flex-col p-6">
        <!-- Mobile menu header -->
        <div class="flex items-start justify-between">
          <!-- Logo -->
          <a href="${baseURL}">
            <img
              class="w-18"
              src="${baseURL}src/assets/logo/lot410-logo-white.svg"
              alt="LOT410"
            />
          </a>

          <!-- Close button -->
          <button type="button" id="close-button" aria-label="Close menu">
            <img class="w-6" src="${baseURL}src/assets/icons/x-white.svg" alt="" />
          </button>
        </div>

        <!-- Mobile navigation links -->
        <ul class="flex flex-1 flex-col justify-center text-white">
          <li>
            <a href="${baseURL}listings/index.html">Auctions</a>
          </li>

          <!-- Logged in -->
          <li id="mobile-sell-link" class="auth-logged-in hidden">
            <a href="${baseURL}create-listing/index.html">Sell</a>
          </li>

          <li id="mobile-profile-link" class="auth-logged-in hidden">
            <a href="${baseURL}profile/index.html">Profile</a>
          </li>

          <!-- Logged out -->
          <li id="mobile-login-link" class="auth-logged-out">
            <a href="${baseURL}login/index.html">Log in</a>
          </li>

          <li id="mobile-register-link" class="auth-logged-out">
            <a href="${baseURL}register/index.html">Register</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  const loggedIn = localStorage.getItem("accessToken");
  const loggedInElements = document.querySelectorAll(".auth-logged-in");
  const loggedOutElements = document.querySelectorAll(".auth-logged-out");
  const mobileUserSummary = document.querySelector("#mobile-user-summary");

  if (loggedIn) {
    loggedInElements.forEach((element) => {
      element.classList.remove("hidden");
    });

    mobileUserSummary?.classList.add("flex");

    loggedOutElements.forEach((element) => {
      element.classList.add("hidden");
    });
  }
}
