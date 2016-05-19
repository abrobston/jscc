/*
 * Universal module definition for logging in Node.
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
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {jscc.log}
   */
  function(require, others) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    var global = /** @type {jscc.global} */ (require("../global")),
        LOG_LEVEL = require("../enums/LOG_LEVEL");

    /**
     * @constructor
     * @implements {jscc.log}
     */
    jscc.logNode = function() {
        this._level = LOG_LEVEL.WARN;
    };

    /**
     * @type {jscc.enums.LOG_LEVEL}
     * @private
     */
    jscc.logNode.prototype._level = LOG_LEVEL.WARN;

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.fatal = function(msg) {
        console.error(msg);
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.error = function(msg) {
        if (this._level <= LOG_LEVEL.ERROR) {
            console.error(msg);
        }
        global.errors++;
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.warn = function(msg) {
        if (this._level <= LOG_LEVEL.WARN) {
            console.warn(msg);
        }
        global.warnings++;
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.info = function(msg) {
        if (this._level <= LOG_LEVEL.INFO) {
            console.info(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.debug = function(msg) {
        if (this._level <= LOG_LEVEL.DEBUG) {
            console.log(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.trace = function(msg) {
        if (this._level <= LOG_LEVEL.TRACE) {
            console.trace(msg);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.logNode.prototype.setLevel = function(level) {
        this._level = level;
    };

    /**
     * @module jscc/log/log
     */
    return new jscc.logNode();
}));
