/*
 * Universal module definition for logging in browsers.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'));
    } else {
        root.log = factory(root.global);
    }
}(this, function(/** module:jscc/global */ global) {
    var innerConsole = console || Console || {};
    innerConsole.log = innerConsole.log || function(msg) {
        };
    innerConsole.warn = innerConsole.warn || innerConsole.log || function(msg) {
        };
    innerConsole.error = innerConsole.error || innerConsole.log || function(msg) {
        };
    innerConsole.info = innerConsole.info || innerConsole.log || function(msg) {
        };
    innerConsole.trace = innerConsole.trace || innerConsole.log || function(msg) {
        };
    /**
     * @private
     * @type {module:jscc/global.LOG_LEVEL}
     */
    var logLevel = global.LOG_LEVEL.WARN;

    /**
     * Browser-specific logging module.  Presumes the availability
     * of console or Console.
     * @module jscc/log/log
     * @requires module:jscc/global
     * @implements {log}
     */
    var exports = {
        fatal: function(msg) {
            if (logLevel <= global.LOG_LEVEL.FATAL) {
                innerConsole.error(msg);
            }
            global.errors++;
        },

        error: function(msg) {
            if (logLevel <= global.LOG_LEVEL.ERROR) {
                innerConsole.error(msg);
            }
            global.errors++;
        },

        warn: function(msg) {
            if (logLevel <= global.LOG_LEVEL.WARN) {
                innerConsole.warn(msg);
            }
            global.warnings++;
        },

        info: function(msg) {
            if (logLevel <= global.LOG_LEVEL.INFO) {
                innerConsole.info(msg);
            }
        },

        debug: function(msg) {
            if (logLevel <= global.LOG_LEVEL.DEBUG) {
                innerConsole.log(msg);
            }
        },

        trace: function(msg) {
            if (logLevel <= global.LOG_LEVEL.TRACE) {
                innerConsole.trace(msg);
            }
        },

        setLevel: function(level) {
            logLevel = level;
        }
    };
    return exports;
}));
