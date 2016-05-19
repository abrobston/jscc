suite("printtab", function() {
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
                                     "log/log": "log/logNode",
                                     "io/io": "io/ioNode"
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
        var ioStub = sandbox.stub({
                                      read_all_input: function(options) {
                                      },
                                      read_template: function(options) {
                                      },
                                      write_output: function(options) {
                                      }
                                  });
        injector.mock("log/log", logStub);
        injector.mock("log/logNode", logStub);
        injector.mock("io/io", ioStub);
        injector.mock("io/ioNode", ioStub);
        injector.store(["global", "log/log", "log/logNode"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
    });

    test("print_actions logs an error if a %n wildcard does not match the right-hand side of a production",
         injector.run(["mocks", "printtab", "classes/Production", "classes/Symbol"],
                      function(mocks, printtab, Production, Symbol) {
                          var global = mocks.store["global"];
                          var log = mocks.store["log/logNode"];
                          global.productions = [];
                          global.symbols = [];
                          global.productions.push(new Production({
                              id: 0,
                              code: "return %1;",
                              lhs: 0,
                              rhs: []
                          }));
                          global.symbols.push(new Symbol({
                              id: 0,
                              label: "testLabel"
                          }));
                          log.error.reset();
                          printtab.print_actions();
                          assert.called(log.error);
                      }));
});