type AlertType = "error" | "success" | "info";

export function showAlert(
  element: HTMLElement,
  type: AlertType,
  message: string,
) {
  const icons = {
    error: "assets/icons/awkward.svg",
    success: "assets/icons/check.svg",
    info: "assets/icons/info.svg",
  };

  const icon = icons[type];

  element.innerHTML = `
    <img
      class="mt-1 w-7 md:mt-2"
      src="${icon}"
      alt=""
    />

    <p>${message}</p>
  `;

  element.classList.remove("hidden");
  element.classList.add("flex", "items-start", "gap-2");
}
