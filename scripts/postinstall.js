require('dotenv').config();
const { exec } = require('child_process');

if (process.env.KNAPSACK_PRO_ENV === 'development') {
  exec('npm link @knapsack-pro/core', (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}
