/*
 * Universal module definition for the Rhino version of the io module.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../global', '../log/log'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../global'), require('../log/log'));
    } else {
        root.io = factory(root.global, root.log);
    }
}(this, function(/** jscc.global */ global, /** jscc.log */ log) {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    /**
     * The Rhino version of the io module.
     * @implements {jscc.io}
     * @constructor
     */
    jscc.ioRhino = function() {
    };

    /**
     * @private
     * @param {string} file
     * @returns {string}
     */
    jscc.ioRhino.prototype.read_file = function(file) {
        var src = "";

        if ((new java.io.File(file)).exists()) {
            src = readFile(file);
        } else {
            log.error("unable to open file '" + file + "'");
            quit(1);
        }

        return src;
    };

    /**
     * @private
     * @param {string} file
     * @param {string} content
     * @returns {boolean}
     */
    jscc.ioRhino.prototype.write_file = function(file, content) {
        var f = new java.io.PrintWriter(file);

        if (f) {
            f.write(content);
            f.close();
        } else {
            log.error("unable to write '" + file + "'");
            return false;
        }

        return true;
    };

    /**
     * @inheritDoc
     */
    jscc.ioRhino.prototype.read_all_input = function(options) {
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioRhino.prototype.read_template = function(options) {
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioRhino.prototype.write_output = function(options) {
        var text = "";
        var callback = function() {};
        var filename = "";
        if (typeof options === 'string') {
            text = options;
        } else if (typeof options === 'object') {
            if (typeof options.text === 'string') {
                text = options.text;
            }
            if (typeof options.destination === 'string') {
                filename = options.destination;
            }
            if (typeof options.callback === 'function') {
                callback = options.callback;
            }
        }

        if (filename === "") {
            java.lang.System.out.print(text);
        } else {
            this.write_file(filename, text);
        }
        callback();
    };

    /**
     * @inheritDoc
     */
    jscc.ioRhino.prototype.write_debug = function(text) {
        java.lang.System.out.print(text);
    };

    /**
     * @inheritDoc
     */
    jscc.ioRhino.prototype.exit = function(exitCode) {
        if (typeof exitCode !== "number") {
            exitCode = 0;
        }
        java.lang.System.exit(exitCode);
    };

    /**
     * @module jscc/io/io
     */
    return new jscc.ioRhino();
}));
