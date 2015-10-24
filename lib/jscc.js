/*
 * Universal module definition for main entry point of JS/CC.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jscc/global', 'jscc/io/io', 'jscc/first',
                'jscc/printtab', 'jscc/tabgen', 'jscc/util',
                'jscc/integrity', 'jscc/lexdbg',
                'jscc/parse', 'jscc/log/log'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jscc/global'),
                                 require('jscc/io/io'), require('jscc/first'),
                                 require('jscc/printtab'), require('jscc/tabgen'),
                                 require('jscc/util'),
                                 require('jscc/integrity'),
                                 require('jscc/lexdbg'), require('jscc/parse'), require("jscc/log/log"));
    } else {
        root.jscc = factory(root.global, root.io, root.first,
                            root.printtab, root.tabgen, root.util, root.integrity,
                            root.lexdbg, root.parse, root.log);
    }
}(this, function(/** module:jscc/global */ global,
                 /** io */ io,
                 /** module:jscc/first */ first,
                 /** module:jscc/printtab */ printtab,
                 /** module:jscc/tabgen */ tabgen,
                 /** module:jscc/util */ util,
                 /** module:jscc/integrity */ integrity,
                 /** module:jscc/lexdbg */ lexdbg,
                 /** module:jscc/parse */ parse,
                 /** log */ log) {
    /**
     * The main entry point of JS/CC.  Call this module as a function to
     * process a grammar specification.
     * @module jscc
     * @requires module:jscc/global
     * @requires module:jscc/io/io
     * @requires module:jscc/first
     * @requires module:jscc/printtab
     * @requires module:jscc/tabgen
     * @requires module:jscc/util
     * @requires module:jscc/integrity
     * @requires module:jscc/lexdbg
     * @requires module:jscc/parse
     * @requires module:jscc/log/log
     * @param {object=} options - Configuration options for the jscc module.
     * @param {string=} options[].out_file - The path of the output file.  Defaults to
     * the empty string, which means to print to standard output (or the engine's equivalent).
     * @param {string=} options[].src_file - The path of the input grammar file.
     * Defaults to the empty string, which means to read from standard input (or
     * the engine's equivalent).
     * @param {string=} options[].tpl_file - The path of the input template file.
     * Defaults to the module's default template file, which is intended for generic
     * compilation tasks.
     * @param {(string|function)=} options[].input - If a string, the contents of the
     * input grammar.  If a function with no arguments, a function that returns
     * the contents of the grammar.  When input is specified, src_file is ignored.
     * @param {(string|function)=} options[].template - If a string, the contents of the
     * template.  If a function with no arguments, a function that returns the contents
     * of the template.  When template is specified, tpl_file is ignored.
     * @param {function=} options[].outputCallback - A function with a parameter
     * that will be called with the output.  When outputCallback is specified,
     * out_file is ignored.
     * @param {boolean=} options[].dump_nfa - Whether to output the nondeterministic finite
     * automata for debugging purposes.  Defaults to false.
     * @param {boolean=} options[].dump_dfa - Whether to output the deterministic finite
     * automata for debugging purposes.  Defaults to false.
     * @param {boolean=} options[].verbose - Make debugging output chattier.  Defaults to
     * false.
     * @param {(string|module:jscc/global.LOG_LEVEL)=} options[].logLevel - The logging
     * level.  Can be the name of one of the {@link module:jscc/global.LOG_LEVEL} values
     * or one of the values themselves.  Defaults to WARN.
     */
    var jscc =
        function(options) {
            util.reset_all(global.EXEC.CONSOLE);
            options = options || {};
            var out_file = (typeof options.out_file === 'string') ? options.out_file : "";
            var src_file = (typeof options.src_file === 'string') ? options.src_file : "";
            var tpl_file = (typeof options.tpl_file === 'string') && options.tpl_file != "" ?
                options.tpl_file :
                global.DEFAULT_DRIVER;
            var dump_nfa = (typeof options.dump_nfa === 'boolean') ? options.dump_nfa : false;
            var dump_dfa = (typeof options.dump_dfa === 'boolean') ? options.dump_dfa : false;
            var verbose = (typeof options.verbose === 'boolean') ? options.verbose : false;
            var inputString = (typeof options.input === 'string') ? options.input : "";
            var inputFunction = (typeof options.input === 'function') ? options.input : null;
            var templateString = (typeof options.template === 'string') ? options.template : "";
            var templateFunction = (typeof options.template === 'function') ? options.template : null;
            var outputCallback = (typeof options.outputCallback === 'function') ? options.outputCallback : null;
            var logLevel = global.LOG_LEVEL.WARN;
            if (typeof options.logLevel === 'string') {
                logLevel = util.log_level_value(options.logLevel);
            } else if (options.logLevel && options.logLevel instanceof global.LOG_LEVEL) {
                logLevel = options.logLevel;
            }
            log.setLevel(logLevel);

            // Only relevant to browsers, but include anyway
            if (inputString !== "") {
                global.read_all_input_function = function() {
                    return inputString;
                }
            } else if (inputFunction) {
                global.read_all_input_function = inputFunction;
            }

            if (templateString !== "") {
                global.read_template_function = function() {
                    return templateString;
                }
            } else if (templateFunction) {
                global.read_template_function = templateFunction;
            }

            if (outputCallback) {
                global.write_output_function = outputCallback;
            }

            global.file = (src_file || "") === "" ? "[input]" : src_file;
            global.dump_nfa = dump_nfa;
            global.dump_dfa = dump_dfa;

            var src = inputString;
            if (src === "") {
                if (inputFunction) {
                    src = inputFunction();
                } else if (src_file !== "") {
                    src = io.read_all_input(src_file);
                } else {
                    // TODO: read standard input
                    log.error("No input.  Specify input or src_file in the options parameter.");
                }
            }
            if (src !== "") {
                parse(src, global.file);

                if (global.errors == 0) {
                    integrity.undef();
                    integrity.unreachable();

                    if (global.errors == 0) {
                        first.first();
                        tabgen.lalr1_parse_table(false);
                        integrity.check_empty_states();

                        if (global.errors == 0) {
                            if (global.dump_dfa) {
                                lexdbg.print_dfa(global.dfa_states);
                            }
                            var driver = templateString;
                            if (driver === "") {
                                if (templateFunction) {
                                    driver = templateFunction();
                                } else {
                                    driver = io.read_template(tpl_file);
                                }
                            }

                            driver = driver.replace(/##HEADER##/gi, global.code_head);
                            driver = driver.replace(/##TABLES##/gi, printtab.print_parse_tables(global.MODE_GEN.JS));
                            driver = driver.replace(/##DFA##/gi, printtab.print_dfa_table(global.dfa_states));
                            driver = driver.replace(/##TERMINAL_ACTIONS##/gi, printtab.print_term_actions());
                            driver = driver.replace(/##LABELS##/gi, printtab.print_symbol_labels());
                            driver = driver.replace(/##ACTIONS##/gi, printtab.print_actions());
                            driver = driver.replace(/##FOOTER##/gi, global.code_foot);
                            driver = driver.replace(/##PREFIX##/gi, global.code_prefix);
                            driver = driver.replace(/##ERROR_TOKEN##/gi, printtab.get_error_symbol_id());
                            driver = driver.replace(/##EOF##/gi, printtab.get_eof_symbol_id());
                            driver = driver.replace(/##WHITESPACE##/gi, printtab.get_whitespace_symbol_id());

                            if (outputCallback) {
                                outputCallback(driver);
                            } else if (out_file != "") {
                                io.write_output({
                                    text: driver,
                                    destination: out_file
                                });
                            } else {
                                io.write_output(driver);
                            }

                            if (verbose) {
                                log.info("\"" + src_file + "\" produced " + global.states.length + " states (" +
                                         global.shifts + " shifts," +
                                         global.reduces + " reductions, " + global.gotos + " gotos)");
                            }
                        }
                    }
                }

                if (verbose) {
                    log.info(global.warnings + " warning" + (global.warnings > 1 ? "s" : "") + ", " +
                             global.errors + " error" + (global.errors > 1 ? "s" : ""));
                }
            }
        };
    return jscc;
}));
