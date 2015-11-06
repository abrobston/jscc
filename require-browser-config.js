/*
 * RequireJS configuration for browser environments.
 */
requirejs.config({
    baseUrl: "./lib",
    paths: {
        "jscc/io/io": "jscc/io/ioBrowser",
        "jscc/log/log": "jscc/log/logBrowser",
        "jscc/bitset": "jscc/bitset/BitSet32"
    },
    nodeRequire: require,
    config: {
        "jscc/global": {
            "version": "0.38.0",
            "defaultDriver": "./bin/parser-driver.js"
        }
    }
});