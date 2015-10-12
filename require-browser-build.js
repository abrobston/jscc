({
  "mainConfigFile": "./require-browser-config.js",
  "optimize": "closure",
  "preserveLicenseComments": false,
  "generateSourceMaps": true,
  "closure": {
    "CompilerOptions": {
      "language": com.google.javascript.jscomp.CompilerOptions.LanguageMode.ECMASCRIPT5
    },
    "CompilationLevel": "ADVANCED_OPTIMIZATIONS",
    "externExportsPath": "./externs.js",
    "loggingLevel": "FINE"
  },
  "name": "jscc",
  "out": "./jscc-browser.js",
  "logLevel": 2
})
