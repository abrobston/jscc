try {
    var fs = require('fs');
    var amdclean = require('amdclean');

    // Path of file to clean should be passed as the first argument.  Other
    // arguments are ignored.
    if (process.argv.length < 3) {
        console.error("The file path to clean must be passed as the first argument.");
        process.exit(1);
    }

    var mainPath = process.argv[2];
    if (!fs.existsSync(mainPath)) {
        console.error("The file path '" + mainPath + "' does not exist.");
        process.exit(2);
    }

    var mapPath = mainPath + '.map';

    if (fs.existsSync(mapPath)) {
        var sourceMap = fs.readFileSync(mapPath, "utf-8");
        var codeHash = amdclean.clean({
            "filePath": mainPath,
            "transformAMDChecks": true,
            "sourceMap": sourceMap,
            "wrap": false,
            "esprima": {
                "source": mainPath
            },
            "escodegen": {
                "sourceMap": true,
                "sourceMapWithCode": true
            },
            "removeAllRequires": true,
            "ignoreModules": ["util", "fs", "path"],
            "prefixTransform": function(postNormalizedModuleName, preNormalizedModuleName) {
                var parts = preNormalizedModuleName.split("/");
                if (parts[0] === "." || parts[0] === "..") {
                    if (parts.length > 1 && parts[1] === "jscc") {
                        parts.shift();
                    } else {
                        parts[0] = "jscc";
                    }
                }
                var last = parts.pop();
                var match = /^(io|log)Node$/.exec(last);
                if (match) {
                    parts.push(match[1]);
                } else if (last !== "BitSet32") {
                    parts.push(last);
                }
                return parts.join("_").replace(/[^A-Za-z0-9_]/g, "_");
            }
        });
        fs.renameSync(mainPath, mainPath + ".old.js");
        fs.writeFileSync(mainPath, codeHash.code);
        fs.renameSync(mapPath, mapPath + ".old.map");
        fs.writeFileSync(mapPath, codeHash.map);
    } else {
        var cleanedCode = amdclean.clean({
                                             "filePath": mainPath,
                                             "transformAMDChecks": false
                                         });
        fs.renameSync(mainPath, mainPath + ".old.js");
        fs.writeFileSync(mainPath, cleanedCode);
    }

    process.exit(0);
} catch (e) {
    console.error(e.toString());
    process.exit(3);
}