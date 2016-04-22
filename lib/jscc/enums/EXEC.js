(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EXEC = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    /**
     * Indicates whether the executable environment is a
     * console-based Javascript engine or a web environment.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.EXEC = {
        /**
         * A console-based Javascript engine is in use.
         */
        CONSOLE: 0,
        /**
         * A web-browser-based Javascript engine is in use.
         */
        WEB: 1
    };
    //>>excludeEnd("closure");
    /**
     * Module containing EXEC enumeration.
     * @module jscc/enums/EXEC
     */
    return jscc.enums.EXEC;
}));