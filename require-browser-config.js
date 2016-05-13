/*
 * RequireJS configuration for browser environments.
 */
requirejs.config({
    baseUrl: ".",
    paths: {
        "text": "bin/text",
        "requireLib": "node_modules/requirejs/require",
        "has": "volo/has"
    },
    map: {
        "*": {
            "lib/jscc/io/io": "lib/jscc/io/ioBrowser",
            "lib/jscc/log/log": "lib/jscc/log/logBrowser",
            "lib/jscc/bitset": "lib/jscc/bitset/BitSet32"
        }
    },
    nodeRequire: require,
    config: {
        "lib/jscc/global": {
            "version": "0.40.0"
        }
    }
});