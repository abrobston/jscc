/*
 * Universal module definition for logging in browsers.
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

    function resolveModules() {
        global = global || require('../global');
    }

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
        resolveModules();
        if (this._level <= LOG_LEVEL.FATAL) {
            innerConsole.error(msg);
        }
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.error = function(msg) {
        resolveModules();
        if (this._level <= LOG_LEVEL.ERROR) {
            innerConsole.error(msg);
        }
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logBrowser.prototype.warn = function(msg) {
        resolveModules();
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
