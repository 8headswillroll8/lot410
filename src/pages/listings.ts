import "../style.css";
import { getListings, getSearchResults } from "../api/listings";
import { renderFooter } from "../components/footer";
import { renderHeader } from "../components/header";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderSearchBar } from "../components/searchBar";
import type { Listing } from "../types/listings";

renderFooter();
renderHeader();
renderSearchBar();
setupMobileMenu();

const gridEl = document.querySelector("#listings-grid");
const searchForm = document.querySelector<HTMLFormElement>("#search-form");
const searchInput =
  document.querySelector<HTMLInputElement>("#listings-search");
const alertElQuery = document.querySelector<HTMLDivElement>("#listings-alert");
const alertTextElQuery = document.querySelector<HTMLParagraphElement>(
  "#listings-alert-text",
);
const controlButtons =
  document.querySelectorAll<HTMLButtonElement>(".listing-control");

const baseURL = import.meta.env.BASE_URL;
let currentListings: Listing[] = [];

if (!gridEl) {
  throw new Error("Listings element not found");
}

if (!alertElQuery || !alertTextElQuery) {
  throw new Error("Alert element not found");
}

const alertEl = alertElQuery;
const alertTextEl = alertTextElQuery;
const grid = gridEl;

if (!searchForm || !searchInput) {
  throw new Error("Search form elements not found");
}

async function loadListings(page: number) {
  const data = await getListings(page);

  currentListings = data.data;

  renderListings(currentListings);
}

function renderListings(listings: Listing[]) {
  grid.innerHTML = "";

  if (listings.length === 0) {
    alertEl.classList.remove("hidden");
    alertEl.classList.add("flex");
    alertTextEl.textContent =
      "Not a single lot in sight. Try searching for something else.";

    return;
  }

  function filterHotListings(listings: Listing[]) {
    return listings.filter((listing) => listing.bids.length > 5);
  }

  function filterStealsListings(listings: Listing[]) {
    return listings.filter((listing) => {
      const sortedBids = listing.bids.sort((a, b) => b.amount - a.amount);
      const highestCredit = sortedBids[0]?.amount ?? 0;

      return highestCredit < 100 && listing.bids.length > 0;
    });
  }

  function filterNoBidsListings(listings: Listing[]) {
    return listings.filter((listing) => listing.bids.length === 0);
  }

  function sortEndingSoonListings(listings: Listing[]) {
    const now = new Date();

    return listings
      .filter((listing) => {
        const endTime = new Date(listing.endsAt);
        const timeLeft = endTime.getTime() - now.getTime();

        return timeLeft > 0;
      })

      .sort(
        (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
      );
  }

  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      if (filter === "hot") {
        const hotListings = filterHotListings(currentListings);
        renderListings(hotListings);
      } else if (filter === "steals") {
        const stealsListings = filterStealsListings(currentListings);
        renderListings(stealsListings);
      } else if (filter === "all") {
        renderListings(currentListings);
      } else if (filter === "no-bids") {
        const noBids = filterNoBidsListings(currentListings);
        renderListings(noBids);
      } else if (filter === "ending") {
        const endingSoon = sortEndingSoonListings(currentListings);
        renderListings(endingSoon);
      }
    });
  });

  alertEl.classList.add("hidden");
  alertEl.classList.remove("flex");

  listings.forEach((listing) => {
    const sortedBids = listing.bids.sort((a, b) => b.amount - a.amount);
    const highestCredit = sortedBids[0]?.amount ?? 0;

    const imageUrl =
      listing.media[0]?.url ?? `${baseURL}src/assets/images/fallback.jpg`;
    const imageAlt = listing.media[0]?.alt ?? listing.title;

    const endTime = new Date(listing.endsAt);
    const now = new Date();

    const timeLeft = endTime.getTime() - now.getTime();
    const totalSeconds = Math.floor(timeLeft / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const minutes = Math.floor(totalMinutes % 60);
    const hours = Math.floor(totalHours % 24);

    let timeDisplay = "Ended";

    if (timeLeft > 0) {
      timeDisplay = `${totalDays}d ${hours}h ${minutes}m`;
    }

    let titleDisplay = listing.title;

    if (titleDisplay.length > 25) {
      titleDisplay = titleDisplay.slice(0, 25) + "...";
    }

    grid.innerHTML += `
      <article class="text-xl">
        <a class="group" href="${baseURL}listing/index.html">
          <div class="listing-image-container relative aspect-square">
            <img
              class="listing-image h-full w-full object-cover"
              src="${imageUrl}"
              alt="${imageAlt}"
            />

            <div
              class="absolute inset-0 flex items-center justify-center bg-brand text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <span
                class="rounded-full border-[1.5px] border-white px-6 py-2 text-xl"
              >
                Place bid
              </span>
            </div>
          </div>

          <div class="mx-2 my-2">
            <div class="flex justify-between">
              <h2>${titleDisplay}</h2>
              <p>${listing._count.bids} bids</p>
            </div>

            <div class="flex justify-between">
              <p class="listing-time">${timeDisplay}</p>
              <p>${highestCredit} credits</p>
            </div>

            <div class="flex justify-end lg:hidden">
              <p class="after:ml-1 after:text-2xl after:content-['↗']">
                VIEW LOT
              </p>
            </div>
          </div>
        </a>
      </article>
    `;
  });

  const images = document.querySelectorAll<HTMLImageElement>(".listing-image");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      image.src = `${baseURL}src/assets/images/fallback.jpg`;
    });
  });
}

async function paginateListings() {
  const paginationButtons = document.querySelectorAll<HTMLButtonElement>(
    ".listing-pagination",
  );

  paginationButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const page = Number(button.dataset.page);

      await loadListings(page);

      grid.scrollIntoView();
    });
  });
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchValue = searchInput.value.trim();

  const searchResults = await getSearchResults(searchValue);

  renderListings(searchResults.data);
});

searchInput.addEventListener("input", async () => {
  if (searchInput.value === "") {
    await loadListings(1);
  }
});

paginateListings();
loadListings(1);
