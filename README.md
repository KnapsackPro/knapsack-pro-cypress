# @knapsack-pro/cypress

<p align="center">
  <a href="https://knapsackpro.com?utm_source=github&utm_medium=readme&utm_campaign=knapsack-pro-cypress&utm_content=hero_logo">
    <img alt="Knapsack Pro" src="./.github/assets/knapsack.png" width="300" height="300" style="max-width: 100%;" />
  </a>
</p>

<h3 align="center">Speed up your tests</h3>
<p align="center">Run your 1-hour test suite in 2 minutes with optimal parallelisation on your existing CI infrastructure</p>

---

<div align="center">
  <a href="https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress">
    <img alt="Circle CI" src="https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg" />
  </a>
</div>

<br />
<br />

Knapsack Pro wraps the [Cypress.io](https://www.cypress.io) test runner and works with your existing CI infrastructure to parallelize tests optimally:

- Dynamically splits your tests based on up-to-date test execution data
- Is designed from the ground up for CI and supports all of them
- Tracks your CI builds to detect bottlenecks
- Does not have access to your source code and collects minimal test data
- Enables you to export historical metrics about your CI builds
- Replaces local dependencies like Redis with an API and runs your tests regardless of network problems

## Installation

See the [docs](https://docs.knapsackpro.com/cypress/guide/) to get started:

<div align="center">
  <a href="https://docs.knapsackpro.com/cypress/guide/">
    <img alt="Install button" src="./.github/assets/install-button.png" width="116" height="50" />
  </a>
</div>

## Contributing

### Requirements

```
>= Node 18.13.0 LTS
```

You can use [NVM](https://github.com/nvm-sh/nvm) to manage Node versions in development.

### Dependencies

- [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

### Setup

1. Setup the [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) project.

   **Follow the steps below or use the `bin/setup_development` script to take care of steps 2-5.**

1. Install the dependencies:

   ```bash
   npm install
   $(npm bin)/cypress install
   ```

1. In order to use the local version of `@knapsack-pro/core` run:

   ```bash
   npm link @knapsack-pro/core
   ```

1. Compile the TypeScript code to the `lib` directory by running:

   ```bash
   npm start
   ```

1. Register the `@knapsack-pro/cypress` package globally in your local system. This way we will be able to develop other npm packages dependent on it:

   ```bash
   npm link
   ```

1. Set up your IDE:

   - Visual Studio Code

     - Install the following plugins:

       - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
       - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
       - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

     - Go to `File > Preferences > Settings > Text Editor > Formatting`

       Turn on `Format On Save` checkbox.

   From now on, every change in the codebase will be automatically formatted by [Prettier](https://prettier.io/). [ESLint](https://eslint.org/) shows errors and warnings in VSCode.

1. Write some code.

### Testing

#### CI

If your feature requires code changes in [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js), please push the `@knapsack-pro/core` to GitHub first. Then you can push changes for `@knapsack-pro/cypress` to ensure the CI will use the latest `@knapsack-pro/core`.

#### Cypress example test suite

To test `@knapsack-pro/cypress` against a real test suite we use the [cypress-example-test-suite](https://github.com/KnapsackPro/cypress-example-test-suite) project.

### Publishing

1. Sign in to the npm registry with:

   ```bash
   npm adduser
   ```

1. Ensure you have the latest version of `@knapsack-pro/core` in `package.json`:

   ```bash
   {
     "dependencies": {
       "@knapsack-pro/core": "^x.x.x"
     }
   }
   ```

   Run `npm install`. This way you will be able to test `@knapsack-pro/core` installed from npm registry instead of the local one that was linked with `npm link @knapsack-pro/core`.

   Commit the updated `package.json` and `package-lock.json`:

   ```bash
   git commit -am "Update @knapsack-pro/core"
   ```

1. Before releasing a new version of the package, please update `CHANGELOG.md` with [`github_changelog_generator`](https://github.com/github-changelog-generator/github-changelog-generator):

   ```bash
   gem install github_changelog_generator

   # generate CHANGELOG.md
   github_changelog_generator --user KnapsackPro --project knapsack-pro-cypress
   git commit -am "Update CHANGELOG.md"
   git push origin master
   ```

1. If you have added new files to the repository, and they should be part of the released npm package, please ensure they are included in the `files` array in `package.json`.

1. Compile the project:

   ```bash
   # Ensure you use the local version of @knapsack-pro/core
   npm link @knapsack-pro/core

   npm run build
   ```

1. In order to [bump the version of the package](https://docs.npmjs.com/cli/version) run the command below. It will also create a version commit and tag for the release:

   ```bash
   # Bump patch version 0.0.x
   npm version patch

   # Bump minor version 0.x.0
   npm version minor
   ```

1. Push the commit and tag:

   ```bash
   git push origin master --tags
   ```

1. When the git tag is on Github, you can update `CHANGELOG.md`:

   ```bash
   github_changelog_generator --user KnapsackPro --project knapsack-pro-cypress
   git commit -am "Update CHANGELOG.md"
   git push origin master
   ```

1. Publish the package to the npm registry:

   ```bash
   npm publish
   ```

1. Update the latest available library version in:

   - `TestSuiteClientVersionChecker` for the Knapsack Pro API repository.
   - [cypress-example-test-suite](https://github.com/KnapsackPro/cypress-example-test-suite)
