#!/usr/bin/env node

import { KnapsackProCore, TestFile } from "@knapsack-pro/core";
const cypress = require("cypress"); // tslint:disable-line:no-var-requires
const glob = require("glob");

class KnapsackProTestFilesFinder {
  public allTestFiles(): TestFile[] {
    // TODO add support for jsx etc
    // https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files
    const testFiles: TestFile[] = glob
      .sync("cypress/integration/**/*.js", {})
      .map((testFilePath: string) => ({ path: testFilePath }));

    return testFiles;
  }
}

const knapsackProTestFilesFinder = new KnapsackProTestFilesFinder();
const allTestFiles: TestFile[] = knapsackProTestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(allTestFiles);

const onSuccess = async (queueTestFiles: TestFile[]) => {
  const recordedTestFiles: TestFile[] = [];

  // TODO remove log
  console.log("tests from queue", queueTestFiles);

  const deferredRecordedTestFiles = new Promise<TestFile[]>((resolve: any, reject: any) => {
    // https://docs.cypress.io/guides/guides/module-api.html#Example
    cypress
      .run({
        spec: [
          "./cypress/integration/examples/actions.spec.js",
          "./cypress/integration/examples/cookies.spec.js",
        ], // TODO use queueTestFiles here
      })
      .then(({ runs: tests }: { runs: object[] }) => {
        tests.forEach((test: any) => {
          const timeExecutionMs = test.stats.wallClockDuration; // in miliseconds
          const timeExecution = timeExecutionMs / 1000.0;
          recordedTestFiles.push({
            path: test.spec.relative,
            time_execution: timeExecution,
          });
        });

        resolve(recordedTestFiles);
      });
  });

  return deferredRecordedTestFiles;
};

const onError = (error: any) => {
  // handle error
};

knapsackPro.runQueueMode(onSuccess, onError);
