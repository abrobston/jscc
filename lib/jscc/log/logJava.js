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
    var /** @type {java.util.logging.Logger} */ Logger,
        /** @type {java.util.logging.Level} */ Level,
        /** @type {function(new:java.util.logging.ConsoleHandler)} */ ConsoleHandler;
    //>>includeStart("nashorn", pragmas.nashorn);
    Logger = Java.type("java.util.logging.Logger");
    Level = Java.type("java.util.logging.Level");
    ConsoleHandler = Java.type("java.util.logging.ConsoleHandler");
    //>>includeEnd("nashorn");
    //>>excludeStart("nashorn", pragmas.nashorn);
    Logger = java.util.logging.Logger;
    Level = java.util.logging.Level;
    ConsoleHandler = java.util.logging.ConsoleHandler;
    //>>excludeEnd("nashorn");

    function resolveModules() {
        global = global || require("../global");
    }

    /**
     * @implements {jscc.log}
     * @constructor
     */
    jscc.logJava = function() {
        this._log = Logger.getLogger("jscc");
        var handler = new ConsoleHandler();
        handler.setLevel(Level.FINER);
        this._log.addHandler(handler);
    };

    /**
     * @type {?}
     * @private
     */
    jscc.logJava.prototype._log = null;

    /**
     * @param {?} javaLevel
     * @param {string} msg
     * @private
     */
    jscc.logJava.prototype._write = function(javaLevel, msg) {
        //>>includeStart("nashorn", pragmas.nashorn);
        this._log["log(java.util.logging.Level, java.lang.String)"](javaLevel, msg);
        //>>includeEnd("nashorn");
        //>>excludeStart("nashorn", pragmas.nashorn);
        this._log.log(javaLevel, msg);
        //>>excludeEnd("nashorn");
    };
    
    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.fatal = function(msg) {
        resolveModules();
        this._write(Level.SEVERE, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.error = function(msg) {
        resolveModules();
        this._write(Level.SEVERE, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.warn = function(msg) {
        resolveModules();
        this._write(Level.WARNING, msg);
        global.warnings++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.info = function(msg) {
        this._write(Level.INFO, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.debug = function(msg) {
        this._write(Level.FINE, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.trace = function(msg) {
        this._write(Level.FINER, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.setLevel = function(level) {
        switch (level) {
            case LOG_LEVEL.FATAL:
            case LOG_LEVEL.ERROR:
                this._log.setLevel(Level.SEVERE);
                break;
            case LOG_LEVEL.WARN:
                this._log.setLevel(Level.WARNING);
                break;
            case LOG_LEVEL.INFO:
                this._log.setLevel(Level.INFO);
                break;
            case LOG_LEVEL.DEBUG:
                this._log.setLevel(Level.FINE);
                break;
            case LOG_LEVEL.TRACE:
                this._log.setLevel(Level.FINER);
                break;
            default:
                this._log.setLevel(Level.WARNING);
                break;
        }
    };

    /**
     * @module {jscc.log} jscc/log/log
     */
    return new jscc.logJava();
}));
