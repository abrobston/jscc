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
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {};
    //>>excludeEnd("closure");
    var sys = require('util');
    var fs = require('fs');
    var path = require('path');

    /**
     * @constructor
     * @implements {jscc.io}
     */
    jscc.ioNode = function() {
    };

    /**
     * @inheritDoc
     */
    jscc.ioNode.prototype.read_all_input = function(options) {
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

        if (filename !== "" && !path.isAbsolute(filename)) {
            filename = path.join(process.cwd(), filename);
        }

        if (filename !== "" && !async) {
            return fs.readFileSync(filename, "utf-8");
        }

        if (filename === "" && !async) {
            /**
             * @type {string}
             */
            var result = "";
            var done = false;
            process.stdin.setEncoding("utf-8");
            process.stdin.on('end', function() {
                done = true;
            });
            process.stdin.on('data', function(chunk, encoding, next) {
                result += "" + chunk;
                next();
            });
            while (!done) {

            }
            return /** @type {string} */ (result);
        }

        if (filename !== "") {
            fs.readFile(filename, "utf-8", chunkCallback);
        } else {
            process.stdin.setEncoding("utf-8");
            process.stdin.on("end", endCallback);
            process.stdin.on("data", chunkCallback);
        }
    };

    /**
     * @inheritDoc
     */
    jscc.ioNode.prototype.read_template = function(options) {
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

        // During testing, __dirname may be undefined for some reason.
        if (typeof __dirname === 'string') {
            var dirToSearch = __dirname;
        } else {
            dirToSearch = process.cwd();
        }
        var root = path.parse(dirToSearch).root;
        while (!filename && dirToSearch !== root) {
            if (fs.existsSync(path.join(dirToSearch, 'parser-driver.js'))) {
                filename = path.join(dirToSearch, 'parser-driver.js');
            } else if (fs.existsSync(path.join(dirToSearch, 'bin/parser-driver.js'))) {
                filename = path.join(dirToSearch, "bin/parser-driver.js");
            } else {
                dirToSearch = path.dirname(dirToSearch);
            }
        }

        if (!path.isAbsolute(filename)) {
            filename = path.join(process.cwd(), filename);
        }

        if (!async) {
            return fs.readFileSync(filename, "utf-8");
        }
        fs.readFile(filename, "utf-8", chunkCallback);
    };

    /**
     * @inheritDoc
     */
    jscc.ioNode.prototype.write_output = function(options) {
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
    };

    /**
     * @inheritDoc
     */
    jscc.ioNode.prototype.write_debug = function(text) {
        sys.puts(text);
    };

    /**
     * @inheritDoc
     */
    jscc.ioNode.prototype.exit = function(exitCode) {
        process.exit(exitCode);
    };

    /**
     * @module jscc/io/io
     */
    return new jscc.ioNode();
}));

