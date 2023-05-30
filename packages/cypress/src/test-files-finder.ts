import glob = require('glob');
import minimatch = require('minimatch');

import { KnapsackProLogger, TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import * as Urls from './urls';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    const testFiles = glob
      .sync(EnvConfig.testFilePattern)
      .filter((testFilePath: string) => {
        if (EnvConfig.testFileExcludePattern) {
          return !minimatch(testFilePath, EnvConfig.testFileExcludePattern, {
            matchBase: true,
          });
        }
        return true;
      })
      .map((testFilePath: string) => ({ path: testFilePath }));

    if (testFiles.length === 0) {
      const knapsackProLogger = new KnapsackProLogger();

      const errorMessage = `Test files cannot be found.\nPlease make sure that KNAPSACK_PRO_TEST_FILE_PATTERN and KNAPSACK_PRO_TEST_FILE_IGNORE_PATTERN allow for some files in your test directory structure to be matched.\nLearn more: ${Urls.NO_TESTS_FOUND}`;

      knapsackProLogger.error(errorMessage);
      throw errorMessage;
    }

    return testFiles;
  }
}
