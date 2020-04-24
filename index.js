// rf-config, a small config loading lib for NodeJS

var fs = require('fs');

// error handling

var red = '\x1b[31m';
var black = '\x1b[0m';

// logging
var log = {
   info: console.log,
   warning: function () {
      var args = [].slice.apply(arguments); // convert arguments to an array
      args.unshift('[rf-config]');
      args.unshift(red);
      args.push(black);
      console.log.apply(this, args);
   },
   critical: function (err) {
      throw new Error(console.log(err));
   }
};
try { // try using rf-log
   log = require(require.resolve('rf-log')).customPrefixLogger('[rf-config]');
} catch (e) {}



var config = { },
   init = function (dirname) {
      var paths = module.exports.paths || {};
      paths.root = dirname || __dirname;
      paths.root += '/';


      // read config file
      config = tryConfigPath(paths.root + 'config/config.js') || {};

      config.paths = config.paths || {};
      config.configPaths = config.configPaths || {};

      validatePathesAndMakeAbsolute(config.paths, paths.root);
      config.paths.root = config.paths.root || paths.root; // import root path


      // read .env file
      const sourcePath = '.env';
      if (pathExists(sourcePath)) {
         const envfile = require('envfile');
         let env = envfile.parseFileSync(sourcePath);
         log.info(`reading ${sourcePath}: `, env);
         Object.assign(config, env);
      }


      // TODO: remove, when mail templates are moved to db
      // get config folder
      if (config.configPaths) {
         var confPath = paths.root + 'config/conf/';
         if (pathExists(confPath)) {
            config.paths.configFolder = confPath;
            validatePathesAndMakeAbsolute(config.configPaths, config.paths.configFolder);
         } else {
            log.info(`Config folder path ${confPath} is incorrect`);
         }
      }


      // get package.json
      paths.packageJsonPath = paths.packageJsonPath || paths.root + 'package.json';
      if (pathExists(paths.packageJsonPath)) {
         try {
            var packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, {
               encoding: 'utf8'
            }));

            config.app = {
               name: packageJson.name,
               version: packageJson.version,
               packageJson: packageJson
            };
         } catch (err) {
            log.critical('packageJson Error ', err);
         }
      } else {
         log.critical("packageJsonPath '" + paths.packageJsonPath + "' does not exist.");
      }



      // check if packageJson dependencies are up to Date
      require('check-dependencies')().then(function (output) {
         if (output.error && output.error.length > 0) {
            log.error('Please run "npm install", npm dependecy are not installed or old: ', output.error);
         }
      });



      // get license file
      paths.licenseFile = paths.licenseFile || paths.root + 'LICENSE';
      if (pathExists(paths.licenseFile)) {
         try {
            config.app = config.app || {};
            config.app.license = fs.readFileSync(paths.licenseFile, {
               encoding: 'utf8'
            });
         } catch (err) {
            log.critical('licenseFile Error ', err);
         }
      } else {
         log.warning("licenseFile '" + paths.licenseFile + "' does not exist.");
      }


      // optional: get changelog file
      paths.changelogFile = paths.changelogFile || paths.root + 'CHANGELOG.md';
      if (pathExists(paths.changelogFile)) {
         try {
            config.app = config.app || {};
            config.app.changelogFile = fs.readFileSync(paths.changelogFile, {
               encoding: 'utf8'
            });
         } catch (err) {
            log.critical('changelogFile Error ', err);
         }
      }



      // put config in export
      // the init function is no longer accessibel => config should not be loaded twice!
      module.exports = config;

      return module.exports;
   };



// expose interface
module.exports = {
   paths: {}
};
module.exports.init = init; // return once for module init



function validatePathesAndMakeAbsolute (pathObj, prefix) {
   if (pathObj) {
      for (var key in pathObj) {
         if (prefix) {
            pathObj[key] = prefix + pathObj[key]; // prefix => make everything absolute
         }

         if (!pathExists(pathObj[key])) {
            log.critical("Directory '" + pathObj[key] + "' does not exist -- please create it.");
         }
      }
   }
}


function tryConfigPath (path) {
   if (pathExists(path)) {
      try {
         var confTemp = require(path);
         try {
            // copy; keep original clean => loading again possible
            return JSON.parse(JSON.stringify(confTemp));
         } catch (err) {
            log.critical('Error in parsing config file ' + path, err);
         }
      } catch (err) {
         log.critical('Error in loading config file ' + path, err);
      }
   } else {
      log.warning(`No Config file found at path ${path}`);
   }
}



function pathExists (path) {
   return (fs.existsSync(path));
}
