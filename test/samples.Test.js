suite("samples", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../lib'),
                             nodeRequire: require,
                             packages: [
                                 {
                                     name: "squirejs",
                                     location: "../node_modules/squirejs",
                                     main: "src/Squire"
                                 }
                             ],
                             paths: {
                                 "sinon": "../node_modules/sinon/pkg/sinon",
                                 "jscc/bitset": "jscc/bitset/BitSet32",
                                 "jscc/log/log": "jscc/log/logNode",
                                 "jscc/io/io": "jscc/io/ioNode"
                             }
                         });
    }

    var sinon = requirejs('sinon');
    var chai = requirejs('chai');
    var Squire = requirejs('squirejs');
    var temp = requirejs('temp').track();

    sinon.assert.expose(chai.assert, { prefix: "" });
    var assert = chai.assert;
    var injector = new Squire();

    var sandbox, tempDir;
    setup("setup", function() {
        injector.configure();
        sandbox = sinon.sandbox.create();
        injector.store(["jscc/log/log"]);
        tempDir = temp.mkdirSync();

    });

    teardown("teardown", function() {
        temp.cleanupSync();
        injector.remove();
        sandbox.restore();
    });

    [
        "../samples/calc_web.par",
        "../samples/xpl.par",
        "../samples/xpl_opt.par"
    ].forEach(function(inputPath) {
        test("Parses sample file '" + inputPath + "' without errors",
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 var log = mocks.store["jscc/log/log"];
                 var fatalSpy = sandbox.spy(log, "fatal");
                 var errorSpy = sandbox.spy(log, "error");
                 var output = "";
                 jscc({
                          src_file: path.join(__dirname, inputPath),
                          tpl_file: path.join(__dirname, "../bin/parser-driver.js"),
                          outputCallback: function(text) {
                              output = text;
                          }
                      });
                 assert.notStrictEqual(output, "");
                 assert.notCalled(fatalSpy);
                 assert.notCalled(errorSpy);
             }));
    });

    [
        "../samples/99-bottles-of-beer.xpl",
        "../samples/countdown.xpl",
        "../samples/hello.xpl"
    ].forEach(function(inputPath) {
        test("Parser generated from xpl.par parses '" + inputPath + "' without errors",
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 jscc({
                          src_file: path.join(__dirname, "../samples/xpl.par"),
                          tpl_file: path.join(__dirname, "../bin/parser-driver.js"),
                          out_file: path.join(tempDir, "xpl.js")
                      });
                 var req = requirejs.config({
                                                context: "Parser generated from... " + inputPath,
                                                baseUrl: path.join(__dirname, "../lib"),
                                                paths: {
                                                    "jscc/io/io": "jscc/io/ioNode",
                                                    "jscc/log/log": "jscc/log/logNode",
                                                    "jscc/bitset": "jscc/bitset/BitSet32",
                                                    "xpl": path.join(tempDir, "xpl")
                                                }
                                            });
                 assert.doesNotThrow(function() {
                     req(["require", "xpl"], function(require, xpl) {
                         xpl(inputPath);
                     });
                 }, Error);
             }));
    });
});