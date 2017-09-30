# rf-config

* Simple NodeJS config read-in library
* Loads a default or custom config file
* Falls back on `./config/conf/config.js` (custom), then on `./config/conf.default/config.js` if no file specified
* Loads a default or custom config folder
* Falls back on `./config/conf/` (custom), then on `./config/conf.default/` if not specified
* `config.paths` variable used to store project relative paths from root. Paths are made absolute and existence is validated
* `config.configPaths` variable used to store paths relative in config folder. Paths are made absolute and existence is validated
* Adds content from ./package.json (required)
* Adds content from ./LICENSE (required)
* Error handling; optional dependency: Uses rf-log for error logging if available

## Getting Started

> npm install rf-config

To load this config.js file in `./config/conf/config.js`:
```js
module.exports = {
   config: 'local',
   abc: 'def',
   paths: {
      myReadme: 'README.md', // /README.md in root folder
      gitignore: '.gitignore',
      webserver: 'dest',
      server: 'server',
   },
   configPaths : {
      mail : 'mail' // converted to /config/conf/mail (main config folder)
   }
};
```

Use this single line:

```js
var config = require('rf-config').init(__dirname); // root path '__dirname'

console.log(config);
// this returns a configuration like:

{
   config: 'local',
   abc: 'def',
   paths: {
      myReadme: '/home/user/project/README.md',
      gitignore: '/home/user/project/.gitignore'
   },
   configPaths: {
      mail: '/home/user/project/config/conf/mail',
   },
   packageJson: {
      name: 'rf-config',
      version: '0.1.6',
      description: 'Simple NodeJS config loading lib',
      author: 'Rapidfacture GmbH',
      license: 'MIT',
      main: 'index.js'
   },
   app: {
      name: 'rf-config',
      version: '0.1.6'
   }
}
```

Once Loaded, access the configuration later in other files with:
```js
var config = require('rf-config');
```
NOTE: The `init` function is only present the first time, as the config should be loaded only once - when the project starts.

## Configuration
```js
var setupConfig = require('rf-config');
setupConfig.paths.customConfigFile =  __dirname + '/newCustomPath/config.js';
setupConfig.paths.defaultConfigFile =  __dirname + '/newPath/config.js';
setupConfig.paths.customConfigFolder =  __dirname + '/newCustomPath/';
setupConfig.paths.defaultConfigFolder =  __dirname + '/newPath/';
setupConfig.paths.packageJsonPath =  __dirname + '/newPath/packageJson.json';
setupConfig.paths.licenseFile =  __dirname + '/newPath/LICENSE';

var config = setupConfig.init();

console.log(config);

```
## Testing
Run the test script:
> sh test.sh

This runs each node script (test1.js, test2.js, ...)


Please also lint the file using jshint.

## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr, Julian von Mendel
