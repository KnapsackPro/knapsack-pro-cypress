# @knapsack-pro/cypress

[![CircleCI](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg)](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress)

`@knapsack-pro/cypress` runs your E2E tests with [Cypress.io](https://www.cypress.io) test runner and does dynamic tests allocation across parallel CI nodes using [KnapsackPro.com](https://knapsackpro.com?utm_source=github&utm_medium=readme&utm_campaign=%40knapsack-pro%2Fcypress&utm_content=sign_up) Queue Mode to provide the fastest CI build time (optimal test suite timing).

Learn about Knapsack Pro Queue Mode in the video [how to run tests with dynamic test suite split](https://youtu.be/hUEB1XDKEFY) and learn what CI problems can be solved thanks to it.

Read article about [runnning javascript E2E tests faster with Cypress on parallel CI nodes](https://docs.knapsackpro.com/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Installation](#installation)
- [How to use](#how-to-use)
  - [Configuration steps](#configuration-steps)
  - [CI steps](#ci-steps)
    - [CircleCI](#circleci)
    - [Travis CI](#travis-ci)
    - [Buildkite.com](#buildkitecom)
    - [Codeship.com](#codeshipcom)
    - [Heroku CI](#heroku-ci)
    - [Solano CI](#solano-ci)
    - [AppVeyor](#appveyor)
    - [GitLab CI](#gitlab-ci)
      - [GitLab CI `>= 11.5`](#gitlab-ci--115)
      - [GitLab CI `< 11.5` (old GitLab CI)](#gitlab-ci--115-old-gitlab-ci)
    - [SemaphoreCI.com](#semaphorecicom)
      - [Semaphore 2.0](#semaphore-20)
      - [Semaphore 1.0](#semaphore-10)
    - [Cirrus-CI.org](#cirrus-ciorg)
    - [Jenkins](#jenkins)
    - [GitHub Actions](#github-actions)
    - [Codefresh.io](#codefreshio)
    - [Other CI provider](#other-ci-provider)
- [FAQ](#faq)
  - [Knapsack Pro Core features FAQ](#knapsack-pro-core-features-faq)
  - [How to run tests only from specific directory?](#how-to-run-tests-only-from-specific-directory)
  - [How to pass command line options?](#how-to-pass-command-line-options)
  - [How to record CI builds in Cypress Dashboard?](#how-to-record-ci-builds-in-cypress-dashboard)
- [Development](#development)
  - [Requirements](#requirements)
  - [Dependencies](#dependencies)
  - [Setup](#setup)
  - [Publishing](#publishing)
  - [Testing](#testing)
    - [CI](#ci)
    - [Example Cypress test suite](#example-cypress-test-suite)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

Please ensure you have added `cypress` package in your project `package.json`.
`@knapsack-pro/cypress` uses `cypress` version installed in your project.

For `npm` users:

```
$ npm install --save-dev @knapsack-pro/cypress
```

For `yarn` users:

```
$ yarn add --dev @knapsack-pro/cypress
```

Whenever you see `npm` in below steps you can use `yarn` there as well.

## How to use

### Configuration steps

1. To get API token just sign up at [KnapsackPro.com](https://knapsackpro.com?utm_source=github&utm_medium=readme&utm_campaign=%40knapsack-pro%2Fcypress&utm_content=sign_up). Please add to your CI environment variables `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`. You can generate API token in [user dashboard](https://knapsackpro.com/dashboard).

   Next to your API token, you can find a link "Build metrics" where you can preview recorded CI builds. You will see yellow tips if something is not configured as expected. Refresh the page once you finish running tests to see new tips. You can also click "Show" on CI build to see details about particular CI build. Look for yellow tips suggesting what to change to ensure all works fine for your project.

2. (optional) Do you want to use "retry single failed parallel CI node" feature for your CI?

   For instance some of CI providers like Travis CI, Buildkite or Codeship allows you to retry only one of failed parallel CI node instead of retrying the whole CI build with all parallel CI nodes. If you want to be able to retry only single failed parallel CI node then you need to tell Knapsack Pro API to remember the way how test files where allocated across parallel CI nodes by adding to your CI environment variables `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

   The default is `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` which means when you want to retry the whole failed CI build then a new dynamic test suite split will happen across all retried parallel CI nodes thanks to Knapsack Pro Queue Mode. Some people may prefer to retry the whole failed CI build with test files allocated across parallel CI nodes in the same order as it happend for the failed CI build - in such case you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

3. (optional) If one of the parallel CI nodes starts work very late after other parallel CI nodes already finished work.

   Some of CI providers have a problem with starting parallel CI nodes as soon as possible. For instance, you have a fixed pool of parallel CI nodes shared with many CI builds and sometimes CI build has started work even the pool has not enough available parallel CI nodes at the moment. Another case is when the CI provider infrastructure is overloaded which can lead to some parallel CI nodes starting work later than others.

   Do you have the CI server that does not start all parallel CI nodes at the same time and one of your parallel CI nodes will start work very late after all other parallel CI nodes already finished consuming tests from the Knapsack Pro Queue? In such a case, if you would use default `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` then the very late CI node would start running all tests again based on a new Queue which means you would run test suite twice. This problem can happen if your test suite is very small and differences in the start time of parallel CI nodes are very big.

   You should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` to ensure the very late parallel CI node won't run tests again if the Queue was already consumed. The downside of this is that you won't be able to run 2nd CI build for the same set of values git commit/branch/ci node total number with a dynamic test suite split way if your CI provider does not expose unique CI build ID. Instead, the tests will be run assigned to the same parallel CI node indexes with the same order as it was recorded for the first time.

   Knapsack Pro tries to detect CI build ID from the environment variables of your CI provider. Here you can check if your CI provider exposes CI build ID, see function [`ciNodeBuildId`](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/ci-providers/github-actions.ts#L14) (example for Github Actions). If you CI provider won't provide CI build ID you can set `KNAPSACK_PRO_CI_NODE_BUILD_ID` (see next point).

4. (optional) `@knapsack-pro/cypress` detects information about CI build from supported CI environment variables. When information like git branch name and git commit hash cannot be detect from CI environment variables then `@knapsack-pro/cypress` will try to use git installed on CI machine to detect the infomation. If you don't have git installed then you should set the information using environment variables:

   - `KNAPSACK_PRO_COMMIT_HASH` - git commit hash (SHA1)
   - `KNAPSACK_PRO_BRANCH` - git branch name
   - `KNAPSACK_PRO_CI_NODE_BUILD_ID` - a unique ID for your CI build. All parallel CI nodes being part of single CI build must have the same node build ID. Example how to generate node build ID: `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)`.

5. (optional) If you have test files in a non-default directory you won't be able to run tests and you may see below error.

   ```
   Response body:
   { errors: [ { test_files: [ 'parameter is required' ] } ] }
   ```

   Please [adjust `KNAPSACK_PRO_TEST_FILE_PATTERN`](#how-to-run-tests-only-from-specific-directory) variable to match your test files directory structure to let Knapsack Pro detect all the test files you want to run in parallel.

6. (optional) If you want to keep screenshots and videos of failed tests recorded by Cypress you need to set in `cypress.json` config file [trashAssetsBeforeRuns](https://docs.cypress.io/guides/references/configuration.html#Screenshots) to `false`:

   ```
   {
     // your default config here
     // ...
     "trashAssetsBeforeRuns": false
   }
   ```

   `@knapsack-pro/cypress` runs tests using [Cypress run command](https://docs.cypress.io/guides/guides/module-api.html#cypress-run) after fetching set of tests from Knapsack Pro Queue API. When another set of tests is fetched from Queue API then we run Cypress run command again with a new set of tests and Cypress run command by default removes screenshots and videos. That's why we need to turn it off in order to preserve screenshots/videos.

7. Please select your CI provider and follow instructions to run tests with `@knapsack-pro/cypress`.

   - [CircleCI](#circleci)
   - [Travis CI](#travis-ci)
   - [Buildkite.com](#buildkitecom)
   - [Codeship.com](#codeshipcom)
   - [Heroku CI](#heroku-ci)
   - [Solano CI](#solano-ci)
   - [AppVeyor](#appveyor)
   - [GitLab CI](#gitlab-ci)
   - [SemaphoreCI.com](#semaphorecicom)
   - [Cirrus-CI.org](#cirrus-ciorg)
   - [Jenkins](#jenkins)
   - [GitHub Actions](#github-actions)
   - [Codefresh.io](#codefreshio)
   - [Other CI provider](#other-ci-provider)

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
  - '$(npm bin)/knapsack-pro-cypress'

env:
  global:
    - KNAPSACK_PRO_CI_NODE_TOTAL=2
    # allows to be able to retry failed tests on one of parallel job (CI node)
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

  jobs:
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

**Other useful resources:**

Here you can find article [how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro](http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example) and 2 example repositories for Ruby/Rails projects:

- [Buildkite Rails Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro)
- [Buildkite Rails Docker Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro)

When using the `docker-compose` plugin on Buildkite, you have to tell it which environment variables to pass to the docker container. Thanks to it Knapsack Pro can detect info about CI build like commit, branch name, amount of parallel nodes.

```yaml
steps:
  - label: 'Test'
    parallelism: 2
    plugins:
      - docker-compose#3.0.3:
        run: app
        command: $(npm bin)/knapsack-pro-cypress
        config: docker-compose.test.yml
        env:
          - BUILDKITE_PARALLEL_JOB_COUNT
          - BUILDKITE_PARALLEL_JOB
          - BUILDKITE_BUILD_NUMBER
          - BUILDKITE_COMMIT
          - BUILDKITE_BRANCH
```

#### Codeship.com

Codeship does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each [parallel test pipeline](https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines). Below is an example for 2 parallel test pipelines.

Configure test pipelines (1/2 used)

```
# first CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-cypress
```

Configure test pipelines (2/2 used)

```
# second CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-cypress
```

Remember to add API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` to `Environment` page of your project settings in Codeship.

CodeShip uses the same build number if you restart a build. Because of that you need to set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` in order to be able to restart CI build.

#### Heroku CI

You can parallelize your tests on [Heroku CI](https://devcenter.heroku.com/articles/heroku-ci) by configuring `app.json` for your project.

You can set how many parallel dynos with tests you want to run with `quantity` value.
Use `test` key to run tests with `@knapsack-pro/cypress` as shown in below example.

You need to specify also the environment variable `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` with API token for Knapsack Pro.
For any sensitive environment variables (like Knapsack Pro API token) that you do not want commited in your `app.json` manifest, you can add them to your pipeline’s Heroku CI settings.

```
# app.json
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 2
        }
      },
      "addons": [
        "heroku-postgresql"
      ],
      "scripts": {
        "test": "$(npm bin)/knapsack-pro-cypress"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS": "example"
      }
    }
  }
}
```

If you would like to [run multiple Knapsack Pro commands for different test runners on Heroku CI](https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci) please follow tips.

Note the [Heroku CI Parallel Test Runs](https://devcenter.heroku.com/articles/heroku-ci-parallel-test-runs) are in Beta and you may need to ask Heroku support to enable it for your project.

You can learn more about [Heroku CI](https://devcenter.heroku.com/articles/heroku-ci).

#### Solano CI

[Solano CI](https://www.solanolabs.com) does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-cypress

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-cypress
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as global environment.

#### AppVeyor

[AppVeyor](https://www.appveyor.com) does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-cypress

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-cypress
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as global environment.

#### GitLab CI

Remember to add API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` to [Secret Variables](https://gitlab.com/help/ci/variables/README.md#secret-variables) in `Gitlab CI Settings -> CI/CD Pipelines -> Secret Variables`.

##### GitLab CI `>= 11.5`

```yaml
test:
  parallel: 2
  script: $(npm bin)/knapsack-pro-cypress
```

Here you can find info [how to configure the GitLab parallel CI nodes](https://docs.gitlab.com/ee/ci/yaml/#parallel).

##### GitLab CI `< 11.5` (old GitLab CI)

GitLab CI does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same `test` stage. Below is relevant part of `.gitlab-ci.yml` configuration for 2 parallel jobs.

```
# .gitlab-ci.yml
stages:
  - test

variables:
  KNAPSACK_PRO_CI_NODE_TOTAL: 2

# first CI node running in parallel
test_ci_node_0:
  stage: test
  script:
    - export KNAPSACK_PRO_CI_NODE_INDEX=0
    - $(npm bin)/knapsack-pro-cypress

# second CI node running in parallel
test_ci_node_1:
  stage: test
  script:
    - export KNAPSACK_PRO_CI_NODE_INDEX=1
    - $(npm bin)/knapsack-pro-cypress
```

#### SemaphoreCI.com

##### Semaphore 2.0

`@knapsack-pro/cypress` supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`. If you don't want to commit secrets in yml file then you can [follow this guide](https://docs.semaphoreci.com/article/66-environment-variables-and-secrets).
- You should create as many parallel jobs as you need with `parallelism` property. If your test suite is slow you should use more parallel jobs.

Below you can find example part of Semaphore CI 2.0 config.

```yaml
blocks:
  - name: Cypress tests
    task:
      env_vars:
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS
          value: your_api_token_here
      prologue:
        commands:
          - checkout
          - nvm install --lts carbon
          - sem-version node --lts carbon

      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - $(npm bin)/knapsack-pro-cypress
```

##### Semaphore 1.0

The only thing you need to do is set up `@knapsack-pro/cypress` for as many parallel threads as you need. Here is an example:

```
# Thread 1
$(npm bin)/knapsack-pro-cypress

# Thread 2
$(npm bin)/knapsack-pro-cypress
```

Tests will be split across 2 parallel threads.

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as global environment.

#### Cirrus-CI.org

The only thing you need to do is to configure number of parallel CI nodes for your project by using [matrix modification](https://cirrus-ci.org/guide/writing-tasks/#matrix-modification). See example for 2 parallel CI nodes.

```
# .cirrus.yml
task:
  matrix:
    name: CI node 0
    name: CI node 1
  test_script: $(npm bin)/knapsack-pro-cypress
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as global environment.

Here is Ruby example for [`.cirrus.yml` configuration file](https://cirrus-ci.org/examples/#ruby) that you may find useful.

#### Jenkins

In order to run parallel jobs with Jenkins you should use Jenkins Pipeline.
You can learn basics about it in the article [Parallelism and Distributed Builds with Jenkins](https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins).

Here is example `Jenkinsfile` working with Jenkins Pipeline.

```
timeout(time: 60, unit: 'MINUTES') {
  node() {
    stage('Checkout') {
      checkout([/* checkout code from git */])

      // determine git commit hash because we need to pass it to Knapsack Pro
      COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

      stash 'source'
    }
  }

  def num_nodes = 4; // define your total number of CI nodes (how many parallel jobs will be executed)
  def nodes = [:]

  for (int i = 0; i < num_nodes; i++) {
    def index = i;
    nodes["ci_node_${i}"] = {
      node() {
        stage('Setup') {
          unstash 'source'
          // other setup steps
        }

        def knapsack_options = """\
            KNAPSACK_PRO_CI_NODE_TOTAL=${num_nodes}\
            KNAPSACK_PRO_CI_NODE_INDEX=${index}\
            KNAPSACK_PRO_COMMIT_HASH=${COMMIT_HASH}\
            KNAPSACK_PRO_BRANCH=${env.BRANCH_NAME}\
            KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG}\
        """

        // example how to run tests with Knapsack Pro
        stage('Run tests') {
          sh """${knapsack_options} $(npm bin)/knapsack-pro-cypress"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
```

Remember to set environment variable `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` in Jenkins configuration with your API token.

#### GitHub Actions

`@knapsack-pro/cypress` supports environment variables provided by GitHub Actions to run your tests. You have to define a few things in `.github/workflows/main.yaml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` environment variable in GitHub repository Settings -> Secrets. See [creating and using secrets in GitHub Actions](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables).
- You should create as many parallel jobs as you need with `matrix.ci_node_total` and `matrix.ci_node_index` properties. If your test suite is slow you should use more parallel jobs.

Below you can find config for GitHub Actions.

```yaml
# .github/workflows/main.yaml
name: Main

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        node-version: [8.x]
        # Set N number of parallel jobs you want to run tests on.
        # Use higher number if you have slow tests to split them on more parallel jobs.
        # Remember to update ci_node_index below to 0..N-1
        ci_node_total: [2]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1]

    steps:
      - uses: actions/checkout@v1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: npm install and build
        run: |
          npm install
          npm run build --if-present

      - name: Run http server with the app in the background
        run: |
          npm run start:ci &

      - name: Run tests with Knapsack Pro
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          # allows rerun parallel jobs with the same set of tests
          # that were consumed from Queue in the very first CI build run
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        run: |
          $(npm bin)/knapsack-pro-cypress
```

#### Codefresh.io

`@knapsack-pro/cypress` supports environment variables provided by Codefresh.io to run your tests. You have to define a few things in `.codefresh/codefresh.yml` config file.

- You need to set an API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` in Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right side).
- Set where Codefresh YAML file can be found. In Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML (set there `./.codefresh/codefresh.yml`).
- Set how many parallel jobs (parallel CI nodes) you want to run with `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in `.codefresh/codefresh.yml` file.
- Ensure in the `matrix` section you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with a value from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs where each job has a different value for `KNAPSACK_PRO_CI_NODE_INDEX`. Thanks to that Knapsack Pro knows what tests should be run on each parallel job.

Below you can find Codefresh YAML config and `Test.Dockerfile` used by Codefresh to run the project and Cypress test suite inside of Docker container.

```yaml
# .codefresh/codefresh.yml
version: '1.0'

stages:
  - 'clone'
  - 'build'
  - 'tests'

steps:
  main_clone:
    type: 'git-clone'
    description: 'Cloning main repository...'
    repo: '${{CF_REPO_OWNER}}/${{CF_REPO_NAME}}'
    revision: '${{CF_BRANCH}}'
    stage: 'clone'
  BuildTestDockerImage:
    title: Building Test Docker image
    type: build
    arguments:
      image_name: '${{CF_ACCOUNT}}/${{CF_REPO_NAME}}-test'
      tag: '${{CF_BRANCH_TAG_NORMALIZED}}-${{CF_SHORT_REVISION}}'
      dockerfile: Test.Dockerfile
    stage: 'build'

  run_tests:
    stage: 'tests'
    image: '${{BuildTestDockerImage}}'
    working_directory: /src
    fail_fast: false
    environment:
      # set how many parallel jobs you want to run
      - KNAPSACK_PRO_CI_NODE_TOTAL=2
    matrix:
      environment:
        # please ensure you have here listed N-1 indexes
        # where N is KNAPSACK_PRO_CI_NODE_TOTAL
        - KNAPSACK_PRO_CI_NODE_INDEX=0
        - KNAPSACK_PRO_CI_NODE_INDEX=1
    commands:
      # run http server in the background (silent mode)
      # we did && echo on purpose to ensure Codefresh does not fail
      # when we pass npm process to background with & sign
      - (npm run start:ci &) && echo "start http server in the background"
      - $(npm bin)/knapsack-pro-cypress
```

Add `Test.Dockerfile` to your project repository.

```Dockerfile
FROM cypress/base:10

RUN apt-get update && \
  apt-get install -y \
  python3-dev \
  python3-pip

# Install AWS CLI
RUN pip3 install awscli

# Install Codefresh CLI
RUN wget https://github.com/codefresh-io/cli/releases/download/v0.31.1/codefresh-v0.31.1-alpine-x64.tar.gz
RUN tar -xf codefresh-v0.31.1-alpine-x64.tar.gz -C /usr/local/bin/

COPY . /src

WORKDIR /src

RUN npm install
```

#### Other CI provider

You have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-cypress

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-cypress
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as global environment.

## FAQ

:heavy_exclamation_mark: **NEW:** Up to date [FAQ for Knapsack Pro Cypress can be found here](https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_cypress).

**OLD:** This README also contains FAQ questions but we keep adding new info only to our new FAQ page mentioned above.

We keep this old FAQ in README to not break old links spread across the web.

### Knapsack Pro Core features FAQ

This project depends on `@knapsack-pro/core`. Please check the [FAQ for `@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js#table-of-contents) to learn more about core features available to you.

### How to run tests only from specific directory?

https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-cypress

### How to pass command line options?

https://knapsackpro.com/faq/question/how-to-pass-command-line-options-to-cypress

### How to record CI builds in Cypress Dashboard?

https://knapsackpro.com/faq/question/how-to-record-ci-builds-in-cypress-dashboard

## Development

### Requirements

You can use [NVM](https://github.com/nvm-sh/nvm) to manage Node version in development.

- `>= Node 12.18.3 LTS`

### Dependencies

- [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

### Setup

1. Setup [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) project.

**Follow below steps or use `bin/setup_development` script to take care of steps 2-5.**

2. Install dependencies:

   ```
   $ npm install
   ```

3. In order to use local version of `@knapsack-pro/core` run:

   ```
   $ npm link @knapsack-pro/core
   ```

4. Compile TypeScript code to `lib` directory by running:

   ```
   $ npm start
   ```

5. Register `@knapsack-pro/cypress` package globally in your local system. This way we will be able to develop other npm packages dependent on it:

   ```
   $ npm link
   ```

6. Set up your IDE:

   - Visual Studio Code

     - Install the following plugins:

       - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
       - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
       - [TypeScript TSLint Plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
       - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

     - Go to `File > Preferences > Settings > Text Editor > Formatting`

       Turn on `Format On Save` checkbox.

   From now on every change in code base will be automatically formatted by [Prettier](https://prettier.io/). [ESLint](https://eslint.org/) and [TSLint](https://palantir.github.io/tslint/) errors will be also automatically fixed on every file save.

7. Write some code.

### Publishing

1. Sign in to npm registry with command:

   ```
   $ npm adduser
   ```

2. Ensure you have the latest version of `@knapsack-pro/core` in `package.json`:

   ```
   {
     "dependencies": {
       "@knapsack-pro/core": "^x.x.x"
     }
   }
   ```

   Then run `npm install`. This way you will be able to test `@knapsack-pro/core` installed from npm registry instead of local one that was linked with `npm link @knapsack-pro/core`.

   Now commit updated `package.json` and `package-lock.json`.

   ```
   $ git commit -am "Update @knapsack-pro/core"
   ```

3. Before releasing a new version of package please update `CHANGELOG.md` with [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator):

   ```
   $ gem install github_changelog_generator

   # generate CHANGELOG.md
   $ github_changelog_generator --user KnapsackPro --project knapsack-pro-cypress
   $ git commit -am "Update CHANGELOG.md"
   $ git push origin master
   ```

4. If you have added new files to the repository and they should be part of the released npm package then please ensure they are included in `files` array in `package.json`.

5. If you have changed any headers in `README.md` please refresh table of contents with:

   ```
   $ npm run doctoc
   ```

6. Compile project:

   ```
   # ensure you use local version of @knapsack-pro/core
   $ npm link @knapsack-pro/core

   $ npm run build
   ```

7. In order to [bump version of the package](https://docs.npmjs.com/cli/version) run below command. It will also create a version commit and tag for the release:

   ```
   # bump patch version 0.0.x
   $ npm version patch

   # bump minor version 0.x.0
   $ npm version minor
   ```

8. Push to git repository created commit and tag:

   ```
   $ git push origin master --tags
   ```

9. Now when git tag is on Github you can update `CHANGELOG.md` again.

   ```
   $ github_changelog_generator --user KnapsackPro --project knapsack-pro-cypress
   $ git commit -am "Update CHANGELOG.md"
   $ git push origin master
   ```

10. Now you can publish package to npm registry:

    ```
    $ npm publish
    ```

11. Update the latest available library version in `TestSuiteClientVersionChecker` for the Knapsack Pro API repository.

### Testing

#### CI

If your feature requires code change in [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) then please push the `@knapsack-pro/core` to GitHub first. Then you can push changes for `@knapsack-pro/cypress` to ensure the CI will use the latest `@knapsack-pro/core`.

#### Example Cypress test suite

To test `@knapsack-pro/cypress` against real test suite we use forked [cypress-example-kitchensink](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/knapsack-pro/README.knapsack-pro.md) project.
