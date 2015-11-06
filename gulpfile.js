(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['gulp', 'gulp-shell', 'rest', 'rest/interceptor/mime', 'rest/interceptor/errorCode', 'path', 'fs',
                'http', 'https', 'url', 'unzip2', 'stream', 'mocha'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('gulp'), require('gulp-shell'), require('rest'), require('rest/interceptor/mime'),
                    require('rest/interceptor/errorCode'), require('path'), require('fs'), require('http'),
                    require('https'), require('url'), require('unzip2'), require('stream'), require('mocha'));
    } else {
        root.gulpfile =
            factory(root.gulp, root.gulpShell, root.rest, root.mime, root.errorCode, root.path, root.fs, root.http,
                    root.https, root.url, root.unzip2, root.stream, root.mocha);
    }
}(this, function(gulp, shell, rest, mime, errorCode, path, fs, http, https, urlUtil, unzip, stream, Mocha) {
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
        var cmd = shell(['node ./bin/_boot_node.js -o ./lib/jscc/parse.js -t ./bin/parser-driver.js ./lib/jscc/parse.par']);
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
        var cmd = shell(['node ./bin/_boot_node.js -o ./lib/jscc/regex.js -t ./bin/parser-driver.js ./lib/jscc/regex.par']);
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
                            fs.createReadStream(destFile)
                              .pipe(unzip.Extract({
                                                      path: path.join(process.cwd(), "jar",
                                                                      filename.substr(0, filename.length - 4))
                                                  }))
                              .on('close', function() {
                                  cb();
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

    gulp.task('_requirejs-optimize', ['_parse.js', '_regex.js', '_get-rhino', '_get-closure'], function(cb) {
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
                gulp.src(path.join(process.cwd(), "jar", path.basename(newestRhinoZip, ".zip"), "**/js.jar"),
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
                            cb(new Error("js.jar was not found in the Rhino directory '" +
                                         path.join(process.cwd(), "jar",
                                                   path.basename(newestRhinoZip, ".zip")) + "'"));
                            return;
                        }
                        var lastError = "";
                        // The path to r.js is due to our local build, which incorporates the code
                        // in https://github.com/jrburke/r.js/pull/861.  If that request ever makes it
                        // into a release, it may be better to go back to using
                        // node_modules/requirejs/bin/r.js instead.
                        var rjsCommand = 'java -server -XX:+TieredCompilation -classpath "' + rhinoJarPath + '"' +
                                         path.delimiter + '"' +
                                         closureJarPath +
                                         '" org.mozilla.javascript.tools.shell.Main -opt -1 "' +
                                         path.join(process.cwd(), "bin", "r.js") +
                                         '" ';
                        gulp.src('./require-*-build.js', { read: false })
                            .pipe(shell(rjsCommand + " -o <%= file.path %>"))
                            .on('error', function(err) {
                                lastError = err;
                            })
                            .on('end', function() {
                                if (lastError === "") {
                                    cb();
                                } else {
                                    cb(new Error(lastError));
                                }
                            });
                    });
            });
    });

    var testFailures = 0;

    gulp.task('_test', ['_parse.js', '_regex.js'], function(cb) {
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

    gulp.task('intellij-pretest', ['_parse.js', '_regex.js'], function(cb) {
        // Process does not otherwise exit under IntelliJ's runner
        cb();
        process.exit(0);
    });

    gulp.task('test', ['_test'], function(cb) {
        cb();
        process.exit(testFailures);
    });

    gulp.task('default', ['_jsdoc', '_requirejs-optimize'], function(cb) {
        cb();
        process.exit(0);
    });

    gulp.task('all', ['_jsdoc', '_requirejs-optimize', '_test'], function(cb) {
        cb();
        process.exit(0);
    });
}));