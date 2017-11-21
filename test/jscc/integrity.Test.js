suite("integrity", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../../lib/jscc'),
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
                                       setLevel: function(msg) {
                                       }
                                   });
        injector.mock("log/log", logStub);
        injector.mock("log/logNode", logStub);
        injector.store(["log/log", "log/logNode", "global", "integrity"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
        requirejs.undef("log/log");
        requirejs.undef("log/logNode");
        requirejs.undef("global");
        requirejs.undef("integrity");
    });

    [
        { symbolTypes: [0, 3, 1, 2], errorCount: 1 },
        { symbolTypes: [0, 2, 1], errorCount: 0 },
        { symbolTypes: [0, 3, 1, 3], errorCount: 2 },
        { symbolTypes: [], errorCount: 0 }
    ].forEach(function(item) {
        test("integrity.undef logs " + item.errorCount + " error" + (item.errorCount == 1 ? "" : "s") +
             " with " + item.symbolTypes.length + " symbol" + (item.symbolTypes.length == 1 ? "" : "s") +
             " and " + item.errorCount + " undefined terminal" + (item.errorCount == 1 ? "" : "s"),
             injector.run(["mocks", "integrity", "classes/Symbol", "enums/SYM"],
                          function(mocks, integrity, Symbol, SYM) {
                              var global = mocks.store["global"];
                              var log = mocks.store["log/logNode"];
                              log.error.resetHistory();
                              var term = new Symbol({ kind: SYM.TERM, defined: false });
                              var defined = new Symbol({ kind: SYM.NONTERM, defined: true });
                              var definedTerm = new Symbol({ kind: SYM.TERM, defined: true });
                              var undefined = new Symbol({ kind: SYM.NONTERM, defined: false });
                              var symbols = [term, defined, definedTerm, undefined];
                              item.symbolTypes.forEach(function(index) {
                                  global.symbols.push(symbols[index]);
                              });

                              integrity.undef();

                              assert.callCount(log.error, item.errorCount);
                          }));
    });
});