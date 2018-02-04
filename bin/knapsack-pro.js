#!/usr/bin/env node

var Jasmine = require('jasmine');
var childProcess = require('child_process');

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

function runSpecFiles(specFiles, callback) {
  var specFilesHead = specFiles[0];
  if (specFilesHead === undefined) return;

  var process = childProcess.fork(__dirname + '/runSpecFile.js', [specFilesHead]);

  // keep track of whether callback has been invoked to prevent multiple invocations
  var callbackInvoked = false;

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (error) {
    if (callbackInvoked) return;
    callbackInvoked = true;

    callback(error);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    var specFilesTail = specFiles.slice(1);
    runSpecFiles(specFilesTail, callback);

    if (callbackInvoked) return;
    callbackInvoked = true;

    var error = (code === 0) ? null : new Error('exit code ' + code);
    callback(error);
  });
}

function handleError(error) {
  if (error) throw error;
}

runSpecFiles(specFiles, handleError);