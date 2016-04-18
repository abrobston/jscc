suite("integrity", function() {
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
                                 "jscc/log/log": "jscc/log/logNode",
                                 "text": "../node_modules/requirejs-text/text"
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
        injector.mock("jscc/log/log", logStub);
        injector.store(["jscc/log/log", "jscc/global", "jscc/integrity"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
        requirejs.undef("jscc/log/log");
        requirejs.undef("jscc/global");
        requirejs.undef("jscc/integrity");
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
             injector.run(["mocks", "jscc/integrity", "jscc/classes/Symbol", "jscc/enums/SYM"],
                          function(mocks, integrity, Symbol, SYM) {
                              var global = mocks.store["jscc/global"];
                              var log = mocks.store["jscc/log/log"];
                              log.error.reset();
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