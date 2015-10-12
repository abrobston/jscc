/*
 * Universal module definition for logging in both Rhino and Nashorn.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'));
    } else {
        root.log = factory(root.global);
    }
}(this, function(global) {
    var log = java.util.logging.Logger.getLogger("jscc");
    /**
     * The logging module as implemented for Rhino and Nashorn.
     * @module jscc/log/log
     * @implements {log}
     * @requires module:jscc/global
     */
    var exports = {
        fatal: function(msg) {
            log.log(java.util.logging.Level.SEVERE, msg);
            global.errors++;
        },

        error: function(msg) {
            log.log(java.util.logging.Level.SEVERE, msg);
            global.errors++;
        },

        warn: function(msg) {
            log.log(java.util.logging.Level.WARNING, msg);
            global.warnings++;
        },

        info: function(msg) {
            log.log(java.util.logging.Level.INFO, msg);
        },

        debug: function(msg) {
            log.log(java.util.logging.Level.FINE, msg);
        },

        trace: function(msg) {
            log.log(java.util.logging.Level.FINER, msg);
        },

        setLevel: function(level) {
            switch (level) {
                case global.LOG_LEVEL.FATAL:
                case global.LOG_LEVEL.ERROR:
                    log.setLevel(java.util.logging.Level.SEVERE);
                    break;
                case global.LOG_LEVEL.WARN:
                    log.setLevel(java.util.logging.Level.WARNING);
                    break;
                case global.LOG_LEVEL.INFO:
                    log.setLevel(java.util.logging.level.INFO);
                    break;
                case global.LOG_LEVEL.DEBUG:
                    log.setLevel(java.util.logging.level.FINE);
                    break;
                case global.LOG_LEVEL.TRACE:
                    log.setLevel(java.util.logging.level.FINER);
                    break;
                default:
                    log.setLevel(java.util.logging.Level.WARNING);
                    break;
            }
        }
    };
    return exports;
}));
