(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.namespace = factory();
    }
}(this, function() {
    /**
     * Root namespace for JSCC.
     * @const
     */
    var jscc = {
        /**
         * Namespace for enumerations.
         * @const
         */
        enums: {},
        /**
         * Namespace for certain class definitions.
         * @const
         */
        classes: {}
    };
    return jscc;
}));