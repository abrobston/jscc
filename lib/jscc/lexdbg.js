/*
 * Universal module definition for lexdbg.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './io/io', './bitset'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./io/io'), require('./bitset'));
    } else {
        root.lexdbg = factory(root.global, root.io, root.bitset);
    }
}(this, function(/** module:jscc/global */ global,
                 /** io */ io,
                 /** module:jscc/bitset */ bitset) {
    /**
     * Debugging-output functions for automata.
     * @module jscc/lexdbg
     * @requires module:jscc/global
     * @requires module:jscc/io/io
     * @requires module:jscc/bitset
     */
    return {
        /**
         * Prints debugging information about the contents of the
         * {@link module:jscc/global.nfa_states} array.
         * @memberof module:jscc/lexdbg
         */
        print_nfa: function() {
            io._print("Pos\tType\t\tfollow\t\tfollow2\t\taccept");
            io._print("-----------------------------------------------------------------------");
            for (var i = 0; i < global.nfa_states.length; i++) {
                io._print(i + "\t" + ((global.nfa_states[i].edge == global.EDGE_FREE) ? "FREE" :
                              ((global.nfa_states[i].edge == global.EDGE_EPSILON) ? "EPSILON" : "CHAR")) + "\t\t" +
                          ((global.nfa_states[i].edge != global.EDGE_FREE && global.nfa_states[i].follow > -1) ?
                              global.nfa_states[i].follow :
                              "") + "\t\t" +
                          ((global.nfa_states[i].edge != global.EDGE_FREE && global.nfa_states[i].follow2 > -1) ?
                              global.nfa_states[i].follow2 :
                              "") + "\t\t" +
                          ((global.nfa_states[i].edge != global.EDGE_FREE && global.nfa_states[i].accept > -1) ?
                              global.nfa_states[i].accept :
                              ""));

                if (global.nfa_states[i].edge == global.EDGE_CHAR) {
                    var chars = "";
                    for (var j = global.MIN_CHAR; j < global.MAX_CHAR; j++) {
                        if (bitset.BitSet.get(global.nfa_states[i].ccl, j)) {
                            chars += String.fromCharCode(j);
                            if (chars.length == 10) {
                                io._print("\t" + chars);
                                chars = "";
                            }
                        }
                    }

                    if (chars.length > 0) {
                        io._print("\t" + chars);
                    }
                }
            }
            io._print("");
        },

        /**
         * Prints debugging information about the provided array of
         * Dfa objects.
         * @param {Array.<module:jscc/global.Dfa>} dfa_states - The states for which to
         * print debugging information.
         * @memberof module:jscc/lexdbg
         */
        print_dfa: function(dfa_states) {
            var str = "";
            var chr_cnt = 0;
            for (var i = 0; i < dfa_states.length; i++) {
                str = i + " => (";

                chr_cnt = 0;
                for (var j = 0; j < dfa_states[i].line.length; j++) {
                    if (dfa_states[i].line[j] > -1) {
                        str += " >" + String.fromCharCode(j) + "<," + dfa_states[i].line[j] + " ";
                        chr_cnt++;

                        if ((chr_cnt % 5) == 0) {
                            str += "\n       ";
                        }
                    }
                }

                str += ") " + dfa_states[i].accept;
                io._print(str);
            }
        }
    };
}));
