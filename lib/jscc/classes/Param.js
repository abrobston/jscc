/*
 * Universal module definition for module containing Param class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.jsccParam = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new Param instance.
     * @classdesc Contains indexes of start and end states.
     * @param {number=} start - Index of the starting state.
     * @param {number=} end - Index of the ending state.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    jscc.classes.Param = function(start, end) {
        if (typeof start === 'number') {
            this.start = start;
        }
        if (typeof end === 'number') {
            this.end = end;
        }
    };

    /**
     * Index of the starting state.
     * @type {!number}
     */
    jscc.classes.Param.prototype.start = -1;
    /**
     * Index of the ending state.
     * @type {!number}
     */
    jscc.classes.Param.prototype.end = -1;

    /**
     * The module containing the Param class.
     * @module jscc/classes/Param
     */
    return jscc.classes.Param;
}));
