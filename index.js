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

   config.paths = {}; // clear => prevent addition of absolute prefix several times
   config.configPaths = {};

   paths.root = dirname  || __dirname ;
   paths.root  += "/";



   // get config file
          if (tryConfigPath(paths.customConfigFile)) {
   } else if (tryConfigPath(paths.defaultConfigFile)) {
   } else if (tryConfigPath(paths.root + "config/conf/config.js")) {
   } else if (tryConfigPath(paths.root + "config/conf.default/config.js")) {
   } else {
       logError("[rf-config] Both config file pathes seem incorrect; customConfigFile: '" + paths.customConfigFile +
         "' and defaultConfigFile:'" + paths.defaultConfigFile + "'", "Please create a config file");
        return;
   }
   validatePathesAndMakeAbsolute(config.paths, paths.root);
   config.paths.root = config.paths.root || paths.root; // import root path




   // get config folder
   if(config.configPaths){
            if (tryConfigFolder(paths.customConfigFolder)) {
      } else if (tryConfigFolder(paths.defaultConfigFolder)) {
      } else if (tryConfigFolder(paths.root + "config/conf/")) {
      } else if (tryConfigFolder(paths.root + "config/conf.default/")) {
      } else {
         logError("[rf-config] Both config folder pathes seem incorrect; customConfigFolder: '" + paths.customConfigFolder +
           "' and defaultConfigFolder:'" + paths.defaultConfigFolder + "'", "Please create a config file");
      }
      validatePathesAndMakeAbsolute(config.configPaths, config.paths.configFolder);
   }





   // get package.json
   paths.packageJsonPath = paths.packageJsonPath || paths.root + 'package.json';
   if (pathExists(paths.packageJsonPath)) {
      try {
         config.packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, {
            encoding: 'utf8'
         }));
      } catch (err) {
         logError("[rf-config] packageJson Error ",  err);
      }

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


function tryConfigPath(path) {
   if(pathExists(path)){
      try {
         var confTemp = require(path);
         try {
            // copy; keep original clean => loading again possible
            config = JSON.parse(JSON.stringify(confTemp));
         } catch (err) {
            logError("[rf-config] Error in parsing config file " + path,  err);
         }
      } catch (err) {
         logError("[rf-config] Error in loading config file " + path,  err);
      }

      return true;
   }
   return false;
}

function tryConfigFolder(path) {
   if(pathExists(path)){
      config.paths.configFolder = path;
      return true;
   }
   return false;
}

function pathExists(path) {
   return (fs.existsSync(path));
}
