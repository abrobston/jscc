({
    "mainConfigFile": "./require-nashorn-config.js",
    "pragmas": {
        "closure": true
    },
    "optimize": "closure",
    "preserveLicenseComments": false,
    "generateSourceMaps": true,
    "closure": {
        "CompilerOptions": {
            "language": com.google.javascript.jscomp.CompilerOptions.LanguageMode.ECMASCRIPT5,
            "checkSymbols": true,
            "checkTypes": true,
            "newTypeInference": true
        },
        "CompilationLevel": "ADVANCED_OPTIMIZATIONS",
        "loggingLevel": "FINE",
        "externExportsPath": "./externs.js"
    },
    "name": "jscc",
    "wrap": {
        "startFile": ["typedef.js", "lib/jscc/io/io.js", "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js"]
    },
    "out": "./bin/jscc-nashorn.js",
    "logLevel": 2
})