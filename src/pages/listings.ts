import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import { getListings } from "../api/listings";
import type { Listing } from "../types/listings";

renderFooter();
renderHeader();
setupMobileMenu();

const grid = document.querySelector("#listings-grid");
const baseURL = import.meta.env.BASE_URL;

async function loadListings() {
  const data = await getListings();

  renderListings(data.data);
}

function renderListings(listings: Listing[]) {
  if (!grid) {
    throw new Error("Listings element not found");
  }

  listings.forEach((listing) => {
    const sortedBids = listing.bids.sort((a, b) => b.amount - a.amount);
    const highestCredit = sortedBids[0]?.amount ?? 0;

    const imageUrl =
      listing.media[0]?.url ?? `${baseURL}src/assets/images/fallback.svg`;
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

    let timeDisplay;

    if (timeLeft < 0) {
      timeDisplay = "Ended";
    }

    if (timeLeft > 0) {
      timeDisplay = `${totalDays}d ${hours}h ${minutes}m`;
    }

    grid.innerHTML += `
      <article class="text-xl">
        <a class="group" href="${baseURL}listing/index.html">
          <div
            class="relative aspect-square cursor-[url(${baseURL}src/assets/icons/gavel-white.svg),pointer]"
          >
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
              <h2>${listing.title}</h2>
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

loadListings();
