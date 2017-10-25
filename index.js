'use strict';

const SteamerPlugin = require('steamer-plugin'),
    fs = require('fs'),
    path = require('path'),
    jsonServer = require('json-server');

class MockPlugin extends SteamerPlugin {
    constructor(args) {
        super(args);
        this.argv = args;
        this.pluginName = 'steamer-plugin-mock';
        this.description = 'mock data for your project';
        // 自定义host
        this.host = this.argv.host || 'localhost';
        // 自定义端口
        this.port = this.argv.port || '7000';
        // 自定义URL
        if (this.argv.route) {
            if (path.extname(this.argv.route) === '.json') {
                this.route = require(path.resolve(this.argv.route));
            } else {
                this.error('需要指定一个json文件来自定义路径！');
            }
        }
        // 默认路径是'./mock/db.js'，如果不存在会进行创建
        this.filePath = './mock/db.js';
        this.exampleBuild = false;
        this.rules = null;
        this.jsonServer = jsonServer;
        this.server = null; // mock server
    }

    init() {
        // this.printTitle('开始mock');
        this.info('\\{^_^}/ hi! 开始mock\n');
        let filePath = this.argv.config;
        if (filePath) {
            this.info('使用' + filePath + '作为mock数据\n');
            this.use(filePath);
        }
        else {
            if (fs.existsSync(this.filePath)) {
                this.info('使用' + this.filePath + '作为mock数据\n');
                this.use(this.filePath);
            }
            else {
                this.info('( ´∀`)第一次使用？未检测到\'./mock/db.js\'，正在自动生成...\n');
                this.createExample(this.use);
            }
        }
    }

    createExample(cb) {
        let exampleFile = path.join(__dirname, 'example.js');
        this.fs.copySync(exampleFile, this.filePath);

        this.info('根据模版生成\'./mock/db.js\'成功ヽ( ^∀^)ﾉ');
        this.exampleBuild = true;
        cb.call(this, this.filePath);
    }

    use(filePath) {
        this.info('正在启动mock服务器...');
        this.server = this.jsonServer.create();
        let data = null;
        // let execPath = process.execPath;
        filePath = path.resolve(filePath);

        if (path.extname(filePath) === '.js') {
            let dataFn = require(filePath);
            if (typeof dataFn !== 'function') {
                this.error('传入了一个js文件，但是export的不是一个function');
                return;
            }
            data = dataFn();
            if (typeof data !== 'object') {
                this.error('js文件export的function返回的不是一个object');
                return;
            }
            // console.log(data);
        }
        else if (path.extname(filePath) === '.json') {
            data = require(filePath);
        }
        else {
            this.error('使用的mock文件后缀名只能是\'js\'或者\'json\'');
        }
        const router = this.jsonServer.router(data);

        if (this.route) {
            this.log(this.route);
            this.server.use(this.jsonServer.rewriter(this.route));
        }
        this.server.use(router);
        this.server.listen(this.port, () => {
            this.log('mock服务已启动ヽ( ^∀^)ﾉ');
            if (this.exampleBuild) {
                this.info('mock服务根据模版文件启动成功ヽ( ^∀^)ﾉ，您现在可以修改\'db.js\'文件模拟后台接口了');
                this.info('体验不错？请点击链接https://github.com/steamerjs/steamer-plugin-mock star一下！');
            }
            this.prettyPrint(this.host, this.port, data, this.rules);
        });
    }

    /**
     * 服务器启动时打印所有资源
     * @param {*} host 
     * @param {*} port 
     * @param {*} object 
     * @param {*} rules 
     */
    prettyPrint(hostParam, portParam, object, rules) {
        let host = hostParam === '0.0.0.0' ? 'localhost' : hostParam,
            port = portParam,
            root = `http://${host}:${port}`;

        this.log('\n  资源');

        for (let prop in object) {
            this.log(`  ${root}/${prop}`);
        }

        if (rules) {
            this.log('\n  其他自定义路径');
            for (let rule in rules) {
                this.log(`  ${rule} -> ${rules[rule]}`);
            }
        }

        this.log('\n  首页');
        this.log(`  ${root}\n`);
    }

    help() {
        this.printUsage('mock data for your project', 'mock');
        this.printOption([
            {
                option: 'config',
                alias: 'c',
                description: 'mocking file route'
            },
            {
                option: 'port',
                alias: 'p',
                description: 'server port'
            },
            {
                option: 'route',
                alias: 'r',
                description: 'server route'
            },
        ]);
    }
}

module.exports = MockPlugin;