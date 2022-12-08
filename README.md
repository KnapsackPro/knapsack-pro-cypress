# @knapsack-pro/cypress

[![CircleCI](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg)](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress)

`@knapsack-pro/cypress` runs your E2E tests with [Cypress.io](https://www.cypress.io) test runner and does dynamic tests allocation across parallel CI nodes using [KnapsackPro.com](https://knapsackpro.com?utm_source=github&utm_medium=readme&utm_campaign=%40knapsack-pro%2Fcypress&utm_content=sign_up) Queue Mode to provide the fastest CI build time (optimal test suite timing).

Learn about Knapsack Pro Queue Mode in the video [how to run tests with dynamic test suite split](https://youtu.be/hUEB1XDKEFY) and learn what CI problems can be solved thanks to it.

Read article about [runnning javascript E2E tests faster with Cypress on parallel CI nodes](https://docs.knapsackpro.com/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Installation](#installation)
- [FAQ](#faq)
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

See the [docs](https://docs.knapsackpro.com/cypress/guide/) to get started.

## FAQ

- [FAQ for Knapsack Pro Cypress can be found here](https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_cypress).

- This project depends on `@knapsack-pro/core`. Please check the [FAQ for `@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js#table-of-contents) to learn more about core features available to you.

## Development

### Requirements

You can use [NVM](https://github.com/nvm-sh/nvm) to manage Node version in development.

- `>= Node 16.15.1 LTS`

### Dependencies

- [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

### Setup

1. Setup [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) project.

**Follow below steps or use `bin/setup_development` script to take care of steps 2-5.**

2. Install dependencies:

   ```
   $ npm install
   $(npm bin)/cypress install
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
       - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

     - Go to `File > Preferences > Settings > Text Editor > Formatting`

       Turn on `Format On Save` checkbox.

   From now on, every change in code base will be automatically formatted by [Prettier](https://prettier.io/). [ESLint](https://eslint.org/) shows errors and warnings in VSCode.

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
