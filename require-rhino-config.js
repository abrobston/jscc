/*
 * RequireJS configuration for Rhino.
 */
requirejs.config({
    baseUrl: "./lib",
    paths: {
        "jscc/io/io": "jscc/io/ioRhino",
        "jscc/log/log": "jscc/log/logJava",
        "jscc/bitset": "jscc/bitset/BitSetJava",
        "text": "../node_modules/requirejs-text/text"
    },
    nodeRequire: require,
    config: {
        "jscc/global": {
            "version": "0.38.0"
        },
        "env": "rhino"
    }
});
