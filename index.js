// rf-config, a small config loading lib for NodeJS

var fs = require("fs"); // Filesystem operations
var logError = console.log;
try { // try using rf-log
   logError = require(require.resolve("rf-log")).error;
} catch (e) {}

module.exports.config = {};
var paths = module.exports.paths = {};
var config = {};



module.exports.loadFrom = function(dirname) {

   // defaults
   paths.root = dirname || __dirname;
   config.paths = config.paths || {};
   config.paths.root = config.paths.root || paths.root; // import root path



   // get config file
          if (tryConfigPath(paths.customConfigFile)) {
   } else if (tryConfigPath(paths.defaultConfigFile)) {
   } else if (tryConfigPath(paths.root + "/config/conf/config.js")) {
   } else if (tryConfigPath(paths.root + "/config/conf.default/config.js")) {
   } else {
             logError("Both config file pathes seem incorrect; custom: '" + paths.customConfigFile +
               "' and standard:'" + paths.defaultConfigFile + "'", "Please create a config file");
              return;
   }



   // verify config.paths
   for (var key in config.paths) {
      var path = config.paths[key];
      if (!pathExists(path)) {
         logError("Directory '" + path + "' does not exist -- please create it.");
         return;
      }
   }


   // Add package.json to configuration
   paths.packageJsonPath = paths.packageJsonPath || paths.root + '/package.json';
   if (pathExists(paths.packageJsonPath)) {
      config.packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, {
         encoding: 'utf8'
      }));

      config.app = {
         name: config.packageJson.name,
         version: config.packageJson.version,
      };
   }


   module.exports.config = config;

   return config;
};


function tryConfigPath(path) {
   if(pathExists(path)){
      config = require(path);
      return true;
   }
   return false;
}

function pathExists(path) {
   return (fs.existsSync(path));
}
