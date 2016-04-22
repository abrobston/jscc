/*
 * Contains type definitions for Closure's benefit.  Used as a
 * start file when optimizing with requirejs.
 */
"use strict";
/**
 * The root namespace.  Re-add the const tag after Closure bug #1235 is fixed.
 * @namespace
 */
this["jscc"] = {};
//>>excludeStart("jsccNamespacePreDefined", pragmas.jsccNamespacePreDefined);
var jscc = this["jscc"];
//>>excludeEnd("jsccNamespacePreDefined");
//>>includeStart("jsccNamespacePreDefined", pragmas.jsccNamespacePreDefined);
jscc = this["jscc"];
//>>includeEnd("jsccNamespacePreDefined");
/**
 * The namespace to which enum definitions belong.
 * @namespace
 */
jscc["enums"] = {};
/**
 * The namespace to which certain classes belong.
 * @namespace
 */
jscc["classes"] = {};
jscc.enums = jscc["enums"];
jscc.classes = jscc["classes"];

/*
 * To avoid type errors with enums, add the enum module code here.  The enum modules
 * will simply return the enum objects when the closure pragma is defined.  There
 * really should be a better solution than this, and maybe there is.
 */

/**
 * Indicates the associativity of a symbol.
 * @enum {number}
 */
jscc.enums.ASSOC = {
    /**
     * The associativity has not yet been set.
     */
    NONE: 0,
    /**
     * The symbol is left-associative.
     */
    LEFT: 1,
    /**
     * The symbol is right-associative.
     */
    RIGHT: 2,
    /**
     * The symbol is non-associative.
     */
    NOASSOC: 3
};

/**
 * Identifies the type of an edge in an automation graph.
 * @enum {number}
 */
jscc.enums.EDGE = {
    FREE: 0,
    EPSILON: 1,
    CHAR: 2
};

/**
 * Indicates whether the executable environment is a
 * console-based Javascript engine or a web environment.
 * @enum {number}
 */
jscc.enums.EXEC = {
    /**
     * A console-based Javascript engine is in use.
     */
    CONSOLE: 0,
    /**
     * A web-browser-based Javascript engine is in use.
     */
    WEB: 1
};

/**
 * Specifies the minimum logging level.
 * @enum {number}
 */
jscc.enums.LOG_LEVEL = {
    /**
     * Log all messages.
     */
    TRACE: 0,
    /**
     * Log debug messages and higher.
     */
    DEBUG: 1,
    /**
     * Log info messages and higher.
     */
    INFO: 2,
    /**
     * Log warning messages and higher.
     */
    WARN: 3,
    /**
     * Log error and fatal messages.
     */
    ERROR: 4,
    /**
     * Log only fatal messages.
     */
    FATAL: 5
};
// Export from Closure, as this enumeration may be used in the
// mainOptions typedef.
jscc.enums.LOG_LEVEL['TRACE'] = jscc.enums.LOG_LEVEL.TRACE;
jscc.enums.LOG_LEVEL['DEBUG'] = jscc.enums.LOG_LEVEL.DEBUG;
jscc.enums.LOG_LEVEL['INFO'] = jscc.enums.LOG_LEVEL.INFO;
jscc.enums.LOG_LEVEL['WARN'] = jscc.enums.LOG_LEVEL.WARN;
jscc.enums.LOG_LEVEL['ERROR'] = jscc.enums.LOG_LEVEL.ERROR;
jscc.enums.LOG_LEVEL['FATAL'] = jscc.enums.LOG_LEVEL.FATAL;
jscc.enums['LOG_LEVEL'] = jscc.enums.LOG_LEVEL;

/**
 * Indicates an output mode for the parser.
 * @enum {number}
 */
jscc.enums.MODE_GEN = {
    /**
     * Output is plain text.
     */
    TEXT: 0,
    /**
     * Output is JavaScript code.
     */
    JS: 1,
    /**
     * Output is HTML-formatted.
     */
    HTML: 2
};

/**
 * Identifies a special symbol.  Special symbols include
 * end-of-file, whitespace, and error symbols.  Use
 * NONE to indicate a non-special symbol.
 * @enum {number}
 */
jscc.enums.SPECIAL = {
    /**
     * Identifies a non-special symbol.
     */
    NONE: 0,
    /**
     * Identifies an end-of-file symbol.
     */
    EOF: 1,
    /**
     * Identifies a whitespace symbol.
     */
    WHITESPACE: 2,
    /**
     * Identifies an error symbol.
     */
    ERROR: 3
};

/**
 * Identifies a symbol as nonterminating or terminating.
 * @enum {number}
 */
jscc.enums.SYM = {
    /**
     * The symbol is nonterminating.
     */
    NONTERM: 0,
    /**
     * The symbol is terminating.
     */
    TERM: 1
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
 * @property {?boolean} throwIfErrors - Whether to throw an exception before completion
 * of the main method if there are any errors.
 * @property {?boolean} exitIfErrors - Whether to exit the process with a non-zero exit
 * code if there are any errors, provided that the platform permits doing so.  Intended
 * for use with shell scripts.
 */
var mainOptions;

