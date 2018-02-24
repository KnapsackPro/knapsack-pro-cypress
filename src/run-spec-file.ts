#!/usr/bin/env node

import Jasmine = require('jasmine');

function runSpecFile(specFile: string) {
  const jasmine = new Jasmine({});
  jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
      specFile
    ],
    helpers: [
      'helpers/**/*.js'
    ]
  });

  const timer = process.hrtime();
  jasmine.execute();
  const timerDiff = process.hrtime(timer);

  const specTimeExecution = timerDiff[0] + timerDiff[1] / 1e9;

  process.send({
    path: specFile, // TODO: try to get not absolute path
    time_execution: specTimeExecution
  });
}

const specFile = process.argv[2];
runSpecFile(specFile);