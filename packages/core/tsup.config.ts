import { defineConfig } from "tsup";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * 讲资源引入为字符串
 */
const ImportRawPlugin = () => {
  return {
    name: "importRawPlugin",
    setup(build) {
      const rawReg = /(?:\?|&)raw(?:&|$)/;
      build.onResolve({ filter: rawReg }, (args) => {
        const { resolveDir, path } = args;
        return { path: join(resolveDir, path) };
      });
      build.onLoad({ filter: rawReg }, async (args) => {
        const path = args.path.replace(rawReg, "");
        const content = await readFile(path, "utf-8");
        return { contents: JSON.stringify(content), loader: "text" };
      });
    },
  };
};

export default defineConfig({
  entry: ["./index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  external: ["cesium"],
  minify: true,

  esbuildPlugins: [ImportRawPlugin()],
});
