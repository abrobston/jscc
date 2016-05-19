/*
 * RequireJS configuration for Nashorn.
 */
requirejs.config({
    baseUrl: ".",
    paths: {
        "text": "bin/text",
        "has": "volo/has"
    },
    map: {
        "*": {
            "lib/jscc/io/io": "lib/jscc/io/ioNashorn",
            "lib/jscc/log/log": "lib/jscc/log/logJava",
            "lib/jscc/bitset": "lib/jscc/bitset/BitSetJava"
        }
    },
    nodeRequire: require,
    config: {
        "lib/jscc/global": {
            "version": "0.40.1"
        }
    }
});
