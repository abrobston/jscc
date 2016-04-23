(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['gulp', 'gulp-shell', 'rest', 'rest/interceptor/mime', 'rest/interceptor/errorCode', 'path', 'fs',
                'http', 'https', 'url', 'stream', 'mocha', 'extract-zip', 'buffer', 'os', 'jformatter',
                'child_process'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('gulp'), require('gulp-shell'), require('rest'), require('rest/interceptor/mime'),
                    require('rest/interceptor/errorCode'), require('path'), require('fs'), require('http'),
                    require('https'), require('url'), require('stream'), require('mocha'), require('extract-zip'),
                    Buffer,
                    require('os'), require('jformatter'), require('child_process'));
    } else {
        root.gulpfile =
            factory(root.gulp, root.gulpShell, root.rest, root.mime, root.errorCode, root.path, root.fs, root.http,
                    root.https, root.url, root.stream, root.mocha, root.extractZip, root.buffer, root.os,
                    root.jformatter, root.child_process);
    }
}(this, function(gulp, shell, rest, mime, errorCode, path, fs, http, https, urlUtil, stream, Mocha, extract, Buffer, os,
                 jformatter, childProcess) {
    gulp.task('_jsdoc', ['_parse.js', '_regex.js'], function(cb) {
        var cmd = shell(['jsdoc -c ./conf.json']);
        var e = null;
        cmd.on('error', function(err) {
            e = err;
        });
        cmd.on('end', function() {
            if (e) {
                cb(e);
            } else {
                cb();
            }
        });
        gulp.src('')
            .pipe(cmd);
    });

    gulp.task('_parse.js', function(cb) {
        var cmd = shell(
            ['node ./bin/_boot_node.js -o ./lib/jscc/parse.js -t ./lib/jscc/template/parser-driver.js.txt ./lib/jscc/parse.par']);
        var e = null;
        cmd.on('error', function(err) {
            e = err;
        });
        cmd.on('end', function() {
            if (e) {
                cb(e);
            } else {
                cb();
            }
        });
        gulp.src('')
            .pipe(cmd);
    });
    gulp.task('_regex.js', function(cb) {
        var cmd = shell(
            ['node ./bin/_boot_node.js -o ./lib/jscc/regex.js -t ./lib/jscc/template/parser-driver.js.txt ./lib/jscc/regex.par']);
        var e = null;
        cmd.on('error', function(err) {
            e = err;
        });
        cmd.on('end', function() {
            if (e) {
                cb(e);
            } else {
                cb();
            }
        });
        gulp.src('')
            .pipe(cmd);
    });

    gulp.task('_externsWithRequire.js', function(cb) {
        var bufferOutput = false,
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
          .pipe(fs.createWriteStream('./externsWithRequire.js'))
          .on('finish', cb)
          .on('error', cb);
    });

    function downloadAndUnzip(filename, url, cb) {
        var destFile = path.join(process.cwd(), "jar", filename);
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

    gulp.task('_urequire-optimize', ['_parse.js', '_regex.js'], function(cb) {
        var urequire = require('urequire');
        var done = false;
        var error = null;
        var config = {
            bundle: {
                path: "./lib",
                filez: ["*.js", "jscc/*.js", "jscc/io/ioNode.js", "jscc/log/logNode.js", "jscc/bitset/BitSet32.js",
                        "jscc/classes/*.js", "jscc/enums/*.js"],
                name: "jscc",
                main: "jscc",
                dependencies: {
                    replace: {
                        "jscc/io/ioNode": "jscc/io/io",
                        "jscc/log/logNode": "jscc/log/log",
                        "jscc/bitset/BitSet32": "jscc/bitset"
                    }
                }
            },
            build: {
                dstPath: "./bin/jscc-node.js",
                template: "combined",
                verbose: true,
                optimize: false,
                afterBuild: [function(errors) {
                    if (typeof errors !== 'undefined' && errors !== true) {
                        error = errors;
                    }
                    done = true;
                }]
            }
        };
        var builder = new urequire.BundleBuilder([config]);
        builder.buildBundle();
        var waitForDone = function waitForDone() {
            if (done) {
                if (error !== null) {
                    cb(new Error(error));
                    process.exit(1);
                } else {
                    cb();
                }
            } else {
                setImmediate(waitForDone);
            }
        };
        waitForDone();
    });

    gulp.task('_requirejs-optimize', ['_parse.js', '_regex.js', '_get-rhino', '_get-closure', '_externsWithRequire.js'],
              function(cb) {
                  var closureJarPath = path.join(process.cwd(), "jar", "closure-latest", "compiler.jar");
                  var newestRhinoZip = "";
                  var newestRhinoZipDate = new Date(0);
                  gulp.src("./jar/*rhino*.zip", { read: false })
                      .pipe(new stream.Writable({
                          objectMode: true,
                          write: function(vinylFile, encoding, next) {
                              fs.stat(vinylFile.path, function(err, stats) {
                                  if (!err && (stats.birthtime > newestRhinoZipDate)) {
                                      newestRhinoZip = vinylFile.path;
                                      newestRhinoZipDate = stats.birthtime;
                                  }
                                  next();
                              });
                          }
                      }))
                      .on('finish', function() {
                          if (newestRhinoZip == "") {
                              cb(new Error("No Rhino zip files were found; something may be wrong with this gulpfile."));
                              return;
                          }
                          var rhinoJarPath = "";
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
                                      encoding: "buffer"
                                  }, function(error, stdout, stderr) {
                                      that._currentParallelCount--;
                                      var stdoutBuffer = Buffer.concat([
                                                                           Buffer.from("Standard output for " + chunkPath +
                                                                                       ":" + os.EOL, "utf8"),
                                                                           stdout]),
                                          stderrBuffer = Buffer.concat([
                                                                           Buffer.from("Standard error for " + chunkPath +
                                                                                       ":" + os.EOL, "utf8"),
                                                                           stderr]);
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

                          gulp.src(
                              path.join(process.cwd(), "jar", path.basename(newestRhinoZip, ".zip"), "**/rhino*.jar"),
                              { read: false })
                              .pipe(new stream.Writable({
                                  objectMode: true,
                                  write: function(vinylFile, encoding, next) {
                                      rhinoJarPath = vinylFile.path;
                                      next();
                                  }
                              }))
                              .on('finish', function() {
                                  if (rhinoJarPath == "") {
                                      cb(new Error("rhino*.jar was not found in the Rhino directory '" +
                                                   path.join(process.cwd(), "jar",
                                                             path.basename(newestRhinoZip, ".zip")) + "'"));
                                      return;
                                  }
                                  var javaHome = process.env["JAVA_HOME"];
                                  if (!javaHome) {
                                      cb(new Error("The JAVA_HOME environment variable has no value.  Ensure that JAVA_HOME is set to the path to the JDK to use."));
                                      return;
                                  }
                                  var javaPath = path.join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");
                                  try {
                                      fs.accessSync(javaPath, fs.X_OK);
                                  } catch (e) {
                                      cb(new Error("Cannot execute java at path '" + javaPath + "'.  Check your JAVA_HOME environment variable."));
                                      return;
                                  }
                                  var lastError = "";
                                  var rjsCommand = '"' + javaPath + '" -server -XX:+TieredCompilation -classpath "' + rhinoJarPath +
                                                   '"' +
                                                   path.delimiter + '"' +
                                                   closureJarPath +
                                                   '" org.mozilla.javascript.tools.shell.Main -opt -1 "' +
                                                   path.join(process.cwd(), "node_modules", "requirejs", "bin",
                                                             "r.js") +
                                                   '" ';
                                  gulp.src('./require-*-build.js', { read: false })
                                      .pipe(new ParallelCompiler(rjsCommand))
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

    gulp.task('_test', ['_requirejs-optimize', '_get-phantom'], function(cb) {
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
        var phantomWorkingDirectory = path.join(__dirname, "node_modules", "phantomjs-prebuilt");
        childProcess.exec("\"" + process.execPath + "\" install.js", { cwd: phantomWorkingDirectory, stdio: "inherit" }, function(error) {
            cb(error);
        });
    });

    gulp.task('intellij-pretest', ['_requirejs-optimize', '_get-phantom'], function(cb) {
        // Process does not otherwise exit under IntelliJ's runner
        cb();
        process.exit(0);
    });

    gulp.task('test', ['_test'], function(cb) {
        cb();
        process.exit(testFailures);
    });

    gulp.task('urequire', ['_urequire-optimize'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('default', ['_requirejs-optimize', '_test'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('unminify', ['_requirejs-optimize', '_formatMinifiedCode'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('all', ['_jsdoc', '_requirejs-optimize', '_test', '_formatMinifiedCode'], function(cb) {
        cb();
        process.exit(0);
    });
}));
