phantom.onError = function(msg, trace) {
    console.error("Uncaught error: " + msg);
    if (trace && trace.length) {
        console.error(trace.join("\n"));
    }
    phantom.exit(1);
};
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
                    console.log("Duplicate option: " + optName);
                    quit(1);
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
                        console.log("Invalid option: " + optName);
                        phantom.exit(1);
                        break;
                }
            }
        } else if (!options.hasOwnProperty("src_file")) {
            options["src_file"] = args[index];
        } else {
            console.log("Extra command-line argument: " + args[index]);
            phantom.exit(1);
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
                console.log("Invalid log level: " + args[index]);
                phantom.exit(1);
                break;
        }
    } else {
        options[onDeck] = args[index];
        onDeck = "";
    }
}

if (onDeck !== "") {
    console.log("No value specified for option: " + onDeck);
    phantom.exit(1);
}

if (options.hasOwnProperty("out_file")) {
    var outFile = options["out_file"];
    delete options["out_file"];
    options.outputCallback = function(contents) {
        fs.write(outFile, contents, { mode: "w", charset: "utf-8" });
    }
}

if (options.hasOwnProperty("src_file")) {
    var srcFile = options["src_file"];
    delete options["src_file"];
    options.input = function() {
        return fs.read(srcFile, { mode: "r", charset: "utf-8" });
    }
}

if (options.hasOwnProperty("tpl_file")) {
    var tplFile = options["tpl_file"];
    delete options["tpl_file"];
    options.template = function() {
        return fs.read(tplFile, { mode: "r", charset: "utf-8" });
    }
}

var jsccPath = phantom.libraryPath + fs.separator + "jscc-browser.js";
phantom.injectJs(jsccPath);
var jscc = requireLib("jscc");
try {
    jscc(options);
    phantom.exit(0);
} catch (e) {
    console.error(e.message);
    phantom.exit(1);
}
