(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ASSOC = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    /**
     * Indicates the associativity of a symbol.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.ASSOC = {
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
    //>>excludeEnd("closure");
    /**
     * Module containing ASSOC enumeration.
     * @module jscc/enums/ASSOC
     */
    return jscc.enums.ASSOC;
}));