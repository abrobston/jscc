/*
 * Universal module definition for a boolean-backed bitset implementation.
 */
(function(root, factory) {
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
     * @module {function(new:jscc.BitSetBool)} jscc/bitset/BitSetBool
     */
    return jscc.BitSetBool;
}));