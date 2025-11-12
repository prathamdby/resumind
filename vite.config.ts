import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["pdfjs-dist"],
  },
  define: {
    "process.env.BETTER_AUTH_URL": JSON.stringify(
      process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ),
    "process.env.API_URL": JSON.stringify(
      process.env.API_URL || "http://localhost:8000",
    ),
  },
});
