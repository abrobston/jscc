var jscc = require('./jscc-node');
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
    exitIfErrors: true
};
var argLength = process.argv.length;
var onDeck = "";
var nextIsLogLevel = false;
for (var index = 2; index < argLength; index++) {
    if (onDeck === "") {
        var optMatch = /^(--|\/)([a-zA-Z0-9_]+)$/.exec(process.argv[index]);
        if (optMatch !== null) {
            var optName = optMatch[2];
            if (possibleOptions.hasOwnProperty(optName)) {
                if (options.hasOwnProperty(optName)) {
                    console.error("Duplicate option: " + optName);
                    process.exit(1);
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
                        console.error("Invalid option: " + optName);
                        process.exit(1);
                        break;
                }
            }
        } else if (!options.hasOwnProperty("src_file")) {
            options["src_file"] = process.argv[index];
        } else {
            console.error("Extra command-line argument: " + process.argv[index]);
            process.exit(1);
        }
    } else if (nextIsLogLevel) {
        var logLevelName = process.argv[index].toUpperCase();
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
                console.error("Invalid log level: " + process.argv[index]);
                process.exit(1);
                break;
        }
    } else {
        options[onDeck] = process.argv[index];
        onDeck = "";
    }
}

if (onDeck !== "") {
    console.error("No value specified for option: " + onDeck);
    process.exit(1);
}

//jscc.jscc(options);
jscc.main(options);
process.exit(0);
