define(function() {
    // This file exists to replace modules that the build "thinks" it needs (e.g., localHas)
    // but will not be needed after optimization.  A less-lazy way to handle this issue would be
    // to declare a separate pragma in the jscc project itself to exclude the localHas call (which
    // the closure pragma does -- along with a lot of other things that won't work here).  But, for
    // now...
    return function() {
    };
});