# @knapsack-pro/cypress

[![CircleCI](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg)](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress)

`@knapsack-pro/cypress` is JS npm package to run your E2E tests with [Cypress.io](https://www.cypress.io) test runner with optimal test suite parallelisation using [KnapsackPro.com](https://knapsackpro.com).

We use Knapsack Pro Queue Mode. Learn more in the video [how to run tests with dynamic test suite split](https://youtu.be/hUEB1XDKEFY) thanks to Queue Mode.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [How to use](#how-to-use)
- [FAQ](#faq)
  - [How to run tests only from specific directory?](#how-to-run-tests-only-from-specific-directory)
- [Dependencies](#dependencies)
- [Development](#development)
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

TODO

## FAQ

### How to run tests only from specific directory?

You can set `KNAPSACK_PRO_TEST_FILE_PATTERN=cypress/integration/**/*.{js,jsx,coffee,cjsx}` and change pattern to match your directory with test files. You can use [glob](https://github.com/isaacs/node-glob) pattern.

## Dependencies

* [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

## Development

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

## Publishing

Ensure you have in `package.json` the latest version of `@knapsack-pro/core` and you run `npm install`:

```
{
  "dependencies": {
    "@knapsack-pro/core": "latest"
  }
}
```

## Testing

### CI

If your feature requires code change in [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) then please push the `@knapsack-pro/core` to GitHub first. Then you can push changes for `@knapsack-pro/cypress` to ensure the CI will use the latest `@knapsack-pro/core`.

### Example Cypress test suite

To test `@knapsack-pro/cypress` against real test suite we use forked [cypress-example-kitchensink](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/knapsack-pro/README.knapsack-pro.md) project.
