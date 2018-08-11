#!/usr/bin/env node

import { KnapsackProCore, TestFile } from "@knapsack-pro/core";
import * as Promise from "bluebird";

const knapsackPro = new KnapsackProCore([]);
knapsackPro.runQueueMode((queueTestFiles: TestFile[]) => {
  const recordedTestFiles: TestFile[] = [];

  const deferredRecordedTestFiles = new Promise<TestFile[]>((resolve, reject) => {
    // run tests by cypress
    // https://docs.cypress.io/guides/guides/command-line.html#Cypress-Module-API
    resolve(recordedTestFiles);
  });

  return deferredRecordedTestFiles;
}, (error: any) => {
  // handle error
});
