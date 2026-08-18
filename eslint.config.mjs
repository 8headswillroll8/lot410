import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  ignores: ["dist/**", "node_modules/**", "test-results/**"],
  files: ["**/*.{js,ts}"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
  ],
});
