import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import { bidOnListings, getSingleListing } from "../api/listings";
import type { Listing } from "../types/listings";
import { getProfile } from "../api/profile";
import { getTimeAgo, timeLeft, sortBidsByHighest } from "../utils/listingUtils";

renderHeader();
setupMobileMenu();
renderFooter();

const singleListingEl = document.querySelector<HTMLElement>("#single-listing");

const biddingActivityEl =
  document.querySelector<HTMLElement>("#bidding-activity");

const listingAlert = document.querySelector<HTMLDivElement>("#listing-alert");

const listingAlertText = document.querySelector<HTMLParagraphElement>(
  "#listing-alert-text",
);

const baseURL = import.meta.env.BASE_URL;

if (
  !singleListingEl ||
  !biddingActivityEl ||
  !listingAlert ||
  !listingAlertText
) {
  throw new Error("Single listing element not found");
}

const singleListing = singleListingEl;
const biddingActivity = biddingActivityEl;

function renderSingleListing(listing: Listing) {
  const lastBid = listing.bids[listing.bids.length - 1];

  const imgUrl =
    listing.media[0]?.url ?? `${baseURL}assets/images/fallback.jpg`;

  const imgAlt = listing.media[0]?.alt ?? listing.title;

  const countDown = timeLeft(listing.endsAt);

  const sortedBids = sortBidsByHighest(listing.bids);
  const highestBid = sortedBids[0]?.amount ?? 0;
  const minimumBid = highestBid + 1;

  let bidDisplay = "No bids yet";
  let timeAgo = "";
  let totalBids;

  if (lastBid) {
    bidDisplay = `${lastBid.bidder.name} bid ${lastBid.amount} credits`;
    timeAgo = getTimeAgo(lastBid.created);
  }

  if (listing.bids.length === 0) {
    totalBids = "No bids yet";
  } else if (listing.bids.length === 1) {
    totalBids = "1 bid and counting";
  } else {
    totalBids = `${listing.bids.length} bids and counting`;
  }

  singleListing.innerHTML = `
    <div class="relative aspect-square md:w-1/2">
      <img
        class="w-full h-full object-cover"
        src="${imgUrl}"
        alt="${imgAlt}"
      />

      <a href="${baseURL}listing-form/index.html" hidden>
        <img
          class="absolute top-3 right-3"
          src="${baseURL}assets/icons/edit-circle.svg"
          alt=""
        />
      </a>
    </div>

    <div class="md:w-1/2">
      <div class="mx-6 lg:mx-15">
        <h1 class="mb-6 text-[54px] lg:text-[64px]">
          ${listing.title}
        </h1>

        <p class="mb-12 text-pretty">
          ${listing.description ?? ""}
        </p>

        <p class="flex items-start gap-3">
          <img
            class="w-4.5 translate-y-2"
            src="${baseURL}assets/icons/coin-stack.svg"
            alt=""
          />
          ${bidDisplay}${timeAgo ? ` → ${timeAgo}` : ""}
        </p>

        <p class="flex gap-3">
          <img
            class="w-5"
            src="${baseURL}assets/icons/plus.svg"
            alt=""
          />
          ${totalBids}
        </p>

        <p class="flex gap-3 mb-12">
          <img
            src="${baseURL}assets/icons/hourglass.svg"
            alt=""
          />
          ${countDown}
        </p>
      </div>

      <div class="flex mx-6 lg:mx-15">
        <form id="bid-form"
        class="flex flex-col w-full">
          <div class="flex flex-row mb-4 border-b-2 xl:mb-8">
            <label for="listing-bid" class="sr-only">
              Place bid here
            </label>

            <img
              class="w-7"
              src="${baseURL}assets/icons/gavel.svg"
              alt=""
            />

            <input
              class="flex-1 bg-transparent outline-none placeholder:text-brand"
              type="number"
              id="listing-bid"
              name="listing-bid"
              placeholder="Your bid here, ${minimumBid} credits or more"
            />
          </div>

          <button
            class="h-12.5 rounded-full bg-brand text-white hover:rounded-none"
            type="submit"
          >
            Place bid
          </button>
          <p id="bid-alert" class="pt-4"></p>
        </form>
      </div>
    </div>
  `;
}

function renderBiddingActivity(listing: Listing) {
  const sortedBids = sortBidsByHighest(listing.bids);

  biddingActivity.innerHTML = `
    <h2 class="mb-2">Bid activity</h2>
  `;

  sortedBids.forEach((bid, index) => {
    const timeAgo = getTimeAgo(bid.created);

    biddingActivity.innerHTML += `
      <div class="flex justify-center gap-2">
        ${
          index === 0
            ? `<img src="${baseURL}assets/icons/trophy.svg" alt="" />`
            : ""
        }

        <p class="${index === 0 ? "" : "opacity-40"}">
          ${bid.bidder.name} bid ${bid.amount} credits → ${timeAgo}
        </p>
      </div>
    `;
  });
}

try {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  const id = params.get("id");

  if (!id) {
    throw new Error("id is missing");
  }

  getSingleListing(id).then(async (data) => {
    const listing = data.data;

    renderSingleListing(listing);
    renderBiddingActivity(listing);

    const bidForm = document.querySelector<HTMLFormElement>("#bid-form");
    const listingBid = document.querySelector<HTMLInputElement>("#listing-bid");
    const bidAlert = document.querySelector<HTMLParagraphElement>("#bid-alert");

    const sortedBids = sortBidsByHighest(listing.bids);
    const currentBid = sortedBids[0]?.amount ?? 0;
    const minimumBid = currentBid + 1;

    const username = localStorage.getItem("name");

    if (!username) {
      throw new Error("Could not find username");
    }

    const userProfile = await getProfile(username);
    console.log(userProfile);

    const userCredits = userProfile.data.credits;
    console.log(userCredits);

    if (!bidForm || !bidAlert || !listingBid) {
      throw new Error("Could not find bid element");
    }

    bidForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const bidAmount = Number(listingBid.value);

      if (bidAmount === 0) {
        bidAlert.textContent = "You'll need to bid something.";
        return;
      }

      if (bidAmount < minimumBid) {
        bidAlert.textContent = "Someone's already gone higher.";
        return;
      }

      if (bidAmount > userCredits) {
        bidAlert.textContent = "Your credits can't cover that one.";
        return;
      }

      const bidParams = {
        amount: bidAmount,
      };

      try {
        const bidData = await bidOnListings(id, bidParams);
        console.log(bidData);

        bidAlert.textContent = "Bid placed. Now we wait.";
      } catch {
        bidAlert.textContent = "That bid didn't make it through. Try again.";
      }
    });
  });
} catch {
  listingAlert.classList.remove("hidden");
  listingAlert.classList.add("flex");
  listingAlertText.textContent = "Error message here";
}

// 4. Listing has already ended
// 5. User is bidding on their own listing
