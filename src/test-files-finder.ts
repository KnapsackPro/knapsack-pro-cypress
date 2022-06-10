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
        'Test files cannot be found.\nPlease set KNAPSACK_PRO_TEST_FILE_PATTERN matching your test directory structure.\nLearn more: https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-cypress';

      knapsackProLogger.error(errorMessage);
      throw errorMessage;
    }

    return testFiles;
  }
}
