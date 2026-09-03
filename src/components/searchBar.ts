const searchBarEl = document.querySelector<HTMLDivElement>("#search-bar");
const baseURL = import.meta.env.BASE_URL;

export function renderSearchBar() {
  if (!searchBarEl) {
    throw new Error("Search bar element not found");
  }

  searchBarEl.innerHTML = `
    <form
      id="search-form"
      class="flex items-center mx-auto mb-8 gap-3 border-b-2 pb-2  max-w-100 border-brand lg:mb-12"
    >
      <img class="w-6" src="${baseURL}src/assets/icons/search.svg" alt="" />
      <label for="listings-search" class="sr-only">Search</label>
      <input
        class="flex-1 bg-transparent outline-none placeholder:text-brand"
        type="search"
        id="listings-search"
        name="listings-search"
        placeholder="Search"
      />
      <button type="submit" aria-label="Search">
        <img
          class="w-6"
          src="${baseURL}src/assets/icons/arrow-right.svg"
          alt=""
        />
      </button>
    </form>
  `;
}
