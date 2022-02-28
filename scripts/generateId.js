/* eslint-disable no-undef */
const replace = require('replace-in-file')
const { argv } = require('yargs')
const { v4: uuidv4 } = require('uuid')

// node /Users/michk/Documents/Programming/booking-system/scripts/generateId.js -f ./src/utils/data.js
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
  (a) => process.exit(),
  (err) => {
    console.log(err)
    process.exit(1)
  }
)
