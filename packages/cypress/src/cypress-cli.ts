// eslint-disable-next-line @typescript-eslint/no-var-requires
const minimist = require('minimist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');

export class CypressCLI {
  // Translate Cypress options to Cypress CLI options:
  // Cypress options: https://docs.cypress.io/guides/guides/command-line#Commands
  // Cypress CLI options (with camelCase): https://docs.cypress.io/guides/guides/module-api.html#cypress-run
  public static alias = {
    'ci-build-id': 'ciBuildId',
    'config-file': 'configFile',
    'reporter-options': 'reporterOptions',
    'slow-test-threshold': 'slowTestThreshold',
    'testing-type': 'testingType',
    'no-exit': 'noExit',
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
