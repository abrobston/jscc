/**
 * Universal module definition for util.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', './global', './nfaStates', './tabgen', './classes/Production', './enums/SYM',
                './enums/SPECIAL', './enums/LOG_LEVEL'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require, require('./global'), require('./nfaStates'), require('./tabgen'),
                                 require('./classes/Production'), require('./enums/SYM'), require('./enums/SPECIAL'),
                                 require('./enums/LOG_LEVEL'));
    } else {
        root.util =
            factory(root.require, root.global, root.nfaStates, root.tabgen, root.Production, root.SYM, root.SPECIAL,
                    root.LOG_LEVEL);
    }
}(this, function(/** function(string) */ require,
                 /** jscc.global */ global,
                 /** function(new:jscc.NFAStates) */ nfaStates,
                 /** jscc.tabgen */ tabgen,
                 /** function(new:jscc.classes.Production, ?ProductionOptions=) */ Production,
                 SYM,
                 SPECIAL,
                 LOG_LEVEL) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * Utility functions.
     * @module {jscc.util} jscc/util
     * @requires module:jscc/global
     * @requires module:jscc/nfaStates
     * @requires module:jscc/tabgen
     */
    /**
     * @constructor
     */
    jscc.util = function() {
    };
    jscc.util.prototype = {
        /**
         * Unions the content of two arrays.
         * @template T
         * @param {!Array<T>} dest_array - The destination array.
         * @param {!Array<T>} src_array - The source array.  Elements
         * that are not in dest_array but in src_array are copied
         * to dest_array.
         * @returns {!Array<T>} The destination array, the union of
         * both input arrays.
         * @author Jan Max Meyer
         * @memberof jscc.util
         */
        union: function(dest_array, src_array) {
            var i, j;
            for (i = 0; i < src_array.length; i++) {
                for (j = 0; j < dest_array.length; j++) {
                    if (src_array[i] == dest_array[j]) {
                        break;
                    }
                }

                if (j == dest_array.length) {
                    dest_array.push(src_array[i]);
                }
            }

            return dest_array;
        },

        /**
         * Resets all global variables.  reset_all() should be called
         * each time a new grammar is compiled.
         * @param {jscc.enums.EXEC} mode - Execution mode.  This can be either
         * EXEC.CONSOLE or EXEC.WEB.
         * @author Jan Max Meyer
         * @memberof jscc.Util
         */
        reset_all: function(mode) {
            global = global || require("./global");
            tabgen = tabgen || require("./tabgen");
            nfaStates = nfaStates || require("./nfaStates");
            Production = Production || require("./classes/Production");
            var p;

            global.assoc_level = 1;
            global.exec_mode = mode;

            global.symbols = [];
            global.productions = [];
            global.states = [];
            global.NFA_states = new nfaStates();
            global.dfa_states = [];
            global.lex = [];

            // Placeholder for the goal symbol
            tabgen.create_symbol("", SYM.NONTERM, SPECIAL.NONE);
            global.symbols[0].defined = true;

            // Error synchronization token
            tabgen.create_symbol("ERROR_RESYNC", SYM.TERM, SPECIAL.ERROR);
            global.symbols[1].defined = true;

            p = new Production();
            p.lhs = 0;
            p.rhs = [];
            p.code = "%% = %1;";
            global.symbols[0].prods.push(global.productions.length);
            global.productions.push(p);
            global.whitespace_token = -1;
            global.file = "";
            global.errors = 0;
            global.show_errors = true;
            global.warnings = 0;
            global.show_warnings = false;

            global.shifts = 0;
            global.reduces = 0;
            global.gotos = 0;

            global.regex_weight = 0;

            global.code_head = "";
            global.code_foot = "";
        },

        /**
         * Gets the string name (in all caps) of the
         * {@link jscc.enums.LOG_LEVEL} value provided.
         * @param {jscc.enums.LOG_LEVEL} level - The
         * LOG_LEVEL value
         * @returns {string} The name of the log level in all caps
         * @memberof jscc.Util
         */
        log_level_string: function(level) {
            switch (level) {
                case LOG_LEVEL.FATAL:
                    return "FATAL";
                case LOG_LEVEL.ERROR:
                    return "ERROR";
                case LOG_LEVEL.WARN:
                    return "WARN";
                case LOG_LEVEL.INFO:
                    return "INFO";
                case LOG_LEVEL.DEBUG:
                    return "DEBUG";
                case LOG_LEVEL.TRACE:
                    return "TRACE";
                default:
                    return "";
            }
        },

        /**
         * Gets the {@link jscc.enums.LOG_LEVEL} value
         * corresponding to the provided string.  If the string
         * is empty or invalid, returns
         * {@link jscc.enums.LOG_LEVEL.WARN} as a default.
         * @param {string} levelString - The name of the log level.
         * @returns {jscc.enums.LOG_LEVEL} The corresponding
         * LOG_LEVEL value, defaulting to WARN.
         */
        log_level_value: function(levelString) {
            switch ((levelString || "").trim().toUpperCase()) {
                case "FATAL":
                    return LOG_LEVEL.FATAL;
                case "ERROR":
                    return LOG_LEVEL.ERROR;
                case "WARN":
                    return LOG_LEVEL.WARN;
                case "INFO":
                    return LOG_LEVEL.INFO;
                case "DEBUG":
                    return LOG_LEVEL.DEBUG;
                case "TRACE":
                    return LOG_LEVEL.TRACE;
                default:
                    return LOG_LEVEL.WARN;
            }
        }
    };
    return new jscc.util();
}));
