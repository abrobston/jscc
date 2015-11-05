/*
 * Universal module definition for Production class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Production = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new Production instance.
     * @classdesc Represents a production created from the grammar.
     * @param {ProductionOptions=} o - Overrides for default property values.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    jscc.classes.Production = function(o) {
        var p = o || {};
        if (typeof p.id === 'number') {
            this.id = /** @type {number} */ (p.id);
        }
        if (typeof p.lhs === 'number') {
            this.lhs = /** @type {number} */ (p.lhs);
        }
        if (typeof p.rhs !== 'undefined' && Array.isArray(p.rhs)) {
            this.rhs = /** @type {!Array<!number>} */ (p.rhs);
        }
        if (typeof p.level === 'number') {
            this.level = /** @type {number} */ (p.level);
        }
        if (typeof p.code === 'string') {
            this.code = /** @type {string} */ (p.code);
        }
    };

    /**
     * The unique identifier of this production, which should
     * match its index within the global productions array.
     * @type {!number}
     */
    jscc.classes.Production.prototype.id = -1;
    /**
     * The id of the symbol representing the left-hand side of
     * this production.
     * @type {!number}
     */
    jscc.classes.Production.prototype.lhs = -1;
    /**
     * The id values of the symbols representing the right-hand side
     * of this production.
     * @type {!Array<!number>}
     */
    jscc.classes.Production.prototype.rhs = [];
    /**
     * The level of this production.
     * @type {!number}
     */
    jscc.classes.Production.prototype.level = 0;
    /**
     * The code associated with this production.
     * @type {!string}
     */
    jscc.classes.Production.prototype.code = "";

    /**
     * Contains the Production class.
     * @module {function(new:jscc.classes.Production, ProductionOptions=)} jscc/classes/Production
     */
    return jscc.classes.Production;
}));
