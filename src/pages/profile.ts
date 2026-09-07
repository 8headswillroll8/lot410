import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import {
  getProfile,
  getProfileListings,
  getBiddingHistory,
} from "../api/profile";
import type { Listing } from "../types/listings";

renderFooter();
renderHeader();
setupMobileMenu();

const headerEl = document.querySelector<HTMLElement>("#profile-header");
const listingsEl = document.querySelector<HTMLDivElement>("#profile-listings");
const currListingsBtn = document.querySelector<HTMLButtonElement>(
  "#current-listings-button",
);
const biddingHistoryBtn = document.querySelector<HTMLButtonElement>(
  "#bidding-history-button",
);
const filterButtons = document.querySelectorAll<HTMLButtonElement>(
  ".filter-buttons button",
);

const baseURL = import.meta.env.BASE_URL;

const name = localStorage.getItem("name");

let currentView = "listings";
let currentFilter = "all";

if (
  !headerEl ||
  !listingsEl ||
  !currListingsBtn ||
  !biddingHistoryBtn ||
  !filterButtons
) {
  throw new Error("Profile elements not found");
}

if (!name) {
  throw new Error("Logged-in user name not found");
}

const profileData = await getProfile(name);
const listingData = await getProfileListings(name);
const biddingHistoryData = await getBiddingHistory(name);

const profileListings = listingData.data;
const biddingHistory = biddingHistoryData.data;

const header = headerEl;
const listingContainer = listingsEl;

function renderProfileHeader() {
  header.innerHTML = `
    <!-- Header -->
    <div class="relative">
      <img
        class="min-h-62.5 w-full object-cover"
        src="${profileData.data.banner.url}"
        alt="${profileData.data.banner.alt}"
      />

      <button class="absolute right-4 bottom-4" type="button">
        <img src="${baseURL}src/assets/icons/edit.svg" alt="" />
      </button>

      <!-- Avatar -->
      <div class="absolute left-5 bottom-0 w-30 translate-y-5 md:w-50">
        <img
          class="aspect-square w-full rounded-full object-cover"
          src="${profileData.data.avatar.url}"
          alt="${profileData.data.avatar.alt}"
        />
      </div>
    </div>

    <!-- Profile info -->
    <div class="mx-6 flex flex-col pt-8 sm:flex-row sm:justify-between">
      <!-- Info -->
      <div>
        <h1 class="font-sans text-[20px] font-normal md:text-[24px]">
          ${profileData.data.name}
        </h1>
        <p>${profileData.data.email}</p>
      </div>

      <!-- Credits -->
      <div class="mt-5 sm:mt-0">
        <p>Credits</p>
        <div class="flex">
          <img class="w-6" src="${baseURL}src/assets/icons/arrow-right.svg" alt="" />
          <p>${profileData.data.credits}</p>
        </div>
      </div>
    </div>
  `;
}

renderProfileHeader();

function renderListing() {
  listingContainer.innerHTML = "";

  let listingsToRender: Listing[];

  if (currentView === "listings") {
    listingsToRender = profileListings;
  } else {
    listingsToRender = biddingHistory;
  }

  if (currentFilter === "active") {
    listingsToRender = listingsToRender.filter(
      (listing) => new Date(listing.endsAt).getTime() > new Date().getTime(),
    );
  }

  if (currentFilter === "ended") {
    listingsToRender = listingsToRender.filter(
      (listing) => new Date(listing.endsAt).getTime() < new Date().getTime(),
    );
  }

  if (listingsToRender.length === 0) {
    if (currentView === "listings") {
      listingContainer.innerText = "You have no listings yet";
    } else {
      listingContainer.innerText = "You haven't placed any bids yet";
    }

    return;
  }

  listingsToRender.forEach((listing: Listing) => {
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

    listingContainer.innerHTML += `
    <article
      class="grid grid-cols-2 gap-y-3 border-b border-brand pb-6 mx-6 text-[16px] sm:grid-cols-3 md:grid-cols-6 md:mx-0 md:items-center"
    >
      <div class="group relative w-19.25">
        <img
          class="w-full h-full aspect-square object-cover"
          src="${imageUrl}"
          alt="${imageAlt}"
        />

        <!-- Blue overlay -->
        <div
          class="absolute inset-0 bg-brand opacity-0 transition-opacity group-hover:opacity-100"
        ></div>

        <img
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          src="${baseURL}src/assets/icons/edit-circle.svg"
          alt=""
        />
      </div>

      <div>
        <p class="font-bold">Item</p>
        <p>${titleDisplay}</p>
      </div>

      <div>
        <p class="font-bold">Ends in</p>
        <p>${timeDisplay}</p>
      </div>

      <div>
        <p class="font-bold">Current bid</p>
        <p>${highestCredit}</p>
      </div>

      <div>
        <p class="font-bold">Bids</p>
        <p>${listing._count.bids}</p>
      </div>

      <div>
        <p class="font-bold">Status</p>
        <p>Listing active</p>
      </div>
    </article>
  `;
  });
}

currListingsBtn.addEventListener("click", () => {
  currentView = "listings";
  renderListing();
});

biddingHistoryBtn.addEventListener("click", () => {
  currentView = "bids";
  renderListing();
});

renderListing();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    if (!filter) return;

    currentFilter = filter;

    renderListing();
  });
});
