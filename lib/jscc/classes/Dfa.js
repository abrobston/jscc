/*
 * Universal module definition for module containing Dfa class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../namespace'));
    } else {
        root.Dfa = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Creates a new Dfa instance.
     * @classdesc Represents a state in a deterministic finite automata.
     * @param {DfaOptions=} o - Optional overrides for default property values.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    j.classes.Dfa = function(o) {
        var p = o || {};
        if (Array.isArray(p.line)) {
            this.line = /** @type {!Array} */ (p.line);
        }
        if (Array.isArray(p.nfa_set)) {
            this.nfa_set = /** @type {!Array<!number>} */ (p.nfa_set);
        }
        if (typeof p.accept === 'number') {
            this.accept = /** @type {!number} */ (p.accept);
        }
        if (typeof p.done === 'boolean') {
            this.done = /** @type {!boolean} */ (p.done);
        }
        if (typeof p.group === 'number') {
            this.group = /** @type {!number} */ (p.group);
        }
    };

    j.classes.Dfa.prototype = {
        /**
         * A multidimensional, generated array corresponding to this DFA state.
         * @type {!Array}
         */
        line: [],
        /**
         * Indexes of NFA states represented in this DFA state.
         * @type {!Array<!number>}
         */
        nfa_set: [],
        /**
         * Index of an accepting state.
         * @type {!number}
         */
        accept: -1,
        /**
         * Whether this DFA state has been fully processed.
         * @type {!boolean}
         */
        done: false,
        /**
         * A group index for this DFA state.
         * @type {!number}
         */
        group: -1
    };

    /**
     * The module containing the Dfa class.
     * @module {function(new:jscc.classes.Dfa, DfaOptions=)} jscc/classes/Dfa
     */
    return j.classes.Dfa;
}));
