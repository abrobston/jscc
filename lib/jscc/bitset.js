/*
 * Universal module definition for bitset.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./log/log'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./log/log'));
    } else {
        root.bitset = factory(root.log);
    }
}(this, function(/** log */ log) {
    /**
     * Contains bitset classes.
     * @module jscc/bitset
     * @requires module:jscc/log/log
     */
    /**
     * A bitset implementation backed by a boolean array.
     * @param {*} size
     * @constructor
     * @memberof module:jscc/bitset
     */
    var BitSetBool = function(size) {
        this._data = [];
    };
    BitSetBool.prototype = {
        /**
         *
         * @param {number} bit
         * @param {boolean} state
         * @returns {boolean}
         */
        set: function(bit, state) {
            return this._data[bit] = (state && true) || false;
        },

        /**
         *
         * @param {number} bit
         * @returns {boolean}
         */
        get: function(bit) {
            return this._data[bit];
        },
        /**
         * Returns the number of true values in the bitset.
         * @returns {number}
         */
        count: function() {
            var i, c = 0;
            for (i = 0; i < this.data.length; i++) {
                if (this._data[i]) {
                    c++;
                }
            }
            return c;
        },
        /**
         * @private
         * @type {Array.<boolean>}
         */
        _data: []
    };
    /**
     * A bitset implementation backed by integers used as bitmasks.
     * @constructor
     * @memberof module:jscc/bitset
     */
    var BitSet32 = function() {
        this._data = [];
    };
    BitSet32.prototype = {
        /**
         *
         * @param {number} bit
         * @param {boolean} state
         */
        set: function(bit, state) {
            this._data[bit >> 5] =
                (state ? (this._data[bit >> 5] | (1 << (bit & 31))) : (this._data[bit >> 5] & ~(1 << (bit & 31))));
        },
        /**
         *
         * @param {number} bit
         * @returns {boolean}
         */
        get: function(bit) {
            return ((this._data[bit >> 5] & (1 << (bit & 31))) != 0);
        },
        /**
         *
         * @returns {number}
         */
        count: function() {
            var i, l, c = 0;
            for (i = 0, l = this._data.length * 32; i < l; i++) {
                if (this.get(i)) {
                    c++;
                }
            }
            return c;
        },
        /**
         * @private
         * @type {Array.<number>}
         */
        _data: []
    };
    /**
     * @param {*} size
     * @constructor
     * @private
     */
    var BitSetTest = function(size) {
        this.size = size;
        this.b = new BitSetBool(size);
        this.i32 = new BitSet32(size);
    };
    BitSetTest.prototype = {
        set: function(bit, state) {
            var b = this.b.set(bit, state);
            this.i32.set(bit, state);
            this.test();
            return b;
        },
        get: function(bit) {
            return this.b.get(bit);
        },
        count: function() {
            return this.b.count();
        },
        test: function() {
            for (var i = 0; i < this.size; i++) {
                if (((this.b.get(i) && true) || false) !== ((this.i32.get(i) && true) || false)) {
                    log.error("\nDifference: index=" + i + "\tBooL=" + this.b.get(1) + "\t I32=" + this.i32.get(i));
                    throw new Error("BITSET");
                }
            }
            if (this.b.count() !== this.i32.count()) {
                log.error("\nDifferent Counts \t Bool=" + this.b.count() + "\tI32=" + this.i32.count());
                throw new Error("BITSET");
            }
        }
    };

    /**
     * Creates the preferred bitset type for the platform.
     * @constructor
     * @memberof module:jscc/bitset
     * @augments module:jscc/bitset.BitSet32
     */
    var BitSet = function() {
        BitSet32.call(this);
    };
    BitSet.prototype = Object.create(BitSet32.prototype);
    BitSet.prototype.constructor = BitSet;
    //var BitSet = (function () {
    //if ((global.DEFAULT_DRIVER === "driver_node.js_") && false) {
    //    var Buffer = buffer.Buffer;
    //    var BitSetBuffer = function (size) {
    //        this.data = new Buffer((size + 7) >> 3);
    //    }
    //    BitSetBuffer.prototype = {
    //        set: function (bit, state) {
    //            this.data[bit >> 3] = (state ? (this.data[bit >> 3] | (1 << (bit & 7))) : (this.data[bit >> 3] & ~(1
    // << (bit & 7)))); }, get: function (bit) { if (this.gets > 10000) { throw new Error("LIMIT"); } else {
    // this.gets++; } return ((this.data[bit >> 3] & (1 << (bit & 7))) == 0) ? false : true; }, count: function () {
    // var i, l, c = 0; for (i = 0, l = this.data.length * 8; i < l; i++) { if (this.get(i)) { c++; } } return c; },
    // gets: 0 }; return BitSetBuffer; } else { return BitSet32(); } })();
    return {
        BitSetBool: BitSetBool,
        BitSet32: BitSet32,
        BitSetTest: BitSetTest,
        BitSet: BitSet
    };
}));
