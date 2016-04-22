({
    "mainConfigFile": "./require-rhino-config.js",
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
            "checkTypes": true
        },
        "CompilationLevel": "ADVANCED_OPTIMIZATIONS",
        "loggingLevel": "FINE",
        "externExportsPath": "./externs.js"
    },
    "name": "../bin/almond",
    "include": ["jscc"],
    "insertRequire": ["jscc"],
    "wrap": {
        "startFile": ["fileoverview.js", "typedef.js", "global-backfills.js", "lib/jscc/io/io.js", "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js", "exports-require.js"]
    },
    "out": "./bin/jscc-rhino.js",
    "logLevel": 2
})
