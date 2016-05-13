/*
 * Universal module definition for integrity.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', './global', './log/log', './enums/SYM'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccintegrity = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {jscc.integrity}
   */
  function(require, others) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    var log, global = /** @type {jscc.global} */ (require("./global")),
        SYM = require("./enums/SYM");

    //>>includeStart("node", pragmas.node);
    log = /** @type {jscc.log} */ (require("./log/logNode"));
    //>>includeEnd("node");
    //>>excludeStart("node", pragmas.node);
    log = /** @type {jscc.log} */ (require("./log/log"));
    //>>excludeEnd("node");

    /**
     * Error-checking functions.
     * @module {jscc.integrity} jscc/integrity
     * @requires module:jscc/global
     * @requires module:jscc/log/log
     */

    /**
     * @constructor
     */
    jscc.integrity = function() {
    };

    jscc.integrity.prototype = {
        /**
         * Checks the {@link jscc.global.symbols} array for
         * nonterminating, undefined symbols.  Logs an error if
         * any such symbols are found.
         */
        undef: function() {
            for (var i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == SYM.NONTERM
                    && global.symbols[i].defined == false) {
                    log.error("Call to undefined non-terminal \"" +
                              global.symbols[i].label + "\"");
                }
            }
        },

        /**
         * Checks the {@link jscc.global.symbols} and
         * {@link jscc.global.productions} arrays for
         * unreachable, nonterminating symbols.  Logs a warning
         * if any such symbols are found.
         */
        unreachable: function() {
            var stack = [];
            var reachable = [];
            var i, j, k, l;

            for (i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == SYM.NONTERM) {
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
                            SYM.NONTERM) {
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
                if (global.symbols[i].kind == SYM.NONTERM) {
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
         * Checks the {@link jscc.global.states} array for
         * states with no lookahead information.  Logs an error
         * if any such states are found.
         */
        check_empty_states: function() {
            for (var i = 0; i < global.states.length; i++) {
                if (global.states[i].actionrow.length == 0 && global.states[i].def_act == -1) {
                    log.error("No lookaheads in state " + i + ", watch for endless list definitions");
                }
            }
        }
    };
    return new jscc.integrity();
}));
