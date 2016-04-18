/*
 * Universal module definition for a bitset implementation backed by
 * integer bitmasks.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.bitset = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * Creates a new BitSet32 object.
     * @classdesc A bitset implementation backed by integer bitmasks.
     * @implements {jscc.bitset}
     * @constructor
     * @const
     */
    jscc.BitSet32 = function() {
        var that = this;
        /**
         * @private
         * @type {!Array<number>}
         */
        this._data = [];
        /**
         * @inheritDoc
         */
        this.set = function(bit, state) {
            that._data[bit >> 5] =
                (state ? (that._data[bit >> 5] | (1 << (bit & 31))) : (that._data[bit >> 5] & ~(1 << (bit & 31))));
            return state;
        };
        /**
         * @inheritDoc
         */
        this.get = function(bit) {
            return ((that._data[bit >> 5] & (1 << (bit & 31))) != 0);
        };
        /**
         * @inheritDoc
         */
        this.count = function() {
            var i, l, c = 0;
            for (i = 0, l = that._data.length * 32; i < l; i++) {
                if (that.get(i)) {
                    c++;
                }
            }
            return c;
        };
    };
    /**
     * Module containing BitSet32 implementation.  Returns a factory
     * function to make Closure slightly happier elsewhere.
     * @module {function(new:jscc.BitSet32)} jscc/bitset/BitSet32
     */
    return jscc.BitSet32;
}));
