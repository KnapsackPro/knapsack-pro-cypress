#!/usr/bin/env node

import { KnapsackProCore, TestFile } from "@knapsack-pro/core";
const cypress = require("cypress"); // tslint:disable-line:no-var-requires
const glob = require("glob");

class KnapsackProTestFileFinder {
  private testFiles: TestFile[] = [];

  public allTestFiles() {
    glob("cypress/integration/**/*.js", {}, (error: any, files: any) => {
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.
      if (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
        return;
      }

      files.forEach((testFilePath: string) => {
        this.testFiles.push({ path: testFilePath });
      });
      console.log(this.testFiles); // here has value
    });

    console.log(this.testFiles); // here is empty, because of async operation
    return this.testFiles;
  }
}

const knapsackProTestFileFinder = new KnapsackProTestFileFinder();

const knapsackPro = new KnapsackProCore(knapsackProTestFileFinder.allTestFiles());

const onSuccess = async (queueTestFiles: TestFile[]) => {
  const recordedTestFiles: TestFile[] = [];

  // TODO remove log, this should be list of tests fetched from queue
  console.log(queueTestFiles);

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
