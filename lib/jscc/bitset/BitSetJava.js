(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.jsccbitset = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * @type {function(new:java.util.BitSet)}
     */
    var JavaBitSet;
    //>>includeStart("nashorn", pragmas.nashorn);
    JavaBitSet = /** @type {function(new:java.util.BitSet)} */ (Java.type("java.util.BitSet"));
    //>>includeEnd("nashorn");
    //>>excludeStart("nashorn", pragmas.nashorn);
    JavaBitSet = java.util.BitSet;
    //>>excludeEnd("nashorn");
    /**
     * Java library bitset implementation.
     * @implements {jscc.bitset}
     * @constructor
     */
    jscc.BitSetJava = function() {
        this._inner = new JavaBitSet();
    };

    /**
     * @type {java.util.BitSet}
     * @private
     */
    jscc.BitSetJava.prototype._inner = null;
    /**
     * @inheritDoc
     * @this {jscc.BitSetJava}
     * @param {!number} bit
     * @param {boolean=} state
     * @returns {!boolean}
     */
    jscc.BitSetJava.prototype.set = function(bit, state) {
        var flag = (state && true) || false;
        this._inner.set(bit, flag);
        return flag;
    };

    /**
     * @inheritDoc
     * @this {jscc.BitSetJava}
     * @param {!number} bit
     * @returns {!boolean}
     */
    jscc.BitSetJava.prototype.get = function(bit) {
        return this._inner.get(bit);
    };

    /**
     * @inheritDoc
     * @this {jscc.BitSetJava}
     * @returns {!number}
     */
    jscc.BitSetJava.prototype.count = function() {
        return this._inner.cardinality();
    };

    /**
     * @module {function(new:jscc.BitSetJava)} jscc/bitset/BitSetJava
     */
    return jscc.BitSetJava;
}));