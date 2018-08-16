import { TestFile } from "@knapsack-pro/core";
import glob = require("glob");

export class TestFilesFinder {
  public allTestFiles(): TestFile[] {
    return glob
      .sync("cypress/integration/**/*.{js,jsx,coffee,cjsx}")
      .map((testFilePath: string) => ({ path: testFilePath }));
  }
}
