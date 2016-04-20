suite("main", function() {
    var path = require('path');
    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../lib'),
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

    var sandbox, ioStub, logStub, integrityStub, parseStub, parseStubCallbacks;
    setup("setup", function() {
        injector.configure();
        sandbox = sinon.sandbox.create();
        ioStub = sandbox.stub({
                                  read_all_input: function(options) {
                                  },
                                  read_template: function(options) {
                                  },
                                  write_output: function(options) {
                                  },
                                  exit: function(exitCode) {
                                  }
                              });
        ioStub.read_template.returns("fake template");
        logStub = sandbox.stub({
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
        integrityStub = sandbox.stub({
                                         undef: function() {
                                         },
                                         unreachable: function() {
                                         },
                                         check_empty_states: function() {
                                         }
                                     });
        // Allow addition of callbacks because it is difficult to stub
        // a bare function in sinon.
        parseStubCallbacks = [];
        parseStub = sandbox.spy(function(str, fileName) {
            var retVal = 0;
            parseStubCallbacks.forEach(function(parseCallback) {
                retVal += parseCallback(str, fileName);
            });
            return retVal;
        });

        injector.mock("jscc/io/io", ioStub)
                .mock("jscc/log/log", logStub)
                .mock("jscc/integrity", integrityStub)
                .mock("jscc/parse", parseStub)
                .store(["jscc/tabgen", "jscc/printtab", "jscc/global", "jscc/util", "jscc/first", "jscc/integrity",
                        "jscc/parse"]);
    });

    teardown("teardown", function() {
        sandbox.restore();
        injector.remove();
    });

    function wrapStub(mocks, cb) {
        stubPartialModules(mocks);
        try {
            cb();
        } finally {
            unstubPartialModules(mocks);
        }
    }

    function stubPartialModules(mocks) {
        sandbox.stub(mocks.store["jscc/tabgen"], "lalr1_parse_table");
        ["print_parse_tables", "print_dfa_table", "print_term_actions", "print_symbol_labels",
         "print_actions"].forEach(function(methodName) {
            sandbox.stub(mocks.store["jscc/printtab"], methodName, function() {
                return ""
            });
        });
    }

    function unstubPartialModules(mocks) {
        mocks.store["jscc/tabgen"].lalr1_parse_table.restore();
        mocks.store["jscc/printtab"].print_parse_tables.restore();
        mocks.store["jscc/printtab"].print_dfa_table.restore();
        mocks.store["jscc/printtab"].print_term_actions.restore();
        mocks.store["jscc/printtab"].print_symbol_labels.restore();
        mocks.store["jscc/printtab"].print_actions.restore();
    }

    test("Ignores src_file when input string is present", injector.run(["mocks", "jscc"], function(mocks, jscc) {
        wrapStub(mocks, function() {
            ioStub.read_all_input.reset();
            jscc({
                     src_file: "invalidFileName.par",
                     tpl_file: "invalidTemplateFile.js",
                     input: "Input we're not checking"
                 });
            sinon.assert.notCalled(ioStub.read_all_input);
        });
    }));

    test("Ignores src_file when input function is present", injector.run(["mocks", "jscc"], function(mocks, jscc) {
        wrapStub(mocks, function() {
            ioStub.read_all_input.reset();
            jscc({
                     src_file: "invalidFileName.par",
                     tpl_file: "invalidTemplateFile.js",
                     input: function() {
                         return "Input we're not checking";
                     }
                 });
            sinon.assert.notCalled(ioStub.read_all_input);
        });
    }));

    test("Uses src_file when no input string or function is present",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 ioStub.read_all_input.reset();
                 jscc({
                          src_file: "invalidFileName.par",
                          tpl_file: "invalidTemplateFile.js"
                      });
                 sinon.assert.calledOnce(ioStub.read_all_input);
                 sinon.assert.alwaysCalledWithExactly(ioStub.read_all_input, "invalidFileName.par");
             });
         }));

    test("Ignores out_file when outputCallback function is present",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 ioStub.write_output.reset();
                 var outputCallback = sandbox.stub();
                 jscc({
                          src_file: "invalidFileName.par",
                          tpl_file: "invalidTemplateFile.js",
                          out_file: "invalidOutputFile.js",
                          outputCallback: outputCallback
                      });
                 sinon.assert.calledOnce(outputCallback);
                 sinon.assert.notCalled(ioStub.write_output);
             });
         }));

    test("Uses out_file when no outputCallback is present", injector.run(["mocks", "jscc"], function(mocks, jscc) {
        wrapStub(mocks, function() {
            ioStub.write_output.reset();
            jscc({
                     src_file: "invalidFileName.par",
                     tpl_file: "invalidTemplateFile.js",
                     out_file: "invalidOutputFile.js"
                 });
            sinon.assert.calledOnce(ioStub.write_output);
            sinon.assert.alwaysCalledWithMatch(ioStub.write_output, { destination: "invalidOutputFile.js" });
        });
    }));

    test("Ignores template string when tpl_file is present", injector.run(["mocks", "jscc"], function(mocks, jscc) {
        wrapStub(mocks, function() {
            ioStub.read_template.reset();
            jscc({
                     src_file: "invalidFileName.par",
                     tpl_file: "invalidTemplateFile.js",
                     out_file: "invalidOutputFile.js",
                     template: "This is a template string"
                 });
            sinon.assert.calledOnce(ioStub.read_template);
        });
    }));

    test("Ignores tpl_file when template function is present", injector.run(["mocks", "jscc"], function(mocks, jscc) {
        wrapStub(mocks, function() {
            ioStub.read_template.reset();
            jscc({
                     src_file: "invalidFileName.par",
                     tpl_file: "invalidTemplateFile.js",
                     out_file: "invalidOutputFile.js",
                     template: function() {
                         return "This is a template string from a function";
                     }
                 });
            sinon.assert.notCalled(ioStub.read_template);
        });
    }));

    test("Uses template string when no tpl_file or function is present",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 ioStub.read_template.reset();
                 var output = "";
                 jscc({
                          src_file: "invalidFileName.par",
                          template: "This is a template string",
                          outputCallback: function(text) {
                              output = text;
                          }
                      });
                 sinon.assert.notCalled(ioStub.read_template);
                 assert.strictEqual(output, "This is a template string");
             });
         }));

    [
        { token: "HEADER", field: "code_head" },
        { token: "FOOTER", field: "code_foot" }
    ].forEach(function(item) {
        test("Replaces ##" + item.token + "## with global." + item.field,
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     mocks.store["jscc/global"][item.field] = "Replacement text";
                     var output = "";
                     jscc({
                              src_file: "invalidFileName.par",
                              template: "Replace ##" + item.token + "## with something",
                              outputCallback: function(text) {
                                  output = text;
                              }
                          });
                     assert.strictEqual(output, "Replace Replacement text with something");
                 });
             }));
    });

    [
        { token: "TABLES", method: "print_parse_tables" },
        { token: "DFA", method: "print_dfa_table" },
        { token: "TERMINAL_ACTIONS", method: "print_term_actions" },
        { token: "LABELS", method: "print_symbol_labels" },
        { token: "ACTIONS", method: "print_actions" }
    ].forEach(function(item) {
        test("Replaces ##" + item.token + "## with results of printtab." + item.method,
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     mocks.store["jscc/printtab"][item.method].restore();
                     sandbox.stub(mocks.store["jscc/printtab"], item.method, function() {
                         return "Replacement text";
                     });
                     var output = "";
                     jscc({
                              src_file: "invalidFileName.par",
                              template: "Replace ##" + item.token + "## with something",
                              outputCallback: function(text) {
                                  output = text;
                              }
                          });
                     assert.strictEqual(output, "Replace Replacement text with something");
                 });
             }));
    });

    [
        { token: "ERROR_TOKEN", method: "get_error_symbol_id" },
        { token: "EOF", method: "get_eof_symbol_id" },
        { token: "WHITESPACE", method: "get_whitespace_symbol_id" }
    ].forEach(function(item) {
        test("Replaces ##" + item.token + "## with results of printtab." + item.method,
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     try {
                         sandbox.stub(mocks.store["jscc/printtab"], item.method, function() {
                             return 87654;
                         });
                         var output = "";
                         jscc({
                                  src_file: "invalidFileName.par",
                                  template: "Replace ##" + item.token + "## with something",
                                  outputCallback: function(text) {
                                      output = text;
                                  }
                              });
                         assert.strictEqual(output, "Replace 87654 with something");
                     } finally {
                         mocks.store["jscc/printtab"][item.method].restore();
                     }
                 });
             }));
    });

    [
        "print_parse_tables",
        "print_dfa_table",
        "print_term_actions",
        "print_symbol_labels",
        "print_actions",
        "get_error_symbol_id",
        "get_eof_symbol_id",
        "get_whitespace_symbol_id"
    ].forEach(function(methodName) {
        test("Does not write output if printtab." + methodName + " indicates errors",
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     var printtab = mocks.store["jscc/printtab"];
                     if (/_id$/.test(methodName)) {
                         sandbox.stub(printtab, methodName, function() {
                             mocks.store["jscc/global"].errors = 1;
                             return 1;
                         });
                     } else {
                         printtab[methodName].restore();
                         sandbox.stub(printtab, methodName, function() {
                             mocks.store["jscc/global"].errors = 1;
                             return "";
                         });
                     }
                     var callback = sandbox.spy();
                     jscc({
                              src_file: "invalidFileName.par",
                              tpl_file: "invalidTemplate.js",
                              outputCallback: callback
                          });
                     assert.notCalled(callback);
                 });
             }));
    });

    test("Does not proceed if parse.parse_grammar indicates errors",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 parseStubCallbacks.push(function() {
                     mocks.store["jscc/global"].errors = 1;
                     return 1;
                 });
                 parseStub.reset();
                 integrityStub.undef.reset();
                 integrityStub.unreachable.reset();
                 jscc({
                          src_file: "invalidFileName.par",
                          tpl_file: "invalidTemplate.js",
                          out_file: "invalidOutput.js"
                      });
                 sinon.assert.called(parseStub);
                 sinon.assert.notCalled(integrityStub.undef);
                 sinon.assert.notCalled(integrityStub.unreachable);
             });
         }));

    [
        "undef",
        "unreachable"
    ].forEach(function(method) {
        test("Does not proceed if integrity." + method + " indicates errors",
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     var firstSpy;
                     try {
                         integrityStub[method].restore();
                         sandbox.stub(integrityStub, method, function() {
                             mocks.store["jscc/global"].errors = 1;
                         });
                         integrityStub[method].reset();
                         firstSpy = sandbox.spy(mocks.store["jscc/first"], "first");
                         mocks.store["jscc/tabgen"].lalr1_parse_table.reset();
                         integrityStub.check_empty_states.reset();
                         jscc({
                                  src_file: "invalidFileName.par",
                                  tpl_file: "invalidTemplate.js",
                                  out_file: "invalidOutput.js"
                              });
                         sinon.assert.called(integrityStub[method]);
                         sinon.assert.notCalled(firstSpy);
                         sinon.assert.notCalled(mocks.store["jscc/tabgen"].lalr1_parse_table);
                         sinon.assert.notCalled(integrityStub.check_empty_states);
                     } finally {
                         if (firstSpy) {
                             mocks.store["jscc/first"].first.restore();
                         }
                         integrityStub[method].restore();
                         sandbox.stub(integrityStub, method);
                     }
                 });
             }));
    });

    [
        { module: "first", method: "first" },
        { module: "tabgen", method: "lalr1_parse_table" },
        { module: "integrity", method: "check_empty_states" }
    ].forEach(function(item) {
        test("Does not write output if " + item.module + "." + item.method + " indicates errors",
             injector.run(["mocks", "jscc"], function(mocks, jscc) {
                 wrapStub(mocks, function() {
                     var fullModule = "jscc/" + item.module;
                     var skipFinallyRestore = true;
                     try {
                         try {
                             mocks.store[fullModule][item.method].restore();
                         } catch (e) {
                             skipFinallyRestore = false;
                         }
                         sandbox.stub(mocks.store[fullModule], item.method, function() {
                             mocks.store["jscc/global"].errors = 1;
                         });
                         var outputCallback = sandbox.stub();
                         jscc({
                                  src_file: "invalidFileName.par",
                                  tpl_file: "invalidTemplate.js",
                                  outputCallback: outputCallback
                              });
                         sinon.assert.called(mocks.store[fullModule][item.method]);
                         sinon.assert.notCalled(outputCallback);
                     } finally {
                         if (!skipFinallyRestore) {
                             mocks.store[fullModule][item.method].restore();
                         }
                     }
                 });
             }));
    });

    test("Throws an exception if there are errors when the throwIfErrors option is true",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 var skipFinallyRestore = true;
                 try {
                     try {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     } catch (e) {
                         skipFinallyRestore = false;
                     }
                     sandbox.stub(mocks.store["jscc/integrity"], "check_empty_states", function() {
                         mocks.store["jscc/global"].errors = 1;
                     });
                     assert.throws(function() {
                         jscc({
                                  src_file: "invalidFileName.par",
                                  tpl_file: "invalidTemplate.js",
                                  outputCallback: function() {
                                  },
                                  throwIfErrors: true
                              });
                     }, Error);
                 } finally {
                     if (!skipFinallyRestore) {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     }
                 }
             });
         }));

    test("Does not throw an exception if there are ordinary errors when the throwIfErrors option is false",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 var integrityStub, skipFinallyRestore = true;
                 try {
                     try {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     } catch (e) {
                         skipFinallyRestore = false;
                     }
                     integrityStub = sandbox.stub(mocks.store["jscc/integrity"], "check_empty_states", function() {
                         mocks.store["jscc/global"].errors = 1;
                     });
                     assert.doesNotThrow(function() {
                         jscc({
                                  src_file: "invalidFileName.par",
                                  tpl_file: "invalidTemplate.js",
                                  outputCallback: function() {
                                  }
                              });
                     }, Error);
                     assert.called(integrityStub);
                 } finally {
                     if (!skipFinallyRestore) {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     }
                 }
             });
         }));

    test("Calls io.exit with a non-zero exit code if there are ordinary errors when the exitIfErrors option is true",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 var skipFinallyRestore = true, exitStub = ioStub.exit;
                 try {
                     try {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     } catch (e) {
                         skipFinallyRestore = false;
                     }
                     sandbox.stub(mocks.store["jscc/integrity"], "check_empty_states", function() {
                         mocks.store["jscc/global"].errors = 1;
                     });
                     exitStub.reset();
                     jscc({
                              src_file: "invalidFileName.par",
                              tpl_file: "invalidTemplate.js",
                              outputCallback: function() {
                              },
                              exitIfErrors: true
                          });
                     assert.calledOnce(exitStub);
                     assert.neverCalledWith(exitStub, 0);
                     assert.alwaysCalledWith(exitStub, sinon.match.number);
                 } finally {
                     if (!skipFinallyRestore) {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     }
                 }
             });
         }));

    test("Does not call io.exit when exitIfErrors is false",
         injector.run(["mocks", "jscc"], function(mocks, jscc) {
             wrapStub(mocks, function() {
                 var integrityStub, skipFinallyRestore = true, exitStub = ioStub.exit;
                 try {
                     try {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     } catch (e) {
                         skipFinallyRestore = false;
                     }
                     integrityStub = sandbox.stub(mocks.store["jscc/integrity"], "check_empty_states", function() {
                         mocks.store["jscc/global"].errors = 1;
                     });
                     exitStub.reset();
                     jscc({
                              src_file: "invalidFileName.par",
                              tpl_file: "invalidTemplate.js",
                              outputCallback: function() {
                              }
                          });
                     assert.notCalled(exitStub);
                     assert.called(integrityStub);
                 } finally {
                     if (!skipFinallyRestore) {
                         mocks.store["jscc/integrity"].check_empty_states.restore();
                     }
                 }
             })
         }));
});
