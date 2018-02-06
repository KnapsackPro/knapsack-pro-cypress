#!/usr/bin/env node

var childProcess = require('child_process');
var Jasmine = require('jasmine');
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

function runSpecFiles(specFiles) {
  var specFilesHead = specFiles[0];
  if (specFilesHead === undefined) return;

  var specProcess = childProcess.fork(__dirname + '/runSpecFile.js', [specFilesHead]);

  specProcess.on('error', function (error) {
    if (error) throw error;
  });

  specProcess.on('exit', function (code) {
    var specFilesTail = specFiles.slice(1);
    runSpecFiles(specFilesTail);

    if (code !== 0) process.exitCode = code;
  });
}

runSpecFiles(jasmine.specFiles);