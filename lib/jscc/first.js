/*
 * Universal module definition for first.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './util', './enums/SYM', './namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('./global'), require('./util'), require('./enums/SYM'), require('./namespace'));
    } else {
        root.first = factory(root.global, root.util, root.SYM, root.namespace);
    }
}(this, function(/** jscc.global */ global,
                 /** jscc.util */ util,
                 SYM,
                 jscc) {
    /**
     * Creates an instance of jscc.first.
     * @classdesc Functions relating to FIRST-sets.
     * @constructor
     */
    jscc.first = function() {
    };
    jscc.first.prototype = {
        /**
         * Computes the FIRST-sets for all non-terminals of the grammar.
         * Must be called right after the parse and before the table
         * generation methods are performed.
         * @author Jan Max Meyer
         */
        first: function() {
            var cnt = 0,
                old_cnt = 0;
            var nullable;

            do {
                old_cnt = cnt;
                cnt = 0;

                for (var i = 0; i < global.symbols.length; i++) {
                    if (global.symbols[i].kind == SYM.NONTERM) {
                        for (var j = 0; j < global.symbols[i].prods.length; j++) {
                            nullable = false;
                            for (var k = 0; k < global.productions[global.symbols[i].prods[j]].rhs.length; k++) {
                                global.symbols[i].first = util.union(global.symbols[i].first,
                                                                     global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].first);

                                nullable =
                                    global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].nullable;
                                if (!nullable) {
                                    break;
                                }
                            }
                            cnt += global.symbols[i].first.length;

                            if (k == global.productions[global.symbols[i].prods[j]].rhs.length) {
                                nullable = true;
                            }

                            global.symbols[i].nullable |= nullable;
                        }
                    }
                }
            } while (cnt != old_cnt);
        },

        /**
         * Returns all terminals that are possible from a given position
         * of a production's right-hand side.
         * @param {jscc.classes.Item} item - Item to which the lookaheads are added.
         * @param {jscc.classes.Production} p - The production where the computation
         * should be done.
         * @param {number} begin - The offset of the symbol where the
         * rhs_first() begins its calculations.
         * @returns {boolean} True if the whole rest of the right-hand side
         * can be null (epsilon), else false.
         * @author Jan Max Meyer
         */
        rhs_first: function(item, p, begin) {
            var i;
            for (i = begin; i < p.rhs.length; i++) {
                item.lookahead = util.union(item.lookahead, global.symbols[p.rhs[i]].first);

                if (!global.symbols[p.rhs[i]].nullable) {
                    return false;
                }
            }
            return true;
        }
    };
    jscc['first'] = jscc.first;
    /**
     * Functions relating to FIRST-sets.
     * @module {jscc.first} jscc/first
     * @requires module:jscc/global
     * @requires module:jscc/util
     */
    return new jscc.first();
}));
