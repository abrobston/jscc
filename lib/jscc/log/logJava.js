/*
 * Universal module definition for logging in both Rhino and Nashorn.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', '../global', '../enums/LOG_LEVEL'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require, require('../global'), require('../enums/LOG_LEVEL'));
    } else {
        root.log = factory(root.require, root.global, root.LOG_LEVEL);
    }
}(this, function(/** function(string) */ require,
                 /** jscc.global */ global,
                 LOG_LEVEL) {
    var log = java.util.logging.Logger.getLogger("jscc");
    function resolveModules() {
        global = global || require("../global");
    }

    /**
     * @module jscc/log/log
     * @implements {jscc.log}
     */
    return {
        fatal: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.SEVERE, msg);
            global.errors++;
        },

        error: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.SEVERE, msg);
            global.errors++;
        },

        warn: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.WARNING, msg);
            global.warnings++;
        },

        info: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.INFO, msg);
        },

        debug: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.FINE, msg);
        },

        trace: function(msg) {
            resolveModules();
            log.log(java.util.logging.Level.FINER, msg);
        },

        setLevel: function(level) {
            resolveModules();
            switch (level) {
                case LOG_LEVEL.FATAL:
                case LOG_LEVEL.ERROR:
                    log.setLevel(java.util.logging.Level.SEVERE);
                    break;
                case LOG_LEVEL.WARN:
                    log.setLevel(java.util.logging.Level.WARNING);
                    break;
                case LOG_LEVEL.INFO:
                    log.setLevel(java.util.logging.level.INFO);
                    break;
                case LOG_LEVEL.DEBUG:
                    log.setLevel(java.util.logging.level.FINE);
                    break;
                case LOG_LEVEL.TRACE:
                    log.setLevel(java.util.logging.level.FINER);
                    break;
                default:
                    log.setLevel(java.util.logging.Level.WARNING);
                    break;
            }
        }
    };
}));
