/* eslint-disable no-undef */

import { replaceInFile as replace } from "replace-in-file";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { v4 as uuidv4 } from "uuid";

// Standing in the root of the project, run the following command:
// node scripts/generateId.js -f src/**/*.js
async function runScript() {
  try {
    const argv = yargs(hideBin(process.argv)).argv;
    if (argv._) {
      const generatedIds = [];
      const options = {
        files: argv._,
        from: /newId/g,
        to: () => {
          const id = uuidv4();
          console.log(id);
          generatedIds.push(id);
          return id;
        },
      };

      const results = await replace(options);
      console.log("Replacement results:", results);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

runScript().then(
  () => process.exit(),
  (err) => {
    console.log(err);
    process.exit(1);
  },
);
