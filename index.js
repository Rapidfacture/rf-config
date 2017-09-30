// rf-config, a small config loading lib for NodeJS

var fs = require("fs");

// error handling
var logError = function(err){
   throw new Error(console.log(err));
};
try { // try using rf-log
   var critical = require(require.resolve("rf-log")).critical;
   if(critical) logError = critical;
} catch (e) {}



var config = {
      paths: {},
      configPaths: {}
   },
   init = function(dirname) {

   var paths = module.exports.paths;
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
         var packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, {
            encoding: 'utf8'
         }));

         config.app = {
            name: config.packageJson.name,
            version: config.packageJson.version,
            packageJson: packageJson
         };

      } catch (err) {
         logError("[rf-config] packageJson Error ",  err);
      }
   }else{
      logError("[rf-config] packageJsonPath '" + paths.packageJsonPath + "' does not exist.");
   }




   // get license file
   paths.licenseFile = paths.licenseFile || paths.root + 'LICENSE';
   if (pathExists(paths.licenseFile)) {

      try {
         config.app = config.app || {};
         config.app.license = fs.readFileSync(paths.licenseFile, {
            encoding: 'utf8'
         });

      } catch (err) {
         logError("[rf-config] packageJson Error ",  err);
      }

   }else{
      logError("[rf-config] licenseFile '" + paths.licenseFile + "' does not exist.");
   }





   // put config in export
   // the init function is no longer accessibel => config should not be loaded twice!
   module.exports = config;

   return module.exports;
};



// expose interface
module.exports = {
   paths:{}
};
module.exports.init = init; // return once for module init




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
