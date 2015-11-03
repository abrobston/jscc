/*
 * Universal module definition for the Node version of the io module.
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
    var sys = require('util');
    var fs = require('fs');

    /**
     * @module jscc/io/io
     * @implements {jscc.io}
     * @requires module:jscc/global
     */
    return {
        /**
         * Deprecated.  Writes an error message.
         * @deprecated Use {@link module:../log/log} instead.
         * @param {string} msg - The error message to write.
         */
        _error: function(msg) {
            if (global.show_errors) {
                sys.print(global.file + ": error: " + msg);
            }
            global.errors++;
        },

        /**
         * Deprecated.  Writes a warning message.
         * @deprecated Use {@link module:../log/log} instead.
         * @param {string} msg - The warning message to write.
         */
        _warning: function(msg) {
            sys.print(global.file + ": warning: " + msg);
            global.warnings++;
        },

        /**
         * Deprecated.  Writes a message to standard output.
         * @deprecated Use {@link module:../log/log} instead.
         */
        _print: sys.puts,

        _quit: process.exit,

        /**
         * Deprecated.  Reads a file and returns its contents.
         * @deprecated Use {@link read_all_input} or {@link read_template} instead.
         * @param {string} file - The filename to read.
         */
        read_file: function(file) {
            return fs.readFileSync(file, "utf-8");
        },

        /**
         * Deprecated.  Writes text to a file.
         * @deprecated Use {@link write_output} instead.
         * @param {string} file - The filename to write.
         * @param {string} content - The text to write.
         */
        write_file: function(file, content) {
            return fs.writeFileSync(file, content, "utf-8");
        },

        /**
         * Gets the arguments passed to the Node command line.
         * @returns {Array.<string>}
         */
        get_arguments: function() {
            return process.argv.slice(2);
        },

        /**
         * Reads input from the specified file or from standard input.
         * If chunkCallback and/or endCallback are specified, the operation
         * is asynchronous, and the function returns nothing.  Otherwise,
         * the operation is synchronous, and the function returns a string
         * with the contents read from the file or from standard input.
         *
         * @param {(string|object|function)=} options - If a string, the filename
         * to read.  If an object, has optional filename, chunkCallback,
         * and endCallback properties.  If a function, the callback function
         * to execute for each chunk read from standard input.
         * @param {string=} options[].filename - The filename to read.
         * If omitted, read from standard input.
         * @param {function=} options[].chunkCallback - The function to call
         * when an input chunk is read asynchronously.
         * @param {function=} options[].endCallback - The function to call
         * when the asynchronous read operation has completed.
         * @returns {?string} When running synchronously, the text read from
         * the file or standard input.  When running asynchronously, returns nothing.
         */
        read_all_input: function(options) {
            var filename = "";
            var async = false;
            var chunkCallback, endCallback;
            if (options && typeof options === 'string') {
                filename = options;
            } else if (options && typeof options === 'object') {
                if (options.filename) {
                    filename = options.filename;
                }
                if (typeof options.chunkCallback === 'function') {
                    chunkCallback = options.chunkCallback;
                    async = true;
                }
                if (typeof options.endCallback === 'function') {
                    endCallback = options.endCallback;
                    async = true;
                }
            } else if (options && typeof options === 'function') {
                chunkCallback = options;
                async = true;
            }

            if (filename != "" && !async) {
                return fs.readFileSync(filename, "utf-8");
            }

            if (filename == "" && !async) {
                var result = "";
                var done = false;
                process.stdin.setEncoding("utf-8");
                process.stdin.on('end', function() {
                    done = true;
                });
                process.stdin.on('data', function(chunk, encoding, next) {
                    result += chunk;
                    next();
                });
                while (!done) {

                }
                return result;
            }

            if (filename != "") {
                fs.readFile(filename, "utf-8", chunkCallback);
            } else {
                process.stdin.setEncoding("utf-8");
                process.stdin.on("end", endCallback);
                process.stdin.on("data", chunkCallback);
            }
        },

        /**
         * Reads the template file into which the parser code is inserted.
         * If not specified, uses the default driver specified in
         * {@link module:./global.DEFAULT_DRIVER}.
         *
         * @param {(string|object|function)=} options - If a string, specifies the
         * template filename.  If a function, specifies the callback function
         * to be used when reading a file chunk has completed.  If an object,
         * specifies either or both.  If omitted, causes the function to read
         * {@link module:./global.DEFAULT_DRIVER} synchronously.
         * @param {string=} options[].filename - Specifies the template filename.
         * @param {function=} options[].chunkCallback - The callback function
         * to be used when reading a file chunk has completed.
         * @returns {?string} When running synchronously, returns the contents of
         * the template file as a string.  When running asynchronously, returns
         * nothing.
         */
        read_template: function(options) {
            var filename = global.DEFAULT_DRIVER;
            var async = false;
            var chunkCallback;

            if (options && typeof options === 'string') {
                filename = options;
            } else if (options && typeof options === 'object') {
                if (typeof options.filename === 'string') {
                    filename = options.filename;
                }
                if (typeof options.chunkCallback === 'function') {
                    chunkCallback = options.chunkCallback;
                    async = true;
                }
            } else if (options && typeof options === 'function') {
                chunkCallback = options;
                async = true;
            }

            if (!async) {
                return fs.readFileSync(filename, "utf-8");
            }
            fs.readFile(filename, "utf-8", chunkCallback);
        },

        /**
         * Writes the provided text to the specified file or to standard output.
         *
         * @param {(string|object)} options - When a string, the text to be written
         * to standard output.  When an object, contains text, destination, and
         * callback properties.
         * @param {string=} options[].text - The text to be written.
         * @param {string=} options[].destination - The filename to which to write
         * the text.  If omitted, text is written to standard output.
         * @param {function=} options[].callback - A callback to be executed when
         * the asynchronous write operation has completed.  If omitted, the
         * operation occurs synchronously instead.
         */
        write_output: function(options) {
            var text = "";
            var destination = "";
            var async = false;
            var callback;

            if (options && typeof options === 'string') {
                text = options;
            } else if (options && typeof options === 'object') {
                if (typeof options.text === 'string') {
                    text = options.text;
                }
                if (typeof options.destination === 'string') {
                    destination = options.destination;
                }
                if (typeof options.callback === 'function') {
                    callback = options.callback;
                    async = true;
                }
            }

            if (destination != "" && !async) {
                fs.writeFileSync(destination, text, "utf-8");
            } else if (destination == "" && !async) {
                process.stdout.write(text, "utf-8");
            } else if (destination != "") {
                fs.writeFile(destination, text, "utf-8", callback);
            } else {
                process.stdout.on('finish', callback);
                process.stdout.write(text, "utf-8");
                process.stdout.end();
            }
        }
    };
}));

