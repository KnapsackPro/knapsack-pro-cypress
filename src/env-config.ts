export class EnvConfig {
  public static get testFilePattern(): string {
    if (process.env.KNAPSACK_PRO_TEST_FILE_PATTERN) {
      return process.env.KNAPSACK_PRO_TEST_FILE_PATTERN;
    }

    return "cypress/integration/**/*.{js,jsx,coffee,cjsx}";
  }
}
