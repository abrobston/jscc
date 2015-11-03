/**
 * Universal module definition for Nashorn version of io module.
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
     * @exports jscc/io/io
     * @implements {jscc.io}
     */
    var exports = {
        _error: function(msg) {
            if (global.show_errors) {
                java.lang.System.err.println(global.file + ": error: " + msg);
            }
            global.errors++;
        },

        _warning: function(msg) {
            if (global.show_warnings) {
                java.lang.System.err.println(global.file + ": warning: " + msg);
            }
            global.warnings++;
        },

        _print: function(txt) {
            java.lang.System.out.println(txt);
        },

        _quit: function(exitcode) {
            if (typeof exitcode !== 'number') {
                exitcode = 0;
            }
            java.lang.System.exit(exitcode);
        },

        /**
         * @private
         * @param file
         * @returns {string}
         */
        _read_file: function(file) {
            var src = "";
            var diskFile = new java.io.File(file);
            if (diskFile.exists() && diskFile.isFile() && diskFile.canRead()) {
                var reader = new java.io.FileReader(diskFile);
                var buffer = new java.io.BufferedReader(reader);
                try {
                    var line = buffer.readLine();
                    while (line) {
                        src += line;
                    }
                } catch (ex) {
                    exports._error("unable to open file '" + file + "'");
                    exports._error("exception message was: '" + ex.message + "'");
                    exports._quit(1);
                } finally {
                    buffer.close();
                    reader.close();
                }
            } else {
                exports._error("unable to open file '" + file + "'");
                exports._quit(2);
            }
            return src;
        },

        /**
         *
         * @param file
         * @param content
         * @returns {boolean}
         * @private
         */
        _write_file: function(file, content) {
            var fileWriter = new java.io.FileWriter(file);
            var buffer = new java.io.BufferedWriter(fileWriter);
            var writer = new java.io.PrintWriter(buffer);
            try {
                writer.write(content);
            } catch (ex) {
                exports._error("unable to write '" + file + "'");
                exports._error("exception message was: '" + ex.message + "'");
                return false;
            } finally {
                writer.close();
                buffer.close();
                fileWriter.close();
            }

            return true;
        },

        get_arguments: function() {
            if ($ARG) {
                return $ARG;
            }
            exports._error("Command-line processing under Nashorn must use scripting mode.  Use the -scripting command-line switch.");
            exports._quit(3);
        },

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
                return this._read_file(filename);
            }

            if (filename == "" && !async) {
                var src = "";
                var stdIn = java.lang.System.in;
                var buffer = new java.io.BufferedReader(new java.io.InputStreamReader(stdIn));
                try {
                    var line = buffer.readLine();
                    while (line) {
                        src += line;
                    }
                } finally {
                    buffer.close();
                }
                return src;
            }

            var asyncInput = filename == "" ?
                new java.io.InputStreamReader(java.lang.System.in) :
                new java.io.FileReader(filename);
            var buffer = new java.io.BufferedReader(asyncInput);
            try {
                buffer.lines().forEachOrdered(chunkCallback);
                endCallback();
            } finally {
                buffer.close();
            }
        },

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
                return this._read_file(filename);
            }

            var asyncInput = new java.io.FileReader(filename);
            var buffer = new java.io.BufferedReader(asyncInput);
            try {
                buffer.lines().forEachOrdered(chunkCallback);
                endCallback();
            } finally {
                buffer.close();
            }
        },

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
                this._write_file(destination, text);
            } else if (destination == "" && !async) {
                java.lang.System.out.print(text);
            } else {
                var asyncOutput = destination == "" ?
                    new java.io.PrintWriter(java.lang.System.out) :
                    new java.io.PrintWriter(destination);
                try {
                    asyncOutput.print(text);
                    callback();
                } finally {
                    asyncOutput.close();
                }
            }
        }
    };
    return exports;
}));
