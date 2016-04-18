/*
 * RequireJS configuration for browser environments.
 */
requirejs.config({
    baseUrl: "./lib",
    paths: {
        "jscc/io/io": "jscc/io/ioBrowser",
        "jscc/log/log": "jscc/log/logBrowser",
        "jscc/bitset": "jscc/bitset/BitSet32",
        "text": "../node_modules/requirejs-text/text",
        "requireLib": "../node_modules/requirejs/require"
    },
    nodeRequire: require,
    config: {
        "jscc/global": {
            "version": "0.38.0"
        }
    }
});