function stripQuotes (input) {
    // Argument quoting, at least from Windows, has some issues.  Strip quotes
    // from the arguments if needed.
    var match = /^"(.*)"$/.exec(input);
    return match ? match[1] : input;
}

var args = arguments;
var currentDirectory = stripQuotes(args[0]);
var runnerName = stripQuotes(args[1]);
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
for (var index = 2; index < argLength; index++) {
    if (onDeck === "") {
        var optMatch = /^(--|\/)([a-zA-Z0-9_]+)$/.exec(args[index]);
        if (optMatch !== null) {
            var optName = optMatch[2];
            if (possibleOptions.hasOwnProperty(optName)) {
                if (options.hasOwnProperty(optName)) {
                    java.lang.System.err.println("Duplicate option: " + optName);
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
                        java.lang.System.err.println("Invalid option: " + optName);
                        quit(1);
                        break;
                }
            }
        } else if (!options.hasOwnProperty("src_file")) {
            options["src_file"] = stripQuotes(args[index]);
        } else {
            java.lang.System.err.println("Extra command-line argument: " + args[index]);
            quit(1);
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
                java.lang.System.err.println("Invalid log level: " + args[index]);
                quit(1);
                break;
        }
    } else {
        options[onDeck] = stripQuotes(args[index]);
        onDeck = "";
    }
}

if (onDeck !== "") {
    java.lang.System.err.println("No value specified for option: " + onDeck);
    quit(1);
}

var jsccPath = java.nio.file.Paths.get(currentDirectory, "jscc-" + runnerName + ".js").toAbsolutePath().toString();

load(jsccPath);
var jscc = require("main");
try {
    jscc(options);
} catch (e) {
    java.lang.System.err.println("Uncaught error: " + e);
    quit(1);
}
quit(0);
