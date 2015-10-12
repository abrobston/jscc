/*
 * Universal module definition for integrity.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './log/log'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./log/log'));
    } else {
        root.integrity = factory(root.global, root.log);
    }
}(this, function(/** module:jscc/global */ global,
                 /** log */ log) {
    /**
     * Error-checking functions.
     * @module jscc/integrity
     * @requires module:jscc/global
     * @requires module:jscc/log/log
     */
    return {
        /**
         * Checks the {@link module:jscc/global.symbols} array for
         * nonterminating, undefined symbols.  Logs an error if
         * any such symbols are found.
         * @memberof module:jscc/integrity
         */
        undef: function() {
            for (var i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == global.SYM.NONTERM
                    && global.symbols[i].defined == false) {
                    log.error("Call to undefined non-terminal \"" +
                              global.symbols[i].label + "\"");
                }
            }
        },

        /**
         * Checks the {@link module:jscc/global.symbols} and
         * {@link module:jscc/global.productions} arrays for
         * unreachable, nonterminating symbols.  Logs a warning
         * if any such symbols are found.
         * @memberof module:jscc/integrity
         */
        unreachable: function() {
            var stack = [];
            var reachable = [];
            var i, j, k, l;

            for (i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == global.SYM.NONTERM) {
                    break;
                }
            }

            if (i == global.symbols.length) {
                return;
            }

            stack.push(i);
            reachable.push(i);

            while (stack.length > 0) {
                i = stack.pop();
                for (j = 0; j < global.symbols[i].prods.length; j++) {
                    for (k = 0; k < global.productions[global.symbols[i].prods[j]].rhs.length; k++) {
                        if (global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].kind ==
                            global.SYM.NONTERM) {
                            for (l = 0; l < reachable.length; l++) {
                                if (reachable[l] == global.productions[global.symbols[i].prods[j]].rhs[k]) {
                                    break;
                                }
                            }

                            if (l == reachable.length) {
                                stack.push(global.productions[global.symbols[i].prods[j]].rhs[k]);
                                reachable.push(global.productions[global.symbols[i].prods[j]].rhs[k]);
                            }
                        }
                    }
                }
            }

            for (i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == global.SYM.NONTERM) {
                    for (j = 0; j < reachable.length; j++) {
                        if (reachable[j] == i) {
                            break;
                        }
                    }
                    if (j == reachable.length) {
                        log.warn("Unreachable non-terminal \"" + global.symbols[i].label + "\"");
                    }
                }
            }
        },

        /**
         * Checks the {@link module:./global.states} array for
         * states with no lookahead information.  Logs an error
         * if any such states are found.
         * @memberof module:jscc/integrity
         */
        check_empty_states: function() {
            for (var i = 0; i < global.states.length; i++) {
                if (global.states[i].actionrow.length == 0 && global.states[i].def_act == -1) {
                    log.error("No lookaheads in state " + i + ", watch for endless list definitions");
                }
            }
        }
    };
}));
