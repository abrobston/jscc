/**
 * Universal module definition for util.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./enums/LOG_LEVEL'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./enums/LOG_LEVEL'));
    } else {
        root.util =
            factory(root.LOG_LEVEL);
    }
}(this, function(LOG_LEVEL) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * Utility functions.
     * @module {jscc.util} jscc/util
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
