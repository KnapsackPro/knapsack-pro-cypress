#!/usr/bin/env node

import Jasmine = require('jasmine');
import childProcess = require('child_process');
import path = require('path');

import { KnapsackProCore } from './knapsack-pro-core';
import { KnapsackProLogger } from './knapsack-pro-logger';
import { TestFile } from './test-file.model';

class KnapsackPro {
  private knapsackProCore: KnapsackProCore;
  private knapsackProLogger: KnapsackProLogger;
  private jasmine: Jasmine;

  private testFiles1: TestFile[]; // TODO: rename variable
  private testFiles2: TestFile[]; // TODO: rename variable

  constructor() {
    this.knapsackProCore = new KnapsackProCore();
    this.knapsackProLogger = new KnapsackProLogger();

    this.jasmine = new Jasmine({});
    this.jasmine.loadConfig({
      spec_dir: 'spec',
      spec_files: [
        '**/*[sS]pec.js'
      ],
      helpers: [
        'helpers/**/*.js',
      ]
    });

    let projectBaseDir = this.jasmine.projectBaseDir;
    if (process.platform === 'win32') {
      projectBaseDir = projectBaseDir.replace(/\\/g, '/');
    }

    this.testFiles1 = this.jasmine.specFiles.map(specFilePath => {
      const specFile = specFilePath.replace(projectBaseDir, '.');
      return { path: specFile };
    });
  }

  initQueueMode() {
    this.runQueueMode(this.testFiles1, true);
  }

  private runQueueMode(testFiles: TestFile[], initializeQueue = false) {
    this.knapsackProCore.queueRequest(testFiles, initializeQueue)
      .then(response => {
        this.knapsackProLogger.logResponse(response);

        const queueTestFiles = response.data.test_files;
        const queueEmpty = queueTestFiles.length === 0;

        if (queueEmpty) {
          this.sendTestSuiteSubsetSummary(this.testFiles2);
          return;
        }

        this.runSpecFiles(queueTestFiles);
      })
      .catch(error => {
        this.knapsackProLogger.logError(error);
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
    this.knapsackProCore.buildSubsetRequest(testFiles)
      .then(response => {
        this.knapsackProLogger.logResponse(response);
      })
      .catch(error => {
        this.knapsackProLogger.logError(error);
      });
  }
}

const knapsackPro = new KnapsackPro();
knapsackPro.initQueueMode();
