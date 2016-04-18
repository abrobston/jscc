suite("regex", function() {
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

    [
        { pattern: "[A-Z][A-Z0-9]*", valid: true },
        { pattern: "ab|c", valid: true },
        { pattern: "[0-9]+", valid: true },
        { pattern: "[A-Z", valid: false },
        { pattern: "*", valid: false },
        { pattern: "\\*", valid: true },
        { pattern: "[", valid: false },
        { pattern: "\\[", valid: true },
        { pattern: "]", valid: false },
        { pattern: "\\]", valid: true },
        { pattern: "(", valid: false },
        { pattern: "\\(", valid: true },
        { pattern: ")", valid: false },
        { pattern: "\\)", valid: true },
        { pattern: "|", valid: false },
        { pattern: "\\|", valid: true },
        { pattern: "?", valid: false },
        { pattern: "\\?", valid: true },
        // Backslash at end of pattern translates as literal backslash;
        // a little messy, but probably not worth changing
        { pattern: "\\", valid: true },
        { pattern: "\\\\", valid: true },
        { pattern: ".", valid: true },
        { pattern: "\\.", valid: true },
        { pattern: "\\220", valid: true }
    ].forEach(function(item) {
        test("Regex '" + item.pattern + "' " + (item.valid ? "does not log" : "logs") + " an error",
             injector.run(["mocks", "jscc/regex"],
                          function(mocks, regex) {
                              var log = mocks.store["jscc/log/log"];
                              log.error.reset();
                              regex(item.pattern, 0, false);
                              if (item.valid) {
                                  assert.notCalled(log.error);
                              } else {
                                  assert.called(log.error);
                              }
                          }));
    });

});