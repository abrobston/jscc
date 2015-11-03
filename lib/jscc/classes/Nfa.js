/*
 * Universal module definition for module containing the Nfa class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../enums/EDGE', '../bitset', '../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../enums/EDGE'), require('../bitset'), require('../namespace'));
    } else {
        root.Nfa = factory(root.EDGE, root.bitset, root.namespace);
    }
}(this, function(EDGE, /** function(new:jscc.bitset):!jscc.bitset */ bitset, j) {
    /**
     * Creates a new Nfa instance.
     * @classdesc Represents a state in a nondeterministic finite automata.
     * @param {NfaOptions=} o - Optional overrides for default property values.
     * @constructor
     * @const
     */
    j.classes.Nfa = function(o) {
        var p = o || {};
        if (p.edge === EDGE.CHAR || p.edge === EDGE.FREE) {
            this.edge = /** @type {!jscc.enums.EDGE} */ (p.edge);
        }
        if (typeof p.ccl === 'object' && p.ccl.hasOwnProperty("get") && p.ccl.hasOwnProperty("set") &&
            p.ccl.hasOwnProperty("count")) {
            this.ccl = /** @type {!jscc.bitset} */ (p.ccl);
        } else {
            this.ccl = new bitset();
        }
        if (typeof p.follow === 'number') {
            this.follow = /** @type {!number} */ (p.follow);
        }
        if (typeof p.follow2 === 'number') {
            this.follow2 = /** @type {!number} */ (p.follow2);
        }
        if (typeof p.accept === 'number') {
            this.accept = /** @type {!number} */ (p.accept);
        }
        if (typeof p.weight === 'number') {
            this.weight = /** @type {!number} */ (p.weight);
        }
    };

    /**
     * The type of edge in this NFA state.
     * @type {!jscc.enums.EDGE}
     */
    j.classes.Nfa.prototype.edge = EDGE.EPSILON;
    /**
     * The bitset for this NFA state.
     * @type {!jscc.bitset}
     */
    j.classes.Nfa.prototype.ccl = new bitset();
    /**
     * Index of an immediately-following state.
     * @type {!number}
     */
    j.classes.Nfa.prototype.follow = -1;
    /**
     * Index of a second following state.
     * @type {!number}
     */
    j.classes.Nfa.prototype.follow2 = -1;
    /**
     * Index of an accepting state.
     * @type {!number}
     */
    j.classes.Nfa.prototype.accept = -1;
    /**
     * The weight of this particular state.
     * @type {!number}
     */
    j.classes.Nfa.prototype.weight = -1;

    /**
     * The module containing the Nfa class.
     * @module jscc/classes/Nfa
     */
    return j.classes.Nfa;
}));
