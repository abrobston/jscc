var innerErrorMessage = null, innerErrorTrace = [];
function dumpObject(obj) {
    if (typeof obj === "string") {
        console.log(obj);
    } else {
        for (var current in obj) {
            console.log("" + current + ": " + obj[current]);
        }
    }
}

function onError(msg, trace) {
    var msgStack = ["PHANTOM ERROR:"];
    if (msg) {
        msgStack.push(msg);
        if (trace && trace.length) {
            innerErrorTrace = trace;
            msgStack.push("TRACE:");
            for (var index = 0; index < trace.length; index++) {
                var current = trace[index];
                msgStack.push(" -> " + (current.file || current.sourceURL) + ": " + current.line + (current.function ? " (in function " + current.function + ")" : ""));
            }
        }
    }
    innerErrorMessage = msgStack.join("\n");
    console.error(innerErrorMessage);
    phantom.exit(1);
}

try {
    var system = require("system");
    var fs = require("fs");
    var args = system.args;
    var possibleOptions = {
        "out_file": "string",
        "src_file": "string",
        "tpl_file": "string",
        "dump_nfa": "boolean",
        "dump_dfa": "boolean",
        "verbose": "boolean",
        "input": "string",
        "template": "string",
        "logLevel": "LOG_LEVEL"
    };
    var options = {
        throwIfErrors: true
    };
    var argLength = args.length;
    var onDeck = "";
    var nextIsLogLevel = false;
    for (var index = 1; index < argLength; index++) {
        if (onDeck === "") {
            var optMatch = /^(--|\/)([a-zA-Z0-9_]+)$/.exec(args[index]);
            if (optMatch !== null) {
                var optName = optMatch[2];
                if (possibleOptions.hasOwnProperty(optName)) {
                    if (options.hasOwnProperty(optName)) {
                        throw new Error("Duplicate option: " + optName);
                    }
                    var optType = possibleOptions[optName];
                    switch (optType) {
                        case "boolean":
                            options[optName] = true;
                            break;
                        case "LOG_LEVEL":
                            onDeck = optName;
                            nextIsLogLevel = true;
                            break;
                        case "string":
                            onDeck = optName;
                            break;
                        default:
                            throw new Error("Invalid option: " + optName);
                            break;
                    }
                }
            } else if (!options.hasOwnProperty("src_file")) {
                options["src_file"] = args[index];
            } else {
                throw new Error("Extra command-line argument: " + args[index]);
            }
        } else if (nextIsLogLevel) {
            var logLevelName = args[index].toUpperCase();
            switch (logLevelName) {
                case "FATAL":
                case "ERROR":
                case "WARN":
                case "INFO":
                case "DEBUG":
                case "TRACE":
                    options[onDeck] = logLevelName;
                    nextIsLogLevel = false;
                    onDeck = "";
                    break;
                case "WARNING":
                    options[onDeck] = "WARN";
                    nextIsLogLevel = false;
                    onDeck = "";
                    break;
                case "ALL":
                    options[onDeck] = "TRACE";
                    nextIsLogLevel = false;
                    onDeck = "";
                    break;
                default:
                    throw new Error("Invalid log level: " + args[index]);
                    break;
            }
        } else {
            options[onDeck] = args[index];
            onDeck = "";
        }
    }

    if (onDeck !== "") {
        throw new Error("No value specified for option: " + onDeck);
    }

    if (options.hasOwnProperty("out_file")) {
        var outFile = options["out_file"];
        delete options["out_file"];
        options.outputCallback = (function(out) {
            return function(contents) {
                try {
                    fs.write(out, contents, { mode: "w", charset: "utf-8" });
                } catch (e) {
                    if (typeof e === "string") {
                        console.log(e);
                        throw new Error(e);
                    }
                    throw e;
                }
            };
        })(outFile);
    }

    if (options.hasOwnProperty("src_file")) {
        var srcFile = options["src_file"];
        delete options["src_file"];
        options.input = (function(src) {
            return function() {
                try {
                    return fs.read(src, { mode: "r", charset: "utf-8" });
                } catch (e) {
                    if (typeof e === "string") {
                        console.log(e);
                        throw new Error(e);
                    }
                    throw e;
                }
            };
        })(srcFile);
    }

    if (options.hasOwnProperty("tpl_file")) {
        var tplFile = options["tpl_file"];
        delete options["tpl_file"];
        options.template = (function(tpl) {
            return function() {
                try {
                    return fs.read(tpl, { mode: "r", charset: "utf-8" });
                } catch (e) {
                    if (typeof e === "string") {
                        console.log(e);
                        throw new Error(e);
                    }
                    throw e;
                }
            };
        })(tplFile);
    }

    phantom.onError = onError;
    var jsccPath = phantom.libraryPath + fs.separator + "jscc-browser.js";
    phantom.injectJs(jsccPath);
    var jscc = requireLib("main");
    jscc(options);
    if (innerErrorMessage) {
        throw new Error(innerErrorMessage);
    }
    phantom.exit(0);
} catch (e) {
    dumpObject(e);
    phantom.exit(1);
}
