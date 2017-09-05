# rf-config

* Simple NodeJS config read-in library
* Loads a default or custom config file
* Falls back on `./config/conf/config.js` (custom), then on `./config/conf.default/config.js` if no file specified
* Adds contents from ./package.json
* `config.path` variable used to store project paths. Path existence is validated
* Error handling
* Optional dependency: Uses rf-log for error logging if available

## Getting Started

> npm install rf-config

To load this config.js file:
```js
module.exports = {
   config: 'local',
   abc: 'def',
   paths: {
      myReadme: 'README.md',
      gitignore: '.gitignore'
   },
};
```

Use this single line:

```js
var config = require("rf-config").loadFrom(__dirname); // root path "__dirname"

console.log(config);
// this returns a configuration like:

{
   config: 'local',
   abc: 'def',
   paths: {
      myReadme: 'README.md',
      gitignore: '.gitignore'
   },
   packageJson: {
      name: 'rf-config',
      version: '0.1.6',
      description: 'Simple NodeJS config loading lib that compiles a reasonable default config variable - no dependencies.',
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

Once Loaded, access the configuration later from another module with:
```js
var config = require("rf-config").config;
```
## Configuration
```js
var setupConfig = require("rf-config");
setupConfig.paths.customConfigFile =  __dirname + "/newCustomPath/config.js";
setupConfig.paths.defaultConfigFile =  __dirname + "/newPath/config.js";
setupConfig.paths.packageJsonPath =  __dirname + "/newPath/packageJson.json";

var config = setupConfig.loadFrom();

console.log(config);

```


## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr, Julian von Mendel
