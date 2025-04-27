import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./setupTests.ts"],
    includeSource: ["src/**/*.{ts,tsx}"],
    environment: "happy-dom",
  },
});
