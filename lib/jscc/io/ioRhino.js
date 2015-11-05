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
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
    };
    //>>excludeEnd("closure");
    /**
     * The Rhino version of the io module.
     * @module jscc/io/io
     * @implements {jscc.io}
     * @constructor
     */
    jscc.ioRhino = function() {
    };
    jscc.ioRhino.prototype = {
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
                this._error("unable to open file '" + file + "'");
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
                this._error("unable to write '" + file + "'");
                return false;
            }

            return true;
        },

        args_global_var: arguments,

        get_arguments: function() {
            return this.args_global_var;
        },

        read_all_input: function(options) {
            if (typeof options === 'string') {
                return this.read_file(options);
            }
            if (typeof options === 'object' && typeof options.filename === 'string') {
                if (typeof options.chunkCallback === 'function') {
                    options.chunkCallback(this.read_file(options.filename));
                    if (typeof options.endCallback === 'function') {
                        options.endCallback();
                    }
                } else {
                    return this.read_file(options.filename);
                }
            }
        },

        read_template: function(options) {
            var filename = global.DEFAULT_DRIVER;
            if (typeof options === 'string') {
                filename = options;
            }
            else if (typeof options === 'object') {
                filename = options.filename || filename;
            }

            if (typeof options === 'object' && typeof options.chunkCallback === 'function') {
                options.chunkCallback(this.read_file(filename));
                if (typeof options.endCallback === 'function') {
                    options.endCallback();
                }
            } else {
                return this.read_file(filename);
            }
        },

        write_output: function(options) {

        },

        write_debug: function(text) {

        }
    };
    return new jscc.ioRhino();
}));
