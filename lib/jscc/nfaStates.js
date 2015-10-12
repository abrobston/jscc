/*
 * Universal module definition for NFAStates (previously in global.js).
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './bitset'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./bitset'));
    } else {
        root.nfaStates = factory(root.global, root.bitset);
    }
}(this, function(/** module:jscc/global */ global,
                 /** module:jscc/bitset */ bitset) {
    /**
     * Module with a class that creates and stores Nfa objects.
     * @module jscc/nfaStates
     * @constructor
     */
    var NFAStates = function() {
    };
    /**
     * The inner array of Nfa objects.
     * @type {Array.<Nfa>}
     */
    NFAStates.prototype.value = [];
    /**
     * Finds an empty Nfa already in the value array if possible,
     * and returns its index.  Otherwise, creates a new Nfa object
     * and returns its index within the value array.
     * @returns {number} The index of the new or recycled Nfa
     * object within the value array.
     */
    NFAStates.prototype.create = function() {
        var nfa;
        var i;
        // Use an empty item if available, else create a new one...
        for (i = 0; i < this.value.length; i++) {
            if (this.value[i].edge === global.EDGE.FREE) {
                break;
            }
        }

        if (i == this.value.length) {
            nfa = new global.Nfa();
            this.value.push(nfa);
        } else {
            nfa = this.value[i];
        }
        nfa.edge = global.EDGE.EPSILON;
        nfa.ccl = new bitset.BitSet(global.MAX_CHAR);
        nfa.accept = -1;
        nfa.follow = -1;
        nfa.follow2 = -1;
        nfa.weight = -1;
        return i;
    };
    return NFAStates;
}));