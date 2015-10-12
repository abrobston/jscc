/**
 * Universal module definition for SpiderMonkey version of io module
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'));
    } else {
        root.io = factory(root.global);
    }
}(this, function(global) {
    // TODO: replace file functions, as SpiderMonkey does not handle files.
    var retVal = {
        _error: function(msg) {
            if (global.show_errors) {
                print("/*--- error: " + msg + " */");
            }
            global.errors++;
        },

        _warning: function(msg) {
            if (global.show_warnings) {
                print("/*--- warning: " + msg + " */");
            }
            global.warnings++;
        },

        _print: function(txt) {
            print(txt);
        },

        _quit: function(exitcode) {
            quit(exitcode);
        },

        read_file: function(file) {
            var src = read(file);
            if (!src) {
                retVal._error("unable to open file '" + file + "'");
                quit(1);
            }
            return src;
        },

        write_file: function(file, content) {
            // Not supported
        },

        get_arguments: function() {
            return []; // TODO
        }
    };
    return retVal;
}));
