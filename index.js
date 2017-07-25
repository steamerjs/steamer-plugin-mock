"use strict";

const pluginutils = require('steamer-pluginutils');
const fs = require('fs');
const path = require('path');

function MockPlugin(argv) {
	this.argv = argv;
    this.utils = new pluginutils("steamer-plugin-mock");
    // 默认路径是'./mock/db.js'，如果不存在会进行创建
    this.filePath = './mock/db.js';
    this.exampleBuild = false;
}

MockPlugin.prototype.init = function() {
    //console.log(this.argv);

    this.utils.printTitle("开始mock");
    let filePath = this.argv.config;
    if (filePath) {
        this.utils.info("使用" + filePath + "作为mock数据");
        this.use(filePath);
    } else {
        if (fs.existsSync(this.filePath)) {
            this.utils.info("使用" + this.filePath + "作为mock数据");
            this.use(this.filePath);
        } else {
            this.utils.info("未检测到'./mock/db.js'，正在自动生成...");
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
            this.utils.info("根据模版生成'./mock/db.js'成功");
            this.exampleBuild = true;
            cb.call(this, this.filePath);
        })

    })
}

MockPlugin.prototype.use = function(filePath) {
    this.utils.info("正在启动mock服务器...");
    const jsonServer = require('json-server');
    const server = jsonServer.create();
    let data = null;
    let execPath = process.execPath;
    filePath = path.resolve(filePath);
    if (path.extname(filePath) == '.js') {
        let dataFn = require(filePath);
        if (typeof dataFn !== 'function') {
            this.utils.error("传入了一个js文件，但是export的不是一个function");
            return;
        }
        data = dataFn();
        if (typeof data !== 'object') {
            this.utils.error("js文件export的function返回的不是一个object");
            return;
        }
        //console.log(data);
    } else if (path.extname(filePath) == '.json') {
        data = filePath;
    } else {
        this.utils.error("使用的mock文件后缀名只能是'js'或者'json'");
    }
    const router = jsonServer.router(data);

    server.use(router);
    server.listen('6800', ()=>{
        console.log('mock服务已启动并在 http://localhost:6800 运行');
        if (this.exampleBuild) {
            console.log("模版mock服务启动成功，请访问 http://localhost:6800/users 查看效果");
        }
    })
}

MockPlugin.prototype.help = function() {
	this.utils.printUsage('steamer plugin mock', 'mock');
	this.utils.printOption([
		{
			option: "config",
			alias: "c",
			description: "Mock文件的路径"
		},
	]);
};

module.exports = MockPlugin;