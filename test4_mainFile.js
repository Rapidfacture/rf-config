// test script for rf-log

var test =  require("./tester.js");

var config = require("./index.js");
test(config, "Using rf-config from another file");

process.exit(1);
