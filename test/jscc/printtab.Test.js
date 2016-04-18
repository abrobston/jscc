suite("printtab", function() {
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
        injector.mock("jscc/log/log", logStub);
        injector.mock("jscc/io/io", ioStub);
        injector.store(["jscc/global", "jscc/log/log"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
    });

    test("print_actions logs an error if a %n wildcard does not match the right-hand side of a production",
         injector.run(["mocks", "jscc/printtab", "jscc/classes/Production"], function(mocks, printtab, Production) {
             var global = mocks.store["jscc/global"];
             var log = mocks.store["jscc/log/log"];
             global.productions = [];
             global.productions.push(new Production({
                 id: 0,
                 code: "return %1;",
                 rhs: []
             }));
             log.error.reset();
             printtab.print_actions();
             assert.called(log.error);
         }));
});