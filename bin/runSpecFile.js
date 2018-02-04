#!/usr/bin/env node

var Jasmine = require('jasmine');

var specFile = process.argv[2];

function runSpecFile(specFile) {
  var jasmine = new Jasmine();

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

runSpecFile(specFile);