// test script for rf-log

var config = require("./index.js");
config.paths.customConfigFile =  __dirname + "/config/conf.local/config.js";
config = config.init();
testConfig(config, "modifiedVariables");

console.log("\x1b[32m", "Test is fine. config is: ", '\x1b[0m');
console.log(config);


function testConfig(config, testName){
   console.log("\x1b[34m", "starting test " + testName, '\x1b[0m');
   console.log("\x1b[32m", "configuration " + config.config, '\x1b[0m');
   test("config.abc", config.abc, 'def');
   test("config.paths.myReadme", config.paths.myReadme);
   test("config.configPaths.testFile", config.configPaths.testFile);
   test("config.packageJson.name", config.packageJson.name, 'rf-config');
   test("config.app.name", config.app.name, 'rf-config');
   console.log("\x1b[32m", "test " +testName+" passed", '\x1b[0m');
}

function test(name, value, equals){
      if(!equals){
         if(value){
            //console.log("test passed:", value);
         }else {
            throw("Error validating '" + name + "' value is: '" + equals);
         }
      }else{
         if(value && value == equals){
            //console.log("test passed:", value + " is " + equals);
         }else {
            throw("Error validating '" + name + "' value should be: '" + equals + "' but is '" + value +"'");
         }
      }
}
