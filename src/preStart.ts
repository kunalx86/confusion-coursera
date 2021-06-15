import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';


// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
    type: String,
  },
]);

// Set the env file
const result2 = dotenv.config({
  path: `./env/${options.env as string}.env`,
});

// Important because while in running in container docker will provide path to env file
// It will just not throw error if not running in container
// But that trade off should be ok
// if (result2.error) {
//   throw result2.error;
// }
