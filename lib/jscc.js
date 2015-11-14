/*
 * Universal module definition for main entry point of JS/CC.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jscc/global', 'jscc/io/io', 'jscc/first',
                'jscc/printtab', 'jscc/tabgen', 'jscc/util',
                'jscc/integrity', 'jscc/lexdbg',
                'jscc/parse', 'jscc/log/log', 'jscc/enums/LOG_LEVEL', 'jscc/enums/EXEC', 'jscc/lexdfa',
                'jscc/enums/MODE_GEN'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./jscc/global'),
                                 require('./jscc/io/io'), require('./jscc/first'),
                                 require('./jscc/printtab'), require('./jscc/tabgen'),
                                 require('./jscc/util'),
                                 require('./jscc/integrity'),
                                 require('./jscc/lexdbg'), require('./jscc/parse'), require("./jscc/log/log"),
                                 require('./jscc/enums/LOG_LEVEL'), require('./jscc/enums/EXEC'), require('./jscc/lexdfa'),
                                 require('./jscc/enums/MODE_GEN'));
    } else {
        root.jscc = factory(root.global, root.io, root.first,
                            root.printtab, root.tabgen, root.util, root.integrity,
                            root.lexdbg, root.parse, root.log, root.LOG_LEVEL, root.EXEC, root.lexdfa, root.MODE_GEN);
    }
}(this, function(/** jscc.global */ global,
                 /** jscc.io */ io,
                 /** jscc.first */ first,
                 /** jscc.printtab */ printtab,
                 /** jscc.tabgen */ tabgen,
                 /** jscc.util */ util,
                 /** jscc.integrity */ integrity,
                 /** jscc.lexdbg */ lexdbg,
                 /** function(string, string=):number */ parse,
                 /** jscc.log */ log,
                 LOG_LEVEL,
                 EXEC,
                 /** jscc.lexdfa */ lexdfa,
                 MODE_GEN) {
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
     * @param {?mainOptions=} options - Configuration options for the jscc module.
     */
    var main =
        function(options) {
            var opt = options || {};
            var out_file = (typeof opt['out_file'] === 'string') ? opt['out_file'] : "";
            var src_file = (typeof opt['src_file'] === 'string') ? opt['src_file'] : "";
            var tpl_file = (typeof opt['tpl_file'] === 'string') && opt['tpl_file'] != "" ?
                opt['tpl_file'] :
                global.DEFAULT_DRIVER;
            var dump_nfa = (typeof opt['dump_nfa'] === 'boolean') ? opt['dump_nfa'] : false;
            var dump_dfa = (typeof opt['dump_dfa'] === 'boolean') ? opt['dump_dfa'] : false;
            var verbose = (typeof opt['verbose'] === 'boolean') ? opt['verbose'] : false;
            var inputString = /** @type {string} */ ((typeof opt['input'] === 'string') ? opt['input'] : "");
            var inputFunction = (typeof opt['input'] === 'function') ? opt['input'] : null;
            var templateString = (typeof opt['template'] === 'string') ? opt['template'] : "";
            var templateFunction = (typeof opt['template'] === 'function') ? opt['template'] : null;
            var outputCallback = (typeof opt['outputCallback'] === 'function') ? opt['outputCallback'] : null;
            var logLevel = /** jscc.enums.LOG_LEVEL */ (LOG_LEVEL.WARN);
            if (typeof opt['logLevel'] === 'string') {
                logLevel = util.log_level_value(opt['logLevel']);
            } else if (opt['logLevel']) {
                logLevel = /** jscc.enums.LOG_LEVEL */ (opt['logLevel']);
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
                    src = /** @type {string} */ (io.read_all_input(src_file));
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
                            global.dfa_states = lexdfa.create_subset(global.nfa_states);
                            global.dfa_states = lexdfa.minimize_dfa(global.dfa_states);
                            /**
                             * @type {string}
                             */
                            var driver = templateString;
                            if (driver === "") {
                                if (templateFunction) {
                                    driver = templateFunction();
                                } else {
                                    driver = /** @type {string} */ (io.read_template(tpl_file));
                                }
                            }

                            driver = driver.replace(/##HEADER##/gi, global.code_head);
                            driver = driver.replace(/##TABLES##/gi, printtab.print_parse_tables(MODE_GEN.JS));
                            driver = driver.replace(/##DFA##/gi, printtab.print_dfa_table(global.dfa_states));
                            driver = driver.replace(/##TERMINAL_ACTIONS##/gi, printtab.print_term_actions());
                            driver = driver.replace(/##LABELS##/gi, printtab.print_symbol_labels());
                            driver = driver.replace(/##ACTIONS##/gi, printtab.print_actions());
                            driver = driver.replace(/##FOOTER##/gi, global.code_foot);
                            driver = driver.replace(/##ERROR_TOKEN##/gi, printtab.get_error_symbol_id().toString());
                            driver = driver.replace(/##EOF##/gi, printtab.get_eof_symbol_id().toString());
                            driver = /** @type {string} */
                                (driver.replace(/##WHITESPACE##/gi, printtab.get_whitespace_symbol_id().toString()));

                            if (global.errors == 0) {
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
    return main;
}));
