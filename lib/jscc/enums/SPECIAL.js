(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SPECIAL = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    //>>excludeEnd("closure");
    /**
     * Identifies a special symbol.  Special symbols include
     * end-of-file, whitespace, and error symbols.  Use
     * NONE to indicate a non-special symbol.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.SPECIAL = {
        /**
         * Identifies a non-special symbol.
         */
        NONE: 0,
        /**
         * Identifies an end-of-file symbol.
         */
        EOF: 1,
        /**
         * Identifies a whitespace symbol.
         */
        WHITESPACE: 2,
        /**
         * Identifies an error symbol.
         */
        ERROR: 3
    };
    /**
     * Module containing SPECIAL enumeration.
     * @module jscc/enums/SPECIAL
     */
    return jscc.enums.SPECIAL;
}));