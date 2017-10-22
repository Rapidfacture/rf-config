// test script for rf-log

var test =  require("./tester.js");


var config = require("./index.js");
config.paths.customConfigFile =  __dirname + "/config/conf.local/config.js";
config = config.init();
test(config, "modified file path for config variable");
