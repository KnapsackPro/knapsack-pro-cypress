# @knapsack-pro/cypress

[![CircleCI](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress.svg?style=svg)](https://circleci.com/gh/KnapsackPro/knapsack-pro-cypress)

`@knapsack-pro/cypress` is JS npm package to run your E2E tests with [Cypress.io](https://www.cypress.io) test runner with optimal test suite parallelisation using [KnapsackPro.com](https://knapsackpro.com).

We use Knapsack Pro Queue Mode. Learn more in the video [how to run tests with dynamic test suite split](https://youtu.be/hUEB1XDKEFY).

## Dependencies

* [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js)

## Development

```
$ npm install
```

Compile typescript code with `gulp`. The output will be in `bin` directory.

```
$ npm start
```

## Testing

### CI

If your feature requires code change in [@knapsack-pro/core](https://github.com/KnapsackPro/knapsack-pro-core-js) then please push the `@knapsack-pro/core` to GitHub first. Then you can push changes for `@knapsack-pro/cypress` to ensure the CI will use the latest `@knapsack-pro/core`.