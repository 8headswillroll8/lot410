import "../style.css";
import { getListings, getSearchResults } from "../api/listings";
import { showAlert } from "../components/alert";
import { renderFooter } from "../components/footer";
import { renderHeader } from "../components/header";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderSearchBar } from "../components/searchBar";
import type { Listing } from "../types/listings";
import { sortBidsByHighest } from "../utils/listingUtils";

renderFooter();
renderHeader();
renderSearchBar();
setupMobileMenu();

const gridEl = document.querySelector<HTMLElement>("#listings-grid");

const searchForm = document.querySelector<HTMLFormElement>("#search-form");

const searchInput =
  document.querySelector<HTMLInputElement>("#listings-search");

const listingsAlert = document.querySelector<HTMLElement>("#listings-alert");

const controlButtons =
  document.querySelectorAll<HTMLButtonElement>(".listing-control");

const baseURL = import.meta.env.BASE_URL;

let currentListings: Listing[] = [];

if (!gridEl) {
  throw new Error("Listings element not found");
}

if (!listingsAlert) {
  throw new Error("Alert element not found");
}

if (!searchForm || !searchInput) {
  throw new Error("Search form elements not found");
}

const grid = gridEl;

async function loadListings(page: number) {
  const data = await getListings(page);

  currentListings = data.data;

  renderListings(currentListings);
}

function filterHotListings(listings: Listing[]) {
  return listings.filter((listing) => listing.bids.length > 5);
}

function filterStealsListings(listings: Listing[]) {
  return listings.filter((listing) => {
    const sortedBids = sortBidsByHighest(listing.bids);
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

function renderListings(listings: Listing[]) {
  grid.innerHTML = "";

  if (listings.length === 0) {
    showAlert(
      listingsAlert,
      "info",
      "Not a single lot in sight. Try searching for something else.",
    );

    return;
  }

  listingsAlert.classList.add("hidden");
  listingsAlert.classList.remove("flex");

  listings.forEach((listing) => {
    const sortedBids = sortBidsByHighest(listing.bids);
    const highestCredit = sortedBids[0]?.amount ?? 0;

    const imageUrl =
      listing.media[0]?.url ?? `${baseURL}assets/images/fallback.jpg`;

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
        <a
          class="group"
          href="${baseURL}listing/index.html?id=${listing.id}"
        >
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
      image.src = `${baseURL}assets/images/fallback.jpg`;
    });
  });
}

function setupFilters() {
  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      controlButtons.forEach((controlButton) => {
        controlButton.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");

      if (filter === "hot") {
        renderListings(filterHotListings(currentListings));
        return;
      }

      if (filter === "steals") {
        renderListings(filterStealsListings(currentListings));
        return;
      }

      if (filter === "no-bids") {
        renderListings(filterNoBidsListings(currentListings));
        return;
      }

      if (filter === "ending") {
        renderListings(sortEndingSoonListings(currentListings));
        return;
      }

      renderListings(currentListings);
    });
  });
}

function paginateListings() {
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

  currentListings = searchResults.data;

  renderListings(currentListings);
});

searchInput.addEventListener("input", async () => {
  if (searchInput.value.trim() === "") {
    await loadListings(1);
  }
});

setupFilters();
paginateListings();
loadListings(1);
