/*
 * Universal module definition for module containing Dfa class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.jsccDfa = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure)
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new Dfa instance.
     * @classdesc Represents a state in a deterministic finite automata.
     * @param {DfaOptions=} o - Optional overrides for default property values.
     * @constructor
     */
    jscc.classes.Dfa = function(o) {
        var p = o || {};
        if (typeof p.line !== 'undefined' && Array.isArray(p.line)) {
            this.line = /** @type {!Array} */ (p.line);
        }
        if (typeof p.nfa_set !== 'undefined' && Array.isArray(p.nfa_set)) {
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

    /**
     * A multidimensional, generated array corresponding to this DFA state.
     * @type {!Array}
     */
    jscc.classes.Dfa.prototype.line = [];
    /**
     * Indexes of NFA states represented in this DFA state.
     * @type {!Array<!number>}
     */
    jscc.classes.Dfa.prototype.nfa_set = [];
    /**
     * Index of an accepting state.
     * @type {!number}
     */
    jscc.classes.Dfa.prototype.accept = -1;
    /**
     * Whether this DFA state has been fully processed.
     * @type {!boolean}
     */
    jscc.classes.Dfa.prototype.done = false;
    /**
     * A group index for this DFA state.
     * @type {!number}
     */
    jscc.classes.Dfa.prototype.group = -1;

    /**
     * The module containing the Dfa class.
     * @module {function(new:jscc.classes.Dfa, DfaOptions=)} jscc/classes/Dfa
     */
    return jscc.classes.Dfa;
}));
