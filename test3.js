// test script for rf-log

var test = require('./tester.js');
var path = require('path');


var config = require('./index.js');
config.paths.customConfigFile = path.join(__dirname, '/config/conf.local/config.js');
config = config.init();
test(config, 'modified file path for config variable');
