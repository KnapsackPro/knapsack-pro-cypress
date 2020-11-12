const minimist = require('minimist');
const { v4: uuidv4 } = require('uuid');

export class CypressCLI {
  // list should match camelCase args here
  // https://docs.cypress.io/guides/guides/module-api.html#cypress-run
  public static alias = {
    'ci-build-id': 'ciBuildId',
    'no-exit': 'noExit',
    'reporter-options': 'reporterOptions',
  };

  public static argvToOptions(): object {
    const argv = process.argv.slice(2);

    return minimist(argv, {
      alias: CypressCLI.alias,
    });
  }

  public static updateOptions(args: object): object {
    // If you want to send recorded data to Cypress Dashboard
    // then we need to generate a unique group name for set of tests fetched
    // from Knapsack Pro API for each cypress.run execution
    // Only then Cypress API accepts data
    // (Cypress not allow to use the same group name within the same CI build)
    if (args.hasOwnProperty('record')) {
      return {
        ...args,
        group: uuidv4(),
      };
    }

    return args;
  }
}
