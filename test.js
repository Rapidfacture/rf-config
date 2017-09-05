// test script for rf-log


testConfig(require("./index.js").loadFrom(), "standard config; no dirname");


testConfig(require("./index.js").loadFrom(__dirname), "standard config; dirname from script");


var modifiedVariables = require("./index.js");
modifiedVariables.paths.customConfigFile =  __dirname + "/config/conf.local/config.js";
modifiedVariables = modifiedVariables.loadFrom();
testConfig(modifiedVariables, "modifiedVariables");


console.log("\x1b[32m", "All tests fine. config is: ", '\x1b[0m');
console.log(modifiedVariables);


function testConfig(config, testName){
   console.log("\x1b[34m", "starting test " + testName, '\x1b[0m');
   console.log("\x1b[32m", "configuration " + config.config, '\x1b[0m');
   test(config.abc, 'def');
   test(config.packageJson.name, 'rf-config');
   test(config.app.name, 'rf-config');
   console.log("\x1b[32m", "test " +testName+" passed", '\x1b[0m');
}

function test(value, equals){
      if(value && value == equals){
         //console.log("test passed:", value + " is " + equals);
      }else {
         throw("value should be: '" + equals + "' but is '" + value +"'");
      }
}
