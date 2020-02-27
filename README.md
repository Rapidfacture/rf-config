# rf-config

NodeJS config loader. Reads a config.js, package.json, LICENSE and .env


## Getting Started

> npm install rf-config

To load this config.js file in `./config/config.js`:
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
   app: {
      name: 'rf-config',
      version: '0.1.6',
      packageJson: {
         name: 'rf-config',
         version: '0.1.6',
         description: 'Simple NodeJS config loading lib',
         author: 'Rapidfacture GmbH',
         license: 'MIT',
         main: 'index.js'
      }
   }
}
```

Once Loaded, access the configuration later in other files with:
```js
var config = require('rf-config');
```
NOTE: The `init` function is only present the first time, as the config should be loaded only once - when the project starts.


## Development

Install the dev tools with

> npm install

Then you can runs some test cases and eslint with:

> npm test


## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr, Julian von Mendel
