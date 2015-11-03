/*
 * Universal module definition for logging in browsers.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', '../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require, require('../global'));
    } else {
        root.log = factory(root.require, root.global);
    }
}(this, function(/** function(string) */ require,
                 /** jscc.global */ global) {
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
     * @type {jscc.global.LOG_LEVEL}
     */
    var logLevel = global.LOG_LEVEL.WARN;

    function resolveModules() {
        global = global || require('../global');
    }

    /**
     * @module jscc/log/log
     * @implements {jscc.log}
     */
    return {
        fatal: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.FATAL) {
                innerConsole.error(msg);
            }
            global.errors++;
        },

        error: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.ERROR) {
                innerConsole.error(msg);
            }
            global.errors++;
        },

        warn: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.WARN) {
                innerConsole.warn(msg);
            }
            global.warnings++;
        },

        info: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.INFO) {
                innerConsole.info(msg);
            }
        },

        debug: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.DEBUG) {
                innerConsole.log(msg);
            }
        },

        trace: function(msg) {
            resolveModules();
            if (logLevel <= global.LOG_LEVEL.TRACE) {
                innerConsole.trace(msg);
            }
        },

        setLevel: function(level) {
            resolveModules();
            logLevel = level;
        }
    };
}));
