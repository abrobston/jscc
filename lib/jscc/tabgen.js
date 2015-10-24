/*
 * Universal module definition for tabgen.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', './global', './first', './util', './log/log'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require, require('./global'), require('./first'), require('./util'), require('./log/log'));
    } else {
        root.tabgen = factory(root.require, root.global, root.first, root.util, root.log);
    }
}(this, function(/** module:require */ require,
                 /** module:jscc/global */ global,
                 /** module:jscc/first */ first,
                 /** module:jscc/util */ util,
                 /** log */ log) {

    function resolveModules() {
        global = global || require("./global");
        first = first || require("./first");
        util = util || require("./util");
        log = log || require("./log/log");
    }

    /**
     * Contains table-generation functions.
     * @module jscc/tabgen
     * @requires module:jscc/global
     * @requires module:jscc/first
     * @requires module:jscc/util
     * @requires module:jscc/log/log
     */
    var exports = {
        /**
         * Creates a new {@link module:jscc/global.State} object, adds it to the global states array,
         * and returns the new {@link module:jscc/global.State} object.
         * @returns {module:jscc/global.State} The newly-created, default State object.
         * @memberof module:jscc/tabgen
         */
        create_state: function() {
            resolveModules();
            var state = new global.State({
                kernel: [],
                epsilon: [],
                actionrow: [],
                gotorow: [],
                done: false,
                closed: false,
                def_act: 0
            });
            global.states.push(state);
            return state;
        },

        /**
         * Creates and returns a new Item instance using the specified parameter
         * as the {@link module:jscc/global.Item#prod} value.
         * @param {number} p - The prod value of the new Item instance.
         * @returns {module:jscc/global.Item} The new Item instance.
         * @memberof module:jscc/tabgen
         */
        create_item: function(p) {
            resolveModules();
            return new global.Item({
                prod: p,
                dot_offset: 0,
                lookahead: []
            });
        },

        /**
         * If row already contains a {@link module:jscc/global.TableEntry} with the given symbol,
         * returns row.  Otherwise, adds a new TableEntry with the
         * provided symbol and action to the row, then returns the row.
         * @param {Array.<module:jscc/global.TableEntry>} row - The row to check for the
         * given symbol.
         * @param {number} sym - The symbol for which to check, or if not found,
         * the symbol that becomes part of the new TableEntry.
         * @param {number} act - The action that becomes part of the new
         * TableEntry, should one be created.
         * @returns {Array.<module:jscc/global.TableEntry>} The row parameter with the possible
         * addition of a new TableEntry if no TableEntry with the given symbol
         * was already in the row.
         * @memberof module:jscc/tabgen
         */
        add_table_entry: function(row, sym, act) {
            resolveModules();
            for (var i = 0; i < row.length; i++) {
                if (row[i].symbol == sym) {
                    return row;
                }
            }
            row.push(new global.TableEntry(sym, act));
            return row;
        },

        /**
         * If row already contains a {@link module:jscc/global.TableEntry} with the given symbol,
         * updates the {@link module:jscc/global.TableEntry#action}
         * property of that TableEntry to match the given action.  If the
         * symbol is not present, no changes are made to the row.  Either way,
         * the row is returned.
         * @param {Array.<TableEntry>} row - The row to check for the given
         * symbol.
         * @param {number} sym - The symbol for which to check.
         * @param {number} act - The action to which to update a TableEntry
         * containing the given symbol.
         * @returns {Array.<TableEntry>} The row parameter, possibly with one
         * modified TableEntry.
         * @memberof module:jscc/tabgen
         */
        update_table_entry: function(row, sym, act) {
            var i;
            for (i = 0; i < row.length; i++) {
                if (row[i].symbol == sym) {
                    row[i].action = act;
                    return row;
                }
            }
            return row;
        },

        /**
         * If row contains a {@link module:jscc/global.TableEntry} with the given symbol, removes that
         * symbol's TableEntry and returns the row.  Otherwise, simply
         * returns the row.
         * @param {Array.<module:jscc/global.TableEntry>} row - The row to check for the given
         * symbol.
         * @param {number} sym - The symbol for which to check and, if found,
         * delete.
         * @returns {Array.<module:jscc/global.TableEntry>} The row parameter, possibly with one
         * fewer TableEntry.
         * @memberof module:jscc/tabgen
         */
        remove_table_entry: function(row, sym) {
            for (var i = 0; i < row.length; i++) {
                if (row[i].symbol == sym) {
                    row.splice(i, 1);
                    return row;
                }
            }
            return row;
        },

        /**
         * If row contains a TableEntry with the given symbol, returns that
         * TableEntry's {@link module:jscc/global.TableEntry#action} property.
         * Otherwise, returns void(0).
         * @param {Array.<module:jscc/global.TableEntry>} row - The row to check for the given
         * symbol.
         * @param {number} sym - The symbol for which to check.
         * @returns {(number|void)}
         * @memberof module:jscc/tabgen
         */
        get_table_entry: function(row, sym) {
            for (var i = 0; i < row.length; i++) {
                if (row[i].symbol == sym) {
                    return row[i].action;
                }
            }
            return void(0);
        },

        /**
         * Returns the index of the first {@link module:jscc/global.states}
         * array entry whose {@link module:jscc/global.State#done} property
         * is false, or -1 if no such entry exists.
         * @returns {number} The index of the first undone state, or -1 if
         * no undone states exist.
         * @memberof module:jscc/tabgen
         */
        get_undone_state: function() {
            resolveModules();
            for (var i = 0; i < global.states.length; i++) {
                if (global.states[i].done == false) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Compares two {@link module:jscc/global.Item} objects for
         * sorting purposes by comparing their
         * {@link module:jscc/global.Item#prod} values.
         * @param {module:jscc/global.Item} a - The first Item
         * @param {module:jscc/global.Item} b - The second Item
         * @returns {number} Less than zero if a.prod < b.prod;
         * greater than zero if a.prod > b.prod; zero if
         * a.prod equals b.prod.
         * @memberof module:jscc/tabgen
         */
        sort_partition: function(a, b) {
            return a.prod - b.prod;
        },

        /**
         * Returns the index within the {@link module:jscc/global.symbols}
         * array of the first symbol with the given label, SYM, and
         * SPECIAL values.  If no such symbol is found, returns -1.
         * @param {string} label - The symbol label for which to search.
         * @param {module:jscc/global.SYM} kind - Whether the symbol is terminating or
         * nonterminating.
         * @param {module:jscc/global.SPECIAL=} special - The type of special symbol, if any.
         * Defaults to NONE.
         * @returns {number} - The index within the symbols array of the
         * first matching symbol, or -1 if there are no matching symbols.
         * @memberof module:jscc/tabgen
         */
        find_symbol: function(label, kind, special) {
            resolveModules();
            if (!special) {
                special = global.SPECIAL.NONE;
            }
            for (var i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].label.toString() == label.toString()
                    && global.symbols[i].kind == kind
                    && global.symbols[i].special == special) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Creates a new symbol (if necessary) and appends it to the
         * global symbol array.  If the symbol does not already exist,
         * the instance of that symbol is returned only.
         * @param {string} label - The label of the symbol.  In case
         * of kind == SYM.NONTERM, the label is the name of the
         * right-hand side, else it is the regular expression for the
         * terminal symbol.
         * @param {module:jscc/global.SYM} kind - Type of the symbol.  This can be
         * SYM.NONTERM or SYM.TERM.
         * @param {module:jscc/global.SPECIAL} special - Specialized symbols.
         * @returns {number} The id property of the particular Symbol
         * object.
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        create_symbol: function(label, kind, special) {
            resolveModules();
            var exists;

            if ((exists = exports.find_symbol(label, kind, special)) > -1) {
                return global.symbols[exists].id;
            }

            var sym = new global.Symbol({
                label: label,
                kind: kind,
                prods: [],
                nullable: false,
                id: global.symbols.length,
                code: "",
                assoc: global.ASSOC.NONE,
                level: 0,
                special: special,
                defined: false,
                first: []
            });

            if (kind == global.SYM.TERM) {
                sym.first.push(sym.id);
            }

            global.symbols.push(sym);
            return sym.id;
        },

        /**
         * Checks if two item sets contain the same items.  The
         * items may only differ in their lookahead.
         * @param {Array.<module:jscc/global.Item>} set1 - Set to be compared with
         * set2.
         * @param {Array.<module:jscc/global.Item>} set2 - Set to be compared with
         * set1.
         * @returns {boolean} True if equal, else false.
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        item_set_equal: function(set1, set2) {
            var i, j, cnt = 0;

            if (set1.length != set2.length) {
                return false;
            }

            for (i = 0; i < set1.length; i++) {
                for (j = 0; j < set2.length; j++) {
                    if (set1[i].prod == set2[j].prod &&
                        set1[i].dot_offset == set2[j].dot_offset) {
                        cnt++;
                        break;
                    }
                }
            }
            return cnt == set1.length;
        },

        /**
         *
         * @param {Array.<module:jscc/global.Item>} seed
         * @param {Array.<module:jscc/global.Item>} closure
         * @returns {number}
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        close_items: function(seed, closure) {
            resolveModules();
            var i, j, k;
            var cnt = 0, tmp_cnt = 0;
            var item;

            for (i = 0; i < seed.length; i++) {
                if (seed[i].dot_offset < global.productions[seed[i].prod].rhs.length) {
                    if (global.symbols[global.productions[seed[i].prod].rhs[seed[i].dot_offset]].kind ==
                        global.SYM.NONTERM) {
                        for (j = 0;
                             j < global.symbols[global.productions[seed[i].prod].rhs[seed[i].dot_offset]].prods.length;
                             j++) {
                            for (k = 0; k < closure.length; k++) {
                                if (closure[k].prod ==
                                    global.symbols[global.productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j]) {
                                    break;
                                }
                            }

                            if (k == closure.length) {
                                item =
                                    exports.create_item(global.symbols[global.productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j]);
                                closure.push(item);

                                cnt++;
                            }

                            tmp_cnt = closure[k].lookahead.length;
                            if (first.rhs_first(closure[k], global.productions[seed[i].prod], seed[i].dot_offset + 1)) {
                                closure[k].lookahead = util.union(closure[k].lookahead, seed[i].lookahead);
                            }

                            cnt += closure[k].lookahead.length - tmp_cnt;
                        }
                    }
                }
            }

            return cnt;
        },

        /**
         * @summary Implements the LALR(1) closure algorithm.
         * @description A short overview:
         *  1. Closing a closure_set of Item objects from a given
         *     kernel seed (this includes the kernel seed itself!)
         *  2. Moving all epsilon items to the current state's epsilon
         *     set.
         *  3. Moving all symbols with the same symbol right to the
         *     dot to a partition set.
         *  4. Check if there is already a state with the same items
         *     as there are in the partition.  If so, union the
         *     lookaheads, else, create a new state and set the
         *     partition as kernel seed.
         *  5. If the (probably new) state was not closed yet, perform
         *     some table creation: If there is a terminal to the
         *     right of the dot, do a shift on the action table, else
         *     do a goto on the goto table.  Reductions are performed
         *     later, when all states are closed.
         * @param {number} s - Id of the state that should be closed.
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        lalr1_closure: function(s) {
            resolveModules();
            var closure = [], nclosure, partition;
            var partition_sym;
            var i, j, cnt = 0, old_cnt = 0, tmp_cnt, ns;

            do {
                old_cnt = cnt;
                cnt = exports.close_items(((old_cnt == 0) ? global.states[s].kernel : closure), closure);
            } while (cnt != old_cnt);

            for (i = 0; i < global.states[s].kernel.length; i++) {
                if (global.states[s].kernel[i].dot_offset <
                    global.productions[global.states[s].kernel[i].prod].rhs.length) {
                    closure.unshift(new global.ITEM({
                        prod: global.states[s].kernel[i].prod,
                        dot_offset: global.states[s].kernel[i].dot_offset,
                        lookahead: []
                    }));
                    for (j = 0; j < global.states[s].kernel[i].lookahead.length; j++) {
                        closure[0].lookahead[j] = global.states[s].kernel[i].lookahead[j];
                    }
                }
            }

            for (i = 0; i < closure.length; i++) {
                if (global.productions[closure[i].prod].rhs.length == 0) {
                    for (j = 0; j < global.states[s].epsilon.length; j++) {
                        if (global.states[s].epsilon[j].prod == closure[i].prod
                            && global.states[s].epsilon[j].dot_offset == closure[i].dot_offset) {
                            break;
                        }
                    }
                    if (j == global.states[s].epsilon.length) {
                        global.states[s].epsilon.push(closure[i]);
                    }
                    closure.splice(i, 1);
                }
            }

            while (closure.length > 0) {
                partition = [];
                nclosure = [];
                partition_sym = -1;

                for (i = 0; i < closure.length; i++) {
                    if (partition.length == 0) {
                        partition_sym = global.productions[closure[i].prod].rhs[closure[i].dot_offset];
                    }

                    if (closure[i].dot_offset < global.productions[closure[i].prod].rhs.length) {
                        if (global.productions[closure[i].prod].rhs[closure[i].dot_offset] == partition_sym) {
                            closure[i].dot_offset++;
                            partition.push(closure[i]);
                        } else {
                            nclosure.push(closure[i]);
                        }
                    }
                }

                if (partition.length > 0) {
                    // beachcoder Feb 23, 2009:
                    // Uhh here was a very exciting bug that only came up on
                    // special grammar constellations: If we don't sort the
                    // partition set by production here, it may happen that
                    // states get wrong lookahead, and unexpected conflicts
                    // or failing grammars come up.
                    partition.sort(exports.sort_partition);

                    // Now one can check for equality
                    for (i = 0; i < global.states.length; i++) {
                        if (exports.item_set_equal(global.states[i].kernel, partition)) {
                            break;
                        }
                    }

                    if (i == global.states.length) {
                        ns = exports.create_state();
                        ns.kernel = partition;
                    }

                    tmp_cnt = 0;
                    cnt = 0;

                    for (j = 0; j < partition.length; j++) {
                        tmp_cnt += global.states[i].kernel[j].lookahead.length;
                        global.states[i].kernel[j].lookahead =
                            util.union(global.states[i].kernel[j].lookahead, partition[j].lookahead);
                        cnt += global.states[i].kernel[j].lookahead.length;
                    }

                    if (tmp_cnt != cnt) {
                        global.states[i].done = false;
                    }

                    if (!(global.states[s].closed)) {
                        for (j = 0; j < partition.length; j++) {
                            if (partition[j].dot_offset - 1 < global.productions[partition[j].prod].rhs.length) {
                                if (global.symbols[global.productions[partition[j].prod].rhs[partition[j].dot_offset -
                                                                                             1]].kind ==
                                    global.SYM_TERM) {
                                    global.states[s].actionrow = exports.add_table_entry(global.states[s].actionrow,
                                                                                         global.productions[partition[j].prod].rhs[partition[j].dot_offset -
                                                                                                                                   1],
                                                                                         i);
                                    global.shifts++;
                                } else {
                                    global.states[s].gotorow = exports.add_table_entry(global.states[s].gotorow,
                                                                                       global.productions[partition[j].prod].rhs[partition[j].dot_offset -
                                                                                                                                 1],
                                                                                       i);
                                    global.gotos++;
                                }
                            }
                        }
                    }
                }
                closure = nclosure;
            }
            global.states[s].closed = true;
        },

        /**
         * Inserts reduce-cells into the action table.  A reduction
         * does always occur for items with the dot to the far right
         * of the production and to items with no production (epsilon
         * items).
         *
         * The reductions are done on the corresponding lookahead
         * symbols.  If a shift-reduce conflict appears, the function
         * will always behave in favor of the shift.
         *
         * Reduce-reduce conflicts are reported immediately, and need
         * to be solved.
         * @param {number} s - The index of the state where the
         * reductions take effect.
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        do_reductions: function(s) {
            resolveModules();
            var n, i, j, ex, act, output_warning, item_set;
            var reds = [];
            var max = 0, count;

            for (n = 0; n < 2; n++) {
                if (!n) {
                    item_set = global.states[s].kernel;
                } else {
                    item_set = global.states[s].epsilon;
                }

                for (i = 0; i < item_set.length; i++) {
                    if (item_set[i].dot_offset == global.productions[item_set[i].prod].rhs.length) {
                        for (j = 0; j < item_set[i].lookahead.length; j++) {
                            output_warning = true;

                            ex = exports.get_table_entry(global.states[s].actionrow,
                                                         item_set[i].lookahead[j]);

                            act = ex;
                            if (ex == void(0)) {
                                act = -1 * item_set[i].prod;

                                global.states[s].actionrow = exports.add_table_entry(global.states[s].actionrow,
                                                                                     item_set[i].lookahead[j], act);

                                global.reduces++;
                            } else {
                                var warning = "";
                                if (ex > 0) {
                                    // Shift-reduce conflict

                                    // Is there any level specified?
                                    if (global.symbols[item_set[i].lookahead[j]].level > 0
                                        || global.productions[item_set[i].prod].level > 0) {
                                        // Is the level the same?
                                        if (global.symbols[item_set[i].lookahead[j]].level ==
                                            global.productions[item_set[i].prod].level) {
                                            // In case of left-associativity, reduce
                                            if (global.symbols[item_set[i].lookahead[j]].assoc == global.ASSOC_LEFT) {
                                                // Reduce
                                                act = -1 * item_set[i].prod;
                                            } else if (global.symbols[item_set[i].lookahead[j]].assoc ==
                                                       global.ASSOC.NOASSOC) {
                                                // else, if nonassociativity is set,
                                                // remove table entry
                                                exports.remove_table_entry(global.states[s].actionrow,
                                                                           item_set[i].lookahead[j]);
                                                log.warn("Removing nonassociative symbol '" +
                                                         global.symbols[item_set[i].lookahead[j]].label +
                                                         "' in state " + s);

                                                output_warning = false;
                                            }
                                        } else {
                                            // If symbol precedence is lower production's
                                            // precedence, reduce
                                            if (global.symbols[item_set[i].lookahead[j]].level <
                                                global.productions[item_set[i].prod].level) {
                                                // Reduce
                                                act = -1 * item_set[i].prod;
                                            }
                                        }
                                    }

                                    warning = "Shift";
                                } else {
                                    // Reduce-reduce conflict
                                    act = ((act * -1 < item_set[i].prod) ?
                                        act : -1 * item_set[i].prod);

                                    warning = "Reduce";
                                }

                                warning += "-reduce conflict on symbol '" +
                                           global.symbols[item_set[i].lookahead[j]].label +
                                           "' in state " + s;
                                warning += "\n         Conflict resolved by " +
                                           ((act <= 0) ? "reducing wiht production" :
                                               "shifting to state") + " " +
                                           ((act <= 0) ? act * -1 : act);

                                if (output_warning) {
                                    log.warn(warning);
                                }

                                if (act != ex) {
                                    exports.update_table_entry(global.states[s].actionrow,
                                                               item_set[i].lookahead[j], act);
                                }
                            }
                        }
                    }
                }
            }

            // Find most common reduction
            global.states[s].def_act = -1; // Define no default action

            // Are there any reductions?  Then select the best of them.
            for (i = 0; i < reds.length; i++) {
                for (j = 0, count = 0; j < reds.length; j++) {
                    if (reds[j] == reds[i]) {
                        count++;
                    }
                }
                if (max < count) {
                    max = count;
                    global.states[s].def_act = reds[i];
                }
            }

            // Remove all default reduce action reductions, if they exist.
            if (global.states[s].def_act >= 0) {
                do {
                    count = global.states[s].actionrow.length;

                    for (i = 0; i < global.states[s].actionrow.length; i++) {
                        if (global.states[s].actionrow[i][1] == global.states[s].def_act * -1) {
                            global.states[s].actionrow.splice(i, 1);
                        }
                    }
                } while (count != global.states[s].actionrow.length);
            }
        },

        /**
         * Entry function to perform table generation.  If all states
         * of the parsing state machine are constructed, all reduce
         * operations are inserted in the particular positions of the
         * action table.
         *
         * If there is a Shift-reduce conflict, the shift takes the
         * higher precedence.  Reduce-reduce conflicts are resolved by
         * choosing the first defined production.
         * @param {boolean} debug - Toggle debug trace output.  This
         * should only be switched on when JS/CC is executed in a web
         * environment, because HTML-code will be printed.
         * @author Jan Max Meyer
         * @memberof module:jscc/tabgen
         */
        lalr1_parse_table: function(debug) {
            resolveModules();
            var i, item, s;

            // Create EOF symbol
            item = exports.create_item(0);
            s = exports.create_symbol("$", global.SYM.TERM, global.SPECIAL.EOF);
            item.lookahead.push(s);

            // Create first state
            s = exports.create_state();
            s.kernel.push(item);

            while ((i = exports.get_undone_state()) >= 0) {
                global.states[i].done = true;
                exports.lalr1_closure(i);
            }

            for (i = 0; i < global.states.length; i++) {
                exports.do_reductions(i);
            }

            if (debug) {
                for (i = 0; i < global.states.length; i++) {
                    exports.print_item_set((global.exec_mode == global.EXEC.CONSOLE) ?
                                               global.MODE_GEN.TEXT :
                                               global.MODE_GEN.HTML,
                                           "states[" + i + "].kernel", global.states[i].kernel);
                    exports.print_item_set((global.exec_mode == global.EXEC.CONSOLE) ?
                                               global.MODE_GEN.TEXT :
                                               global.MODE_GEN.HTML,
                                           "states[" + i + "].epsilon", global.states[i].epsilon);
                }

                log.debug(global.states.length + " States created.");
            }
        }
    };
    return exports;
}));
