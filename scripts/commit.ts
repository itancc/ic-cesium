import { execa } from "execa";

async function main() {
  // 选择需要提交的文件
  const { stdout: files } = await execa("git", ["status", "-s"]);
  console.log(files, "files");
}

main();
