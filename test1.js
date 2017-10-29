// test script for rf-log

var test = require('./tester.js')

var config = require('./index.js').init()
test(config, 'standard config; no dirname')
