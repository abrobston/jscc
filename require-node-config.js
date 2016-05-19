/*
 * RequireJS configuration for Node.
 */
requirejs.config({
    baseUrl: ".",
    paths: {
        "text": "bin/text",
        "json": "volo/json",
        "has": "volo/has"
    },
    map: {
        "*": {
            "lib/jscc/io/io": "lib/jscc/io/ioNode",
            "lib/jscc/log/log": "lib/jscc/log/logNode",
            "lib/jscc/bitset": "lib/jscc/bitset/BitSet32"
        }
    },
    nodeRequire: require,
    config: {
        "lib/jscc/global": {
            "version": "0.40.1"
        },
        "env": "node"
    }
});