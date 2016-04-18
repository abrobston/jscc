suite("tabgen", function() {
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
        injector.store(["jscc/global"]);
    });

    teardown("teardown", function() {
        injector.remove();
        sandbox.restore();
    });

    [
        { label: "someLabel", terminating: true, special: "NONE", expected: -1, overrides: [] },
        {
            label: "someLabel", terminating: false, special: "NONE", expected: 0, overrides: [
            { label: "someLabel", terminating: false, special: "NONE" }
        ]
        },
        {
            label: "SomeLabel", terminating: false, special: "NONE", expected: -1, overrides: [
            { label: "someLabel", terminating: false, special: "NONE" }
        ]
        },
        {
            label: "someLabel", terminating: true, special: "EOF", expected: 2, overrides: [
            { label: "someLabel", terminating: false, special: "EOF" },
            { label: "someLabel", terminating: true, special: "WHITESPACE" },
            { label: "someLabel", terminating: true, special: "EOF" }
        ]
        }
    ].forEach(function(item) {
        test("Calling find_symbol with label '" + item.label + "', kind 'SYM." +
             (item.terminating ? "TERM" : "NONTERM") + "', and special '" +
             (typeof item.special === 'undefined' ? "undefined" : item.special) + "' returns " +
             item.expected,
             injector.run(["mocks", "jscc/tabgen", "jscc/enums/SYM", "jscc/enums/SPECIAL",
                           "jscc/classes/Symbol"], function(mocks, tabgen, SYM, SPECIAL, Symbol) {
                 var global = mocks.store["jscc/global"];
                 // Remove default symbols now added by the jscc.global constructor
                 global.symbols = [];
                 item.overrides.forEach(function(override) {
                     if (typeof override.terminating === 'boolean') {
                         override.kind = override.terminating ? SYM.TERM : SYM.NONTERM;
                         delete override.terminating;
                     }
                     if (typeof override.special === 'string') {
                         var newSpecial = SPECIAL.NONE;
                         switch (override.special) {
                             case "EOF":
                                 newSpecial = SPECIAL.EOF;
                                 break;
                             case "ERROR":
                                 newSpecial = SPECIAL.ERROR;
                                 break;
                             case "WHITESPACE":
                                 newSpecial = SPECIAL.WHITESPACE;
                                 break;
                             default:
                                 break;
                         }
                         override.special = newSpecial;
                     }
                     global.symbols.push(new Symbol(override));
                 });
                 var kind = item.terminating ? SYM.TERM : SYM.NONTERM;
                 var special;
                 switch (item.special) {
                     case "NONE":
                         special = SPECIAL.NONE;
                         break;
                     case "EOF":
                         special = SPECIAL.EOF;
                         break;
                     case "ERROR":
                         special = SPECIAL.ERROR;
                         break;
                     case "WHITESPACE":
                         special = SPECIAL.WHITESPACE;
                         break;
                     default:
                         break;
                 }
                 var result = tabgen.find_symbol(item.label, kind, special);
                 assert.strictEqual(result, item.expected);
             }));
    });
});