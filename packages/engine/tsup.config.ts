import { defineConfig } from "tsup";
import { readFile } from "fs/promises";
/**
 * 讲资源引入为字符串
 */
const ImportRawPlugin = () => {
  return {
    name: "importRawPlugin",
    setup(build) {
      build.onLoad({ filter: /(.glsl|.vert|.frag|.txt)/ }, async (args) => {
        const content = await readFile(args.path, "utf-8");
        return {
          contents: JSON.stringify(content),
          loader: "text",
        };
      });
    },
  };
};

export default defineConfig({
  entry: ["index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  external: ["cesium"],
  esbuildPlugins: [ImportRawPlugin()],
});
