#!/usr/bin/env node

var Jasmine = require('jasmine');

var specFiles = (function() {
  var jasmine = new Jasmine();

  jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
      '**/*[sS]pec.js'
    ],
    helpers: [
      'helpers/**/*.js'
    ]
  });

  return jasmine.specFiles;
})();

var runTestsByFile = function (specFiles) {
  var head = specFiles[0];
  var tail = specFiles.slice(1);

  if (head === undefined) return;

  console.log(head);

  var jasmine = new Jasmine();

  jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
      head
    ],
    helpers: [
      'helpers/**/*.js'
    ]
  });

  jasmine.onComplete(function(passed) {
    runTestsByFile(tail);
  });

  jasmine.execute();
}

runTestsByFile(specFiles);
