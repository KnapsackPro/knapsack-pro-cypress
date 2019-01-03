#!/usr/bin/env node

const { name: clientName, version: clientVersion } = require('../package.json');

const cypress = require('cypress');

import {
  KnapsackProCore,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import { TestFilesFinder } from './test-files-finder';

EnvConfig.loadEnvironmentVariables();

const allTestFiles: TestFile[] = TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(
  clientName,
  clientVersion,
  allTestFiles,
);

const onSuccess: onQueueSuccessType = async (queueTestFiles: TestFile[]) => {
  const testFilePaths: string[] = queueTestFiles.map(
    (testFile: TestFile) => testFile.path,
  );
  const { runs: tests, totalFailed } = await cypress.run({
    spec: testFilePaths,
  });

  const recordedTestFiles: TestFile[] = tests.map((test: any) => ({
    path: test.spec.relative,
    time_execution: test.stats.wallClockDuration / 1000, // seconds
  }));

  return {
    recordedTestFiles,
    isTestSuiteGreen: totalFailed === 0,
  };
};

// we do nothing when error so pass noop
const onError: onQueueFailureType = (error: any) => {};

knapsackPro.runQueueMode(onSuccess, onError);
