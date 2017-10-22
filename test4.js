// test script for rf-log

var config = require("./index.js");
config.paths.customConfigFile =  __dirname + "/config/conf.local/config.js";
config = config.init();

require("./test4_mainFile.js");

process.exit(1);
