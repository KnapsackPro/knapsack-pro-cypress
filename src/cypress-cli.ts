const minimist = require('minimist');

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
}
