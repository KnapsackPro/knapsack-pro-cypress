#!/usr/bin/env node

import {
  KnapsackProCore,
  KnapsackProLogger,
  testFilesToExecuteType,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import { TestFilesFinder } from './test-files-finder';
import { CypressCLI } from './cypress-cli';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cypress = require('cypress');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name: clientName, version: clientVersion } = require('../package.json');

const cypressCLIOptions = CypressCLI.argvToOptions();
const knapsackProLogger = new KnapsackProLogger();

knapsackProLogger.debug(
  `Initial Cypress CLI options:\n${KnapsackProLogger.objectInspect(
    cypressCLIOptions,
  )}`,
);

EnvConfig.loadEnvironmentVariables();

const testFilesToExecute: testFilesToExecuteType = () =>
  TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(
  clientName,
  clientVersion,
  testFilesToExecute,
);

const onSuccess: onQueueSuccessType = async (queueTestFiles: TestFile[]) => {
  const testFilePaths: string[] = queueTestFiles.map(
    (testFile: TestFile) => testFile.path,
  );

  const updatedCypressCLIOptions = CypressCLI.updateOptions(cypressCLIOptions);
  knapsackProLogger.debug(
    `Updated Cypress CLI options for the set of tests fetched from Knapsack Pro API:\n${KnapsackProLogger.objectInspect(
      updatedCypressCLIOptions,
    )}`,
  );

  const { runs: tests, totalFailed } = await cypress
    .run({
      ...updatedCypressCLIOptions,
      spec: testFilePaths,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      knapsackProLogger.error(
        `Error from cypress.run:\n${KnapsackProLogger.objectInspect(e)}`,
      );
      process.exitCode = 1;
      throw new Error('cypress.run process failed. See the above logs.');
    });

  // when Cypress crashed
  if (typeof tests === 'undefined') {
    return {
      recordedTestFiles: [],
      isTestSuiteGreen: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordedTestFiles: TestFile[] = tests.map((test: any) => ({
    path: test.spec.relative,
    time_execution: test.stats.duration / 1000,
  }));

  return {
    recordedTestFiles,
    isTestSuiteGreen: totalFailed === 0,
  };
};

// we do nothing when error so pass noop
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
const onError: onQueueFailureType = (error: any) => {};

knapsackPro.runQueueMode(onSuccess, onError);
