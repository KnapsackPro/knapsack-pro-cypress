# @knapsack-pro/cypress

[![CircleCI](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg)](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress)

`@knapsack-pro/cypress` is JS npm package to run your E2E tests with [Cypress.io](https://www.cypress.io) test runner with optimal test suite parallelisation using [KnapsackPro.com](https://knapsackpro.com).

We use Knapsack Pro Queue Mode. Learn more in the video [how to run tests with dynamic test suite split](https://youtu.be/hUEB1XDKEFY) thanks to Queue Mode.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [How to use](#how-to-use)
  - [Configuration steps](#configuration-steps)
  - [CI steps](#ci-steps)
    - [CircleCI](#circleci)
    - [Travis CI](#travis-ci)
    - [Buildkite.com](#buildkitecom)
- [FAQ](#faq)
  - [How to run tests only from specific directory?](#how-to-run-tests-only-from-specific-directory)
- [Development](#development)
  - [Dependencies](#dependencies)
  - [Setup project in development](#setup-project-in-development)
  - [Publishing](#publishing)
  - [Testing](#testing)
    - [CI](#ci)
    - [Example Cypress test suite](#example-cypress-test-suite)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
$ npm install --save-dev @knapsack-pro/cypress
```

## How to use

### Configuration steps

1. Please add to your CI environment variables `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`. You can generate API token in [user dashboard](https://knapsackpro.com/dashboard).

2. (optional) Do you want to use "retry single failed parallel CI node" feature for your CI? For instance some of CI providers like Travis CI, Buildkite or Codeship allows you to retry only one of failed parallel CI node instead of retrying the whole CI build with all parallel CI nodes. If you want to be able to retry only single failed parallel CI node then you need to tell Knapsack Pro API to remember the way how test files where allocated across parallel CI nodes by adding to your CI environment variables `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`. 

    The default is `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` which means when you want to retry the whole failed CI build then a new dynamic test suite split will happen across all retried parallel CI nodes thanks to Knapsack Pro Queue Mode. Some people may prefer to retry the whole failed CI build with test files allocated across parallel CI nodes in the same order as it happend for the failed CI build - in such case you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

3. (optional) `@knapsack-pro/cypress` detects information about CI build from supported CI environment variables. When information like git branch name and git commit hash cannot be detect from CI environment variables then `@knapsack-pro/cypress` will try to use git installed on CI machine to detect the infomation. If you don't have git installed then you should set the information using environment variables:

    `KNAPSACK_PRO_COMMIT_HASH` - git commit hash (SHA1)
    `KNAPSACK_PRO_BRANCH` - git branch name
    `KNAPSACK_PRO_CI_NODE_BUILD_ID` - a unique ID for your CI build. All parallel CI nodes being part of single CI build must have the same node build ID. Example how to generate node build ID: `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)`.

4. Please select your CI provider and follow instructions to run tests with `@knapsack-pro/cypress`.

    - [CircleCI](#circleci)
    - [Travis CI](#travis-ci)
    - [Buildkite.com](#buildkitecom)

### CI steps

#### CircleCI

Example configuration for CircleCI 2.0 platform.

```YAML
# ~/.circleci/config.yml
version: 2
jobs:
  test:
    docker:
      - image: circleci/<language>:<version TAG>
    parallelism: 2 # run 2 parallel CI nodes

    steps:
      - checkout

      - run:
        name: Run Cypress.io tests with @knapsack-pro/cypress using Knapsack Pro Queue Mode
        command: $(npm bin)/knapsack-pro-cypress
```

Please remember to add additional parallel containers for your project in CircleCI settings.

#### Travis CI

You can parallelize your CI build across virtual machines with [travis matrix feature](https://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines).

```yaml
# .travis.yml
script:
  - "$(npm bin)/knapsack-pro-cypress"

env:
  global:
    - KNAPSACK_PRO_CI_NODE_TOTAL=2
    # allows to be able to retry failed tests on one of parallel job (CI node)
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

  matrix:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
```

The configuration will generate matrix with 2 parallel jobs (2 parallel CI nodes):

```
# first CI node (first parallel job)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0

# second CI node (second parallel job)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 
```

More info about global and matrix ENV configuration in [travis docs](https://docs.travis-ci.com/user/customizing-the-build/#build-matrix).

#### Buildkite.com

The only thing you need to do is to configure the parallelism parameter (number of parallel agents) in your build step and run the below command in your build:

```
$(npm bin)/knapsack-pro-cypress
```

If you want to use Buildkite retry single agent feature to retry just failed tests on particular agent (CI node) then you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

__Other useful resources:__

Here you can find article [how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro](http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example) and 2 example repositories for Ruby/Rails projects:

* [Buildkite Rails Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro)
* [Buildkite Rails Docker Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro)

## FAQ

### How to run tests only from specific directory?

You can set `KNAPSACK_PRO_TEST_FILE_PATTERN=cypress/integration/**/*.{js,jsx,coffee,cjsx}` and change pattern to match your directory with test files. You can use [glob](https://github.com/isaacs/node-glob) pattern.

## Development

### Dependencies

* [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

### Setup project in development

1. Setup [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) project.

2. Set up environment variables:

    ```
    $ cp .env.sample .env
    $ vim .env
    ```

3. Install dependencies.

    ```
    $ npm install
    ```

    Take note that NPM postinstall script defined in `package.json` may run below command based on `.env` configuration:

    ```
    $ npm link @knapsack-pro/core
    ```

4. Compile typescript code with `gulp`. The output will be in `bin` directory.

    ```
    $ npm start
    ```

5. Register `@knapsack-pro/cypress` package globally in your local system. This way we will be able to develop other npm packages dependent on it.

    ```
    $ npm link
    ```

### Publishing

Ensure you have in `package.json` the latest version of `@knapsack-pro/core` and you run `npm install`:

```
{
  "dependencies": {
    "@knapsack-pro/core": "latest"
  }
}
```

### Testing

#### CI

If your feature requires code change in [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) then please push the `@knapsack-pro/core` to GitHub first. Then you can push changes for `@knapsack-pro/cypress` to ensure the CI will use the latest `@knapsack-pro/core`.

#### Example Cypress test suite

To test `@knapsack-pro/cypress` against real test suite we use forked [cypress-example-kitchensink](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/knapsack-pro/README.knapsack-pro.md) project.
