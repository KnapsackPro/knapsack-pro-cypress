#!/usr/bin/env node

import { KnapsackProCore, TestFile } from "@knapsack-pro/core";
import "cypress";

const allTestFiles: TestFile[] = [];
const knapsackPro = new KnapsackProCore(allTestFiles);

const onSuccess = async (queueTestFiles: TestFile[]) => {
  const recordedTestFiles: TestFile[] = [];

  // cypress.run({
  //   spec: './cypress/integration/examples/actions.spec.js'
  // })
  // .then((results) => {
  //   console.log(results)
  // })
  // .catch((err) => {
  //   console.error(err)
  // })

  const deferredRecordedTestFiles = new Promise<TestFile[]>((resolve, reject) => {
    // run tests by cypress
    // https://docs.cypress.io/guides/guides/command-line.html#Cypress-Module-API
    resolve(recordedTestFiles);
  });

  return deferredRecordedTestFiles;
};

const onError = (error: any) => {
  // handle error
};

knapsackPro.runQueueMode(onSuccess, onError);
