suite("main", function() {
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
            baseUrl: './lib',
            nodeRequire: require,
            paths: {
                "sinon": "../node_modules/sinon/pkg/sinon"
            }
        });
    }

    requirejs('amdefine/intercept');

    var sinon = requirejs('sinon');
    var chai = requirejs('chai');
    var Squire = requirejs('squirejs');

    sinon.assert.expose(chai.assert, { prefix: "" });
    var assert = chai.assert;
    var injector = new Squire();

    var ioStub, logStub, integrityStub, parseStub;
    setup("setup", function() {
        ioStub = sinon.stub({
            read_all_input: function(options) {
            },
            read_template: function(options) {
            },
            write_output: function(options) {
            }
        });
        logStub = sinon.stub({
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
        integrityStub = sinon.stub({
            undef: function() {
            },
            unreachable: function() {
            },
            check_empty_states: function() {
            }
        });
        parseStub = sinon.stub({
            parse_grammar: function(src, file) {
            }
        });
        injector.mock("jscc/io/io", ioStub)
            .mock("jscc/log/log", logStub)
            .mock("jscc/integrity", integrityStub)
            .mock("jscc/parse", parseStub);
    });

    teardown("teardown", function() {
        injector.clean();
    });

    test("Ignores src_file when input string is present", function() {
        injector.require(["jscc"], function(jscc) {
            jscc({
                src_file: "invalidFileName.par",
                tpl_file: "invalidTemplateFile.js",
                input: "Input we're not checking"
            });
            assert.false(ioStub.called);
        }, function(err) {
            assert.fail(err);
        });
    });
});
