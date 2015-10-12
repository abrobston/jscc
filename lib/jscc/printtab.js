/**
 * Universal module definition for printtab.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './tabgen', './io/io'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./tabgen'), require('./io/io'));
    } else {
        root.printtab = factory(root.global, root.tabgen, root.io);
    }
}(this, function(/** module:jscc/global */ global,
                 /** module:jscc/tabgen */ tabgen,
                 /** io */ io) {
    /**
     * Functions for printing parse tables.
     * @module jscc/printtab
     * @requires jscc/global
     * @requires jscc/tabgen
     * @requires jscc/io/io
     */
    var exports = {
        /**
         * Prints the parse tables in a desired format.
         * @param {(module:jscc/global.MODE_GEN|string)} mode - The output mode.
         * This can be either {@link module:jscc/global.MODE_GEN.JS} to create JavaScript/
         * JScript code as output or {@link module:jscc/global.MODE_GEN.HTML} to create
         * HTML-tables as output (the HTML-tables are formatted to
         * look nice with the JS/CC Web Environment).
         * @returns {string} The code to be printed to a file or
         * website.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        print_parse_tables: function(mode) {
            var code = "";
            var i, j, deepest = 0, val;
            switch (mode) {
                case global.MODE_GEN.HTML:
                case "html":
                    code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
                    code += "<tr>";
                    code += "<td class=\"tabtitle\" colspan=\"2\">Pop-Table</td>";
                    code += "</tr>";
                    code +=
                        "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
                    code += "<td class=\"coltitle\">Number of symbols to pop</td>";
                    code += "</tr>";
                    for (i = 0; i < global.productions.length; i++) {
                        code += "<tr>";
                        code +=
                            "<td style=\"border-right: 1px solid lightgray;\">" + global.productions[i].lhs + "</td>";
                        code += "<td>" + global.productions[i].rhs.length + "</td>";
                        code += "</tr>";
                    }
                    code += "</table>";

                    for (i = 0; i < global.symbols.length; i++) {
                        if (global.symbols[i].kind == global.SYM.TERM) {
                            deepest++;
                        }
                    }

                    code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
                    code += "<tr>";
                    code += "<td class=\"tabtitle\" colspan=\"" + (deepest + 1) + "\">Action-Table</td>";
                    code += "</tr>";

                    code +=
                        "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">State</td>";
                    for (i = 0; i < global.symbols.length; i++) {
                        if (global.symbols[i].kind == global.SYM.TERM) {
                            code += "<td><b>" + global.symbols[i].label + "</b></td>";
                        }
                    }

                    code += "</tr>";

                    for (i = 0; i < global.states.length; i++) {
                        code += "<tr>";
                        code += "<td class=\"coltitle\" style=\"border-right: 1px solid lightgray;\">" + i + "</td>";

                        for (j = 0; j < global.symbols.length; j++) {
                            if (global.symbols[j].kind == global.SYM.TERM) {
                                code += "<td>";
                                if ((val = tabgen.get_table_entry(global.states[i].actionrow, j)) != void(0)) {
                                    if (val <= 0) {
                                        code += "r" + (val * -1);
                                    } else {
                                        code += "s" + val;
                                    }
                                }
                                code += "</td>";
                            }
                        }

                        code += "</tr>";
                    }

                    code += "</table>";

                    for (i = 0; i < global.symbols.length; i++) {
                        if (global.symbols[i].kind == global.SYM.NONTERM) {
                            deepest++;
                        }
                    }

                    code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
                    code += "<tr>";
                    code += "<td class=\"tabtitle\" colspan=\"" + (deepest + 1) + "\">Goto-Table</td>";
                    code += "</tr>";

                    code +=
                        "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">State</td>";
                    for (i = 0; i < global.symbols.length; i++) {
                        if (global.symbols[i].kind == global.SYM.NONTERM) {
                            code += "<td>" + global.symbols[i].label + "</td>";
                        }
                    }

                    code += "</tr>";

                    for (i = 0; i < global.states.length; i++) {
                        code += "<tr>";
                        code += "<td class=\"coltitle\" style=\"border-right: 1px solid lightgray;\">" + i + "</td>";

                        for (j = 0; j < global.symbols.length; j++) {
                            if (global.symbols[j].kind == global.SYM.NONTERM) {
                                code += "<td>";
                                if ((val = tabgen.get_table_entry(global.states[i].gotorow, j)) != void(0)) {
                                    code += val;
                                }
                                code += "</td>";
                            }
                        }

                        code += "</tr>";
                    }

                    code += "</table>";

                    code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
                    code += "<tr>";
                    code += "<td class=\"tabtitle\" colspan=\"2\">Default Actions Table</td>";
                    code += "</tr>";
                    code +=
                        "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
                    code += "<td class=\"coltitle\">Number of symbols to pop</td>";
                    code += "</tr>";
                    for (i = 0; i < global.states.length; i++) {
                        code += "<tr>";
                        code += "<td style=\"border-right: 1px solid lightgray;\">State " + i + "</td>";
                        code +=
                            "<td>" + ((global.states[i].def_act < 0) ? "(none)" : global.states[i].def_act) + "</td>";
                        code += "</tr>";
                    }
                    code += "</table>";
                    break;
                case global.MODE_GEN.JS:
                case "js":
                    var pop_tab_json = [];
                    for (i = 0; i < global.productions.length; i++) {
                        pop_tab_json.push([global.productions[i].lhs, global.productions[i].rhs.length]);
                    }
                    code += "\nvar pop_tab = " + JSON.stringify(pop_tab_json) + ";\n";

                    var act_tab_json = [];
                    for (i = 0; i < global.states.length; i++) {
                        var act_tab_json_item = [];
                        for (j = 0; j < global.states[i].actionrow.length; j++) {
                            act_tab_json_item.push(global.states[i].actionrow[j][0], global.states[i].actionrow[j][1]);
                        }
                        act_tab_json.push(act_tab_json_item);
                    }
                    code += "\nvar act_tab =" + JSON.stringify(act_tab_json) + ";\n";

                    var goto_tab_json = [];
                    for (i = 0; i < global.states.length; i++) {
                        var goto_tab_json_item = [];
                        for (j = 0; j < global.states[i].gotorow.length; j++) {
                            goto_tab_json_item.push(global.states[i].gotorow[j][0], global.states[i].gotorow[j][1]);
                        }
                        goto_tab_json.push(goto_tab_json_item);
                    }
                    code += "\nvar goto_tab =" + JSON.stringify(goto_tab_json) + ";\n";

                    var defact_tab_json = [];
                    for (i = 0; i < global.states.length; i++) {
                        defact_tab_json.push(global.states[i].def_act);
                    }
                    code += "\nvar defect_tab =" + JSON.stringify(defact_tab_json) + ";\n";
                    break;
            }
            return code;
        },
        /**
         *
         * @param {Array.<module:jscc/global.Dfa>} dfa_states
         * @returns {Array}
         * @memberof module:jscc/printtab
         */
        pack_dfa: function(dfa_states) {
            var PL = function(line) {
                var out = [];
                while (line.length) {
                    var first = line.shift();
                    var second = line.shift();
                    if (first == second) {
                        out.push(first);
                    } else {
                        out.push([first, second]);
                    }
                }
                return out;
            };
            var json = [];
            for (var i = 0; i < dfa_states.length; i++) {
                (function(i) {
                    var line = [];
                    for (var j = 0; j < dfa_states[i].line.length; j++) {
                        if (dfa_states[i].line[j] != -1) {
                            line[j] = dfa_states[i].line[j];
                        }
                    }
                    line = PL(PL(PL(PL(PL(PL(PL(PL((line)))))))));
                    json.push({
                        line: line,
                        accept: dfa_states[i].accept
                    });
                })(i);
            }
            return json;
        },

        /**
         * Generates a state-machine construction from the deterministic
         * finite automata.
         * @param {Array.<module:jscc/global.Dfa>} dfa_states - The dfa state machine for
         * the lexing function.
         * @returns {string} The code to be inserted into the static
         * parser driver framework.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        print_dfa_table: function(dfa_states) {
            var json = [], code;
            for (var i = 0; i < dfa_states.length; i++) {
                (function(i) {
                    var line = {};
                    for (var j = 0; j < dfa_states[i].line.length; j++) {
                        if (dfa_states[i].line[j] != -1) {
                            line[j] = dfa_states[i].line[j];
                        }
                    }
                    json.push({
                        line: line,
                        accept: dfa_states[i].accept
                    });
                })(i);
            }
            code = JSON.stringify(exports.pack_dfa(dfa_states));
            return code.replace(/,/g, ",\n\t");
        },

        /**
         * Prints all symbol labels into an array; this is used for
         * error reporting purposes only in the resulting parser.
         * @returns {string} The code to be inserted into the
         * static parser driver framework.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        print_symbol_labels: function() {
            for (var i = 0, arr = []; i < global.symbols.length; i++) {
                arr.push(global.symbols[i].label);
            }
            return "var labels = " + JSON.stringify(global.symbols) + ";\n\n";
        },

        /**
         * Prints the terminal symbol actions to be associated with a
         * terminal definition into a switch-case-construct.
         * @returns {string} The code to be inserted into the static
         * parser driver framework.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        print_term_actions: function() {
            var code = "({\n";
            var re = /%match|%offset|%source/;
            var i, j, k;
            var semcode;
            var strmatch;
            for (i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].kind == global.SYM.TERM && global.symbols[i].code != "") {
                    code += "   \"" + i + "\":";
                    code += "function(PCB){";
                    semcode = "";
                    for (j = 0, k = 0; j < global.symbols[i].code.length; j++, k++) {
                        strmatch = re.exec(global.symbols[i].code.substr(j, global.symbols[i].code.length));
                        if (strmatch && strmatch.index == 0) {
                            if (strmatch[0] == "%match") {
                                semcode += "PCB.att";
                            } else if (strmatch[0] == "%offset") {
                                semcode += "( PCB.offset - PCB.att.length )";
                            } else if (strmatch[0] == "%source") {
                                semcode += "PCB.src";
                            }

                            j += strmatch[0].length - 1;
                            k = semcode.length;
                        } else {
                            semcode += global.symbols[i].code.charAt(j);
                        }
                    }
                    code += "       " + semcode + "\n";
                    code += "       return PCB.att;},\n";
                }
            }
            code += "\n})";
            return code;
        },

        /**
         * Generates a switch-case-construction that contains all
         * the semantic actions.  This construction should then be
         * generated into the static parser driver template.
         * @returns {string} The code to be inserted into the static
         * parser driver framework.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        print_actions: function() {
            var code = "";
            var re = /%[0-9]+|%%/;
            var semcode, strmatch;
            var i, j, k, idx, src;
            code += "[";
            for (i = 0; i < global.productions.length; i++) {
                src = global.productions[i].code;
                semcode = "function(){\n";
                semcode += "var rval;";
                for (j = 0, k = 0; j < src.length; j++, k++) {
                    strmatch = re.exec(src.substr(j, src.length));
                    if (strmatch && strmatch.index == 0) {
                        if (strmatch[0] == "%%") {
                            semcode += "rval";
                        } else {
                            idx = parseInt(strmatch[0].substr(1, strmatch[0].length));
                            idx = global.productions[i].rhs.length - idx;
                            semcode += " argument[" + idx + "] ";
                        }
                        j += strmatch[0].length - 1;
                        k = semcode.length;
                    } else {
                        semcode += src.charAt(j);
                    }
                }
                code += "       " + semcode + "\nreturn rval;},\n";
            }
            code += "]";
            return code;
        },

        /**
         * Returns the value of the eof-symbol.
         * @returns {number} The id of the EOF-symbol.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        get_eof_symbol_id: function() {
            var eof_id = -1;
            // Find out which symbol is for EOF
            for (var i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].special == global.SPECIAL.EOF) {
                    eof_id = i;
                    break;
                }
            }
            if (eof_id == -1) {
                io._error("No EOF-symbol defined - This might not be possible (bug!)");
            }
            return eof_id;
        },

        /**
         * Returns the value of the error-symbol.
         * @returns {number} The id of the error-symbol.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        get_error_symbol_id: function() {
            var error_id = -1;
            for (var i = 0; i < global.symbols.length; i++) {
                if (global.symbols[i].special == global.SPECIAL.ERROR) {
                    error_id = i;
                    break;
                }
            }
            if (error_id == -1) {
                io._error("No ERROR-symbol defined - This might not be possible (bug!)");
            }
            return error_id;
        },

        /**
         * Returns the ID of the whitespace-symbol.
         * @returns {number} The id of the whitespace-symbol.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        get_whitespace_symbol_id: function() {
            return global.whitespace_token;
        },

        /**
         * Returns the ID of a non-existing state.
         * @returns {number} One greater than the length of the
         * states array.
         * @author Jan Max Meyer
         * @memberof module:jscc/printtab
         */
        get_error_state: function() {
            return global.states.length + 1;
        }
    };
    return exports;
}));
