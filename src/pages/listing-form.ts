import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import { createListing } from "../api/listings";

renderFooter();
renderHeader();
setupMobileMenu();

const listingFormEl = document.querySelector<HTMLFormElement>(".listing-form");

if (!listingFormEl) {
  throw new Error("Listing form element not found");
}

const listingForm = listingFormEl;

function renderListingForm() {
  listingForm.innerHTML = `
    <!-- title -->
    <div class="flex flex-col">
      <label class="pb-2" for="listing-form-title">Title</label>
      <input
        class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
        type="text"
        id="listing-form-title"
        name="listing-form-title"
        placeholder="What are you passing on?"
      />
    </div>

    <!-- Image URL -->
    <div class="flex flex-col">
      <label class="pb-2" for="listing-form-image">Image URL</label>
      <input
        class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
        type="url"
        id="listing-form-image"
        name="listing-form-image"
        placeholder="Paste a link to your image"
      />
    </div>

    <!-- Image description -->
    <div class="flex flex-col">
      <label class="pb-2" for="listing-form-alt">Image description</label>
      <input
        class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
        type="text"
        id="listing-form-alt"
        name="listing-form-alt"
        placeholder="Image description"
      />
    </div>

    <!-- Description -->
    <div class="flex flex-col">
      <label class="pb-2" for="listing-form-description">Description</label>
      <textarea
        class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
        name="listing-form-description"
        id="listing-form-description"
        rows="4"
        placeholder="Tell us about it. Condition, details, quirks, anything worth knowing."
      ></textarea>
    </div>

    <!-- Time -->
    <div class="flex flex-col">
      <label class="pb-2" for="listing-ends-at">Ends at</label>
      <input
        class="border-2 border-brand p-2 focus:border-dashed focus:outline-none placeholder:text-brand"
        type="datetime-local"
        id="listing-ends-at"
        name="listing-ends-at"
      />
    </div>

    <!-- Buttons  -->
    <div class="flex gap-3">
      <button
        class="flex-1 h-12 w-full border-2 rounded-full hover:bg-brand hover:border-brand hover:text-white"
        type="button"
      >
        Delete
      </button>
      <button
        class="flex-2 h-12 w-full rounded-full bg-brand text-white hover:rounded-none"
        type="submit"
      >
        Put it up for auction
      </button>
    </div>
  `;
}

renderListingForm();

const listingTitle = document.querySelector<HTMLInputElement>(
  "#listing-form-title",
);
const listingImageUrl = document.querySelector<HTMLInputElement>(
  "#listing-form-image",
);
const listingImageAlt =
  document.querySelector<HTMLInputElement>("#listing-form-alt");
const listingDescription = document.querySelector<HTMLInputElement>(
  "#listing-form-description",
);
const listingEndsAt =
  document.querySelector<HTMLInputElement>("#listing-ends-at");
const listingAlertContainer = document.querySelector<HTMLDivElement>(
  "#listing-form-alert",
);
const listingAlert = document.querySelector<HTMLParagraphElement>(
  "#listing-form-alert-text",
);

if (
  !listingTitle ||
  !listingImageUrl ||
  !listingImageAlt ||
  !listingDescription ||
  !listingEndsAt ||
  !listingAlertContainer ||
  !listingAlert
) {
  throw new Error("Listing form element not found");
}

listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = listingTitle.value.trim();
  const imageUrl = listingImageUrl.value.trim();
  const imageAlt = listingImageAlt.value.trim();
  const description = listingDescription.value.trim();
  const endsAt = listingEndsAt.value.trim();

  if (!title) {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "Give your listing a name";
    return;
  }

  if (title.length > 50) {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "Keep your title under 50 characters";
    return;
  }

  try {
    new URL(imageUrl);
  } catch {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "That image URL looks a little off";
    return;
  }

  if (imageAlt.length > 125) {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "Keep your image description under 125 characters";
    return;
  }

  if (description.length > 1000) {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "Keep your description under 1000 characters";
    return;
  }

  if (!endsAt) {
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "When should the auction end?";
    return;
  }

  const params = {
    title: title,
    description: description,
    media: [
      {
        url: imageUrl,
        alt: imageAlt,
      },
    ],
    endsAt: endsAt,
  };

  try {
    console.log("about to create listing", params);
    const listingData = await createListing(params);

    const id = listingData.data.id;

    window.location.href = `../listing/index.html?id=${id}`;
  } catch (error) {
    console.error(error);
    listingAlertContainer.classList.add("flex");
    listingAlertContainer.classList.remove("hidden");
    listingAlert.innerText = "That didn't go up for auction. Try again";
  }
});
