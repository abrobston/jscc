(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SYM = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    //>>excludeEnd("closure");
    /**
     * Identifies a symbol as nonterminating or terminating.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.SYM = {
        /**
         * The symbol is nonterminating.
         */
        NONTERM: 0,
        /**
         * The symbol is terminating.
         */
        TERM: 1
    };
    /**
     * Module containing SYM enumeration.
     * @module jscc/enums/SYM
     */
    return jscc.enums.SYM;
}));