/* eslint-disable @typescript-eslint/no-explicit-any */
import { findPackages, Project } from "find-packages";
import * as process from "process";
import prompt, { Choice } from "prompts";
import { execa } from "execa";
import chalk from "chalk";
import versionBump from "bumpp";

/**
 * 选择需要发布的包
 * @param pkgs 所有的包
 * @returns
 */
const selectPkgs = async (pkgs: Project[] = []) => {
  const pkgPrompts = await prompt({
    type: "multiselect",
    name: "selectPublishPkg",
    message: "please select publish package",
    choices: pkgs.map((pkg) => ({
      title: pkg.manifest.name,
      value: pkg,
    })) as Choice[],
  });
  return pkgPrompts.selectPublishPkg as Project[];
};

/** 获取packages下所有的包 */
const resolvePkgs = async () => {
  const pkgs = await findPackages(process.cwd());
  return pkgs.filter((pkg) => pkg.dir !== process.cwd());
};

/** 选择版本 */
const selectVersion = async () => {
  const preIncludes = ["prepatch", "preminor", "premajor", "prerelease"];

  return await prompt([
    {
      type: "select",
      name: "versionType",
      message: "please select release version type",
      choices: [
        {
          title: "patch",
          value: "patch",
        },
        {
          title: "minor",
          value: "minor",
        },
        {
          title: "major",
          value: "major",
        },
        {
          title: "prepatch",
          value: "prepatch",
        },
        {
          title: "preminor",
          value: "preminor",
        },
        {
          title: "premajor",
          value: "premajor",
        },
        {
          title: "prerelease",
          value: "prerelease",
        },
      ],
    },
    {
      type: (prev) => (preIncludes.includes(prev) ? "select" : null),
      name: "releaseType",
      message: "please select pre release type",
      choices: [
        {
          title: "beta",
          value: "beta",
        },
        {
          title: "alpha",
          value: "alpha",
        },
        {
          title: "rc",
          value: "rc",
        },
        {
          title: "next",
          value: "next",
        },
      ],
    },
  ]);
};

/** 改变package.json版本 */
const changeVersion = async (
  selectPkgs: Project[],
  versionType: string,
  releaseType: string
) => {
  try {
    console.log(chalk.magenta("change version ..."));
    for (const selectPkg of selectPkgs) {
      await versionBump({
        release: versionType,
        preid: releaseType,
        cwd: selectPkg.dir,
      });
    }
    console.log(chalk.green("change version success"));
  } catch (e) {
    console.log(chalk.red("change version failed !"));
    process.exit(1);
  }
};

/** git commit  */
const commit = async (commit?: string) => {
  console.log(chalk.magenta("commit ..."));
  await execa("git", ["add", "."]);
  await execa("git", ["commit", "-m", commit || "release: change version"]);
  console.log(chalk.green("commit success"));
};

/** 发布包 */
const publish = async (pkgs: Project[] = []) => {
  try {
    await Promise.all(
      pkgs.map((pkg) =>
        execa("pnpm", ["publish", "--no-git-checks", "--access", "public"], {
          cwd: pkg.dir,
        })
      )
    );
    console.log(chalk.green("publish success"));
  } catch (error) {
    console.log(chalk.red("publish failed !"));
    process.exit(1);
  }
};
/** git push  */
const push = async () => {
  try {
    console.log(chalk.magenta("push ..."));
    await execa("git", ["push"]);
    console.log(chalk.green("push success"));
  } catch (e: any) {
    console.log(chalk.red("push failed !"));
    console.log(e?.stderr);
    process.exit(1);
  }
};

/** 主函数 */
const main = async () => {
  const pkgs = await resolvePkgs();
  const _selectPkgs = await selectPkgs(pkgs);
  const { versionType, releaseType } = await selectVersion();

  //编译选中的包
  try {
    console.log(chalk.magenta("build ..."));
    for (const _selectPkg of _selectPkgs) {
      await execa("pnpm", ["build"], { cwd: _selectPkg.dir });
    }
    console.log(chalk.green("build success"));
  } catch (error) {
    console.log("build error");
    console.log(error);
    process.exit(1);
  }

  await changeVersion(_selectPkgs, versionType, releaseType);
  await commit();
  await publish(_selectPkgs);
  await push();
};

main();
