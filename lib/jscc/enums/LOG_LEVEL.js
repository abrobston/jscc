(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LOG_LEVEL = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    //>>excludeEnd("closure");
    /**
     * Specifies the minimum logging level.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.LOG_LEVEL = {
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
    return jscc.enums.LOG_LEVEL;
}));