suite("parse", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../../lib'),
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
                                 "jscc/io/io": "jscc/io/ioNode",
                                 "jscc/log/log": "jscc/log/logNode"
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
        injector.store(["jscc/log/log", "jscc/global", "jscc/util"]);
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
             injector.run(["mocks", "jscc/parse", "jscc/enums/EXEC"], function(mocks, parse) {
                 var log = mocks.store["jscc/log/log"];
                 log.fatal.reset();
                 log.error.reset();

                 var global = mocks.store["jscc/global"];

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