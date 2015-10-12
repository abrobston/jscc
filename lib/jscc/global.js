/*
 * Universal module definition for global variables in JS/CC.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./bitset', 'module'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./bitset'), require('module'));
    } else {
        root.global = factory(root.bitset, root.module);
    }
}(this, function(/** module:jscc/bitset */ bitset, module) {
    /**
     * @private
     * @param {Array.<string>} a
     * @returns {Function}
     */
    var createConstructor = function(a) {
        var arr = {};
        for (var i = 0; i < a.length; i++) {
            arr[a[i]] = true;
        }
        return function(o) {
            o = o || {};
            for (var f in o) {
                if (f in arr) {
                    this[f] = o[f];
                }
            }
        }
    };

    /**
     * Specifies the minimum logging level.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var LOG_LEVEL = {
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

    /**
     * Identifies a symbol as nonterminating or terminating.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var SYM = {
        /**
         * The symbol is nonterminating.
         */
        NONTERM: 0,
        /**
         * The symbol is terminating.
         */
        TERM: 1
    };

    /**
     * Indicates the associativity of a symbol.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var ASSOC = {
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
     * Identifies a special symbol.  Special symbols include
     * end-of-file, whitespace, and error symbols.  Use
     * NONE to indicate a non-special symbol.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var SPECIAL = {
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
     * Indicates an output mode for the parser.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var MODE_GEN = {
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
     * Indicates whether the executable environment is a
     * console-based Javascript engine or a web environment.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var EXEC = {
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
     * Identifies the type of an edge in an automation graph.
     * @readonly
     * @enum {number}
     * @memberof module:jscc/global
     */
    var EDGE = {
        FREE: 0,
        EPSILON: 1,
        CHAR: 2
    };

    /**
     * Represents a symbol in the grammar.
     * @param {object=} o - Optional overrides for default
     * property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var Symbol = function(o) {
        o = o || {};
        if (typeof o.id === 'number') {
            this.id = o.id;
        }
        if (o.kind === SYM.TERM) {
            this.kind = o.kind;
        }
        if (typeof o.label === 'string') {
            this.label = o.label;
        }
        if (Array.isArray(o.prods)) {
            this.prods = o.prods;
        }
        if (Array.isArray(o.first)) {
            this.first = o.first;
        }
        if (o.associativity === ASSOC.LEFT ||
            o.associativity === ASSOC.RIGHT ||
            o.associativity === ASSOC.NOASSOC) {
            this.associativity = o.associativity;
        }
        if (typeof o.level === 'number') {
            this.level = o.level;
        }
        if (typeof o.code === 'string') {
            this.code = o.code;
        }
        if (o.special === SPECIAL.EOF ||
            o.special === SPECIAL.ERROR ||
            o.special === SPECIAL.WHITESPACE) {
            this.special = o.special;
        }
        if (typeof o.nullable === 'boolean') {
            this.nullable = o.nullable;
        }
        if (typeof o.defined === 'boolean') {
            this.defined = o.defined;
        }
    };

    /**
     * The unique identifier for this symbol.  Generally,
     * this value should match the symbol's index within
     * the global symbol array.
     * @type {number}
     */
    Symbol.prototype.id = -1;
    /**
     * Whether the symbol is terminating or nonterminating.
     * @type {SYM}
     */
    Symbol.prototype.kind = SYM.NONTERM;
    /**
     * The text of this symbol.
     * @type {string}
     */
    Symbol.prototype.label = "";
    /**
     * The set of productions associated with
     * this symbol.
     * @type {Array.<Production>}
     */
    Symbol.prototype.prods = [];
    Symbol.prototype.first = [];
    /**
     * The associativity of this symbol.
     * @type {ASSOC}
     */
    Symbol.prototype.associativity = ASSOC.NONE;
    Symbol.prototype.level = 0;
    Symbol.prototype.code = "";
    Symbol.prototype.special = SPECIAL.NONE;
    Symbol.prototype.nullable = false;
    Symbol.prototype.defined = false;

    /**
     * Represents a production created from the grammar.
     * @param {object=} o - Optional overrides for default
     * property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var Production = function(o) {
        o = o || {};
        if (typeof o.id === 'number') {
            this.id = o.id;
        }
        if (typeof o.lhs === 'number') {
            this.lhs = o.lhs;
        }
        if (Array.isArray(o.rhs)) {
            this.rhs = o.rhs;
        }
        if (typeof o.level === 'number') {
            this.level = o.level;
        }
        if (typeof o.code === 'string') {
            this.code = o.code;
        }
    };

    /**
     * The unique identifier of this production, which should
     * match its index within the global productions array.
     * @type {number}
     */
    Production.prototype.id = -1;
    /**
     * The id of the symbol representing the left-hand side of
     * this production.
     * @type {number}
     */
    Production.prototype.lhs = -1;
    /**
     * The id values of the symbols representing the right-hand
     * side of this production.
     * @type {Array.<number>}
     */
    Production.prototype.rhs = [];
    /**
     * The level of this production.
     * @type {number}
     */
    Production.prototype.level = 0;
    /**
     * The code associated with this production.
     * @type {string}
     */
    Production.prototype.code = "";

    /**
     * Contains lookahead information associated with a
     * production.
     * @param {object=} o - Optional overrides for default
     * property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var Item = function(o) {
        o = o || {};
        if (typeof o.prod === 'number') {
            this.prod = o.prod;
        }
        if (typeof o.dot_offset === 'number') {
            this.dot_offset = o.dot_offset;
        }
        if (Array.isArray(o.lookahead)) {
            this.lookahead = o.lookahead;
        }
    };

    /**
     * The index within the global productions array of the production
     * associated with this item.
     * @type {number}
     */
    Item.prototype.prod = -1;
    /**
     * The dot offset.
     * @type {number}
     */
    Item.prototype.dot_offset = 0;
    /**
     * An array of lookahead indexes.
     * @type {Array.<number>}
     */
    Item.prototype.lookahead = [];

    /**
     * An object used in the {@link State#actionrow} and {@link State#gotorow}
     * arrays to indicate how symbols and actions are paired for that state.
     * @param {number} sym - A number representing a {@link Symbol#id} value.
     * @param {number} act - A number representing the action associated with the symbol.
     * @constructor
     * @memberof module:jscc/global
     */
    var TableEntry = function(sym, act) {
        this.symbol = sym;
        this.action = act;
    };

    /**
     * The id value of the Symbol with which this entry is associated.
     * @type {number}
     */
    TableEntry.prototype.symbol = -1;
    /**
     * A number representing the action associated with the symbol.
     * @type {number}
     */
    TableEntry.prototype.action = -1;

    /**
     * Represents a state machine entry.
     * @param {object=} o - Optional overrides for default
     * property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var State = function(o) {
        o = o | {};
        if (Array.isArray(o.kernel)) {
            this.kernel = o.kernel;
        }
        if (Array.isArray(o.epsilon)) {
            this.epsilon = o.epsilon;
        }
        if (typeof o.def_act === 'number') {
            this.def_act = o.def_act;
        }
        if (typeof o.done === 'boolean') {
            this.done = o.done;
        }
        if (typeof o.closed === 'boolean') {
            this.closed = o.closed;
        }
        if (Array.isArray(o.actionrow)) {
            this.actionrow = o.actionrow;
        }
        if (Array.isArray(o.gotorow)) {
            this.gotorow = o.gotorow;
        }
    };

    /**
     * An array of items forming the kernel of this state.
     * @type {Array.<Item>}
     */
    State.prototype.kernel = [];
    /**
     * An array of items forming the epsilon of this state.
     * @type {Array.<Item>}
     */
    State.prototype.epsilon = [];
    /**
     * A number representing a defined action.
     * @type {number}
     */
    State.prototype.def_act = 0;
    /**
     * Whether this state has been fully processed.
     * @type {boolean}
     */
    State.prototype.done = false;
    /**
     * Whether this state is closed.
     * @type {boolean}
     */
    State.prototype.closed = false;
    /**
     * Table entries representing actions for this state.
     * @type {Array.<TableEntry>}
     */
    State.prototype.actionrow = [];
    /**
     * Table entries representing goto operations for this state.
     * @type {Array.<TableEntry>}
     */
    State.prototype.gotorow = [];

    /**
     * Represents a state in a nondeterministic finite automata.
     * @param {object=} o - Optional overrides for default property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var Nfa = function(o) {
        o = o | {};
        if (o.edge === EDGE.CHAR || o.edge === EDGE.FREE) {
            this.edge = o.edge;
        }
        if (o.ccl instanceof bitset.BitSet) {
            this.ccl = o.ccl;
        }
        if (typeof o.follow === 'number') {
            this.follow = o.follow;
        }
        if (typeof o.follow2 === 'number') {
            this.follow2 = o.follow2;
        }
        if (typeof o.accept === 'number') {
            this.accept = o.accept;
        }
        if (typeof o.weight === 'number') {
            this.weight = o.weight;
        }
    };

    /**
     * The type of edge in this NFA state.
     * @type {EDGE}
     */
    Nfa.prototype.edge = EDGE.EPSILON;
    /**
     * The bitset for this NFA state.
     * @type {BitSet}
     */
    Nfa.prototype.ccl = new bitset.BitSet(255);
    /**
     * Index of an immediately-following state.
     * @type {number}
     */
    Nfa.prototype.follow = -1;
    /**
     * Index of a second following state.
     * @type {number}
     */
    Nfa.prototype.follow2 = -1;
    /**
     * Index of an accepting state.
     * @type {number}
     */
    Nfa.prototype.accept = -1;
    /**
     * The weight of this particular state.
     * @type {number}
     */
    Nfa.prototype.weight = -1;

    /**
     * Represents a state in a deterministic finite automata.
     * @param {object=} o - Optional overrides for default
     * property values.
     * @constructor
     * @memberof module:jscc/global
     */
    var Dfa = function(o) {
        o = o | {};
        if (Array.isArray(o.line)) {
            this.line = o.line;
        }
        if (Array.isArray(o.nfa_set)) {
            this.nfa_set = o.nfa_set;
        }
        if (typeof o.accept === 'number') {
            this.accept = o.accept;
        }
        if (typeof o.done === 'boolean') {
            this.done = o.done;
        }
        if (typeof o.group === 'number') {
            this.group = o.group;
        }
    };

    /**
     * A multidimensional, generated array corresponding to this DFA state.
     * @type {Array}
     */
    Dfa.prototype.line = [];
    /**
     * Indexes of NFA states represented in this DFA state.
     * @type {Array.<number>}
     */
    Dfa.prototype.nfa_set = [];
    /**
     * Index of an accepting state.
     * @type {number}
     */
    Dfa.prototype.accept = -1;
    /**
     * Whether this DFA state has been fully processed.
     * @type {boolean}
     */
    Dfa.prototype.done = false;
    /**
     * A group index for this DFA state.
     * @type {number}
     */
    Dfa.prototype.group = -1;

    /**
     * Contains indexes of start and end states.
     * @param {number=} start - Index of the starting state.
     * @param {number=} end - Index of the ending state.
     * @constructor
     * @memberof module:jscc/global
     */
    var Param = function(start, end) {
        if (typeof start === 'number') {
            this.start = start;
        }
        if (typeof end === 'number') {
            this.end = end;
        }
    };

    /**
     * Index of the starting state.
     * @type {number}
     */
    Param.prototype.start = -1;
    /**
     * Index of the ending state.
     * @type {number}
     */
    Param.prototype.end = -1;

    /**
     * The module containing global properties, types, and constants
     * for use throughout JS/CC.
     * @module jscc/global
     */
    var global = {
        /**
         * @memberof module:jscc/global
         * @type {string}
         */
        JSCC_VERSION: module.config().version,
        /**
         * The default template filename for the running Javascript engine.
         * @type {string}
         * @memberof module:jscc/global
         */
        DEFAULT_DRIVER: module.config().defaultDriver,
        SYM: SYM,
        /**
         * @readonly
         * @deprecated Use {@link SYM.NONTERM} instead.
         * @memberof module:jscc/global
         */
        SYM_NONTERM: SYM.NONTERM,
        /**
         * @readonly
         * @deprecated Use {@link SYM.TERM} instead.
         * @memberof module:jscc/global
         */
        SYM_TERM: SYM.TERM,
        SPECIAL: SPECIAL,
        /**
         * @readonly
         * @deprecated Use {@link SPECIAL.NONE} instead.
         * @memberof module:jscc/global
         */
        SPECIAL_NO_SPECIAL: SPECIAL.NONE,
        /**
         * @readonly
         * @deprecated Use {@link SPECIAL.EOF} instead.
         * @memberof module:jscc/global
         */
        SPECIAL_EOF: SPECIAL.EOF,
        /**
         * @readonly
         * @deprecated Use {@link SPECIAL.WHITESPACE} instead.
         * @memberof module:jscc/global
         */
        SPECIAL_WHITESPACE: SPECIAL.WHITESPACE,
        /**
         * @readonly
         * @deprecated Use {@link SPECIAL.ERROR} instead.
         * @memberof module:jscc/global
         */
        SPECIAL_ERROR: SPECIAL.ERROR,
        ASSOC: ASSOC,
        /**
         * @readonly
         * @deprecated Use {@link ASSOC.NONE} instead.
         * @memberof module:jscc/global
         */
        ASSOC_NONE: ASSOC.NONE,
        /**
         * @readonly
         * @deprecated Use {@link ASSOC.LEFT} instead.
         * @memberof module:jscc/global
         */
        ASSOC_LEFT: ASSOC.LEFT,
        /**
         * @readonly
         * @deprecated Use {@link ASSOC.RIGHT} instead.
         * @memberof module:jscc/global
         */
        ASSOC_RIGHT: ASSOC.RIGHT,
        /**
         * @readonly
         * @deprecated Use {@link ASSOC.NOASSOC} instead.
         * @memberof module:jscc/global
         */
        ASSOC_NOASSOC: ASSOC.NOASSOC,
        /**
         * The default code contents for a production.
         * @constant {string}
         * @memberof module:jscc/global
         */
        DEF_PROD_CODE: "%% = %1;",
        MODE_GEN: MODE_GEN,
        /**
         * @readonly
         * @deprecated Use {@link MODE_GEN.TEXT} instead.
         * @memberof module:jscc/global
         */
        MODE_GEN_TEXT: MODE_GEN.TEXT,
        /**
         * @readonly
         * @deprecated Use {@link MODE_GEN.JS} instead.
         * @memberof module:jscc/global
         */
        MODE_GEN_JS: MODE_GEN.JS,
        /**
         * @readonly
         * @deprecated Use {@link MODE_GEN.HTML} instead.
         * @memberof module:jscc/global
         */
        MODE_GEN_HTML: MODE_GEN.HTML,
        EXEC: EXEC,
        /**
         * @readonly
         * @deprecated Use {@link EXEC.CONSOLE} instead.
         * @memberof module:jscc/global
         */
        EXEC_CONSOLE: EXEC.CONSOLE,
        /**
         * @readonly
         * @deprecated Use {@link EXEC.WEB} instead.
         * @memberof module:jscc/global
         */
        EXEC_WEB: EXEC.WEB,
        /**
         * The minimum lexer-state index.
         * @constant {number}
         * @memberof module:jscc/global
         */
        MIN_CHAR: 0,
        /**
         * One greater than the maximum lexer-state index.
         * @constant {number}
         * @memberof module:jscc/global
         */
        MAX_CHAR: 255,
        EDGE: EDGE,
        /**
         * @readonly
         * @deprecated Use {@link EDGE.FREE} instead.
         * @memberof module:jscc/global
         */
        EDGE_FREE: EDGE.FREE,
        /**
         * @readonly
         * @deprecated Use {@link EDGE.EPSILON} instead.
         * @memberof module:jscc/global
         */
        EDGE_EPSILON: EDGE.EPSILON,
        /**
         * @readonly
         * @deprecated Use {@link EDGE.CHAR} instead.
         * @memberof module:jscc/global
         */
        EDGE_CHAR: EDGE.CHAR,
        Symbol: Symbol,
        /**
         * @type {function}
         * @constructs SYMBOL
         * @param {object=} o - The default properties of SYMBOL to override.
         * @deprecated Use {@link Symbol} instead.
         * @memberof module:jscc/global
         */
        SYMBOL: createConstructor(['id', 'kind', 'label', 'prods', 'first', 'associativity', 'level', 'code', 'special',
                                   'nullable', 'defined', 'defined_at', 'used_at']),
        Production: Production,
        /**
         * @type {function}
         * @constructs PROD
         * @param {object=} o - The default properties of PROD to override.
         * @deprecated Use {@link Production} instead.
         * @memberof module:jscc/global
         */
        PROD: createConstructor(['id', 'lhs', 'rhs', 'level', 'code']),
        Item: Item,
        /**
         * @type {function}
         * @constructs ITEM
         * @param {object=} o - The default properties of ITEM to override.
         * @deprecated Use {@link Item} instead.
         * @memberof module:jscc/global
         */
        ITEM: createConstructor(['prod', 'dot_offset', 'lookahead']),
        TableEntry: TableEntry,
        State: State,
        /**
         * @type {function}
         * @constructs STATE
         * @param {object=} o - The default properties of STATE to override.
         * @deprecated Use {@link State} instead.
         * @memberof module:jscc/global
         */
        STATE: createConstructor(['kernel', 'epsilon', 'def_act', 'done', 'closed', 'actionrow', 'gotorow']),
        Nfa: Nfa,
        /**
         * @type {function}
         * @constructs {NFA}
         * @param {object=} o - The default properties of NFA to override.
         * @deprecated Use {@link Nfa} instead.
         * @memberof module:jscc/global
         */
        NFA: createConstructor(['edge', 'ccl', 'follow', 'follow2', 'accept', 'weight']),
        Dfa: Dfa,
        /**
         * @type {function}
         * @constructs {DFA}
         * @param {object=} o - The default properties of DFA to override.
         * @deprecated Use {@link Dfa} instead.
         * @memberof module:jscc/global
         */
        DFA: createConstructor(['line', 'object', 'nfa_set', 'accept', 'done', 'group']),
        Param: Param,
        /**
         * @type {function}
         * @constructs PARAM
         * @param {object=} o - The default properties of PARAM to override.
         * @deprecated Use {@link Param} instead.
         * @memberof module:jscc/global
         */
        PARAM: createConstructor(['start', 'end']),
        /**
         * The global symbol array.
         * @type {Array.<Symbol>}
         * @memberof module:jscc/global
         */
        symbols: [],
        /**
         * The global production array.
         * @type {Array.<Production>}
         * @memberof module:jscc/global
         */
        productions: [],
        /**
         * The global state array.
         * @type {Array.<State>}
         * @memberof module:jscc/global
         */
        states: [],
        /**
         * The global array of NFA states.
         * @type {Array.<Nfa>}
         * @memberof module:jscc/global
         */
        get nfa_states() {
            return global.NFA_states.value;
        },
        /**
         * The global NfaStates object.
         * @type {module:jscc/nfaStates}
         * @memberof module:jscc/global
         */
        NFA_states: null,
        /**
         * The global array of DFA states.
         * @type {Array.<Dfa>}
         * @memberof module:jscc/global
         */
        dfa_states: [],
        /**
         * Contains the {@link Symbol#id} value of the
         * whitespace token, or -1 if the whitespace token
         * has not yet been created.
         * @type {number}
         * @memberof module:jscc/global
         */
        whitespace_token: -1,
        /**
         * A string that the parser builds to replace the
         * ##HEADER## token in the template file.
         * @type {string}
         * @memberof module:jscc/global
         */
        code_head: "",
        /**
         * A string that the parser builds to replace the
         * ##FOOTER## token in the template file.
         * @type {string}
         * @memberof module:jscc/global
         */
        code_foot: "",
        /**
         * The filename of the grammar file currently in-process,
         * or the empty string when reading from a non-file input
         * source.
         * @type {string}
         * @memberof module:jscc/global
         */
        file: "",
        /**
         * A running count of errors.
         * @type {number}
         * @memberof module:jscc/global
         */
        errors: 0,
        /**
         * @type {boolean}
         * @deprecated Ignored.  See {@link module:./log/log}.
         * @memberof module:jscc/global
         */
        show_errors: true,
        /**
         * A running count of warnings.
         * @type {number}
         * @memberof module:jscc/global
         */
        warnings: 0,
        /**
         * @type {boolean}
         * @deprecated Ignored.  See {@link module:./log/log}.
         * @memberof module:jscc/global
         */
        show_warnings: true,
        /**
         * A running count of shift operations.
         * @type {number}
         * @memberof module:jscc/global
         */
        shifts: 0,
        /**
         * A running count of reduce operations.
         * @type {number}
         * @memberof module:jscc/global
         */
        reduces: 0,
        /**
         * A running count of goto operations.
         * @type {number}
         * @memberof module:jscc/global
         */
        gotos: 0,
        /**
         * The execution mode for this program.
         * @type {EXEC}
         * @memberof module:jscc/global
         */
        exec_mode: EXEC.CONSOLE,
        /**
         * A value that the parser uses to keep track of
         * associativity levels to assign to the
         * {@link Symbol#level} property.
         * @type {number}
         * @memberof module:jscc/global
         */
        assoc_level: 1,
        /**
         * A value that the parser uses to track the
         * value assigned to the {@link Nfa#weight}
         * property.
         * @type {number}
         * @memberof module:jscc/global
         */
        regex_weight: 0,
        LOG_LEVEL: LOG_LEVEL,
        /**
         * When running in an environment without obvious IO,
         * contains a function with one parameter that accepts
         * the output.
         * @type {function}
         * @memberof module:jscc/global
         */
        write_output_function: null,
        /**
         * When running in an environment without obvious IO,
         * contains a function that returns the grammar as
         * a string.
         * @type {function}
         * @memberof module:jscc/global
         */
        read_all_input_function: null,
        /**
         * When running in an environment without obvious IO,
         * contains a function that returns the template as
         * a string.
         * @type {function}
         * @memberof module:jscc/global
         */
        read_template_function: null
    };
    return global;
}));
