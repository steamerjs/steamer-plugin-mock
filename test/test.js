"use strict";


const path = require('path'),
	  os = require('os'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  expect = require('expect.js'),
	  sinon = require('sinon'),
	  cp = require('child_process'),
	  spawnSync = cp.spawnSync,
      plugin = require('../index');

const MOCK = path.join(process.cwd(), "test", "mock");
const EXAMPLE = path.join(process.cwd(), "example.js");

        
describe("steamer mock", function() {
    this.timeout(10000);
    spawnSync("npm", ["link"], {stdio: "inherit"});
    before(function(){
        console.log('before it');
    });

    it("Generate template file db.js", function(){
        this.timeout(3000);
        fs.emptyDirSync(MOCK);
        process.chdir("test");
        var mock = new plugin({});
        var createExample = sinon.stub(mock, 'createExample');
        var usePath = sinon.stub(mock, 'use');
        mock.init();
        setTimeout(function(){
            expect(createExample.called).to.be(true);
            expect(usePath.called).to.be(true);
            expect(usePath.calledWith({
                filePath: EXAMPLE
            })).to.be(true);
            let fileInfo = fs.readdirSync(MOCK);
            expect(fileInfo).to.eql(['db.js']);
        }, 500);

        createExample.restore();
        usePath.restore();


    })
})