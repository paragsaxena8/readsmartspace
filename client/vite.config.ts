import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:4000"
      }
    }
  },
  plugins: [react()],
});
