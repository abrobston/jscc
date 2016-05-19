/*
 * Universal module definition for logging in browsers.
 */
(function(root, factory) {
    /* istanbul ignore next */
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
     * @constructor
     * @implements {jscc.log}
     */
    jscc.logBrowser = function() {
        this._level = LOG_LEVEL.WARN;
    };

    /**
     * @type {jscc.enums.LOG_LEVEL}
     * @private
     */
    jscc.logBrowser.prototype._level = LOG_LEVEL.WARN;

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.fatal = function(msg) {
        if (this._level <= LOG_LEVEL.FATAL) {
            innerConsole.error(msg);
        }
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.error = function(msg) {
        if (this._level <= LOG_LEVEL.ERROR) {
            innerConsole.error(msg);
        }
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.warn = function(msg) {
        if (this._level <= LOG_LEVEL.WARN) {
            innerConsole.warn(msg);
        }
        global.warnings++;
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.info = function(msg) {
        if (this._level <= LOG_LEVEL.INFO) {
            innerConsole.info(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.debug = function(msg) {
        if (this._level <= LOG_LEVEL.DEBUG) {
            innerConsole.log(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.trace = function(msg) {
        if (this._level <= LOG_LEVEL.TRACE) {
            innerConsole.trace(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.setLevel = function(level) {
        this._level = level;
    };

    /**
     * @module jscc/log/log
     */
    return new jscc.logBrowser();
}));
