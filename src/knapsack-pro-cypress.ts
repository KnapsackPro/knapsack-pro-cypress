#!/usr/bin/env node

import KnapsackProCore = require('@knapsack-pro/core');
import { TestFile } from '@knapsack-pro/core/test-file.model';

const knapsackPro = new KnapsackProCore([]);
knapsackPro.runQueueMode((queueTestFiles: TestFile[]) => {
  const recordedTestFiles<TestFile[]> = [];
  const deferredRecordedTestFiles = new Promise()

  // run tests by cypress
  // https://docs.cypress.io/guides/guides/command-line.html#Cypress-Module-API
  deferredRecordedTestFiles.resolve(recordedTestFiles);

  return deferredRecordedTestFiles;
}, (error: any) => {

});