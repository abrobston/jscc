/*
 * Universal module definition for logging in Node.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global', '../util'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'), require('../util'));
    } else {
        root.log = factory(root.global, root.util);
    }
}(this, function(global, util) {
    var log = require('log4js').getLogger();
    /**
     * The logging module as implemented for Node.
     * @module jscc/log/log
     * @implements {log}
     * @requires module:jscc/global
     */
    var exports = {
        fatal: function(msg) {
            log.fatal(msg);
            global.errors++;
        },

        error: function(msg) {
            log.error(msg);
            global.errors++;
        },

        warn: function(msg) {
            log.warn(msg);
            global.errors++;
        },

        info: function(msg) {
            log.info(msg);
        },

        debug: function(msg) {
            log.debug(msg);
        },

        trace: function(msg) {
            log.trace(msg)
        },

        setLevel: function(level) {
            log.setLevel(util.log_level_string(level));
        }
    };
    return exports;
}));
