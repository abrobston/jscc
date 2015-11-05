/*
 * Universal module definition for the Symbol class module.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["../enums/SYM", "../enums/ASSOC", "../enums/SPECIAL"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("../enums/SYM"), require("../enums/ASSOC"), require("../enums/SPECIAL"));
    } else {
        root.Symbol = factory(root.SYM, root.ASSOC, root.SPECIAL);
    }
}(this, function(SYM, ASSOC, SPECIAL) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new Symbol instance.
     * @classdesc Represents a symbol in the grammar.
     * @param {SymbolOptions=} o - Optional overrides for default property values.
     * @constructor
     * @memberof {jscc.classes}
     * @const
     */
    jscc.classes.Symbol = function(o) {
        var p = o || {};
        if (typeof p.id === 'number') {
            this.id = p.id;
        }
        if (p.kind === SYM.TERM) {
            this.kind = p.kind;
        }
        if (typeof p.label === 'string') {
            this.label = p.label;
        }
        if (Array.isArray(p.prods)) {
            this.prods = /** @type {!Array<number>} */ (p.prods);
        }
        if (Array.isArray(p.first)) {
            this.first = /** @type {!Array<number>} */ (p.first);
        }
        if (p.associativity === ASSOC.LEFT ||
            p.associativity === ASSOC.RIGHT ||
            p.associativity === ASSOC.NOASSOC) {
            this.associativity = p.associativity;
        }
        if (typeof p.level === 'number') {
            this.level = p.level;
        }
        if (typeof p.code === 'string') {
            this.code = p.code;
        }
        if (p.special === SPECIAL.EOF ||
            p.special === SPECIAL.ERROR ||
            p.special === SPECIAL.WHITESPACE) {
            this.special = p.special;
        }
        if (typeof p.nullable === 'boolean') {
            this.nullable = p.nullable;
        }
        if (typeof p.defined === 'boolean') {
            this.defined = p.defined;
        }
    };

    /**
     * The unique identifier for this symbol.  Generally, this value should match the symbol's index within the
     * global symbol array.
     * @type {!number}
     */
    jscc.classes.Symbol.prototype.id = -1;
    /**
     * Whether the symbol is terminating or nonterminating.
     * @type {!jscc.enums.SYM}
     */
    jscc.classes.Symbol.prototype.kind = SYM.NONTERM;
    /**
     * The text of this symbol.
     * @type {!string}
     */
    jscc.classes.Symbol.prototype.label = "";
    /**
     * The set of productions associated with this symbol, as identified by
     * their id values within the global productions array.
     * @type {!Array<number>}
     */
    jscc.classes.Symbol.prototype.prods = [];
    /**
     * The "first" array.
     * @type {!Array<number>}
     */
    jscc.classes.Symbol.prototype.first = [];
    /**
     * The associativity of this symbol.
     * @type {!jscc.enums.ASSOC}
     */
    jscc.classes.Symbol.prototype.associativity = ASSOC.NONE;
    /**
     * The level of this symbol.
     * @type {!number}
     */
    jscc.classes.Symbol.prototype.level = 0;
    /**
     * The code that this symbol produces.
     * @type {!string}
     */
    jscc.classes.Symbol.prototype.code = "";
    /**
     * The type of special symbol, if any, that this symbol represents.
     * @type {!jscc.enums.SPECIAL}
     */
    jscc.classes.Symbol.prototype.special = SPECIAL.NONE;
    /**
     * Whether this symbol is nullable.
     * @type {!boolean}
     */
    jscc.classes.Symbol.prototype.nullable = false;
    /**
     * Whether this symbol is defined.
     * @type {!boolean}
     */
    jscc.classes.Symbol.prototype.defined = false;

    /**
     * The module containing the Symbol class.
     * @module {function(new:jscc.classes.Symbol, SymbolOptions=)} jscc/classes/Symbol
     */
    return jscc.classes.Symbol;
}));
