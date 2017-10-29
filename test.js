
var execSync = require('child_process').execSync

exec('node test1.js')
exec('node test2.js')
exec('node test3.js')
exec('node test3.js')

function exec (cmd) {
   try {
      console.log(execSync(cmd).toString())
   } catch (error) {
      console.log(error.message)
      process.exit(1)
   }
}


console.log('all Tests passed; fine')
process.exit(0)
