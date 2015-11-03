/*
 * Universal module definition for TableEntry class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.TableEntry = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Creates a new TableEntry instance.
     * @classdesc An object used in the {@link jscc.classes.State#actionrow} and {@link jscc.classes.State#gotorow}
     *     arrays to indicate how symbols and actions are paired for that state.
     * @param {number} sym - A number representing a {@link jscc.classes.Symbol#id} value.
     * @param {number} act - A number representing the action associated with the symbol.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    j.classes.TableEntry = function(sym, act) {
        this.symbol = sym;
        this.action = act;
    };

    j.classes.TableEntry.prototype = {
        /**
         * The id value of the Symbol with which this entry is associated.
         * @type {!number}
         */
        symbol: -1,
        /**
         * A number representing the action associated with the symbol.
         * @type {!number}
         */
        action: -1
    };

    /**
     * The module containing the TableEntry class.
     * @module jscc/classes/TableEntry
     */
    return j.classes.TableEntry;
}));
