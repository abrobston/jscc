/**
 * Interface definition for bitset implementations.
 * @interface
 * @const
 */
jscc.bitset = function() {
};
jscc.bitset.prototype = {
    /**
     * Sets the specified bit to true or false.
     * @param {number} bit - The index of the bit to set
     * @param {boolean} state - Whether to set the bit to true or false
     * @returns {boolean} Returns the state parameter for chaining purposes
     * @method
     */
    set: function(bit, state) {
        return false;
    },

    /**
     * Gets the bit at the specified index.
     * @param {number} bit - The index of the bit to get
     * @returns {boolean} Whether the bit is currently true or false
     * @method
     */
    get: function(bit) {
        return false;
    },

    /**
     * Returns the number of true values in the bitset.
     * @returns {number} The number of true values in the bitset
     * @method
     */
    count: function() {
        return 0;
    }
};