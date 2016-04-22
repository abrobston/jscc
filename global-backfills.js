(function(context) {
    if (typeof context.setTimeout !== "function") {
        /**
         * @param {?(Function|string)} callback
         * @param {number=} interval
         * @param {...*} extras
         * @returns {number}
         */
        context.setTimeout = function(callback, interval, extras) {
            // Ignore the interval, as we just want to ensure that the callback
            // itself is called.  Also, accepting a string callback is just
            // to make Closure happy -- we don't currently need to handle it.
            if (typeof callback === "function") {
                callback();
            }
            return 0;
        }
    }
})(this);
