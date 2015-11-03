(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.ASSOC = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Indicates the associativity of a symbol.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.ASSOC = {
        /**
         * The associativity has not yet been set.
         */
        NONE: 0,
        /**
         * The symbol is left-associative.
         */
        LEFT: 1,
        /**
         * The symbol is right-associative.
         */
        RIGHT: 2,
        /**
         * The symbol is non-associative.
         */
        NOASSOC: 3
    };
    /**
     * Module containing ASSOC enumeration.
     * @module jscc/enums/ASSOC
     */
    return j.enums.ASSOC;
}));