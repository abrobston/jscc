/**
 * Universal module definition for V8 version of io module.
 */
(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'));
    } else {
        root.io = factory(root.global);
    }
}(this, function(global) {
    var retVal = {
        _error: function(msg) {
            if (global.show_errors) {
                print("error: " + global.file + ": " + msg);
            }
            global.errors++;
        },

        _warning: function(msg) {
            if (global.show_warnings) {
                print("warning: " + global.file + ": " + msg);
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
            var src = new String();

            if (file_exists(file)) {
                src = file_read(file);
            } else {
                retVal._error("unable to open file '" + file + "'");
                quit();
            }

            return src;
        },

        write_file: function(file, content) {
            var f = file_write(file, content);

            if (!f) {
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
