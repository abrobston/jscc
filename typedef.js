/*
 * Contains type definitions for Closure's benefit.  Used as a
 * start file when optimizing with requirejs.
 */
/**
 * The root namespace.  Re-add the const tag after Closure bug #1235 is fixed.
 * @namespace
 * @const
 */
var jscc = {
    /*
     * The namespace to which enum definitions belong.
     * @const
     */
    enums: {},
    /*
     * The namespace to which certain classes belong.
     * @namespace
     * @const
     */
    classes: {}
};

/*
 * Some option-override, fictional types.
 */
/**
 * @typedef {{id: ?number, kind: ?jscc.enums.SYM, label: ?string, prods: ?Array<number>, first:
 *     ?Array, associativity: ?jscc.enums.ASSOC, level: ?number, code: ?string, special: ?jscc.enums.SPECIAL,
 *     defined: ?boolean, "nullable": ?boolean}}
 */
var SymbolOptions;
/**
 * @typedef {{id: ?number, lhs: ?number, rhs: ?Array<!number>, level: ?number, code: ?string}}
 */
var ProductionOptions;
/**
 * @typedef {{kernel: ?Array<!jscc.classes.Item>, epsilon: ?Array<!jscc.classes.Item>, def_act: ?number, done:
 *     ?boolean, closed: ?boolean, actionrow: ?Array<!jscc.classes.TableEntry>, gotorow:
 *     ?Array<!jscc.classes.TableEntry>}}
 */
var StateOptions;
/**
 * @typedef {{prod: ?number, dot_offset: ?number, lookahead: ?Array<!number>}}
 */
var ItemOptions;
/**
 * @typedef {{edge: ?jscc.enums.EDGE, ccl: ?jscc.bitset, follow: ?number, follow2: ?number, accept: ?number,
 *     weight: ?number}}
 */
var NfaOptions;
/**
 * @typedef {{line: ?Array, nfa_set: ?Array<!number>, accept: ?number, done: ?boolean, group: ?number}}
 */
var DfaOptions;
/**
 * @typedef {{out_file: ?string, src_file: ?string, tpl_file: ?string, input: ?(string|function():!string),
     *     template: ?(string|function():!string), outputCallback: ?function(string):void, dump_nfa: ?boolean,
     *     dump_dfa: ?boolean, verbose: ?boolean, logLevel: ?(string|jscc.enums.LOG_LEVEL)}}
 * @property {?string} out_file - The path of the output file.  Defaults to
 * the empty string, which means to print to standard output (or the engine's equivalent).
 * @property {?string} src_file - The path of the input grammar file.
 * Defaults to the empty string, which means to read from standard input (or
 * the engine's equivalent).
 * @property {?string} tpl_file - The path of the input template file.
 * Defaults to the module's default template file, which is intended for generic
 * compilation tasks.
 * @property {?(string|function():!string)} input - If a string, the contents of the
 * input grammar.  If a function with no arguments, a function that returns
 * the contents of the grammar.  When input is specified, src_file is ignored.
 * @property {?(string|function():!string)} template - If a string, the contents of the
 * template.  If a function with no arguments, a function that returns the contents
 * of the template.  When template is specified, tpl_file is ignored.
 * @property {?function(string):void} outputCallback - A function with a parameter
 * that will be called with the output.  When outputCallback is specified,
 * out_file is ignored.
 * @property {?boolean} dump_nfa - Whether to output the nondeterministic finite
 * automata for debugging purposes.  Defaults to false.
 * @property {?boolean} dump_dfa - Whether to output the deterministic finite
 * automata for debugging purposes.  Defaults to false.
 * @property {?boolean} verbose - Make debugging output chattier.  Defaults to
 * false.
 * @property {?(string|jscc.enums.LOG_LEVEL)} logLevel - The logging
 * level.  Can be the name of one of the {@link module:jscc.enums.LOG_LEVEL} values
 * or one of the values themselves.  Defaults to WARN.
 */
var mainOptions;

