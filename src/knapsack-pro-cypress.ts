#!/usr/bin/env node

const { name: clientName, version: clientVersion } = require('../package.json');

const cypress = require('cypress');

import {
  KnapsackProCore,
  KnapsackProLogger,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import { TestFilesFinder } from './test-files-finder';
import { CypressCLI } from './cypress-cli';

const cypressCLIOptions = CypressCLI.argvToOptions();
const knapsackProLogger = new KnapsackProLogger();

knapsackProLogger.debug(
  `Initial Cypress CLI options:\n${KnapsackProLogger.objectInspect(
    cypressCLIOptions
  )}`
);

EnvConfig.loadEnvironmentVariables();

const allTestFiles: TestFile[] = TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(
  clientName,
  clientVersion,
  allTestFiles
);

const onSuccess: onQueueSuccessType = async (queueTestFiles: TestFile[]) => {
  const testFilePaths: string[] = queueTestFiles.map(
    (testFile: TestFile) => testFile.path
  );

  const updatedCypressCLIOptions = CypressCLI.updateOptions(cypressCLIOptions);
  knapsackProLogger.debug(
    `Updated Cypress CLI options for the set of tests fetched from Knapsack Pro API:\n${KnapsackProLogger.objectInspect(
      updatedCypressCLIOptions
    )}`
  );

  const { runs: tests, totalFailed } = await cypress.run({
    ...updatedCypressCLIOptions,
    spec: testFilePaths,
  });

  // when Cypress crashed
  if (typeof tests === 'undefined') {
    return {
      recordedTestFiles: [],
      isTestSuiteGreen: false,
    };
  }

  const recordedTestFiles: TestFile[] = tests.map((test: any) => ({
    path: test.spec.relative,
    time_execution:
      // test.stats.wallClockDuration - Cypress 3.x and 4.x
      // test.stats.duration - Cypress 5.x
      (test.stats.wallClockDuration || test.stats.duration) / 1000,
  }));

  return {
    recordedTestFiles,
    isTestSuiteGreen: totalFailed === 0,
  };
};

// we do nothing when error so pass noop
const onError: onQueueFailureType = (error: any) => {};

knapsackPro.runQueueMode(onSuccess, onError);
