# rf-config

* Simple NodeJS config read-in lib
* Optional dependency: Uses rf-log for error logging if available
* Configurable base dir
* Creates a config variable with object from ./config/conf/config.js, if directory is available. As a fallback, ./config/conf.default/ is used.
* Additionally, contents from ./package.json are inserted into that same configuration variable
* The existence of all paths you define in your config.js in the "paths" key is verified and errors are logged

## Getting Started

> npm install rf-config

config.js files are of this format:
```js
module.exports = {
   "abc": "def",
   "paths": {
      "myReadme" : paths.root + "/README.md",
      "myTxtConfig" : paths.config + "/otherconfigfile.txt",
   },
};
```

To load the configuration, you use a single line:
```js
config = require("rf-config").loadFrom(__dirname);

console.log(config.paths.root); // our root path "__dirname"
console.log(config.paths.config); // configuration directory
console.log(config.paths.myReadme);
console.log(config.packageJson); // our package.json data
```

If you need to access the configuration at a later point from another module, that's easy:
```js
var config = require("rf-config").config;
```

## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr, Julian von Mendel

