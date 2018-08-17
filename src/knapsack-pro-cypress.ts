#!/usr/bin/env node

const cypress = require("cypress"); // tslint:disable-line:no-var-requires

import { KnapsackProCore, onQueueFailureType, onQueueSuccessType, TestFile } from "@knapsack-pro/core";
import { TestFilesFinder } from "./test-files-finder";

const allTestFiles: TestFile[] = TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(allTestFiles);

const onSuccess: onQueueSuccessType = async (queueTestFiles) => {
  const testFilePaths: string[] = queueTestFiles.map((testFile: TestFile) => testFile.path);
  const { runs: tests, totalFailed } = await cypress.run({ spec: testFilePaths });

  const recordedTestFiles: TestFile[] = tests.map((test: any) => ({
    path: test.spec.relative,
    time_execution: test.stats.wallClockDuration / 1000, // seconds
  }));

  return {
    recordedTestFiles,
    isTestSuiteGreen: totalFailed === 0,
  };
};

const onError: onQueueFailureType = (error) => {
  // TODO: handle error
};

knapsackPro.runQueueMode(onSuccess, onError);
