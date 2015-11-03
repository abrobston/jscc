/*
 * Universal module definition for browser-specific IO.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'));
    } else {
        root.io = factory(root.global);
    }
}(this, function(/** module:jscc/global */ global) {
    /**
     * Browser-specific version of the IO module.
     * @module jscc/io/io
     * @requires module:jscc/global
     * @implements {jscc.io}
     */
    var exports = {
        read_all_input: function(options) {
            if (global.read_all_input_function) {
                options = options || {};
                if (typeof options.chunkCallback === 'function') {
                    var chunkCallback = options.chunkCallback;
                    var endCallback = (typeof options.endCallback === 'function') ? options.endCallback : function() {
                    };
                    chunkCallback(global.read_all_input_function());
                    endCallback();
                } else {
                    return global.read_all_input_function();
                }
            } else {
                throw new Error("global.read_all_input_function was not defined");
            }
        },

        read_template: function(options) {
            if (global.read_template_function) {
                options = options | {};
                if (typeof options.chunkCallback === 'function') {
                    var chunkCallback = options.chunkCallback;
                    var endCallback = (typeof options.endCallback === 'function') ? options.endCallback : function() {
                    };
                    chunkCallback(global.read_template_function());
                    endCallback();
                } else {
                    return global.read_template_function();
                }
            } else {
                throw new Error("global.read_template_function was not defined");
            }
        },

        write_output: function(options) {
            if (global.write_output_function) {
                var text = "";
                var callback = function() {
                };
                if (typeof options === 'string') {
                    text = options;
                } else if (options && (typeof options === 'object')) {
                    if (typeof options.text === 'string') {
                        text = options.text;
                    } else {
                        throw new Error("options was not a string, and options.text was not a string");
                    }
                    if (typeof options.callback === 'function') {
                        callback = options.callback;
                    }
                }
                global.write_output_function(text);
                callback();
            } else {
                throw new Error("global.write_output_function was not defined");
            }
        }
    };
    return exports;
}));
