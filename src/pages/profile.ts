import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import {
  getProfile,
  getProfileListings,
  getBiddingHistory,
  editProfile,
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
const editProfileEl = document.querySelector<HTMLElement>("#profile-edit");

const baseURL = import.meta.env.BASE_URL;
const name = localStorage.getItem("name");

let currentView = "listings";
let currentFilter = "all";

if (
  !headerEl ||
  !listingsEl ||
  !currListingsBtn ||
  !biddingHistoryBtn ||
  !editProfileEl ||
  filterButtons.length === 0
) {
  throw new Error("Profile elements not found");
}

if (!name) {
  throw new Error("Logged-in user name not found");
}

/*
 * Safe references after null guards.
 * TypeScript now knows these cannot be null.
 */
const header = headerEl;
const listingContainer = listingsEl;
const editProfileContainer = editProfileEl;
const profileName = name;

const profileData = await getProfile(profileName);
const listingData = await getProfileListings(profileName);
const biddingHistoryData = await getBiddingHistory(profileName);

const profileListings = listingData.data;
const biddingHistory = biddingHistoryData.data;

function renderProfileHeader() {
  header.innerHTML = `
    <!-- Header -->
    <div class="relative">
      <img
        class="min-h-62.5 w-full object-cover"
        src="${profileData.data.banner.url}"
        alt="${profileData.data.banner.alt}"
      />

      <button
        id="edit-button"
        class="absolute right-4 bottom-4"
        type="button"
      >
        <img
          src="${baseURL}assets/icons/edit.svg"
          alt=""
        />
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
          <img
            class="w-6"
            src="${baseURL}assets/icons/arrow-right.svg"
            alt=""
          />

          <p>${profileData.data.credits}</p>
        </div>
      </div>
    </div>
  `;
}

function closeEditProfile() {
  editProfileContainer.classList.remove("translate-y-0", "opacity-100");
  editProfileContainer.classList.add("-translate-y-4", "opacity-0");

  setTimeout(() => {
    editProfileContainer.innerHTML = "";

    header.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 300);
}

function renderEditProfile() {
  editProfileContainer.innerHTML = `
    <p class="mb-6 underline underline-offset-6">
      Edit mode
    </p>

    <form
      id="profile-edit-form"
      class="profile-edit-form flex flex-col gap-5"
      novalidate
    >
      <!-- Profile image -->
      <div class="flex flex-col">
        <label
          class="pb-2"
          for="edit-profile-img"
        >
          Change profile image
        </label>

        <input
          class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
          type="text"
          id="edit-profile-img"
          name="edit-profile-img"
          value="${profileData.data.avatar.url}"
        />
      </div>

      <!-- Banner image -->
      <div class="flex flex-col">
        <label
          class="pb-2"
          for="edit-profile-header-img"
        >
          Change header image
        </label>

        <input
          class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
          type="text"
          id="edit-profile-header-img"
          name="edit-profile-header-img"
          value="${profileData.data.banner.url}"
        />
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          id="cancel-btn"
          class="h-12 w-full flex-1 rounded-full border-2 hover:border-brand hover:bg-brand hover:text-white"
          type="button"
        >
          Cancel
        </button>

        <button
          class="h-12 w-full flex-2 rounded-full bg-brand text-white hover:rounded-none"
          type="submit"
        >
          Save changes
        </button>
      </div>

      <!-- Alert -->
      <div
        class="hidden items-start gap-2 pt-3"
        id="profile-edit-alert"
        aria-live="polite"
      >
        <img
          class="mt-1 w-7"
          src="${baseURL}assets/icons/alert-circle.svg"
          alt=""
        />

        <p id="profile-edit-alert-text"></p>
      </div>
    </form>
  `;

  const editForm =
    document.querySelector<HTMLFormElement>("#profile-edit-form");

  const cancelButton = document.querySelector<HTMLButtonElement>("#cancel-btn");

  const editImageInput =
    document.querySelector<HTMLInputElement>("#edit-profile-img");

  const editCoverInput = document.querySelector<HTMLInputElement>(
    "#edit-profile-header-img",
  );

  const profileAlertContainer = document.querySelector<HTMLDivElement>(
    "#profile-edit-alert",
  );

  const profileAlert = document.querySelector<HTMLParagraphElement>(
    "#profile-edit-alert-text",
  );

  if (
    !editForm ||
    !cancelButton ||
    !editImageInput ||
    !editCoverInput ||
    !profileAlertContainer ||
    !profileAlert
  ) {
    throw new Error("Edit profile elements could not be found");
  }

  cancelButton.addEventListener("click", () => {
    closeEditProfile();
  });

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const avatarUrl = editImageInput.value.trim();
      const bannerUrl = editCoverInput.value.trim();

      const params = {
        avatar: {
          url: avatarUrl,
          alt: "Profile avatar image",
        },
        banner: {
          url: bannerUrl,
          alt: "Profile banner image",
        },
      };

      const data = await editProfile(profileName, params);

      renderProfileHeader();
      closeEditProfile();

      console.log(data);
    } catch {
      profileAlertContainer.classList.add("flex");
      profileAlertContainer.classList.remove("hidden");

      profileAlert.innerText = "That change didn't stick. Try again.";
    }
  });
}

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

    listingContainer.innerHTML += `
      <article
        class="mx-6 grid grid-cols-2 gap-y-3 border-b border-brand pb-6 text-[16px] sm:grid-cols-3 md:mx-0 md:grid-cols-6 md:items-center"
      >
        <div class="group relative w-19.25">
          <img
            class="aspect-square h-full w-full object-cover"
            src="${imageUrl}"
            alt="${imageAlt}"
          />

          <div
            class="absolute inset-0 bg-brand opacity-0 transition-opacity group-hover:opacity-100"
          ></div>

          <img
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            src="${baseURL}assets/icons/edit-circle.svg"
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

renderProfileHeader();
renderListing();

const editButton = document.querySelector<HTMLButtonElement>("#edit-button");

if (!editButton) {
  throw new Error("Edit button could not be found");
}

editButton.addEventListener("click", () => {
  renderEditProfile();

  editProfileContainer.classList.remove("-translate-y-4", "opacity-0");
  editProfileContainer.classList.add("translate-y-0", "opacity-100");

  editProfileContainer.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

currListingsBtn.addEventListener("click", () => {
  currentView = "listings";
  renderListing();
});

biddingHistoryBtn.addEventListener("click", () => {
  currentView = "bids";
  renderListing();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    if (!filter) return;

    currentFilter = filter;
    renderListing();
  });
});
