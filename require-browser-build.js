({
    "mainConfigFile": "./require-browser-config.js",
    "baseUrl": ".",
    "pragmas": {
        "closure": true
    },
    "has": {
        "node": false
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
    "name": "bin/almond",
    "include": ["main"],
    "stubModules": ["text"],
    "wrap": {
        "startFile": ["fileoverview.js", "typedef.js", "lib/jscc/io/io.js", "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js", "exports-requireLib.js", "require-browser-config.js", "require-main.js"]
    },
    "out": "./bin/jscc-browser.js",
    "logLevel": 2
})
