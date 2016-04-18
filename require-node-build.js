({
    "mainConfigFile": "./require-node-config.js",
    "pragmas": {
        "closure": true,
        "jsccNamespacePreDefined": true
    },
    "optimize": "closure",
    "preserveLicenseComments": false,
    "generateSourceMaps": true,
    "closure": {
        "CompilerOptions": {
            "language": com.google.javascript.jscomp.CompilerOptions.LanguageMode.ECMASCRIPT5,
            "checkSymbols": true,
            "checkTypes": true
        },
        "CompilationLevel": "ADVANCED_OPTIMIZATIONS",
        "loggingLevel": "FINE",
        "externExportsPath": "./externsWithRequire.js"
    },
    "name": "jscc",
    "wrap": {
        "startFile": ["typedef.js", "lib/jscc/io/io.js", "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js"]
    },
    "out": "./bin/jscc-node.js",
    "logLevel": 2,
    "onModuleBundleComplete": function(data) {
        var nodeName = "node";
        if (/windows/i.test(java.lang.System.getProperty("os.name"))) {
            nodeName = "node.exe";
        }
        var amdcleanExitCode = runCommand(nodeName, "run-amdclean.js", data.path);
        if (amdcleanExitCode !== 0) {
            quit(amdcleanExitCode);
        }
    }
})
