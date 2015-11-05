/*
 * Universal module definition for lexdfa.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './log/log', './enums/EDGE', './classes/Dfa'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('./global'), require('./log/log'), require('./enums/EDGE'), require('./classes/Dfa'));
    } else {
        root.lexdfa = factory(root.global, root.log, root.EDGE, root.Dfa);
    }
}(this, function(/** jscc.global */ global,
                 /** jscc.log */ log,
                 EDGE,
                 /** function(new:jscc.classes.Dfa, ?DfaOptions=) */ Dfa) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * @constructor
     */
    jscc.lexdfa = function() {
    };
    /**
     * DFA-related functions.
     * @module {jscc.lexdfa} jscc/lexdfa
     * @requires module:jscc/global
     * @requires module:jscc/log/log
     */
    jscc.lexdfa.prototype = {
        /**
         * Creates a new {@link jscc.global.Dfa} object and
         * adds it to the provided array.
         * @param {Array<!jscc.classes.Dfa>} where - The array to which to add the
         * new Dfa object.
         * @returns {number} The prior length of the provided array.
         * @memberof jscc.lexdfa
         */
        create_dfa: function(where) {
            var dfa = new Dfa({
                line: new Array(global.MAX_CHAR),
                accept: -1,
                nfa_set: [],
                done: false,
                group: -1
            });
            where.push(dfa);
            return where.length - 1;
        },

        /**
         * Determines whether the dfa_states array has a
         * Dfa object whose {@link jscc.global.Dfa#nfa_set}
         * property contains the same values as those in the
         * items parameter.
         * @param {Array<!jscc.classes.Dfa>} dfa_states - The array of Dfa
         * objects to check.
         * @param {Array<number>} items - The set to match.
         * @returns {number} The index in dfa_states of the first
         * matching item, or -1 if no match exists.
         * @memberof jscc.lexdfa
         */
        same_nfa_items: function(dfa_states, items) {
            var i, j;
            for (i = 0; i < dfa_states.length; i++) {
                if (dfa_states[i].nfa_set.length == items.length) {
                    for (j = 0; j < dfa_states[i].nfa_set.length; j++) {
                        if (dfa_states[i].nfa_set[j] != items[j]) {
                            break;
                        }
                    }
                    if (j == dfa_states[i].nfa_set.length) {
                        return i;
                    }
                }
            }
            return -1;
        },

        /**
         * Determines the next Dfa object in the provided array
         * whose {@link jscc.classes.Dfa#done} value is false.
         * @param {Array<!jscc.classes.Dfa>} dfa_states - The array to check.
         * @returns {number} The index of the first array element for
         * which done is false, or -1 if no such element exists.
         * @memberof jscc.lexdfa
         */
        get_undone_dfa: function(dfa_states) {
            for (var i = 0; i < dfa_states.length; i++) {
                if (!dfa_states[i].done) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Performs a move operation on a given input character from a
         * set of NFA states.
         * @param {Array<!number>} state_set - The set of epsilon-closure
         * states on which base the move should be performed.
         * @param {Array<!jscc.classes.Nfa>} machine - The NFA state machine.
         * @param {number} ch - A character code to be moved on.
         * @returns {Array<!number>} If there is a possible move, a new
         * set of NFA-states is returned, else the returned array has a
         * length of 0.
         * @author Jan Max Meyer
         * @memberof jscc.lexdfa
         */
        move: function(state_set, machine, ch) {
            var hits = [];
            var tos = -1;
            try {
                do {
                    tos = state_set.pop();
                    if (machine[tos].edge == EDGE.CHAR) {
                        if (machine[tos].ccl.get(ch)) {
                            hits.push(machine[tos].follow);
                        }
                    }
                } while (state_set.length > 0);
            } catch (e) {
                log.error("\n state_set= " + state_set + " machine= " + machine + " ch= " + ch);
                throw e;
            }
            return hits;
        },

        /**
         * Performs an epsilon closure from a set of NFA states.
         * @param {Array<!number>} state_set - The set of states on which
         * base the closure is started.  The whole epsilon closure will
         * be appended to this parameter, so this parameter acts as
         * input/output value.
         * @param {Array<!jscc.classes.Nfa>} machine - The NFA state machine.
         * @returns {Array<!number>} An array of accepting states, if
         * available.
         * @author Jan Max Meyer
         * @memberof jscc.lexdfa
         */
        epsilon_closure: function(state_set, machine) {
            var stack = [];
            var accept = [];
            var tos = -1;
            for (var i = 0; i < state_set.length; i++) {
                stack.push(state_set[i]);
            }
            do {
                tos = stack.pop();
                if (machine[tos].accept >= 0) {
                    accept.push(machine[tos].accept);
                }
                if (machine[tos].edge == EDGE.EPSILON) {
                    if (machine[tos].follow > -1) {
                        for (var i = 0; i < state_set.length; i++) {
                            if (state_set[i] == machine[tos].follow) {
                                break;
                            }
                        }
                        if (i == state_set.length) {
                            state_set.push(machine[tos].follow);
                            stack.push(machine[tos].follow);
                        }
                    }
                    if (machine[tos].follow2 > -1) {
                        for (var i = 0; i < state_set.length; i++) {
                            if (state_set[i] == machine[tos].follow2) {
                                break;
                            }
                        }
                        if (i == state_set.length) {
                            state_set.push(machine[tos].follow2);
                            stack.push(machine[tos].follow2);
                        }
                    }
                }
            } while (stack.length > 0);
            return accept.sort();
        },

        /**
         * Constructs a deterministic finite automata (DFA) from a
         * nondeterministic finite automata, by using the subset
         * construction algorithm.
         * @param {!Array<!jscc.classes.Nfa>} nfa_states - The NFA-state machine
         * on which base the DFA will be constructed.
         * @returns {!Array<!jscc.classes.Dfa>} An array of DFA-objects forming the
         * new DFA-state machine.  This machine is not minimized here.
         * @author Jan Max Meyer
         * @memberof jscc.lexdfa
         */
        create_subset: function(nfa_states) {
            var dfa_states = [];
            var stack = [0];
            var current = this.create_dfa(dfa_states);
            var trans;
            var next = -1;
            var lowest_weight;

            if (nfa_states.length == 0) {
                return dfa_states;
            }
            this.epsilon_closure(stack, nfa_states);
            dfa_states[current].nfa_set = dfa_states[current].nfa_set.concat(stack);
            while ((current = this.get_undone_dfa(dfa_states)) > -1) {
                dfa_states[current].done = true;
                lowest_weight = -1;
                for (var i = 0; i < dfa_states[current].nfa_set.length; i++) {
                    if (nfa_states[dfa_states[current].nfa_set[i]].accept > -1
                        && nfa_states[dfa_states[current].nfa_set[i]].weight < lowest_weight
                        || lowest_weight == -1) {
                        dfa_states[current].accept = nfa_states[dfa_states[current].nfa_set[i]].accept;
                        lowest_weight = nfa_states[dfa_states[current].nfa_set[i]].weight;
                    }
                }
                for (var i = global.MIN_CHAR; i < global.MAX_CHAR; i++) {
                    trans = [].concat(dfa_states[current].nfa_set);
                    trans = this.move(trans, nfa_states, i);

                    if (trans.length > 0) {
                        this.epsilon_closure(trans, nfa_states);
                    }

                    if (trans.length == 0) {
                        next = -1;
                    } else if ((next = this.same_nfa_items(dfa_states, trans)) == -1) {
                        next = this.create_dfa(dfa_states);
                        dfa_states[next].nfa_set = trans;
                    }
                    dfa_states[current].line[i] = next;
                }
            }
            return dfa_states;
        },

        /**
         * Minimizes a DFA, by grouping equivalent states together.
         * These groups form the new, minimized dfa-states.
         * @param {!Array<!jscc.classes.Dfa>} dfa_states - The DFA-state machine on
         * which base the minimized DFA is constructed.
         * @returns {!Array<!jscc.classes.Dfa>} An array of DFA-objects forming the
         * minimized DFA-state machine.
         * @author Jan Max Meyer
         * @memberof jscc.lexdfa
         */
        minimize_dfa: function(dfa_states) {
            var groups = [[]];
            var accept_groups = [];
            var min_dfa_states = [];
            var old_cnt = 0;
            var cnt = 0;
            var new_group;
            var i, j, k;

            if (dfa_states.length == 0) {
                return min_dfa_states;
            }
            // Forming a general starting state:
            // Accepting and non-accepting states are pushed in separate groups first
            for (i = 0; i < dfa_states.length; i++) {
                if (dfa_states[i].accept > -1) {
                    for (j = 0; j < accept_groups.length; j++) {
                        if (accept_groups[j] == dfa_states[i].accept) {
                            break;
                        }
                    }
                    if (j == accept_groups.length) {
                        accept_groups.push(dfa_states[i].accept);
                        groups.push([]);
                    }
                    groups[j + 1].push(i);
                    dfa_states[i].group = j + 1;
                } else {
                    groups[0].push(i);
                    dfa_states[i].group = 0;
                }
            }

            // Now the minimization is performed on base of these default groups
            do {
                old_cnt = cnt;
                for (i = 0; i < groups.length; i++) {
                    new_group = [];
                    if (groups[i].length > 0) {
                        for (j = 1; j < groups[i].length; j++) {
                            for (k = global.MIN_CHAR; k < global.MAX_CHAR; k++) {
                                // This verifies the equality of the first state
                                // in this group with its successors
                                var groupZeroLineK = dfa_states[groups[i][0]].line[k];
                                var groupJLineK = dfa_states[groups[i][j]].line[k];
                                if (groupZeroLineK != groupJLineK &&
                                    (groupZeroLineK == -1 ||
                                     groupJLineK == -1) ||
                                    (groupZeroLineK > -1 &&
                                     groupJLineK > -1 &&
                                     dfa_states[groupZeroLineK].group
                                     != dfa_states[groupJLineK].group)) {
                                    // If this item does not match, put it to a new group
                                    dfa_states[groups[i][j]].group = groups.length;
                                    new_group = new_group.concat(groups[i].splice(j, 1));
                                    j--;
                                    break;
                                }
                            }
                        }
                    }
                    if (new_group.length > 0) {
                        groups[groups.length] = [];
                        groups[groups.length - 1] = groups[groups.length - 1].concat(new_group);
                        cnt += new_group.length;
                    }
                }
            } while (old_cnt != cnt);

            // Updating the dfa-state transitions; each group forms a new state.
            for (i = 0; i < dfa_states.length; i++) {
                for (j = global.MIN_CHAR; j < global.MAX_CHAR; j++) {
                    if (dfa_states[i].line[j] > -1) {
                        dfa_states[i].line[j] = dfa_states[dfa_states[i].line[j]].group;
                    }
                }
            }
            for (i = 0; i < groups.length; i++) {
                min_dfa_states.push(dfa_states[groups[i][0]]);
            }
            return min_dfa_states;
        }
    };
    return new jscc.lexdfa();
}));
