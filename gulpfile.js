(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['gulp', 'rest', 'rest/interceptor/mime', 'rest/interceptor/errorCode', 'path', 'fs',
                'http', 'https', 'url', 'stream', 'mocha', 'extract-zip', 'buffer', 'os', 'jformatter',
                'child_process', 'async', './resolvePackageDirectories'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('gulp'), require('rest'), require('rest/interceptor/mime'),
                    require('rest/interceptor/errorCode'), require('path'), require('fs'), require('http'),
                    require('https'), require('url'), require('stream'), require('mocha'), require('extract-zip'),
                    Buffer,
                    require('os'), require('jformatter'), require('child_process'), require('async'),
                    require('./resolvePackageDirectories'));
    } else {
        root.gulpfile =
            factory(root.gulp, root.rest, root.mime, root.errorCode, root.path, root.fs, root.http,
                    root.https, root.url, root.stream, root.mocha, root.extractZip, root.buffer, root.os,
                    root.jformatter, root.child_process, root.async, root.jsccresolvePackageDirectories);
    }
}(this, function(gulp, rest, mime, errorCode, path, fs, http, https, urlUtil, stream, Mocha, extract, Buffer, os,
                 jformatter, childProcess, async, resolvePackageDirectories) {
    function ensureDir(dirPath, cb) {
        var dirname = path.dirname(dirPath);

        function createDir() {
            fs.mkdir(dirPath, cb);
        }

        if (!/^(?:\.|\/|[A-Za-z]:[\\\/]?)?$/.test(dirname)) {
            ensureDir(dirname, createDir);
        } else {
            createDir();
        }
    }

    gulp.task('_jsdoc', ['_parse.js', '_regex.js'], function(cb) {
        childProcess.exec(
            '"' + path.join(__dirname, "node_modules", ".bin", process.platform === "win32" ? "jsdoc.cmd" : "jsdoc") +
            '" -c ./conf.json',
            {
                cwd: __dirname,
                stdio: "inherit"
            }, function(error) {
                if (error) {
                    cb(error);
                } else {
                    cb();
                }
            });
    });

    gulp.task('_generate-npm-runners', function() {
        return gulp.src("./npm-bin-template.js")
                   .pipe(new stream.Writable({
                       objectMode: true,
                       write: function(vinylFile, encoding, next) {
                           async.each(["browser", "nashorn", "node", "rhino"],
                                      function(item, callback) {
                                          var content = vinylFile.contents.toString("utf8").replace("##RUNNER##", item);
                                          fs.writeFile(path.join(__dirname, "bin", "npm-" + item + ".js"), content,
                                                       { encoding: "utf8", mode: 511 }, callback);
                                      }, next);
                       }
                   }));
    });

    gulp.task('_parse.js', function(cb) {
        childProcess.exec(
            "node ./bin/_boot_node.js -o ./lib/jscc/parse.js -t ./lib/jscc/template/parser-driver-js.txt ./lib/jscc/parse.par",
            {
                cwd: __dirname,
                stdio: "inherit"
            },
            function(error) {
                if (error) {
                    cb(error);
                } else {
                    cb();
                }
            });
    });

    gulp.task('_regex.js', function(cb) {
        childProcess.exec(
            'node ./bin/_boot_node.js -o ./lib/jscc/regex.js -t ./lib/jscc/template/parser-driver-js.txt ./lib/jscc/regex.par',
            {
                cwd: __dirname,
                stdio: "inherit"
            },
            function(error) {
                if (error) {
                    cb(error);
                } else {
                    cb();
                }
            });
    });

    gulp.task('_externsWithRequire.js', function(cb) {
        var bufferOutput = false,
            chunkArray = [],
            duplexWriteFinished = false,
            duplexReadFinished = false,
            buffer = new Buffer("// This file is generated.  Edit externs.js instead." + os.EOL +
                                "/**" + os.EOL +
                                " * @type {function(?, ?=, ?=)}" + os.EOL +
                                " */" + os.EOL +
                                "var define = function(name, deps, callback) {" + os.EOL +
                                "};" + os.EOL +
                                "define.amd = {};" + os.EOL +
                                "var require = function(path) {" + os.EOL +
                                "};" + os.EOL + os.EOL);

        fs.createReadStream('./externs.js')
          .pipe(new stream.Transform({
              transform: function(chunk, encoding, next) {
                  if (!bufferOutput) {
                      bufferOutput = true;
                      var enc = encoding === "buffer" ? "utf8" : encoding;
                      this.push(buffer.toString(enc));
                  }
                  next(null, chunk);
              }
          }))
          .pipe(new stream.Duplex({
              write: function(chunk, encoding, next) {
                  if (Buffer.isBuffer(chunk)) {
                      chunkArray.push(chunk.toString("utf8"));
                  } else {
                      chunkArray.push(chunk);
                  }
                  next();
              },
              read: function() {
                  var that = this;

                  function filter() {
                      if (!duplexWriteFinished) {
                          setTimeout(filter, 50);
                          return;
                      }
                      if (duplexReadFinished) {
                          that.push(null);
                          return;
                      }
                      var totalString = chunkArray.join("");
                      var startIndex = 0;
                      do {
                          var blockStartIndex = totalString.indexOf("// GULP REMOVE START", startIndex);
                          if (blockStartIndex !== -1) {
                              var blockEndIndex = totalString.indexOf("// GULP REMOVE END", blockStartIndex);
                              if (blockEndIndex !== -1) {
                                  totalString = totalString.substring(0, blockStartIndex - 1) + os.EOL +
                                                totalString.substring(blockEndIndex + "// GULP REMOVE END".length);
                                  startIndex = blockStartIndex;
                              }
                          }
                      } while (blockStartIndex !== -1 && blockEndIndex !== -1);

                      var keepReading = that.push(new Buffer(totalString, "utf8"));
                      duplexReadFinished = true;
                      if (keepReading) {
                          that.push(null);
                      }
                  }

                  setImmediate(filter);
              }
          }))
          .on("finish", function() {
              duplexWriteFinished = true;
          })
          .pipe(fs.createWriteStream('./externsWithRequire.js'))
          .on('finish', cb)
          .on('error', cb);
    });

    function downloadAndUnzip(filename, url, cb) {
        var jarDir = path.join(__dirname, "jar");
        try {
            fs.mkdirSync(jarDir);
        } catch (e) {
            // Directory probably exists, so ignore error
        }
        var jarDirStat = fs.statSync(jarDir);
        if (!jarDirStat.isDirectory()) {
            cb(new Error("Could not create or access jar directory at " + jarDir));
            return;
        }
        var destFile = path.join(jarDir, filename);
        var redirectCount = 0;
        var downloadCallback = function(err, stat) {
            var requestHeaders = {
                "Accept": "application/zip"
            };
            if (!err && stat.isFile()) {
                var compareDateTime = stat.birthtime;
                requestHeaders["If-Modified-Since"] = compareDateTime.toUTCString();
            }
            var parsedUrl = urlUtil.parse(url);
            var web = /^https:?$/i.test(parsedUrl.protocol) ? https : http;
            web.get({
                        protocol: parsedUrl.protocol,
                        hostname: parsedUrl.hostname,
                        port: parsedUrl.port,
                        path: parsedUrl.path,
                        headers: requestHeaders
                    }, function(res) {
                switch (res.statusCode) {
                    case 304:
                        // Not Modified
                        cb();
                        break;
                    case 302:
                        // Moved
                        if (++redirectCount > 10) {
                            cb(new Error("Too many redirects"));
                        }
                        url = res.headers.location;
                        downloadCallback(err, stat);
                        break;
                    case 200:
                        // OK
                        var outStream = fs.createWriteStream(destFile, { defaultEncoding: "binary" });
                        res.on('end', function() {
                            outStream.end();
                            extract(destFile,
                                    { dir: path.join(process.cwd(), "jar", filename.substr(0, filename.length - 4)) },
                                    function(err) {
                                        if (err) {
                                            cb(err);
                                        } else {
                                            cb();
                                        }
                                    });
                        });
                        res.on('data', function(data) {
                            outStream.write(data);
                        });
                        break;
                    default:
                        cb(new Error("Asset download from " + url + " returned HTTP status " + res.statusCode));
                        break;
                }
            });
        };
        fs.stat(destFile, downloadCallback);
    }

    gulp.task('_get-rhino', function(cb) {
        var client = rest.wrap(mime, {
            mime: "application/json",
            accept: "application/vnd.github.v3+json;q=1.0, application/json;q=0.8"
        })
                         .wrap(errorCode);
        client({
                   path: "https://api.github.com/repos/mozilla/rhino/releases/latest",
                   headers: { "User-Agent": "jscc" }
               }).then(function(response) {
            var data = response.entity;
            var url = "";
            var filename = "";
            for (var index = 0; index < data.assets.length; index++) {
                if (/\.zip$/i.test(data.assets[index].name) && !/source/i.test(data.assets[index].name)) {
                    url = data.assets[index].browser_download_url;
                    filename = data.assets[index].name;
                    break;
                }
            }
            if (url == "") {
                cb(new Error("No rhino zip file found in latest release on Github"));
            } else {
                downloadAndUnzip(filename, url, cb);
            }
        }, function(errorResponse) {
            cb(new Error("Request failed with HTTP status " + errorResponse.status.code));
        });
    });

    gulp.task('_get-closure', function(cb) {
        downloadAndUnzip("closure-latest.zip", "http://dl.google.com/closure-compiler/compiler-latest.zip", cb);
    });

    function voloGet(archiveString, cb) {
        ensureDir("volo", function() {
            var execName = process.platform === "win32" ? "volo.cmd" : "volo";
            childProcess.exec("\"" + path.join(__dirname, "node_modules", ".bin", execName) +
                              "\" add -amd -nostamp -noprompt " + archiveString, {
                                  cwd: path.join(__dirname, "volo")
                              },
                              function(error, stdout, stderr) {
                                  if (stdout) {
                                      console.log(stdout);
                                  }
                                  if (stderr) {
                                      console.log(stderr);
                                  }
                                  cb(error);
                              });
        });
    }

    gulp.task('_get-requirejs-plugins', function(cb) {
        voloGet("millermedeiros/requirejs-plugins/v1.0.3#src/json.js", cb);
    });

    gulp.task('_get-has-js', function(cb) {
        voloGet("phiggins42/has.js", cb);
    });

    gulp.task('_convert-cjs-modules', function(cb) {
        var rjsPath = path.join(__dirname, "node_modules", ".bin", process.platform === "win32" ? "r.js.cmd" : "r.js"),
            convertedModulesPath = path.join(__dirname, "converted_modules");
        ensureDir(convertedModulesPath, function() {
            resolvePackageDirectories(["amdclean escodegen", "amdclean escodegen esutils", "amdclean sourcemap-to-ast"],
                                         function(error, modulePaths) {
                                             if (error) {
                                                 cb(error);
                                                 return;
                                             }
                                             gulp.src(modulePaths, { read: false })
                                                 .pipe(new stream.Writable({
                                                     objectMode: true,
                                                     write: function(vinylFile, encoding, next) {
                                                         var baseDir = path.basename(vinylFile.path);
                                                         childProcess.exec(
                                                             "\"" + rjsPath + "\" -convert \"" + vinylFile.path +
                                                             "\" \"" +
                                                             path.join(convertedModulesPath, baseDir) + "\"",
                                                             function(error, stdout, stderr) {
                                                                 if (stdout) {
                                                                     console.log(stdout);
                                                                 }
                                                                 if (stderr) {
                                                                     console.log(stderr);
                                                                 }
                                                                 next(error);
                                                             });
                                                     }
                                                 }))
                                                 .on("finish", function(e) {
                                                     cb(e);
                                                 });

                                         });
        });
    });

    gulp.task('_replace-require-json', ['_convert-cjs-modules'], function() {
        return gulp.src(["./converted_modules/**/*.js"])
                   .pipe(new stream.Transform({
                       objectMode: true,
                       transform: function(vinylFile, encoding, next) {
                           var isBuffer = Buffer.isBuffer(vinylFile.contents);
                           var contents = isBuffer ? vinylFile.contents.toString("utf8") : vinylFile.contents;
                           var output = contents.replace(/\brequire\(\s*(['"])([^!]+?\.[jJ][sS][oO][nN])\1\s*\)/g,
                                                         "require(\"json!$2\")");
                           vinylFile.contents = isBuffer ? new Buffer(output, "utf8") : output;
                           next(null, vinylFile);
                       }
                   }))
                   .pipe(gulp.dest("./converted_modules"));
    });

    gulp.task('_requirejs-optimize',
              ['_parse.js', '_regex.js', '_get-closure', '_externsWithRequire.js',
               '_convert-cjs-modules', '_get-requirejs-plugins', '_replace-require-json', '_get-has-js'],
              function(cb) {
                  var closureJarPath = path.join(process.cwd(), "jar", "closure-latest", "compiler.jar");
                  var ParallelCompiler = function(rjsCommand) {
                      var that = this;
                      stream.Duplex.call(this, { writableObjectMode: true });
                      this._rjsCommand = rjsCommand;
                      this._maxParallel = Math.max(1, os.cpus().length - 2);
                      this.on("finish", function() {
                          that._writingFinished = true;
                      });
                  };
                  ParallelCompiler.prototype = Object.create(stream.Duplex.prototype);
                  ParallelCompiler.prototype.constructor = ParallelCompiler;
                  ParallelCompiler.prototype._writingFinished = false;
                  ParallelCompiler.prototype._processesRemaining = 0;
                  ParallelCompiler.prototype._maxParallel = 0;
                  ParallelCompiler.prototype._currentParallelCount = 0;
                  ParallelCompiler.prototype._rjsCommand = null;
                  ParallelCompiler.prototype._shellResults = [];
                  ParallelCompiler.prototype._writeExec = function(command, chunkPath, next) {
                      var that = this;
                      if (this._currentParallelCount < this._maxParallel) {
                          this._currentParallelCount++;
                          childProcess.exec(command, {
                              maxBuffer: 1024 * 1024,
                              encoding: "utf8"
                          }, function(error, stdout, stderr) {
                              that._currentParallelCount--;
                              var stdoutBuffer = Buffer.concat([
                                                                   new Buffer(
                                                                       "Standard output for " + chunkPath +
                                                                       ":" + os.EOL, "utf8"),
                                                                   new Buffer(stdout, "utf8")]),
                                  stderrBuffer = Buffer.concat([
                                                                   new Buffer(
                                                                       "Standard error for " + chunkPath +
                                                                       ":" + os.EOL, "utf8"),
                                                                   new Buffer(stderr, "utf8")]);
                              if (/^\s*(?:WARNING|SEVERE):/m.test(stderr)) {
                                  error = error ||
                                          new Error("There were build warnings or errors when compiling " +
                                                    chunkPath + ".");
                              }
                              that._shellResults.push({
                                                          path: chunkPath,
                                                          stdout: stdoutBuffer,
                                                          stderr: stderrBuffer,
                                                          error: error,
                                                          stdoutPos: 0,
                                                          stderrPos: 0
                                                      });
                          });
                          next();
                      } else {
                          setTimeout(function() {
                              that._writeExec(command, chunkPath, next);
                          }, 250);
                      }
                  };
                  ParallelCompiler.prototype._write = function(chunk, encoding, next) {
                      var that = this, command = this._rjsCommand + " -o \"" + chunk.path + "\"";
                      this._processesRemaining++;
                      setImmediate(function() {
                          that._writeExec(command, chunk.path, next);
                      });
                  };
                  ParallelCompiler.prototype._innerRead = function(bytes) {
                      var that = this,
                          currentResult = this._shellResults.shift(),
                          keepReading = true,
                          currentStart, currentEnd, currentChunk;
                      if (bytes <= 0) {
                          bytes = 1024;
                      }
                      if (typeof currentResult === "undefined") {
                          keepReading = false;
                          if (this._writingFinished && this._processesRemaining === 0) {
                              this.push(null);
                          } else {
                              setTimeout(function() {
                                  that._innerRead(bytes);
                              }, 250);
                          }
                      }
                      while (keepReading) {
                          if (currentResult.stdoutPos < currentResult.stdout.length) {
                              currentStart = currentResult.stdoutPos;
                              currentEnd = Math.min(currentStart + bytes, currentResult.stdout.length);
                              currentChunk = currentResult.stdout.toString("utf8", currentStart, currentEnd);
                              keepReading = this.push(currentChunk, "utf8");
                              currentResult.stdoutPos = currentEnd;
                          } else if (currentResult.stderrPos < currentResult.stderr.length) {
                              currentStart = currentResult.stderrPos;
                              currentEnd = Math.min(currentStart + bytes, currentResult.stderr.length);
                              currentChunk = currentResult.stderr.toString("utf8", currentStart, currentEnd);
                              keepReading = this.push(currentChunk, "utf8");
                              currentResult.stderrPos = currentEnd;
                          } else {
                              if (currentResult.error) {
                                  this.emit("error", currentResult.error);
                              }
                              this._processesRemaining--;
                              currentResult = this._shellResults.shift();
                              if (typeof currentResult === "undefined") {
                                  keepReading = false;
                                  if (this._writingFinished && this._processesRemaining === 0) {
                                      this.push(null);
                                  } else {
                                      setTimeout(function() {
                                          that._innerRead(bytes);
                                      }, 250);
                                  }
                              }
                          }
                      }
                      if (typeof currentResult !== "undefined") {
                          this._shellResults.unshift(currentResult);
                      }
                  };
                  ParallelCompiler.prototype._read = function(bytes) {
                      var that = this;
                      setImmediate(function() {
                          that._innerRead(bytes);
                      });
                  };

                  var javaHome = process.env["JAVA_HOME"];
                  if (!javaHome) {
                      cb(new Error("The JAVA_HOME environment variable has no value.  Ensure that JAVA_HOME is set to the path to the JDK to use."));
                      return;
                  }
                  var jjsPath = path.join(javaHome, "bin",
                                          process.platform === "win32" ? "jjs.exe" : "jjs");
                  try {
                      fs.accessSync(jjsPath, fs.X_OK);
                  } catch (e) {
                      cb(new Error("Cannot execute jjs (Nashorn) at path '" + javaPath +
                                   "'.  Check your JAVA_HOME environment variable -- Java 8 or later is required."));
                      return;
                  }
                  var lastError = "";
                  var rjsCommand = '"' + jjsPath + '" -scripting -classpath "' + closureJarPath +
                                   // Uncomment next line, and comment out the following line, to debug using IntelliJ
                                   // remote debugger
                                   // '" -J-agentlib:jdwp=transport=dt_socket,server=n,address=localhost:5005,suspend=y "' +
                                   '" "' +
                                   path.join(__dirname, "node_modules", "requirejs", "bin", "r.js") + '" -- ';
                  gulp.src('./require-*-build.js', { read: false })
                      .pipe(new ParallelCompiler(rjsCommand))
                      .on("error", function(err) {
                          lastError = err;
                      })
                      .pipe(new stream.Writable({
                          write: function(chunk, encoding, next) {
                              var text = chunk;
                              if (encoding === "buffer") {
                                  text = chunk.toString("utf8");
                              }
                              console.log(text);
                              next();
                          }
                      }))
                      .on('error', function(err) {
                          lastError = err;
                      })
                      .on('finish', function() {
                          if (lastError === "") {
                              cb();
                          } else {
                              cb(new Error(lastError));
                          }
                      });
              });

    gulp.task('_formatMinifiedCode', ['_requirejs-optimize'], function(cb) {
        gulp.src("bin/jscc-+([a-z]).js")
            .pipe(new stream.Transform({
                objectMode: true,
                transform: function(vinylFile, encoding, next) {
                    vinylFile.contents = new Buffer(jformatter.format(vinylFile.contents.toString("utf8")), "utf8");
                    next(null, vinylFile);
                }
            }))
            .pipe(gulp.dest("bin/formatted"))
            .on("error", function(err) {
                cb(new Error(err));
            })
            .on("end", function() {
                cb();
            });
    });

    var testFailures = 0;

    gulp.task('_test', ['_get-rhino', '_get-has-js', '_get-phantom'], function(cb) {
        testFailures = 0;
        var mocha = new Mocha({ ui: "tdd" }).globals(["define", "requirejs"]);
        gulp.src("test/**/*.js", { read: false })
            .pipe(new stream.Writable({
                objectMode: true,
                write: function(chunk, encoding, next) {
                    mocha.addFile(chunk.path);
                    next();
                }
            }))
            .once('error', function(err) {
                cb(err);
            })
            .once('finish', function() {
                mocha.run(function(failures) {
                    testFailures = failures;
                    cb();
                })
            });
    });

    gulp.task('_get-phantom', function(cb) {
        resolvePackageDirectories("phantomjs-prebuilt", function(err, modulePaths) {
            if (err) {
                cb(err);
                return;
            }
            var phantomWorkingDirectory = modulePaths[0];
            childProcess.exec("\"" + process.execPath + "\" install.js", { cwd: phantomWorkingDirectory, stdio: "inherit" },
                              function(error) {
                                  cb(error);
                              });
        });
    });

    var Unlinker = function() {
        stream.Writable.call(this, { objectMode: true });
    };
    Unlinker.prototype = Object.create(stream.Writable.prototype);
    Unlinker.prototype.constructor = Unlinker;
    Unlinker.prototype._serialNumber = 1;
    Unlinker.prototype._checkMemo = async.memoize(function(fullPath, serialNumber, cb) {
        async.setImmediate(cb, null, serialNumber);
    }, function(fullPath) {
        return fullPath;
    });
    Unlinker.prototype._filterError = function(err) {
        if (!err) {
            return null;
        }
        var msg = err.message || err;
        if (typeof msg === "string" && /no such file or directory/i.test(msg)) {
            return null;
        }
        return err;
    };
    Unlinker.prototype._recurse = function(fullPath, cb) {
        var that = this, serial = ++this._serialNumber;
        this._checkMemo(fullPath, serial, function(checkError, returnedSerial) {
            if (returnedSerial !== serial) {
                cb();
                return;
            }
            fs.lstat(fullPath, function(err, stats) {
                if (!err) {
                    if (stats.isDirectory()) {
                        console.log("Processing " + fullPath);
                        fs.readdir(fullPath, function(e, files) {
                            var fileCount = files.length;
                            var currentCountdownError = null;
                            var countdown = function(countdownError) {
                                currentCountdownError = countdownError || currentCountdownError;
                                if (--fileCount < 1) {
                                    console.log("Deleting " + fullPath);
                                    fs.rmdir(fullPath, function(rmdirError) {
                                        var errorToUse = rmdirError || countdownError;
                                        cb(that._filterError(errorToUse));
                                    });
                                }
                            };
                            if (fileCount < 1) {
                                setImmediate(countdown);
                            } else {
                                for (var index = 0; index < files.length; index++) {
                                    that._recurse(path.join(fullPath, files[index]), countdown);
                                }
                            }
                        });
                    } else {
                        console.log("Deleting " + fullPath);
                        fs.unlink(fullPath, function(unlinkError) {
                            cb(that._filterError(unlinkError));
                        });
                    }
                } else {
                    cb(that._filterError(err));
                }
            });
        });
    };
    Unlinker.prototype._write = function(vinylFile, encoding, callback) {
        this._recurse(vinylFile.path, callback);
    };

    gulp.task('_clean', function(cb) {
        var lastError = null;
        gulp.src(["./bin/formatted/jscc-*.js", "./bin/*.map", "./bin/jscc-*.js", "./lib/jscc/parse.js",
                  "./lib/jscc/regex.js", "./externsWithRequire.js", "./bin/**/*~", "./bin/npm-*.js",
                  "./coverage", "./.nyc_output", "./*.lcov"], { read: false, allowEmpty: true })
            .pipe(new Unlinker())
            .on("finish", function() {
                if (lastError) {
                    cb(lastError);
                } else {
                    cb();
                }
            })
            .on("error", function(err) {
                var message = err.message || err;
                if ((typeof message !== "string") || !/no such file or directory/i.test(message)) {
                    lastError = err;
                }
            });
    });

    gulp.task('_distclean', ['_clean'], function() {
        return gulp.src(["./html-documentation", "./jar", "./volo", "./node_modules"],
                        { read: false, allowEmpty: true })
                   .pipe(new Unlinker());
    });

    gulp.task('intellij-pretest', ['_requirejs-optimize', '_get-phantom', '_generate-npm-runners', '_get-rhino'],
              function(cb) {
                  // Process does not otherwise exit under IntelliJ's runner
                  cb();
                  process.exit(0);
              });

    gulp.task('build', ['_requirejs-optimize', '_generate-npm-runners', '_jsdoc'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('test', ['_test'], function(cb) {
        cb();
        process.exit(testFailures);
    });

    gulp.task('default', ['_jsdoc', '_requirejs-optimize', '_generate-npm-runners'], function(cb) {
        cb();
        process.exit(testFailures);
    });

    gulp.task('unminify', ['_requirejs-optimize', '_formatMinifiedCode'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('all', ['_jsdoc', '_requirejs-optimize', '_generate-npm-runners', '_formatMinifiedCode'], function(cb) {
        cb();
        process.exit(testFailures);
    });

    gulp.task('clean', ['_clean'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('distclean', ['_distclean'], function(cb) {
        cb();
        process.exit(0);
    });
}));
