#!/usr/bin/env node

const cypress = require("cypress"); // tslint:disable-line:no-var-requires

import { KnapsackProCore, TestFile } from "@knapsack-pro/core";
import { TestFilesFinder } from "./test-files-finder";

const allTestFiles: TestFile[] = TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(allTestFiles);

const onSuccess = (queueTestFiles: TestFile[]): Promise<TestFile[]> => {
  const testFilePaths: string[] = queueTestFiles.map((testFile: TestFile) => testFile.path);
  const recordedTestFiles: TestFile[] = [];

  return new Promise<TestFile[]>((resolve: any, reject: any) => {
    // https://docs.cypress.io/guides/guides/module-api.html#Example
    cypress
      .run({ spec: testFilePaths })
      .then(({ runs: tests }: { runs: object[] }) => {
        tests.forEach((test: any) => {
          const timeExecutionSeconds = test.stats.wallClockDuration / 1000;
          recordedTestFiles.push({
            path: test.spec.relative,
            time_execution: timeExecutionSeconds,
          });
        });

        resolve(recordedTestFiles);
      });
  });
};

const onError = (error: any) => {
  // handle error
};

knapsackPro.runQueueMode(onSuccess, onError);
