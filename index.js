"use strict";

const pluginutils = require('steamer-pluginutils');

function MockPlugin(argv) {
	this.argv = argv;
	this.utils = new pluginutils("steamer-plugin-example");
}

MockPlugin.prototype.init = function() {
	console.log(this.argv);
};

MockPlugin.prototype.help = function() {
	this.utils.printUsage('steamer plugin mock', 'mock');
	this.utils.printOption([
		{
			option: "db",
			alias: "d",
			description: "The mock data file path"
		},
	]);
};

module.exports = MockPlugin;