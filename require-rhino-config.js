/*
 * RequireJS configuration for Rhino.
 */
requirejs.config({
    baseUrl: "./lib",
    paths: {
        "jscc/io/io": "jscc/io/ioRhino",
        "jscc/log/log": "jscc/log/logJava"
    },
    nodeRequire: require,
    config: {
        "jscc/global": {
            "version": "0.38.0",
            "defaultDriver": "./src/driver/parser.js"
        }
    }
});
