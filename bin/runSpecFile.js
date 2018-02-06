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

  jasmine.execute();
}

var specFile = process.argv[2];
runSpecFile(specFile);