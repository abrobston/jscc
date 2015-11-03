(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.namespace = factory();
    }
}(this, function() {
    // jscc is already defined as a global.  This is to work around
    // Closure Compiler bug #1235 while still permitting testing.
    return jscc;
}));