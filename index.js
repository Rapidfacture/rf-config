// rf-config, read config.js, .env, packages.json, README and CHANGELOG

let fs = require('fs');
let log = require('rf-log').customPrefixLogger('[rf-config]');



function init (dirname) {
   let paths = {
      root: (dirname || __dirname) + '/'
   };


   // config.js
   let config = readConfigFile(paths.root + 'config/config.js');


   // package.json
   checkFile(paths.root + 'package.json', function (content) {
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
   checkFile(paths.root + 'LICENSE', function (content) {
      config.app.license = content;
   }, function () {
      log.warning('LICENSE does not exist.');
   });


   // CHANGELOG.md
   checkFile(paths.root + 'CHANGELOG.md', function (content) {
      config.app.changelogFile = content;
   });


   // keep the old relative paths in a copy:
   config.pathsRelative = config.paths || {};
   // then make them all absolute for easy usage in app
   validatePathesAndMakeAbsolute(config.paths, paths.root);


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



function readConfigFile (path) {
   if (fs.existsSync(path)) {
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

function checkFile (path, successFunc, warningFunction) {
   if (fs.existsSync(path)) {
      try {
         let content = fs.readFileSync(path, {
            encoding: 'utf8'
         });
         successFunc(content);
      } catch (err) {
         log.critical(`attemt failed to read ${path}`, err);
      }
   } else if (warningFunction) {
      warningFunction();
   }
}

function validatePathesAndMakeAbsolute (pathObj, prefix) {
   if (pathObj) {
      for (var key in pathObj) {
         if (prefix) {
            pathObj[key] = prefix + pathObj[key]; // prefix => make everything absolute
         }

         if (!fs.existsSync(pathObj[key])) {
            log.critical("Directory '" + pathObj[key] + "' does not exist -- please create it.");
         }
      }
   }
}
