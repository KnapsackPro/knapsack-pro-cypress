#!/usr/bin/env node

import Jasmine = require('jasmine');
import childProcess = require('child_process');
import path = require('path');
import util = require('util')

import { KnapsackProCore } from './knapsack-pro-core';
import { TestFile } from './test-file.model';

class KnapsackPro {
  private knapsackProCore: KnapsackProCore;
  private jasmine: Jasmine;

  private testFiles1: TestFile[]; // TODO: rename variable
  private testFiles2: TestFile[]; // TODO: rename variable

  constructor() {
    this.knapsackProCore = new KnapsackProCore();

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
  }

  initQueueMode() {
    this.runQueueMode(this.testFiles1, true);
  }

  private runQueueMode(testFiles: TestFile[], initializeQueue = false) {
    this.knapsackProCore.queueRequest(testFiles, initializeQueue)
      .then(response => {
        const queueTestFiles = response.data.test_files;
        const queueEmpty = queueTestFiles.length === 0;

        if (queueEmpty) {
          this.sendTestSuiteSubsetSummary(this.testFiles2);
          return;
        }

        this.runSpecFiles(queueTestFiles);
      })
      .catch(this.logResponse);
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
    this.knapsackProCore.buildSubsetRequest(testFiles)
      .then(response => {
        // console.log(response); // TODO: uncomment
      })
      .catch(this.logResponse);
  }

  private logResponse(error) {
    console.log(util.inspect(error.response.data, {
      showHidden: false,
      depth: null
    }))
  }
}

const knapsackPro = new KnapsackPro();
knapsackPro.initQueueMode();
