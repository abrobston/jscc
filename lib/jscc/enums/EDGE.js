(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.EDGE = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Identifies the type of an edge in an automation graph.
     * @enum {number}
     * @memberof jscc.enums
     */
    j.enums.EDGE = {
        FREE: 0,
        EPSILON: 1,
        CHAR: 2
    };
    /**
     * Module containing EDGE enumeration.
     * @module jscc/enums/EDGE
     */
    return j.enums.EDGE;
}));