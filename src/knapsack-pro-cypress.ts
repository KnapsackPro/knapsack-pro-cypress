#!/usr/bin/env node

import KnapsackProCore = require('@knapsack-pro/core');
import { TestFile } from '@knapsack-pro/core/test-file.model';

const knapsackPro = new KnapsackProCore([]);
knapsackPro.runQueueMode((queueTestFiles: TestFile[]) => {
  // run tests by cypress
  // return recorded timing for those tests
}, (error: any) => {

});