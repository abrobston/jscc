(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.SPECIAL = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Identifies a special symbol.  Special symbols include
     * end-of-file, whitespace, and error symbols.  Use
     * NONE to indicate a non-special symbol.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.SPECIAL = {
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
    return j.enums.SPECIAL;
}));