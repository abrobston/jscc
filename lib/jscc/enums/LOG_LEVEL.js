(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.LOG_LEVEL = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Specifies the minimum logging level.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.LOG_LEVEL = {
        /**
         * Log all messages.
         */
        TRACE: 0,
        /**
         * Log debug messages and higher.
         */
        DEBUG: 1,
        /**
         * Log info messages and higher.
         */
        INFO: 2,
        /**
         * Log warning messages and higher.
         */
        WARN: 3,
        /**
         * Log error and fatal messages.
         */
        ERROR: 4,
        /**
         * Log only fatal messages.
         */
        FATAL: 5
    };
    /**
     * Module containing LOG_LEVEL enumeration.
     * @module jscc/enums/LOG_LEVEL
     */
    return j.enums.LOG_LEVEL;
}));