({
    "mainConfigFile": "./require-browser-config.js",
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
        "externExportsPath": "./externs.js",
        "loggingLevel": "FINE"
    },
    "name": "../node_modules/almond/almond",
    "include": ["jscc"],
    "insertRequire": ["jscc"],
    "wrap": {
        "startFile": ["typedef.js", "lib/jscc/io/io.js", "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js", "exports-requireLib.js"]
    },
    "out": "./bin/jscc-browser.js",
    "logLevel": 2
})
