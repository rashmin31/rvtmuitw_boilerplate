import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      exclude: [
        "**/index.ts",
        "src/main.tsx",
        "src/**/*.stories.*",
        "dist/**",
        "coverage/**"
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    }
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@tenants": path.resolve(__dirname, "src/tenants")
    }
  }
});
