var args = arguments,
    nodeRequire = require,
    baseReq = requirejs.config({
                                   context: "baseReq",
                                   baseUrl: ".",
                                   nodeRequire: nodeRequire,
                                   packages: [{
                                       name: "async",
                                       location: "node_modules/async",
                                       main: "dist/async"
                                   }]
                               });

baseReq(["./resolvePackageDirectories"], function(resolvePackageDirectories) {
    resolvePackageDirectories(["amdclean", "amdclean esprima", "amdclean estraverse", "amdclean lodash"],
                              function(error, fourPaths) {
                                  if (error) {
                                      throw error;
                                  }

                                  req = requirejs.config({
                                                             context: "run-amdclean",
                                                             baseUrl: ".",
                                                             nodeRequire: nodeRequire,
                                                             packages: [{
                                                                 name: "amdclean",
                                                                 location: fourPaths[0],
                                                                 main: "src/amdclean"
                                                             }, {
                                                                 name: "esprima",
                                                                 location: fourPaths[1],
                                                                 main: "esprima"
                                                             }, {
                                                                 name: "estraverse",
                                                                 location: fourPaths[2],
                                                                 main: "estraverse"
                                                             }, {
                                                                 name: "lodash",
                                                                 location: fourPaths[3],
                                                                 main: "dist/lodash"
                                                             }, {
                                                                 name: "sourcemap-to-ast",
                                                                 location: "converted_modules/sourcemap-to-ast",
                                                                 main: "src/index"
                                                             }, {
                                                                 name: "escodegen",
                                                                 location: "converted_modules/escodegen",
                                                                 main: "escodegen"
                                                             }, {
                                                                 name: "esutils",
                                                                 location: "converted_modules/esutils",
                                                                 main: "lib/utils"
                                                             }],
                                                             paths: {
                                                                 "source-map": "node_modules/source-map/dist/source-map",
                                                                 "text": "bin/text",
                                                                 "json": "volo/json",
                                                                 "has": "volo/has"
                                                             },
                                                             map: {
                                                                 "*": {
                                                                     "underscore": "lodash"
                                                                 }
                                                             }
                                                         }
                                  );

                                  req(["require", "amdclean"], function(require, amdclean) {
                                      var isNode = typeof process === "object" && typeof process.version === "string",
                                          isNashorn = typeof Java !== "undefined" && typeof Java.type === "function",
                                          isRhino = typeof java !== "undefined" && !isNashorn,
                                          isJava = typeof java !== "undefined",
                                          innerMainPath = typeof mainPath !== "undefined" ? mainPath : null;

                                      if (!innerMainPath) {
                                          if (isNode) {
                                              // Path of file to clean should be passed as the first argument.  Other
                                              // arguments are ignored.
                                              if (process.argv.length < 3) {
                                                  writeError(
                                                      "The file path to clean must be passed as the first argument.");
                                                  exit(1);
                                              }
                                              innerMainPath = process.argv[2];
                                          } else if (isJava) {
                                              if (args.length < 2) {
                                                  writeError(
                                                      "The file path to clean must be passed as the first argument.");
                                                  exit(1);
                                              }
                                              innerMainPath = args[1];
                                          } else {
                                              writeError(
                                                  "Both isNode and isJava are false.  If this condition is inaccurate, check run-amdclean.js for bugs.");
                                              exit(1);
                                          }
                                      }

                                      function writeError(msg) {
                                          if (isNode) {
                                              console.error(msg);
                                              return;
                                          }
                                          if (isRhino) {
                                              java.lang.System.err.println(msg);
                                              return;
                                          }
                                          if (isNashorn) {
                                              Java.type("java.lang.System").err.println(msg);
                                          }
                                      }

                                      function fileExists(filePath) {
                                          if (isNode) {
                                              try {
                                                  return require("fs").statSync(filePath).isFile();
                                              } catch (e) {
                                                  return false;
                                              }
                                          }
                                          if (isNashorn) {
                                              var File = Java.type("java.io.File");
                                              var thisFile = new File(filePath);
                                              return thisFile.exists();
                                          }
                                          if (isRhino) {
                                              var rhinoFileObject = new java.io.File(filePath);
                                              return rhinoFileObject.exists();
                                          }
                                          return false;
                                      }

                                      function readFile(filePath) {
                                          if (isNode) {
                                              return require("fs").readFileSync(filePath, "utf8");
                                          }
                                          if (isRhino) {
                                              return readFile(filePath, "utf-8");
                                          }
                                          if (isNashorn) {
                                              var fileLines = [];
                                              var BufferedReader = Java.type("java.io.BufferedReader");
                                              var FileReader = Java.type("java.io.FileReader");
                                              var eol = Java.type("java.lang.System").lineSeparator();
                                              try {
                                                  var fileReader = new FileReader(filePath);
                                                  var bufferedReader = new BufferedReader(fileReader);
                                                  var line = bufferedReader.readLine();
                                                  while (typeof line !== "undefined" && line !== null) {
                                                      fileLines.push(line);
                                                      line = bufferedReader.readLine();
                                                  }
                                                  return fileLines.join(eol);
                                              } finally {
                                                  if (bufferedReader) {
                                                      bufferedReader.close();
                                                  }
                                                  if (fileReader) {
                                                      fileReader.close();
                                                  }
                                              }
                                          }
                                      }

                                      function renameFile(oldPath, newPath) {
                                          if (isNode) {
                                              require("fs").renameSync(oldPath, newPath);
                                              return;
                                          }
                                          if (isRhino) {
                                              var rhinoOld = new java.io.File(oldPath),
                                                  rhinoNew = new java.io.File(newPath);
                                              rhinoOld.renameTo(rhinoNew);
                                              return;
                                          }
                                          if (isNashorn) {
                                              var File = Java.type("java.io.File");
                                              var oldFile = new File(oldPath);
                                              var newFile = new File(newPath);
                                              oldFile.renameTo(newFile);
                                          }
                                      }

                                      function writeFile(filePath, contents) {
                                          if (isNode) {
                                              require("fs").writeFileSync(filePath, contents, { encoding: "utf8" });
                                              return;
                                          }
                                          if (isRhino) {
                                              try {
                                                  var rhinoFileWriter = new java.io.FileWriter(filePath),
                                                      rhinoBufferedWriter = new java.io.BufferedWriter(rhinoFileWriter);
                                                  rhinoBufferedWriter.write(contents, 0, contents.length);
                                              } finally {
                                                  if (rhinoBufferedWriter) {
                                                      rhinoBufferedWriter.close();
                                                  }
                                                  if (rhinoFileWriter) {
                                                      rhinoFileWriter.close();
                                                  }
                                              }
                                              return;
                                          }
                                          if (isNashorn) {
                                              try {
                                                  var FileWriter = Java.type("java.io.FileWriter"),
                                                      BufferedWriter = Java.type("java.io.BufferedWriter"),
                                                      fileWriter = new FileWriter(filePath),
                                                      bufferedWriter = new BufferedWriter(fileWriter);
                                                  bufferedWriter.write(contents, 0, contents.length);
                                              } finally {
                                                  if (bufferedWriter) {
                                                      bufferedWriter.close();
                                                  }
                                                  if (fileWriter) {
                                                      fileWriter.close();
                                                  }
                                              }
                                          }
                                      }

                                      function exit(exitCode) {
                                          if (isNode) {
                                              process.exit(exitCode);
                                              return;
                                          }
                                          // Don't actually exit from Java if exitCode is 0
                                          if (isJava && exitCode !== 0) {
                                              quit(exitCode);
                                          }
                                      }

                                      try {
                                          if (!fileExists(innerMainPath)) {
                                              writeError("The file path '" + innerMainPath + "' does not exist.");
                                              exit(2);
                                          }

                                          var mapPath = innerMainPath + '.map';

                                          if (fileExists(mapPath)) {
                                              var sourceMap = readFile(mapPath);
                                              // amdclean appears not to read files from the "filePath" property below
                                              // when running under anything but Node, so we have to read the file and
                                              // provide it directly.
                                              var inputCode = readFile(innerMainPath);
                                              var codeHash = amdclean.clean({
                                                                                "code": inputCode,
                                                                                "filePath": innerMainPath,
                                                                                "transformAMDChecks": true,
                                                                                "sourceMap": sourceMap,
                                                                                "esprima": {
                                                                                    "comment": true,
                                                                                    "source": innerMainPath
                                                                                },
                                                                                "escodegen": {
                                                                                    "comment": true,
                                                                                    "sourceMap": true,
                                                                                    "sourceMapWithCode": true
                                                                                },
                                                                                "removeAllRequires": false,
                                                                                "ignoreModules": ["util", "fs", "path"],
                                                                                "removeModules": ["text", "has"],
                                                                                "wrap": false,
                                                                                "prefixTransform": function(postNormalizedModuleName,
                                                                                                            preNormalizedModuleName) {
                                                                                    var parts = preNormalizedModuleName.split(
                                                                                        "/");
                                                                                    if (parts[0] === "." ||
                                                                                        parts[0] === "..") {
                                                                                        if (parts.length > 1 &&
                                                                                            parts[1] === "lib") {
                                                                                            parts.shift();
                                                                                        } else {
                                                                                            parts[0] = "lib";
                                                                                            if (parts.length > 1 &&
                                                                                                parts[1] !== "jscc") {
                                                                                                parts.splice(1, 0,
                                                                                                             "jscc");
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    var last = parts.pop();
                                                                                    var match = /^(io|log)Node$/.exec(
                                                                                        last);
                                                                                    if (match) {
                                                                                        parts.push(match[1]);
                                                                                    } else if (last !== "BitSet32") {
                                                                                        parts.push(last);
                                                                                    }
                                                                                    var retVal = parts.join("_")
                                                                                                      .replace(
                                                                                                          /[^A-Za-z0-9_]/g,
                                                                                                          "_");
                                                                                    // main.js in the root directory
                                                                                    // appears to use the wrong
                                                                                    // variable, so hack around it here
                                                                                    // -- also, require calls to the
                                                                                    // text plugin have a similar issue
                                                                                    if (retVal === "lib_jscc_main") {
                                                                                        retVal = "_" + retVal;
                                                                                    } else {
                                                                                        var match = /^text_+(?:lib_jscc_)?(.*)$/.exec(
                                                                                            retVal);
                                                                                        if (match) {
                                                                                            retVal =
                                                                                                "text___" + match[1];
                                                                                        }
                                                                                    }
                                                                                    return retVal;
                                                                                }
                                                                            });
                                              // The wrap option does not appear to work correctly when using source
                                              // maps.  So, we'll throw the global Node require statements in yet
                                              // another Closure header file instead.
                                              renameFile(innerMainPath, innerMainPath + ".old.js");
                                              writeFile(innerMainPath, codeHash.code);
                                              renameFile(mapPath, mapPath + ".old.map");
                                              writeFile(mapPath, codeHash.map);
                                          } else {
                                              var cleanedCode = amdclean.clean({
                                                                                   "filePath": innerMainPath,
                                                                                   "transformAMDChecks": false
                                                                               });
                                              renameFile(innerMainPath, innerMainPath + ".old.js");
                                              writeFile(innerMainPath, cleanedCode);
                                          }

                                          exit(0);
                                      } catch (e) {
                                          writeError(e.toString());
                                          exit(3);
                                      }
                                  });
                              });
});
