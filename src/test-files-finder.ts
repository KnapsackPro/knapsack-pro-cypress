import glob = require('glob');

import { KnapsackProLogger, TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    const testFiles = glob
      .sync(EnvConfig.testFilePattern)
      .map((testFilePath: string) => ({ path: testFilePath }));

    if (testFiles.length === 0) {
      const knapsackProLogger = new KnapsackProLogger();

      const errorMessage =
        // tslint:disable-next-line: max-line-length
        'Test files cannot be found.\nPlease set KNAPSACK_PRO_TEST_FILE_PATTERN matching your test directory structure.\nLearn more: https://github.com/KnapsackPro/knapsack-pro-cypress#how-to-run-tests-only-from-specific-directory';

      knapsackProLogger.error(errorMessage);
      throw errorMessage;
    }

    return testFiles;
  }
}
