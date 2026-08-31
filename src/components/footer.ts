const footer = document.querySelector("footer");
const baseURL = import.meta.env.BASE_URL;

export function renderFooter() {
  if (!footer) {
    throw new Error("Footer element not found");
  }

  footer.innerHTML = `
    <div class="flex flex-col gap-6 xl:col-span-2 xl:h-full xl:justify-between">
      <nav class="flex flex-col">
        <a href="${baseURL}listings/index.html">Auctions</a>
        <a href="${baseURL}login/index.html">Log in</a>
        <a href="${baseURL}register/index.html">Register</a>
        <a href="#">Terms</a>
      </nav>

      <div class="flex flex-col">
        <a href="#">Newsletter</a>
        <a href="#">Instagram</a>
      </div>
    </div>

    <div class="xl:col-span-2">
      <p>Questions:</p>
      <p>hello@lot410.no</p>
    </div>

    <div class="xl:col-span-2">
      <p>Listings:</p>
      <p>listings@lot410.no</p>
    </div>

    <div
      class="xl:col-start-9 xl:col-span-4 xl:flex xl:h-full xl:flex-col xl:justify-between"
    >
      <p>
        LOT410 is a student-only auction platform for things worth passing on.
        List what you no longer need, bid on what you want, and let the highest
        bid take it.
      </p>

      <p>© 2026 LOT410. All rights reserved.</p>
    </div>
  `;
}
