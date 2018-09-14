require('dotenv').config();
const { exec } = require('child_process');

if (process.env.KNAPSACK_PRO_ENV === 'development') {
  console.log('================================================================');
  console.log('You have set in .env file a KNAPSACK_PRO_ENV=development');
  console.log('The local version of @knapsack-pro/core will be used.');
  console.log('================================================================');

  exec('npm link @knapsack-pro/core', (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}
