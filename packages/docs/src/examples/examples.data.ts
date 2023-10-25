import { join, resolve } from "path";
import { readdirSync, readFileSync } from "node:fs";

export type ExampleData = {
  [key: string]: string | Record<string, string>;
};

export const data: Record<string, ExampleData> = {};
function readExamples(dir: string) {
  const files = readdirSync(dir, { withFileTypes: true });
  // get all demos
  const examples = files.filter((file) => file.isDirectory());
  examples.forEach((example) => {
    data[example.name] = readExample(join(dir, example.name));
  });
  return data;
}

function readExample(dir: string) {
  const files: ExampleData = {};
  const dirents = readdirSync(dir, { withFileTypes: true });
  // only handle file type
  const direntFiles = dirents.filter((dirent) => dirent.isFile());
  direntFiles.forEach((file) => {
    const content = readFileSync(join(dir, file.name), "utf-8");
    files[file.name] = content;
  });
  return files;
}

export default {
  watch: "./**",
  load() {
    const exampleDir = resolve(__dirname, "./");
    return readExamples(exampleDir);
  },
};
