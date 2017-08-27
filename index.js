// rf-config, a small config loading lib for NodeJS

var fs = require("fs"); // Filesystem operations
var logError = console.log;

// use rf-log for error logging if available
try {
   logError = require(require.resolve("rf-log")).error;
} catch(e) {}

module.exports.loadFrom = function (dirname) {
   // Determine configuration directory
   var configPath;
   checkPath(dirname + "/config/conf.default"); // set path to standard path
   checkPath(dirname + "/config/conf"); // custom folder? => set path to it

   function checkPath(path){
      if (fs.existsSync(path)){
         configPath = path;
      }
   }

   // Add paths to configuration
   var paths = {
      root : dirname,
      config : configPath,
   };

   var config = require(configPath + "/config.js"); // import global configuration
   config.paths = ((typeof config.paths == 'object') ? config.paths : {});
   Object.keys(paths).forEach(function (key) {
      config.paths[key] = paths[key];
   });

   // Verify existence of all config paths
   Object.keys(config.paths).forEach(function (key) {
      var path = config.paths[key];
      if (!fs.existsSync(path)) {
         logError("Directory '" + path + "' does not exist -- please create it.");
         return;
      }
   });
   
   // Add package.json to configuration
   var packageJson = fs.readFileSync(dirname + '/package.json',
         { encoding: 'utf8' });
   
   config.packageJson = JSON.parse(packageJson);

   config.app = {
      name: config.packageJson.name,
      version: config.packageJson.version,
   };

   return config;
};

