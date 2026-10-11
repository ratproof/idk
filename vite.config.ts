import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";
export default defineConfig({
  plugins: [react(), tailwind()],
  server: { proxy: { "/api": { target: "https://bucket.stains.rocks", changeOrigin: true } } },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
