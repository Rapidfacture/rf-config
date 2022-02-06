// rf-config, read config.js, .env, packages.json, README and CHANGELOG
let fs = require('fs');
let path = require('path');
let log = require('rf-log').customPrefixLogger('[rf-config]');

function init (dirname) {
   let rootPath = dirname || __dirname;

   // config/config.js => regular config
   let config = readConfigFile(path.join(rootPath, './config/config.js'));

   // config.js => custom config overwrites regular config
   let customConfig = readConfigFile(path.join(rootPath, './config.js'));
   Object.assign(config, customConfig);

   // package.json
   checkFile(path.join(rootPath, './package.json'), function (content) {
      try {
         var packageJson = JSON.parse(content);
         config.app = {
            name: packageJson.name,
            version: packageJson.version,
            packageJson: packageJson
         };
      } catch (err) {
         log.critical('packageJson Error ', err);
      }
   }, function () {
      log.critical('package.json does not exist.');
   });

   // LICENSE
   checkFile(path.join(rootPath, './LICENSE'), function (content) {
      config.app.license = content;
   }, function () {
      log.warning('LICENSE does not exist.');
   });

   // CHANGELOG.md
   checkFile(path.join(rootPath, './CHANGELOG.md'), function (content) {
      config.app.changelogFile = content;
   });

   // keep the old relative paths in a copy:
   config.pathsRelative = config.paths || {};
   // then make them all absolute for easy usage in app
   validatePathesAndMakeAbsolute(config.paths, rootPath);

   // .env file
   const sourcePath = '.env';
   if (fs.existsSync(sourcePath)) {
      const envfile = require('envfile');
      let env = envfile.parseFileSync(sourcePath);
      log.info(`reading ${sourcePath}: `, env);
      Object.assign(config, env);
   }

   // check if packageJson dependencies are up to Date
   require('check-dependencies')().then(function (output) {
      if (output.error && output.error.length > 0) {
         log.error('Please run "npm install", npm dependecy are not installed or old: ', output.error);
      }
   });

   // put config in export
   // the init function is no longer accessibel => config should not be loaded twice!
   module.exports = config;

   return module.exports;
}

// expose interface
module.exports = {
   init
};

function readConfigFile (configPath) {
   if (fs.existsSync(configPath)) {
      try {
         var confTemp = require(configPath);
         try {
            // copy; keep original clean => loading again possible
            return JSON.parse(JSON.stringify(confTemp));
         } catch (err) {
            log.critical('Error in parsing config file ' + configPath, err);
         }
      } catch (err) {
         log.critical('Error in loading config file ' + configPath, err);
      }
   } else {
      log.info(`No Config file found at ${configPath}`);
   }
}

function checkFile (filePath, successFunc, warningFunction) {
   if (fs.existsSync(filePath)) {
      try {
         let content = fs.readFileSync(filePath, {
            encoding: 'utf8'
         });
         successFunc(content);
      } catch (err) {
         log.critical(`attemt failed to read ${filePath}`, err);
      }
   } else if (warningFunction) {
      warningFunction();
   }
}

function validatePathesAndMakeAbsolute (pathObj, rootPath) {
   if (pathObj) {
      for (var key in pathObj) {

         // make everything absolute
         if (rootPath) pathObj[key] = path.join(rootPath, pathObj[key]);

         if (!fs.existsSync(pathObj[key])) {
            log.critical("Directory '" + pathObj[key] + "' does not exist -- please create it.");
         }
      }
   }
}
