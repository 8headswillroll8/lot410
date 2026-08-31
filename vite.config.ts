import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/lot410/",
  plugins: [tailwindcss()],
});
