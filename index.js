// rf-config, a small config loading lib for NodeJS

var fs = require("fs");

// error handling
var error = console.log;
try { // try using rf-log
   error = require(require.resolve("rf-log")).error;
} catch (e) {}
function logError (err){
   throw new Error(error(err));
}

module.exports.config = {};
var paths = module.exports.paths = {};
var config = {};



module.exports.loadFrom = function(dirname) {

   paths.root = dirname  || __dirname ;
   paths.root  += "/";



   // get config file
          if (tryConfigPath(paths.customConfigFile)) {
   } else if (tryConfigPath(paths.defaultConfigFile)) {
   } else if (tryConfigPath(paths.root + "config/conf/config.js")) {
   } else if (tryConfigPath(paths.root + "config/conf.default/config.js")) {
   } else {
             logError("[rf-config] Both config file pathes seem incorrect; custom: '" + paths.customConfigFile +
               "' and standard:'" + paths.defaultConfigFile + "'", "Please create a config file");
              return;
   }
   config.paths = {}; // clear => prevent addition of absolute prefix several times
   validatePathesAndMakeAbsolute(config.paths, paths.root);
   config.paths.root = config.paths.root || paths.root; // import root path




   // get config folder
   if(config.configPaths){
            if (tryConfigFolder(paths.customConfigFolder)) {
      } else if (tryConfigFolder(paths.defaultConfigFolder)) {
      } else if (tryConfigFolder(paths.root + "config/conf/")) {
      } else if (tryConfigFolder(paths.root + "config/conf.default/")) {
      } else {
               throw (logError("[rf-config] Both config folder pathes seem incorrect; custom: '" + paths.customConfigFolder +
                 "' and standard:'" + paths.defaultConfigFolder + "'", "Please create a config file"));
      }
      config.configPaths = {}; // clear => prevent addition of absolute prefix several times
      validatePathesAndMakeAbsolute(config.configPaths, config.paths.configFolder);
   }





   // get package.json
   paths.packageJsonPath = paths.packageJsonPath || paths.root + 'package.json';
   if (pathExists(paths.packageJsonPath)) {
      config.packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, {
         encoding: 'utf8'
      }));

      config.app = {
         name: config.packageJson.name,
         version: config.packageJson.version,
      };
   }else{
      logError("[rf-config] packageJsonPath '" + paths.packageJsonPath + "' does not exist.");
   }




   module.exports.config = config;

   return config;
};



function validatePathesAndMakeAbsolute(pathArray, prefix) {
   for (var key in pathArray) {

      if(prefix){{
         pathArray[key] = prefix + pathArray[key]; // prefix => make everything absolute
      }}

      if (!pathExists(pathArray[key])) {
         logError("[rf-config] Directory '" + pathArray[key] + "' does not exist -- please create it.");
      }
   }
}

function tryConfigFolder(path) {
   if(pathExists(path)){
      config.paths.configFolder = path;
      return true;
   }
   return false;
}

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
