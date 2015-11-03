(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.SYM = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Identifies a symbol as nonterminating or terminating.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.SYM = {
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
    return j.enums.SYM;
}));