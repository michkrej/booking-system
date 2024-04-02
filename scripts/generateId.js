/* eslint-disable no-undef */
const replace = require('replace-in-file')
const { argv } = require('yargs')
const { v4: uuidv4 } = require('uuid')

// Standing in the root of the project, run the following command:
// node scripts/generateId.js -f src/**/*.js
async function runScript() {
  try {
    if (argv.f) {
      const generatedIds = []
      const options = {
        files: argv.f,
        from: /newId/g,
        to: () => {
          const id = uuidv4()
          console.log(id)
          generatedIds.push(id)
          return id
        }
      }

      const results = await replace(options)
      console.log('Replacement results:', results)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

runScript().then(
  () => process.exit(),
  (err) => {
    console.log(err)
    process.exit(1)
  }
)
