/*
 * Universal module definition for a bitset implementation backed by
 * integer bitmasks.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./namespace'));
    } else {
        root.bitset = factory(root.namespace);
    }
}(this, function(j) {
    /**
     * Creates a new BitSet32 object.
     * @classdesc A bitset implementation backed by integer bitmasks.
     * @implements {jscc.bitset}
     * @constructor
     * @const
     */
    j.BitSet32 = function() {
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
    //j.BitSet32.prototype = {
    //    /**
    //     * @private
    //     * @type {!Array<number>}
    //     */
    //    _data: [],
    //    /**
    //     * @inheritDoc
    //     * @this {jscc.BitSet32}
    //     */
    //    set: function(bit, state) {
    //        this._data[bit >> 5] =
    //            (state ? (this._data[bit >> 5] | (1 << (bit & 31))) : (this._data[bit >> 5] & ~(1 << (bit & 31))));
    //        return state;
    //    },
    //    /**
    //     * @inheritDoc
    //     * @this {jscc.BitSet32}
    //     */
    //    get: function(bit) {
    //        return ((this._data[bit >> 5] & (1 << (bit & 31))) != 0);
    //    },
    //    /**
    //     * @inheritDoc
    //     * @this {jscc.BitSet32}
    //     */
    //    count: function() {
    //        var i, l, c = 0;
    //        for (i = 0, l = this._data.length * 32; i < l; i++) {
    //            if (this.get(i)) {
    //                c++;
    //            }
    //        }
    //        return c;
    //    }
    //};
    /**
     * Module containing BitSet32 implementation.
     * @module {function(new:jscc.BitSet32)} jscc/bitset/BitSet32
     */
    return j.BitSet32;
}));
