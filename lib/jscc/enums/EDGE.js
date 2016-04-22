(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EDGE = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        enums: {}
    };
    /**
     * Identifies the type of an edge in an automation graph.
     * @enum {number}
     * @memberof jscc.enums
     */
    jscc.enums.EDGE = {
        FREE: 0,
        EPSILON: 1,
        CHAR: 2
    };
    //>>excludeEnd("closure");
    /**
     * Module containing EDGE enumeration.
     * @module jscc/enums/EDGE
     */
    return jscc.enums.EDGE;
}));