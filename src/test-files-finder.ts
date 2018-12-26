import glob = require('glob');

import { TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    return glob
      .sync(EnvConfig.testFilePattern)
      .map((testFilePath: string) => ({ path: testFilePath }));
  }
}
