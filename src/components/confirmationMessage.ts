const main = document.querySelector("main");

export function renderConfirmationMessage(question: string, message: string) {
  if (!main) {
    throw new Error("Main element not found");
  }

  main.insertAdjacentHTML(
    "beforeend",
    `
      <div
        id="confirmation-message"
        class="fixed inset-0 flex items-center justify-center"
      >
        <div class="bg-brand px-6 py-8 text-center">
          <p id="confirmation-question" class="text-white">${question}</p>
          <p id="confirmation-text" class="text-white">${message}</p>
          <div class="mt-4">
            <button
              id="no-btn"
              class="rounded-full border-2 px-7 text-white"
              type="button"
            >
              No
            </button>
            <button
              id="yes-btn"
              class="rounded-full border-2 px-7 text-white"
              type="button"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    `,
  );
}
