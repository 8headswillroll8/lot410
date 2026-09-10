import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/lot410/",
  plugins: [tailwindcss()],

  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        listings: resolve(import.meta.dirname, "listings/index.html"),
        listing: resolve(import.meta.dirname, "listing/index.html"),
        login: resolve(import.meta.dirname, "login/index.html"),
        register: resolve(import.meta.dirname, "register/index.html"),
        profile: resolve(import.meta.dirname, "profile/index.html"),
        listingForm: resolve(import.meta.dirname, "listing-form/index.html"),
      },
    },
  },
});
