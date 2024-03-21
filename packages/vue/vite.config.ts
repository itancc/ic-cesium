import { defineConfig } from "vite";
import VueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  optimizeDeps: {
    exclude: ["vue", "@ic-cesium/core"],
  },
  plugins: [VueJsx()],
});
