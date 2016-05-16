({
    "mainConfigFile": "./require-node-config.js",
    "baseUrl": ".",
    "pragmas": {
        "closure": true,
        "amdclean": true,
        "node": true
    },
    "has": {
        "amdclean": true,
        "node": true
    },
    "optimize": "closure",
    "preserveLicenseComments": false,
    "generateSourceMaps": true,
    "closure": {
        "CompilerOptions": {
            "language": com.google.javascript.jscomp.CompilerOptions.LanguageMode.ECMASCRIPT5,
            "checkSymbols": true,
            "checkTypes": true
        },
        "CompilationLevel": "ADVANCED_OPTIMIZATIONS",
        "loggingLevel": "FINE",
        "externExportsPath": "./externsWithRequire.js"
    },
    "name": "main",
    "wrap": {
        "startFile": ["fileoverview-node.js", "typedef.js", "amdclean-node-globals.js", "lib/jscc/io/io.js",
                      "lib/jscc/log/log.js", "lib/jscc/bitset/bitset.js"],
        "endFile": ["exports.js"]
    },
    "out": "./bin/jscc-node.js",
    "logLevel": 2,
    "stubModules": ["text", "has"],
    "onModuleBundleComplete": function(data) {
        var isNode = typeof process === "object",
            isNashorn = typeof Java !== "undefined" && typeof Java.type === "function",
            isRhino = typeof java !== "undefined" && !isNashorn;

        (function(mainPath) {
            if (isNode) {
                var path = require("path");
                var rjsPath = path.join(__dirname, "node_modules", ".bin",
                                        process.platform === "win32" ? "r.js.cmd" : "r.js");
                var stderrLines = [];
                var stderrStream = new require("stream").Writable({
                                                                      write: function(chunk, encoding, next) {
                                                                          if (Buffer.isBuffer(chunk)) {
                                                                              stderrLines.push(chunk.toString("utf8"));
                                                                          } else {
                                                                              stderrLines.push(chunk);
                                                                          }
                                                                          next();
                                                                      }
                                                                  }
                );
                stderrStream.on("finish", function() {
                    console.log("Standard error:");
                    console.log(stderrLines.join(require("os").EOL));
                });

                var stdOut =
                    require("child_process")
                        .execSync(
                            "\"" + rjsPath + "\" \"" + path.join(__dirname, "run-amdclean.js") + "\" \"" + mainPath +
                            "\"", {
                                stdio: ["inherit", "pipe", stderrStream],
                                encoding: "utf8"
                            });
                console.log("Standard output:" + require("os").EOL + stdOut);
                return;
            }
            if (isRhino) {
                var exitCode =
                    org.mozilla.javascript.tools.shell.Main.exec(
                        ["./node_modules/requirejs/bin/r.js", "./run-amdclean.js", mainPath]);
                if (exitCode !== 0) {
                    quit(exitCode);
                }
                return;
            }
            if (isNashorn) {
                loadWithNewGlobal("./node_modules/requirejs/bin/r.js", "./run-amdclean.js", mainPath);
                // We need to wait until the various asynchronous threads all complete, since this
                // isn't Node.
                var commonPool = Java.type("java.util.concurrent.ForkJoinPool").commonPool();
                var minuteUnit = Java.type("java.util.concurrent.TimeUnit").MINUTES;
                commonPool.awaitQuiescence(9, minuteUnit);
            }
        })(data.path);
    }
})
