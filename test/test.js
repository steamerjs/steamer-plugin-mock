'use strict';

const path = require('path'),
    chalk = require('chalk'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    SteamerMock = require('../index.js');

describe('steamer-plugin-mock', function() {

    let projectPath = path.join(process.cwd(), './test/project/');

    it('init db.js', function() {

        process.chdir('./test/project/');

        let mock = new SteamerMock({
            _: []
        });

        let dbFile = path.join(projectPath, './mock/db.js');

        mock.fs.removeSync(dbFile);
        let serverStub = sinon.stub(mock, 'use').callsFake(function() {
                return function() {};
            }),
            logSub = sinon.stub(mock, 'log');

        mock.init();

        expect(mock.fs.readFileSync(dbFile, 'utf8')).to.eql(mock.fs.readFileSync(path.join(process.cwd(), '../../example.js'), 'utf8'));

        serverStub.restore();
        logSub.restore();
    });

    it('init db.js but exists', function() {

        let mock = new SteamerMock({
            _: []
        });

        let dbFile = path.join(projectPath, './mock/db.js');

        let serverStub = sinon.stub(mock, 'use').callsFake(function() {
                return function() {};
            }),
            logStub = sinon.stub(mock, 'log');

        mock.init();

        expect(mock.fs.readFileSync(dbFile, 'utf8')).to.eql(mock.fs.readFileSync(path.join(process.cwd(), '../../example.js'), 'utf8'));
        expect(logStub.calledWith('使用' + mock.filePath + '作为mock数据\n')).to.eql(true);

        serverStub.restore();
        logStub.restore();
    });

    it('start server', function() {
        let mock = new SteamerMock({
            _: []
        });

        let dbFile = path.join(projectPath, './mock/db.js');

        let serverStub = sinon.stub(mock.jsonServer, 'create').callsFake(function() {
                return {
                    use: function() {

                    },
                    listen: function(port, cb) {
                        expect(port).to.eql('7000');
                        cb();
                    }
                };
            }),
            logStub = sinon.stub(mock, 'log');

        mock.use(dbFile);

        // expect(mock.fs.readFileSync(dbFile, 'utf8')).to.eql(mock.fs.readFileSync(path.join(process.cwd(), '../../example.js'), 'utf8'));
        // expect(logStub.calledWith('使用' + mock.filePath + '作为mock数据\n')).to.eql(true);

        serverStub.restore();
        logStub.restore();
    });

    it('help', function() {
        let list = new SteamerMock({
            help: true
        });

        let printUsageStub = sinon.stub(list, 'printUsage'),
            printOptionStub = sinon.stub(list, 'printOption');

        list.help();

        expect(printUsageStub.calledWith('mock data for your project', 'mock')).to.eql(true);
        expect(printUsageStub.calledOnce).to.eql(true);

        printUsageStub.restore();
        printOptionStub.restore();
    });
});