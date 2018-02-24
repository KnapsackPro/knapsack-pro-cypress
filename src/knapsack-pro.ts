#!/usr/bin/env node

import Jasmine = require('jasmine');
import childProcess = require('child_process');
import path = require('path');
import axios from 'axios';

// TODO: use fake env data for testing
process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN = '4499425b5908312eb878ddc1a6e437c2';
process.env.KNAPSACK_PRO_FIXED_QUEUE_SPLIT = 'false';
process.env.KNAPSACK_PRO_COMMIT_HASH = 'ae3396177d9f8ca87e2b93b4b0a25babd09d574d';
process.env.KNAPSACK_PRO_BRANCH = 'master';
process.env.KNAPSACK_PRO_NODE_TOTAL = '2';
process.env.KNAPSACK_PRO_NODE_INDEX = '1';
process.env.KNAPSACK_PRO_NODE_BUILD_ID = '1234'; // TODO: use new Date().getTime(); for testing

class TestFile {
  path: string;
  time_execution?: number;
}

abstract class KnapsackProCore {
  // ...
}

class KnapsackPro extends KnapsackProCore {
  private readonly apiBaseUrl: string;
  private jasmine: Jasmine;

  private testFiles1: TestFile[]; // TODO: rename variable
  private testFiles2: TestFile[]; // TODO: rename variable

  constructor() {
    super(); // TODO: implement KnapsackProCore?
    this.apiBaseUrl = 'https://api-staging.knapsackpro.com/v1'; // TODO: move to KnapsackProCore?

    this.jasmine = new Jasmine({});
    this.jasmine.loadConfig({
      spec_dir: 'spec',
      spec_files: [
        '**/*[sS]pec.js'
      ],
      helpers: [
        'helpers/**/*.js'
      ]
    });

    this.testFiles1 = this.jasmine.specFiles.map(specFile => {
      return { path: specFile };
    });
    this.runQueueMode(this.testFiles1, true);
  }

  private runQueueMode(testFiles: TestFile[], initializeQueue = false) {
    const url = `${this.apiBaseUrl}/queues/queue`;
    const data = {
      test_suite_token: process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN,
      can_initialize_queue: initializeQueue,
      fixed_queue_split: process.env.KNAPSACK_PRO_FIXED_QUEUE_SPLIT === 'true',
      commit_hash: process.env.KNAPSACK_PRO_COMMIT_HASH,
      branch: process.env.KNAPSACK_PRO_BRANCH,
      node_total: process.env.KNAPSACK_PRO_NODE_TOTAL,
      node_index: process.env.KNAPSACK_PRO_NODE_INDEX,
      node_build_id: process.env.KNAPSACK_PRO_NODE_BUILD_ID,
      test_files: testFiles
    };

    axios.post(url, data)
      .then(response => {
        const queueTestFiles = response.data.test_files;
        const queueEmpty = queueTestFiles.length === 0;

        if (queueEmpty) {
          this.sendTestSuiteSubsetSummary(this.testFiles2);
          return;
        }

        this.runSpecFiles(queueTestFiles);
      })
      .catch(error => {
        console.log(error);
      });
  }

  private runSpecFiles(testFiles: TestFile[]) {
    const testFilesEmpty = testFiles.length === 0;
    if (testFilesEmpty) {
      this.runQueueMode(this.testFiles1);
      return;
    }

    const testFilesHead = testFiles[0].path;
    const specProcess = childProcess.fork(
      `${__dirname}${path.sep}run-spec-file.js`,
      [testFilesHead]
    );

    specProcess.on('message', testFile => {
      this.testFiles2.push(testFile);
    });

    specProcess.on('error', error => {
      if (error) throw error;
    });

    specProcess.on('exit', exitCode => {
      const testFilesTail = testFiles.slice(1);
      this.runSpecFiles(testFilesTail);

      if (exitCode !== 0) process.exitCode = exitCode;
    });
  }

  private sendTestSuiteSubsetSummary(testFiles: TestFile[]) {
    const url = `${this.apiBaseUrl}/build_subsets`;
    const data = {
      test_suite_token: process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN,
      commit_hash: process.env.KNAPSACK_PRO_COMMIT_HASH,
      branch: process.env.KNAPSACK_PRO_BRANCH,
      node_total: process.env.KNAPSACK_PRO_NODE_TOTAL,
      node_index: process.env.KNAPSACK_PRO_NODE_INDEX,
      test_files: testFiles
    };

    axios.post(url, data)
      .then(response => {
        // console.log(response); // TODO: uncomment
      })
      .catch(error => {
        console.log(error);
      });
  }
}

const knapsackPro = new KnapsackPro();