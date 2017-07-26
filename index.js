"use strict";

const pluginutils = require('steamer-pluginutils');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function MockPlugin(argv) {
	this.argv = argv;
    this.utils = new pluginutils("steamer-plugin-mock");
    // 默认路径是'./mock/db.js'，如果不存在会进行创建
    this.filePath = './mock/db.js';
    this.exampleBuild = false;
    this.rules = null;
}

MockPlugin.prototype.init = function() {
    //this.utils.printTitle("开始mock");
    this.utils.info("\\{^_^}/ hi! 开始mock");
    console.log("");
    this.host = this.argv.host == null? 'localhost': argv.host;
    this.port = this.argv.port == null? '6800': argv.port;
    let filePath = this.argv.config;
    if (filePath) {
        this.utils.info("使用" + filePath + "作为mock数据");
        console.log("");
        this.use(filePath);
    } else {
        if (fs.existsSync(this.filePath)) {
            this.utils.info("使用" + this.filePath + "作为mock数据");
            console.log("");
            this.use(this.filePath);
        } else {
            this.utils.info("( ´∀`)第一次使用？未检测到'./mock/db.js'，正在自动生成...");
            console.log("");
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
            this.utils.info("根据模版生成'./mock/db.js'成功ヽ( ^∀^)ﾉ");            
            console.log("");
            this.exampleBuild = true;
            cb.call(this, this.filePath);
        })

    })
}


/**
 * 服务器启动时打印所有资源
 * @param {*} host 
 * @param {*} port 
 * @param {*} object 
 * @param {*} rules 
 */
function prettyPrint(host, port, object, rules) {
  var host = host === '0.0.0.0' ? 'localhost' : host;
  var port = port;
  var root = `http://${host}:${port}`;

  console.log();
  console.log(chalk.bold('  资源'));
  for (var prop in object) {
    console.log(`  ${root}/${prop}`);
  }

  if (rules) {
    console.log();
    console.log(chalk.bold('  其他自定义路径'));
    for (var rule in rules) {
      console.log(`  ${rule} -> ${rules[rule]}`);
    }
  }

  console.log();
  console.log(chalk.bold('  首页'));
  console.log(`  ${root}`);
  console.log();
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
    server.listen(this.port, ()=>{
        console.log('mock服务已启动ヽ( ^∀^)ﾉ');
        if (this.exampleBuild) {
            chalk.cyan("mock服务根据模版文件启动成功ヽ( ^∀^)ﾉ，您现在可以修改'db.js'文件模拟后台接口了");
            chalk.cyan("体验不错？请点击链接https://github.com/steamerjs/steamer-plugin-mock star一下！")
        }
        prettyPrint(this.host, this.port, data, this.rules);
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