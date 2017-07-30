#!/usr/bin/env node

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

jasmine.onComplete(function(passed) {
  if (passed) {
    console.log('All specs have passed');
  } else {
    console.log('At least one spec has failed');
  }
});

var myReporter = {
  jasmineStarted: function(suiteInfo) {
    // console.log(suiteInfo);
  },
  specStarted: function(result) {
    // console.log(result);
  },
  specDone: function(result) {
    // console.log(result);
    // console.log(jasmine.env);
  },
  suiteStarted: function(result) {
    // console.log('suite started');
  },
  suiteDone: function(result) {
    // console.log('suite done');
    // const util = require('util');
    // console.log(util.inspect(jasmine.env, true, null));
  }
};

jasmine.addReporter(myReporter);

console.log(jasmine.specFiles);
// console.log(jasmine.env);

jasmine.execute();