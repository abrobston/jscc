(function(context) {
    if (typeof context.setTimeout !== "function") {
        context.setTimeout = function(callback) {
            // Ignore the interval, as we just want to ensure that the callback
            // itself is called.
            callback();
        }
    }
})(this);
