(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.MODE_GEN = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Indicates an output mode for the parser.
     * @readonly
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.MODE_GEN = {
        /**
         * Output is plain text.
         */
        TEXT: 0,
        /**
         * Output is JavaScript code.
         */
        JS: 1,
        /**
         * Output is HTML-formatted.
         */
        HTML: 2
    };
    /**
     * Module containing MODE_GEN enumeration.
     * @module jscc/enums/MODE_GEN
     */
    return j.enums.MODE_GEN;
}));