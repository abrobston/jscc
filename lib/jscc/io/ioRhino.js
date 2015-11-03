/*
 * Universal module definition for the Rhino version of the io module.
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
    /**
     * The Rhino version of the io module.
     * @module jscc/io/io
     * @implements {jscc.io}
     */
    var retVal = {
        _error: function(msg) {
            if (global.show_errors) {
                print(global.file + ": error: " + msg);
            }
            global.errors++;
        },

        _warning: function(msg) {
            if (global.show_warnings) {
                print(global.file + ": warning: " + msg);
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
            var src = "";

            if ((new java.io.File(file)).exists()) {
                src = readFile(file);
            } else {
                retVal._error("unable to open file '" + file + "'");
                quit(1);
            }

            return src;
        },

        write_file: function(file, content) {
            var f = new java.io.PrintWriter(file);

            if (f) {
                f.write(content);
                f.close();
            } else {
                retVal._error("unable to write '" + file + "'");
                return false;
            }

            return true;
        },

        args_global_var: arguments,

        get_arguments: function() {
            return retVal.args_global_var;
        }
    };
    return retVal;
}));
