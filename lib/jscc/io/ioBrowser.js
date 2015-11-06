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
}(this, function(/** jscc.global */ global) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");

    /**
     * @constructor
     * @implements {jscc.io}
     */
    jscc.ioBrowser = function() {
    };

    /**
     * @inheritDoc
     */
    jscc.ioBrowser.prototype.read_all_input = function(options) {
        if (typeof global.read_all_input_function === 'function') {
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioBrowser.prototype.read_template = function(options) {
        if (typeof global.read_template_function === 'function') {
            options = options || {};
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioBrowser.prototype.write_output = function(options) {
        if (typeof global.write_output_function === 'function') {
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioBrowser.prototype.write_debug = function(text) {
        if (typeof global.write_debug_function === 'function') {
            global.write_debug_function(text);
        }
    };

    /**
     * @module jscc/io/io
     */
    return new jscc.ioBrowser();
}));
