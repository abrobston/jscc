(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.EXEC = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Indicates whether the executable environment is a
     * console-based Javascript engine or a web environment.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.EXEC = {
        /**
         * A console-based Javascript engine is in use.
         */
        CONSOLE: 0,
        /**
         * A web-browser-based Javascript engine is in use.
         */
        WEB: 1
    };
    /**
     * Module containing EXEC enumeration.
     * @module jscc/enums/EXEC
     */
    return j.enums.EXEC;
}));