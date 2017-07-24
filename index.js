"use strict";

const pluginutils = require('steamer-pluginutils');
const fs = require('fs');
const path = require('path');

function MockPlugin(argv) {
	this.argv = argv;
    this.utils = new pluginutils("steamer-plugin-mock");
    // 默认路径是'./mock/db.js'，如果不存在会进行创建
    this.filePath = './mock/db.js';
}

MockPlugin.prototype.init = function() {
    console.log(this.argv);

    let filePath = this.argv.config;
    if (filePath) {
        this.use(filePath);
    } else {
        if (fs.existsSync(this.filePath)) {
            this.utils.warn("使用" + this.filePath + "作为Mock数据");
            this.use(this.filePath);
        } else {
            this.createExample(this.use);
        }
    }
};

MockPlugin.prototype.createExample = function(cb) {
    let dir = path.dirname(this.filePath);
    fs.mkdir(dir, ()=>{
        let exampleFile = path.join(__dirname, 'example.js');
        let readStream = fs.createReadStream(exampleFile);
        let writeStream = fs.createWriteStream(this.filePath);
        readStream.pipe(writeStream);
        // listen the error
        readStream.once('error', (error)=>{
            console.error('Read example.js error!');
            console.error(error);
        })
        // call the callback when finishing the copy
        writeStream.once('close', ()=>{
            cb(this.filePath);
        })

    })
}

MockPlugin.prototype.use = function(filePath) {
    const jsonServer = require('json-server');
    const server = jsonServer.create();
    let data = null;
    let execPath = process.execPath;
    filePath = path.resolve(filePath);
    console.log(filePath);
    console.log(path.extname(filePath));

    if (path.extname(filePath) == '.js') {
        let dataFn = require(filePath);
        if (typeof dataFn !== 'function') {
            this.utils.error("传入了一个js文件，但是export的不是一个function");
        }
        data = dataFn();
        console.log(data);
    } else if (path.extname(filePath) == '.json') {
        data = filePath;
    } else {
        this.utils.error("使用的mock文件后缀名只能是'js'或者'json'");
    }
    const router = jsonServer.router(data);

    server.use(router);
    server.listen('6800', ()=>{
        console.log('json server running on 6800');
    })
}

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