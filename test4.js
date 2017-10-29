// test script for rf-log

var config = require('./index.js')
var path = require('path')

config.paths.customConfigFile = path.join(__dirname, '/config/conf.local/config.js')
config = config.init()

require('./test4_mainFile.js')
