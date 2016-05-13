/*
 * Universal module definition for debug.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', './global', './io/io', './enums/MODE_GEN', './enums/SYM', './enums/ASSOC'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccdebug = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {jscc.debug}
   */
  function(require, others) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    var io,
        global = /** @type {jscc.global} */ (require("./global")),
        MODE_GEN = require("./enums/MODE_GEN"),
        SYM = require("./enums/SYM"),
        ASSOC = require("./enums/ASSOC");

    //>>includeStart("node", pragmas.node);
    io = /** @type {jscc.io} */ (require("./io/ioNode"));
    //>>includeEnd("node");
    //>>excludeStart("node", pragmas.node);
    io = /** @type {jscc.io} */ (require("./io/io"));
    //>>excludeEnd("node");

    /**
     * Debugging-output functions.
     * @namespace jscc.debug
     */
    /**
     * Debugging-output functions.
     * @module {jscc.debug} jscc/debug
     * @requires module:jscc/global
     * @requires module:jscc/io/io
     * @constructor
     */
    jscc.debug = function() {
    };
    jscc.debug.prototype = {
        /**
         * Prints debugging output related to the current value of the
         * {@link jscc.global.symbols} array.
         * @param {jscc.enums.MODE_GEN} mode - The current output mode.
         * @memberof jscc.debug
         */
        print_symbols: function(mode) {
            if (mode == MODE_GEN.HTML) {
                io.write_debug("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"tabtitle\" colspan=\"3\">Symbols Overview</td>");
                io.write_debug("</tr>");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"coltitle\">Symbol</td>");
                io.write_debug("<td class=\"coltitle\">Type</td>");
                io.write_debug("</tr>");
            } else if (mode == MODE_GEN.TEXT) {
                io.write_debug("--- Symbol Dump ---");
            }

            for (var i = 0; i < global.symbols.length; i++) {
                if (mode == MODE_GEN.HTML) {
                    io.write_debug("<tr>");

                    io.write_debug("<td>");
                    io.write_debug(global.symbols[i].label);
                    io.write_debug("</td>");

                    io.write_debug("<td>");
                    io.write_debug(((global.symbols[i].kind == SYM.NONTERM) ? "Non-terminal" : "Terminal"));
                    io.write_debug("</td>");
                } else if (mode == MODE_GEN.TEXT) {
                    var output = "";

                    output = global.symbols[i].label;
                    for (var j = output.length; j < 20; j++) {
                        output += " ";
                    }

                    output += ((global.symbols[i].kind == SYM.NONTERM) ? "Non-terminal" : "Terminal");

                    if (global.symbols[i].kind == SYM.TERM) {
                        for (var j = output.length; j < 40; j++) {
                            output += " ";
                        }
                        output += global.symbols[i].level + "/";

                        switch (global.symbols[i].associativity) {
                            case ASSOC.NONE:
                                output += "^";
                                break;
                            case ASSOC.LEFT:
                                output += "<";
                                break;
                            case ASSOC.RIGHT:
                                output += ">";
                                break;
                        }
                    }

                    io.write_debug(output);
                }
            }

            if (mode == MODE_GEN.HTML) {
                io.write_debug("</table>");
            } else if (mode == MODE_GEN.TEXT) {
                io.write_debug("");
            }
        },

        /**
         * Prints debugging output related to the grammar being processed,
         * using information from the {@link jscc.global.symbols} and
         * {@link jscc.global.productions} arrays.
         * @param {jscc.enums.MODE_GEN} mode - The current output mode.
         * @memberof jscc.debug
         */
        print_grammar: function(mode) {
            if (mode == MODE_GEN.HTML) {
                io.write_debug("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"tabtitle\" colspan=\"3\">Grammar Overview</td>");
                io.write_debug("</tr>");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"coltitle\">Left-hand side</td>");
                io.write_debug("<td class=\"coltitle\">FIRST-set</td>");
                io.write_debug("<td class=\"coltitle\">Right-hand side</td>");
                io.write_debug("</tr>");

                for (var i = 0; i < global.symbols.length; i++) {
                    io.write_debug("<tr>");

                    if (global.symbols[i].kind == SYM.NONTERM) {
                        io.write_debug("<td>");
                        io.write_debug(global.symbols[i].label);
                        io.write_debug("</td>");

                        io.write_debug("<td>");
                        for (var j = 0; j < global.symbols[i].first.length; j++) {
                            io.write_debug("<b>" + global.symbols[global.symbols[i].first[j]].label + "</b>");
                        }
                        io.write_debug("</td>");

                        io.write_debug("<td>");
                        for (var j = 0; j < global.symbols[i].prods.length; j++) {
                            for (var k = 0; k < global.productions[global.symbols[i].prods[j]].rhs.length; k++) {
                                if (global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].kind ==
                                    SYM.TERM) {
                                    io.write_debug("<b>" +
                                                   global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                                   "</b>");
                                } else {
                                    io.write_debug(" " +
                                                   global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                                   " ");
                                }
                            }
                            io.write_debug("<br />");
                        }
                        io.write_debug("</td>");
                    }
                    io.write_debug("</tr>");
                }
                io.write_debug("</table>");
            } else if (mode == MODE_GEN.TEXT) {
                var output = "";

                for (var i = 0; i < global.symbols.length; i++) {
                    if (global.symbols[i].kind == SYM.NONTERM) {
                        output += global.symbols[i].label + " {";

                        for (var j = 0; j < global.symbols[i].first.length; j++) {
                            output += " " + global.symbols[global.symbols[i].first[j]].label + " ";
                        }

                        output += "}\n";

                        for (var j = 0; j < global.symbols[i].prods.length; j++) {
                            output += "\t";
                            for (var k = 0; k < global.productions[global.symbols[i].prods[j]].rhs.length; k++) {
                                if (global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].kind ==
                                    SYM.TERM) {
                                    output += "#" +
                                              global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                              " ";
                                } else {
                                    output +=
                                        global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                        " ";
                                }
                            }
                            output += "\n";
                        }
                    }
                }

                io.write_debug(output);
            }
        },

        /**
         * Prints debugging information relating to the provided array
         * of Item objects.
         * @param {jscc.enums.MODE_GEN} mode - The current output mode.
         * @param {string} label - A label for the debugging output.
         * @param {Array<!jscc.classes.Item>} item_set - The items for which to print information.
         * @memberof jscc.debug
         */
        print_item_set: function(mode, label, item_set) {
            var i, j;

            if (item_set.length == 0) {
                return;
            }

            if (mode == MODE_GEN.HTML) {
                io.write_debug("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"tabtitle\" colspan=\"2\">" + label + "</td>");
                io.write_debug("</tr>");
                io.write_debug("<tr>");
                io.write_debug("<td class=\"coltitle\" width=\"35%\">Lookahead</td>");
                io.write_debug("<td class=\"coltitle\" width=\"65%\">Production</td>");
                io.write_debug("</tr>");
            } else if (mode == MODE_GEN.TEXT) {
                io.write_debug("--- " + label + " ---");
            }

            for (i = 0; i < item_set.length; i++) {
                if (mode == MODE_GEN.HTML) {
                    io.write_debug("<tr>");
                    io.write_debug("<td>");
                    for (j = 0; j < item_set[i].lookahead.length; j++) {
                        io.write_debug("<b>" + global.symbols[item_set[i].lookahead[j]].label + "</b> ");
                    }
                    io.write_debug("</td>");

                    io.write_debug("<td>");
                    io.write_debug(global.symbols[global.productions[item_set[i].prod].lhs].label + " -&gt; ");
                    for (j = 0; j < global.productions[item_set[i].prod].rhs.length; j++) {
                        if (j == item_set[i].dot_offset) {
                            io.write_debug(".");
                        }

                        if (global.symbols[global.productions[item_set[i].prod].rhs[j]].kind == SYM.TERM) {
                            io.write_debug("<b>" + global.symbols[global.productions[item_set[i].prod].rhs[j]].label +
                                           "</b>");
                        } else {
                            io.write_debug(
                                " " + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ");
                        }
                    }

                    if (j == item_set[i].dot_offset) {
                        io.write_debug(".");
                    }
                    io.write_debug("</td>");
                    io.write_debug("</tr>");
                } else if (mode == MODE_GEN.TEXT) {
                    var out = "";

                    out += global.symbols[global.productions[item_set[i].prod].lhs].label;

                    for (j = out.length; j < 20; j++) {
                        out += " ";
                    }

                    out += " -> ";

                    for (j = 0; j < global.productions[item_set[i].prod].rhs.length; j++) {
                        if (j == item_set[i].dot_offset) {
                            out += ".";
                        }
                        if (global.symbols[global.productions[item_set[i].prod].rhs[j]].kind == SYM.TERM) {
                            out += " #" + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ";
                        } else {
                            out += " " + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ";
                        }
                    }

                    if (j == item_set[i].dot_offset) {
                        out += ".";
                    }

                    for (j = out.length; j < 60; j++) {
                        out += " ";
                    }
                    out += "{ ";

                    for (j = 0; j < item_set[i].lookahead.length; j++) {
                        out += "#" + global.symbols[item_set[i].lookahead[j]].label + " ";
                    }

                    out += "}";

                    io.write_debug(out);
                }
            }

            if (mode == MODE_GEN.HTML) {
                io.write_debug("</table>");
            }
        }
    };
    return new jscc.debug();
}));
