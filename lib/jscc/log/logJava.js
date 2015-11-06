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
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");

    function resolveModules() {
        global = global || require("../global");
    }

    /**
     * @implements {jscc.log}
     * @constructor
     */
    jscc.logJava = function() {
        this._log = java.util.logging.Logger.getLogger("jscc");
    };

    /**
     * @type {?}
     * @private
     */
    jscc.logJava.prototype._log = null;
    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.fatal = function(msg) {
        resolveModules();
        this._log.log(java.util.logging.Level.SEVERE, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.error = function(msg) {
        resolveModules();
        this._log.log(java.util.logging.Level.SEVERE, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.warn = function(msg) {
        resolveModules();
        this._log.log(java.util.logging.Level.WARNING, msg);
        global.warnings++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.info = function(msg) {
        this._log.log(java.util.logging.Level.INFO, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.debug = function(msg) {
        this._log.log(java.util.logging.Level.FINE, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.trace = function(msg) {
        this._log.log(java.util.logging.Level.FINER, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.setLevel = function(level) {
        switch (level) {
            case LOG_LEVEL.FATAL:
            case LOG_LEVEL.ERROR:
                this._log.setLevel(java.util.logging.Level.SEVERE);
                break;
            case LOG_LEVEL.WARN:
                this._log.setLevel(java.util.logging.Level.WARNING);
                break;
            case LOG_LEVEL.INFO:
                this._log.setLevel(java.util.logging.level.INFO);
                break;
            case LOG_LEVEL.DEBUG:
                this._log.setLevel(java.util.logging.level.FINE);
                break;
            case LOG_LEVEL.TRACE:
                this._log.setLevel(java.util.logging.level.FINER);
                break;
            default:
                this._log.setLevel(java.util.logging.Level.WARNING);
                break;
        }
    };

    /**
     * @module {jscc.log} jscc/log/log
     */
    return new jscc.logJava();
}));
