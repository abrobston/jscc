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
                "sinon": "../node_modules/sinon/pkg/sinon"
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
                  test("Calling find_symbol with label '" + item.label + "', kind 'global.SYM." +
                       (item.terminating ? "TERM" : "NONTERM") + "', and special '" +
                       (typeof item.special === 'undefined' ? "undefined" : item.special) + "' returns " +
                       item.expected,
                       injector.run(["mocks", "jscc/tabgen"], function(mocks, tabgen) {
                           var global = mocks.store["jscc/global"];
                           item.overrides.forEach(function(override) {
                               if (typeof override.terminating === 'boolean') {
                                   override.kind = override.terminating ? global.SYM.TERM : global.SYM.NONTERM;
                                   delete override.terminating;
                               }
                               if (typeof override.special === 'string') {
                                   var newSpecial = global.SPECIAL.NONE;
                                   switch (override.special) {
                                       case "EOF":
                                           newSpecial = global.SPECIAL.EOF;
                                           break;
                                       case "ERROR":
                                           newSpecial = global.SPECIAL.ERROR;
                                           break;
                                       case "WHITESPACE":
                                           newSpecial = global.SPECIAL.WHITESPACE;
                                           break;
                                       default:
                                           break;
                                   }
                                   override.special = newSpecial;
                               }
                               global.symbols.push(new global.Symbol(override));
                           });
                           var kind = item.terminating ? global.SYM.TERM : global.SYM.NONTERM;
                           var special;
                           switch (item.special) {
                               case "NONE":
                                   special = global.SPECIAL.NONE;
                                   break;
                               case "EOF":
                                   special = global.SPECIAL.EOF;
                                   break;
                               case "ERROR":
                                   special = global.SPECIAL.ERROR;
                                   break;
                               case "WHITESPACE":
                                   special = global.SPECIAL.WHITESPACE;
                                   break;
                               default:
                                   break;
                           }
                           var result = tabgen.find_symbol(item.label, kind, special);
                           assert.strictEqual(result, item.expected);
                       }));
              });
});