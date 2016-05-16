(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["require", "async", "./asyncSupport"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccresolvePackageDirectories = factory(function(mod) {
            return root["jscc" + mod];
        });
    }
}(this, function(require) {
    require("./asyncSupport");
    var async = require("async");

    var thisDirName = "";
    if (typeof __dirname === "string") {
        thisDirName = __dirname;
    } else if (typeof __DIR__ === "string") {
        thisDirName = __DIR__;
    }

    // Backfill for path.join when running in non-Node environments
    function pathJoin() {
        var resultQueue = [], index, current;
        for (index = 0; index < arguments.length; index++) {
            current = arguments[index];
            if (typeof current === "string" && current.trim() !== "") {
                resultQueue.push(current.trim().replace(/^[\\\/]*/, "").replace(/[\\\/]*$/, ""));
            }
        }
        return resultQueue.join("/");
    }

    function isDirectory(dirPath, callback) {
        if (typeof process === "object" && typeof process.version === "string") {
            // Node
            require("fs").stat(dirPath, function(e, stat) {
                callback(e, !e && stat.isDirectory());
            });
        } else if (typeof Java !== "undefined" && typeof Java.type === "function") {
            // Nashorn
            var File = Java.type("java.io.File");
            var file = new File(dirPath);
            callback(null, file.exists() && file.isDirectory());
        } else if (typeof java !== "undefined") {
            // Rhino
            var rhinoFile = new java.io.File(dirPath);
            callback(null, rhinoFile.exists() && rhinoFile.isDirectory());
        } else {
            callback(
                new Error("Platform is not Node, Nashorn, or Rhino, so filesystem operations are currently unsupported."));
        }
    }

    function resolveDefault(moduleName, callback) {
        var mainModulePath = pathJoin(thisDirName, "node_modules", moduleName);
        isDirectory(mainModulePath, function(e, result) {
            if (!e && result) {
                callback(null, mainModulePath);
                return;
            }
            callback(new Error("Could not resolve moduleName '" + moduleName + "'" + (e ? (": " + e.message) : ".")));
        });
    }

    function resolveLast(parentDirPath, moduleName, callback) {
        if (parentDirPath) {
            var childPath = pathJoin(parentDirPath, "node_modules", moduleName);
            isDirectory(childPath, function(err, result) {
                if (!err && result) {
                    callback(null, childPath);
                    return;
                }
                resolveDefault(moduleName, callback);
            });
        } else {
            resolveDefault(moduleName, callback);
        }
    }

    var resolve = async.memoize(function(packageTreeString, callback) {
        var match = /^(.*)\s(\S+)$/.exec(packageTreeString.trim());
        if (match) {
            resolve(match[1], function(err, parentPath) {
                if (err) {
                    callback(err);
                    return;
                }
                resolveLast(parentPath, match[2], callback);
            });
        } else {
            resolveDefault(packageTreeString.trim(), callback);
        }
    }, function(packageTreeString) {
        return packageTreeString.trim().replace(/\s+/g, " ");
    });

    /**
     * To work with npm versions 2 and 3, whose installation behavior differs,
     * use this function.  Specify each module path as a space-delimited package
     * tree.  For example, to specify that we want the path to the version of
     * the "esprima" package that the "amdclean" package uses, use the path
     * "amdclean esprima".
     * @param {!(string|Array<string>)} modulePaths - The space-delimited package
     * tree or trees, e.g., "amdclean esprima" or ["amdclean esprima", "amdclean escodegen"]
     * @param {function(?Error, Array<string>)=} cb - An optional callback that takes a
     * nullable Error parameter and a parameter containing an array of paths to each
     * module directory
     * @returns {(undefined|Array<string>)} If there is no callback, returns an array of
     * paths to each module directory
     */
    function getNodeModuleDependencyPaths(modulePaths, cb) {
        if (typeof modulePaths === "string") {
            modulePaths = [modulePaths];
        }

        if (typeof cb === "function") {
            async.map(modulePaths, resolve, cb);
            return;
        }
        var outerError, outerResult, done = false;
        async.map(modulePaths, resolve, function(error, result) {
            outerError = error;
            outerResult = result;
            done = true;
        });
        while (!done) {
            // no-op
        }
        if (outerError) {
            throw outerError;
        }
        return outerResult;
    }

    return getNodeModuleDependencyPaths;
}));