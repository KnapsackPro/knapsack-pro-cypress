#!/usr/bin/env node

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

function runSpecFile(specFile) {
  jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
      specFile
    ],
    helpers: [
      'helpers/**/*.js'
    ]
  });

  var timer = process.hrtime();
  jasmine.execute();
  var timerDiff = process.hrtime(timer);

  var specTimeExecution = timerDiff[0] + timerDiff[1] / 1e9;

  process.send({
    path: specFile,
    time_execution: specTimeExecution
  });
}

var specFile = process.argv[2];
runSpecFile(specFile);