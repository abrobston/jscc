/*
 * Universal module definition for module containing the Item class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Item = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new Item instance.
     * @classdesc Contains lookahead information associated with a production.
     * @param {ItemOptions=} o - Optional overrides for default property values.
     * @constructor
     * @const
     */
    jscc.classes.Item = function(o) {
        var p = o || {};
        if (typeof p.prod === 'number') {
            this.prod = /** @type {!number} */ (p.prod);
        }
        if (typeof p.dot_offset === 'number') {
            this.dot_offset = /** @type {!number} */ (p.dot_offset);
        }
        if (typeof p.lookahead !== 'undefined' && Array.isArray(p.lookahead)) {
            this.lookahead = /** @type {!Array<!number>} */ (p.lookahead);
        }
    };

    /**
     * The index within the global productions array of the production associated with this item.
     * @type {!number}
     */
    jscc.classes.Item.prototype.prod = -1;
    /**
     * The dot offset.
     * @type {!number}
     */
    jscc.classes.Item.prototype.dot_offset = 0;
    /**
     * An array of lookahead indexes.
     * @type {!Array<!number>}
     */
    jscc.classes.Item.prototype.lookahead = [];

    /**
     * The module containing the Item class.
     * @module {function(new:jscc.classes.Item, ItemOptions=)} jscc/classes/Item
     */
    return jscc.classes.Item;
}));
