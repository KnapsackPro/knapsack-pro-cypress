import
  axios,
  { AxiosPromise }
from 'axios';

import { TestFile } from './test-file.model';

// TODO: use fake env data for testing
process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN = '4499425b5908312eb878ddc1a6e437c2';
process.env.KNAPSACK_PRO_FIXED_QUEUE_SPLIT = 'false';
process.env.KNAPSACK_PRO_COMMIT_HASH = 'ae3396177d9f8ca87e2b93b4b0a25babd09d574d';
process.env.KNAPSACK_PRO_BRANCH = 'master';
process.env.KNAPSACK_PRO_NODE_TOTAL = '2';
process.env.KNAPSACK_PRO_NODE_INDEX = '1';
// process.env.KNAPSACK_PRO_NODE_BUILD_ID = '1234';
process.env.KNAPSACK_PRO_NODE_BUILD_ID = new Date().getTime() + ''; // TODO: use this for testing

export class KnapsackProCore {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = 'https://api-staging.knapsackpro.com/v1';
  }

  queueRequest(testFiles: TestFile[], initializeQueue: boolean): AxiosPromise<any> {
    const url = `${this.apiBaseUrl}/queues/queue`;
    const data = {
      test_suite_token: process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN,
      can_initialize_queue: initializeQueue,
      fixed_queue_split: process.env.KNAPSACK_PRO_FIXED_QUEUE_SPLIT === 'true',
      commit_hash: process.env.KNAPSACK_PRO_COMMIT_HASH,
      branch: process.env.KNAPSACK_PRO_BRANCH,
      node_total: process.env.KNAPSACK_PRO_NODE_TOTAL,
      node_index: process.env.KNAPSACK_PRO_NODE_INDEX,
      node_build_id: process.env.KNAPSACK_PRO_NODE_BUILD_ID,
      test_files: testFiles
    };

    return axios.post(url, data);
  }

  buildSubsetRequest(testFiles: TestFile[]): AxiosPromise<any> {
    const url = `${this.apiBaseUrl}/build_subsets`;
    const data = {
      test_suite_token: process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN,
      commit_hash: process.env.KNAPSACK_PRO_COMMIT_HASH,
      branch: process.env.KNAPSACK_PRO_BRANCH,
      node_total: process.env.KNAPSACK_PRO_NODE_TOTAL,
      node_index: process.env.KNAPSACK_PRO_NODE_INDEX,
      test_files: testFiles
    };

    return axios.post(url, data);
  }
}
