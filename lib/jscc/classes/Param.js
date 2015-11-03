/*
 * Universal module definition for module containing Param class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.Param = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Creates a new Param instance.
     * @classdesc Contains indexes of start and end states.
     * @param {number=} start - Index of the starting state.
     * @param {number=} end - Index of the ending state.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    j.classes.Param = function(start, end) {
        if (typeof start === 'number') {
            this.start = start;
        }
        if (typeof end === 'number') {
            this.end = end;
        }
    };

    j.classes.Param.prototype = {
        /**
         * Index of the starting state.
         * @type {!number}
         */
        start: -1,
        /**
         * Index of the ending state.
         * @type {!number}
         */
        end: -1
    };

    /**
     * The module containing the Param class.
     * @module jscc/classes/Param
     */
    return j.classes.Param;
}));
