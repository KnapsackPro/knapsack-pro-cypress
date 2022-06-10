// eslint-disable-next-line @typescript-eslint/no-var-requires
const minimist = require('minimist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static updateOptions(args: any): object {
    // If you want to send recorded data to Cypress Dashboard
    // then we need to generate a unique group name for set of tests fetched
    // from Knapsack Pro API for each cypress.run execution
    // Only then Cypress API accepts data
    // (Cypress not allow to use the same group name within the same CI build)
    // eslint-disable-next-line no-prototype-builtins
    if (args.hasOwnProperty('record') && args.record !== 'false') {
      return {
        ...args,
        group: uuidv4(),
      };
    }

    return args;
  }
}
