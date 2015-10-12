/**
 * Universal module definition for util.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './nfaStates', './tabgen'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./nfaStates'), require('./tabgen'));
    } else {
        root.util = factory(root.global, root.nfaStates, root.tabgen);
    }
}(this, function(/** module:jscc/global */ global,
                 /** module:jscc/nfaStates */ nfaStates,
                 /** module:jscc/tabgen */ tabgen) {
    /**
     * Utility functions.
     * @module jscc/util
     * @requires module:jscc/global
     * @requires module:jscc/nfaStates
     * @requires module:jscc/tabgen
     */
    return {
        /**
         * Unions the content of two arrays.
         * @param {Array} dest_array - The destination array.
         * @param {Array} src_array - The source array.  Elements
         * that are not in dest_array but in src_array are copied
         * to dest_array.
         * @returns {Array} The destination array, the union of
         * both input arrays.
         * @author Jan Max Meyer
         * @memberof module:jscc/util
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
         * @param {module:jscc/global.EXEC} mode - Execution mode.  This can be either
         * EXEC.CONSOLE or EXEC.WEB.
         * @author Jan Max Meyer
         * @memberof module:jscc/util
         */
        reset_all: function(mode) {
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
            tabgen.create_symbol("", global.SYM.NONTERM, global.SPECIAL.NONE);
            global.symbols[0].defined = true;

            // Error synchronization token
            tabgen.create_symbol("ERROR_RESYNC", global.SYM.TERM, global.SPECIAL.ERROR);
            global.symbols[1].defined = true;

            p = new global.Production();
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
         * {@link module:jscc/global.LOG_LEVEL} value provided.
         * @param {module:jscc/global.LOG_LEVEL} level - The
         * LOG_LEVEL value
         * @returns {string} The name of the log level in all caps
         * @memberof module:jscc/util
         */
        log_level_string: function(level) {
            switch (level) {
                case global.LOG_LEVEL.FATAL:
                    return "FATAL";
                case global.LOG_LEVEL.ERROR:
                    return "ERROR";
                case global.LOG_LEVEL.WARN:
                    return "WARN";
                case global.LOG_LEVEL.INFO:
                    return "INFO";
                case global.LOG_LEVEL.DEBUG:
                    return "DEBUG";
                case global.LOG_LEVEL.TRACE:
                    return "TRACE";
                default:
                    return "";
            }
        },

        /**
         * Gets the {@link module:jscc/global.LOG_LEVEL} value
         * corresponding to the provided string.  If the string
         * is empty or invalid, returns
         * {@link module:jscc/global.LOG_LEVEL.WARN} as a default.
         * @param {string} levelString - The name of the log level.
         * @returns {module:jscc/global.LOG_LEVEL} The corresponding
         * LOG_LEVEL value, defaulting to WARN.
         */
        log_level_value: function(levelString) {
            switch ((levelString || "").trim().toUpperCase()) {
                case "FATAL":
                    return global.LOG_LEVEL.FATAL;
                case "ERROR":
                    return global.LOG_LEVEL.ERROR;
                case "WARN":
                    return global.LOG_LEVEL.WARN;
                case "INFO":
                    return global.LOG_LEVEL.INFO;
                case "DEBUG":
                    return global.LOG_LEVEL.DEBUG;
                case "TRACE":
                    return global.LOG_LEVEL.TRACE;
                default:
                    return global.LOG_LEVEL.WARN;
            }
        }
    };
}));
