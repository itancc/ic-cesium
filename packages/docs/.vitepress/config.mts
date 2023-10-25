import { defineConfig } from "vitepress";
import cesium from "vite-plugin-cesium";

const nav = [
  { text: "Home", link: "/" },
  { text: "Examples", link: "/examples/" },
  { text: "Api", link: "/api/" },
];

const sidebar = {
  "/examples/": [
    {
      text: "Basic",
      items: [
        { text: "start-icesium", link: "/examples/#start" },
        { text: "test-icesium", link: "/examples/#test" },
      ],
    },
  ],
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ic-cesium",
  description: "cesium sdk",
  srcDir: "src",
  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/itancc/ic-cesium" },
    ],
  },
  vite: {
    plugins: [cesium()],
  },
});
