import "../style.css";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
// import { getProfile } from "../api/profile";

renderFooter();
renderHeader();
setupMobileMenu();

const headerEl = document.querySelector<HTMLElement>("#profile-header");

const baseURL = import.meta.env.BASE_URL;

if (!headerEl) {
  throw new Error("Header element not found");
}
const header = headerEl;

function renderProfileHeader() {
  header.innerHTML = `
    <!-- Header -->
    <div class="relative">
      <img
        class="min-h-62.5 w-full object-cover"
        src="${baseURL}src/assets/images/header.svg"
        alt="Grey gradient"
      />

      <button class="absolute right-4 bottom-4" type="button">
        <img src="${baseURL}src/assets/icons/edit.svg" alt="" />
      </button>

      <!-- Avatar -->
      <div class="absolute left-5 bottom-0 w-30 translate-y-5 md:w-50">
        <img
          class="aspect-square w-full rounded-full object-cover"
          src="${baseURL}src/assets/images/profile-avatar.webp"
          alt="Profile picture of Nicco Dahl"
        />
      </div>
    </div>

    <!-- Profile info -->
    <div class="mx-6 flex flex-col pt-8 sm:flex-row sm:justify-between">
      <!-- Info -->
      <div>
        <h1 class="font-sans text-[20px] font-normal md:text-[24px]">
          Nicco Dahl
        </h1>
        <p>nicco.dahl@stud.noroff.no</p>
      </div>

      <!-- Credits -->
      <div class="mt-5 sm:mt-0">
        <p>Credits</p>
        <div class="flex">
          <img class="w-6" src="${baseURL}src/assets/icons/arrow-right.svg" alt="" />
          <p>1,240</p>
        </div>
      </div>
    </div>
  `;
}

renderProfileHeader();
