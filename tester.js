module.exports = tester;

function tester (config, testName) {
   console.log('\x1b[34m', "starting test '" + testName + "'", '\x1b[0m');
   test('config.abc', config.abc, 'def');
   test('config.paths.myReadme', config.paths.myReadme);
   test('config.configPaths.testFile', config.configPaths.testFile);
   test('config.app.packageJson.name', config.app.packageJson.name, 'rf-config');
   test('config.app.name', config.app.name, 'rf-config');
   console.log('\x1b[32m', 'test passed.', '\x1b[0m');
   // console.log("config is: ", config);
}

function test (name, value, equals) {
   if (!equals) {
      if (value) {
         // console.log("test passed:", value);
      } else {
         console.error("Error validating '" + name + "' value is: '" + equals);
         process.exit(1);
      }
   } else {
      if (value && value === equals) {
         // console.log("test passed:", value + " is " + equals);
      } else {
         console.error("Error validating '" + name + "' value should be: '" + equals + "' but is '" + value + "'");
         process.exit(1);
      }
   }
}
