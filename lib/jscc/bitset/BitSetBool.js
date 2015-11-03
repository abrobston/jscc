/*
 * Universal module definition for a boolean-backed bitset implementation.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./namespace'));
    } else {
        root.bitset = factory(root.namespace);
    }
}(this, function(jscc) {
    /**
     * Boolean-backed bitset implementation.
     * @implements {jscc.bitset}
     * @constructor
     */
    jscc.BitSetBool = function() {
        this._data = [];
    };
    jscc.BitSetBool.prototype = {
        /**
         * @private
         * @type {!Array<boolean>}
         */
        _data: [],
        /**
         * @inheritDoc
         * @this {jscc.BitSetBool}
         */
        set: function(bit, state) {
            return this._data[bit] = (state && true) || false;
        },
        /**
         * @inheritDoc
         * @this {jscc.BitSetBool}
         */
        get: function(bit) {
            return this._data[bit];
        },
        /**
         * @inheritDoc
         * @this {jscc.BitSetBool}
         */
        count: function() {
            var i, c = 0;
            for (i = 0; i < this._data.length; i++) {
                if (this._data[i]) {
                    c++;
                }
            }
            return c;
        }
    };
    /**
     * @module jscc/bitset/BitSetBool
     */
    return jscc.BitSetBool;
}));