suite("parse", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../../lib/jscc'),
                             nodeRequire: require,
                             packages: [
                                 {
                                     name: "squirejs",
                                     location: "../node_modules/squirejs",
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
                                     "bitset": "bitset/BitSet32",
                                     "io/io": "io/ioNode",
                                     "log/log": "log/logNode"
                                 }
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
        injector.mock("log/log", logStub);
        injector.mock("log/logNode", logStub);
        injector.mock("io/io", requirejs("io/ioNode"));
        injector.store(["log/log", "log/logNode", "global", "util"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
    });

    [
        { semi: ";", description: "a semicolon" },
        { semi: "", description: "no semicolon" },
        { semi: " ;", description: "a semicolon preceded by a space" },
        { semi: "\n ;", description: "a semicolon preceded by a newline and a space" },
        { semi: "; /~ Comment ~/", description: "a semicolon followed by a comment" }
    ].forEach(function(item) {
        test("Permits " + item.description + " after whitespace terminal definition",
             injector.run(["mocks", "parse", "enums/EXEC"], function(mocks, parse) {
                 var log = mocks.store["log/logNode"];
                 log.fatal.reset();
                 log.error.reset();

                 var global = mocks.store["global"];

                 var source = "!   ' '" + item.semi + "\n" +
                              "##\n" +
                              "p: e [* alert( %1 ); *]\n" +
                              "   ;\n" +
                              "e: ;\n";

                 parse(source, "");

                 assert.notCalled(log.fatal);
                 assert.notCalled(log.error);
             }));
    });
});