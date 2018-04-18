// test script for rf-log

var test = require('./tester.js');


var config = require('./index.js').init(__dirname);
test(config, 'standard config; dirname from script');
