suite("samples", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../lib/jscc'),
                             nodeRequire: require,
                             packages: [
                                 {
                                     name: "squirejs",
                                     location: "../../node_modules/squirejs",
                                     main: "src/Squire"
                                 }
                             ],
                             paths: {
                                 "jscc": "main",
                                 "sinon": "../../node_modules/sinon/pkg/sinon",
                                 "text": "../../node_modules/requirejs-text/text",
                                 "has": "../../volo/has"
                             },
                             map: {
                                 "*": {
                                     "log/log": "log/logNode",
                                     "io/io": "io/ioNode",
                                     "bitset": "bitset/BitSet32"
                                 }
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
        injector.store(["log/log", "log/logNode"]);
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
                 var log = mocks.store["log/logNode"];
                 var fatalSpy = sandbox.spy(log, "fatal");
                 var errorSpy = sandbox.spy(log, "error");
                 var output = "";
                 jscc({
                          src_file: path.join(__dirname, inputPath),
                          tpl_file: path.join(__dirname, "../lib/jscc/template/parser-driver-js.txt"),
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
                          tpl_file: path.join(__dirname, "../lib/jscc/template/parser-driver-js.txt"),
                          out_file: path.join(tempDir, "xpl.js")
                      });
                 var req = requirejs.config({
                                                context: "Parser generated from... " + inputPath,
                                                baseUrl: path.join(__dirname, "../lib/jscc"),
                                                paths: {
                                                    "text": "../../node_modules/requirejs-text/text",
                                                    "xpl": path.join(tempDir, "xpl")
                                                },
                                                map: {
                                                    "*": {
                                                        "io/io": "io/ioNode",
                                                        "log/log": "log/logNode"
                                                    }
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