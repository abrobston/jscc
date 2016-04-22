(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MODE_GEN = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    /**
     * Indicates an output mode for the parser.
     * @readonly
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.MODE_GEN = {
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
    //>>excludeEnd("closure");
    /**
     * Module containing MODE_GEN enumeration.
     * @module jscc/enums/MODE_GEN
     */
    return jscc.enums.MODE_GEN;
}));