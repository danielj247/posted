import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url).href),
      },
      {
        find: "~",
        replacement: fileURLToPath(new URL("./", import.meta.url).href),
      },
    ],
  },

  plugins: [vue()],
});
