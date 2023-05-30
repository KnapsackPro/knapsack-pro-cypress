export class EnvConfig {
  public static loadEnvironmentVariables(): void {
    if (process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS) {
      process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN =
        process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS;
    }
  }

  public static get testFilePattern(): string {
    if (process.env.KNAPSACK_PRO_TEST_FILE_PATTERN) {
      return process.env.KNAPSACK_PRO_TEST_FILE_PATTERN;
    }

    return 'cypress/e2e/**/*.{js,jsx,coffee,cjsx}';
  }

  public static get testFileExcludePattern(): void | string {
    return process.env.KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN;
  }
}
