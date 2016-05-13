/*
 * Universal module definition for logging in both Rhino and Nashorn.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', '../global', '../enums/LOG_LEVEL'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jscclog = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this, function(/** reqParameter */ require) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    var global = /** @type {jscc.global} */ (require("../global")),
        LOG_LEVEL = require("../enums/LOG_LEVEL");

    var /** @type {function(new:java.util.logging.ConsoleHandler)} */ ConsoleHandler,
        /** @type {java.util.logging.Level} */ javaSevere,
        /** @type {java.util.logging.Level} */ javaWarning,
        /** @type {java.util.logging.Level} */ javaInfo,
        /** @type {java.util.logging.Level} */ javaFine,
        /** @type {java.util.logging.Level} */ javaFiner;
    //>>includeStart("nashorn", pragmas.nashorn);
    var javaLevel = /** @type {java.util.logging.Level} */ (Java.type("java.util.logging.Level"));
    javaSevere = javaLevel.SEVERE;
    javaWarning = javaLevel.WARNING;
    javaInfo = javaLevel.INFO;
    javaFine = javaLevel.FINE;
    javaFiner = javaLevel.FINER;
    ConsoleHandler = /** @type {function(new:java.util.logging.ConsoleHandler)} */
        (Java.type("java.util.logging.ConsoleHandler"));
    //>>includeEnd("nashorn");
    //>>excludeStart("nashorn", pragmas.nashorn);
    javaSevere = java.util.logging.Level.SEVERE;
    javaWarning = java.util.logging.Level.WARNING;
    javaInfo = java.util.logging.Level.INFO;
    javaFine = java.util.logging.Level.FINE;
    javaFiner = java.util.logging.Level.FINER;
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
        //>>includeStart("nashorn", pragmas.nashorn);
        this._log = /** @type {java.util.logging.Logger} */ (Java.type("java.util.logging.Logger").getLogger("jscc"));
        //>>includeEnd("nashorn");
        //>>excludeStart("nashorn", pragmas.nashorn);
        this._log = java.util.logging.Logger.getLogger("jscc");
        //>>excludeEnd("nashorn");
        var handler = new ConsoleHandler();
        handler.setLevel(javaFiner);
        this._log.addHandler(handler);
    };

    /**
     * @type {java.util.logging.Logger}
     * @private
     */
    jscc.logJava.prototype._log = null;

    /**
     * @param {java.util.logging.Level} javaLevel
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
        this._write(javaSevere, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.error = function(msg) {
        resolveModules();
        this._write(javaSevere, msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.warn = function(msg) {
        resolveModules();
        this._write(javaWarning, msg);
        global.warnings++;
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.info = function(msg) {
        this._write(javaInfo, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.debug = function(msg) {
        this._write(javaFine, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.trace = function(msg) {
        this._write(javaFiner, msg);
    };

    /**
     * @inheritDoc
     */
    jscc.logJava.prototype.setLevel = function(level) {
        switch (level) {
            case LOG_LEVEL.FATAL:
            case LOG_LEVEL.ERROR:
                this._log.setLevel(javaSevere);
                break;
            case LOG_LEVEL.WARN:
                this._log.setLevel(javaWarning);
                break;
            case LOG_LEVEL.INFO:
                this._log.setLevel(javaInfo);
                break;
            case LOG_LEVEL.DEBUG:
                this._log.setLevel(javaFine);
                break;
            case LOG_LEVEL.TRACE:
                this._log.setLevel(javaFiner);
                break;
            default:
                this._log.setLevel(javaWarning);
                break;
        }
    };

    /**
     * @module {jscc.log} jscc/log/log
     */
    return new jscc.logJava();
}));
