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
                                 "jscc/bitset": "jscc/bitset/BitSet32"
                             }
                         });
    }

    var sinon = requirejs('sinon');
    var chai = requirejs('chai');
    var Squire = requirejs('squirejs');

    sinon.assert.expose(chai.assert, { prefix: "" });
    var assert = chai.assert;
    var injector = new Squire();

    var sandbox;
    setup("setup", function() {
        injector.configure();
        sandbox = sinon.sandbox.create();
        var logStub = sandbox.stub({
                                       fatal: function(msg) {
                                       },
                                       error: function(msg) {
                                       },
                                       warn: function(msg) {
                                       },
                                       info: function(msg) {
                                       },
                                       debug: function(msg) {
                                       },
                                       trace: function(msg) {
                                       },
                                       setLevel: function(level) {
                                       }
                                   });
        injector.mock("jscc/log/log", logStub);
        injector.mock("jscc/io/io", requirejs("jscc/io/ioNode"));
        injector.store(["jscc/log/log"]);
    });

    teardown("teardown", function() {
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
                 log.fatal.reset();
                 log.error.reset();
                 var output = "";
                 jscc({
                          src_file: path.join(__dirname, inputPath),
                          tpl_file: path.join(__dirname, "../src/driver/parser.js"),
                          outputCallback: function(text) {
                              output = text;
                          }
                      });
                 assert.notStrictEqual(output, "");
                 assert.notCalled(log.fatal);
                 assert.notCalled(log.error);
             }));
    });
});