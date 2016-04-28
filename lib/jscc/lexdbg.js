/*
 * Universal module definition for lexdbg.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './io/io', './enums/EDGE'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./io/ioNode'), require('./enums/EDGE'));
    } else {
        root.lexdbg = factory(root.global, root.io, root.EDGE);
    }
}(this, function(/** jscc.global */ global,
                 /** jscc.io */ io,
                 EDGE) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * Debugging-output functions for automata.
     * @module {jscc.lexdbg} jscc/lexdbg
     * @requires module:jscc/global
     * @requires module:jscc/io/io
     */
    /**
     * @constructor
     */
    jscc.lexdbg = function() {
    };
    jscc.lexdbg.prototype = {
        /**
         * Prints debugging information about the contents of the
         * {@link jscc.global.nfa_states.value} array.
         * @memberof jscc.lexdbg
         */
        print_nfa: function() {
            io.write_debug("Pos\tType\t\tfollow\t\tfollow2\t\taccept");
            io.write_debug("-----------------------------------------------------------------------");
            for (var i = 0; i < global.nfa_states.value.length; i++) {
                io.write_debug(i + "\t" + ((global.nfa_states.value[i].edge == EDGE.FREE) ? "FREE" :
                              ((global.nfa_states.value[i].edge == EDGE.EPSILON) ? "EPSILON" : "CHAR")) + "\t\t" +
                          ((global.nfa_states.value[i].edge != EDGE.FREE && global.nfa_states.value[i].follow > -1) ?
                              global.nfa_states.value[i].follow :
                              "") + "\t\t" +
                          ((global.nfa_states.value[i].edge != EDGE.FREE && global.nfa_states.value[i].follow2 > -1) ?
                              global.nfa_states.value[i].follow2 :
                              "") + "\t\t" +
                          ((global.nfa_states.value[i].edge != EDGE.FREE && global.nfa_states.value[i].accept > -1) ?
                              global.nfa_states.value[i].accept :
                              ""));

                if (global.nfa_states.value[i].edge == EDGE.CHAR) {
                    var chars = "";
                    for (var j = global.MIN_CHAR; j < global.MAX_CHAR; j++) {
                        if (global.nfa_states.value[i].ccl.get(j)) {
                            chars += String.fromCharCode(j);
                            if (chars.length == 10) {
                                io.write_debug("\t" + chars);
                                chars = "";
                            }
                        }
                    }

                    if (chars.length > 0) {
                        io.write_debug("\t" + chars);
                    }
                }
            }
            io.write_debug("");
        },

        /**
         * Prints debugging information about the provided array of
         * Dfa objects.
         * @param {Array<jscc.classes.Dfa>} dfa_states - The states for which to
         * print debugging information.
         * @memberof jscc.lexdbg
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
                io.write_debug(str);
            }
        }
    };
    return new jscc.lexdbg();
}));
