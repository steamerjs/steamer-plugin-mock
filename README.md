# steamer-plugin-example

steamer plugin example

* Confirm the steamer CLI tool is installed. If not, please visit https://github.com/steamerjs/steamerjs

After finishing this plugin example, you can use this plugin like this:

```javascript
steamer example -c config.js
// or
steamer example --config config.js
```


## How to write a steamerjs plugin

* Create a function as the plugin

```javascript
function ExamplePlugin(argv) {
	this.argv = argv;
}
```
When user inputs the plugin command, the arguments are passed to this function.

For more information of the arguments，please visit [yargs](https://github.com/yargs/yargs).

* `init` method

Create a `init` method for this plugin, the method will be called when the command works.

```javascript
ExamplePlugin.prototype.init = function() {
	console.log(this.argv);
};

module.exports = ExamplePlugin;
```


* `help` method

Create a `help` method for this plugin.

```javascript
ExamplePlugin.prototype.help = function() {
	console.log("Usage of Example: ");
}
```

When use command `steamer [plugin name] -h` or `steamer [plugin name] --help`, the `help` method will be called to output docs.

* Specify a main file and a bin file in package.json

```javascript
"main": "index.js"
```

## `Util` library

We provide a `Util` library for you to develop plugins. 

* [steamer-pluginutils](https://github.com/SteamerTeam/steamer-pluginutils)


## Use plugin in terminal

```javascript
// Link your plugin to global path so you can use `steamer example` directly
npm link

// After finishing the development, you can `unlink` the plugin
npm unlink

```
