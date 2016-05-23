var gulp = require("gulp"),
    less = require("gulp-less"),
    path = require("path"),
    childProcess = require("child_process"),
    stream = require("stream"),
    fs = require("fs"),
    requirejs = require("requirejs"),
    temp = require("temp").track(),
    handlebars = require("handlebars"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefix = require("gulp-autoprefixer"),
    cleanCss = require("gulp-clean-css"),
    async = require("async");

function getNpmBinPath(basename) {
    return path.join(__dirname, "node_modules", ".bin", process.platform === "win32" ? (basename + ".cmd") : basename);
}

function ensureDir(fullPath, callback) {
    var relative = path.relative(__dirname, fullPath).split(path.sep);
    var current = __dirname;

    function next() {
        current = path.join(current, relative.shift());
        if (relative.length > 0) {
            fs.mkdir(current, next);
        } else {
            fs.mkdir(current, callback);
        }
    }

    next();
}

gulp.task("_ensure-buildTemp", function(cb) {
    ensureDir(path.join(__dirname, "buildTemp"), function() {
        cb();
    });
});

gulp.task("_less", function() {
    return gulp.src("./stylesheets/less/main-*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
                       paths: [path.join(__dirname, "node_modules", "bootstrap", "less"),
                               path.join(__dirname, "stylesheets", "less")]
                   }))
        .pipe(autoprefix())
        .pipe(cleanCss())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./stylesheets"));
});

gulp.task("_copy-module-files", ["_ensure-buildTemp"], function() {
    return gulp.src(
        ["./node_modules/requirejs/require.js",
         "./node_modules/jscc-parser/lib/jscc/template/parser-driver.js.txt"])
        .pipe(gulp.dest("./buildTemp"));
});

gulp.task("_convert-from-common", ["_ensure-buildTemp"], function() {
    return gulp.src(["./node_modules/browser-cookies", "./node_modules/prismjs"], { read: false })
        .pipe(new stream.Writable(
            {
                objectMode: true,
                write: function(vinylFile, encoding, next) {
                    temp.mkdir("common", function(err, dirPath) {
                        if (err) {
                            next(err);
                            return;
                        }
                        childProcess.exec("\"" + getNpmBinPath("r.js") +
                                          "\" -convert \"" + vinylFile.path + "\" \"" + dirPath + "\"",
                                          function(error, stdout, stderr) {
                                              if (stdout) {
                                                  console.log(stdout);
                                              }
                                              if (stderr) {
                                                  console.error(stderr);
                                              }
                                              if (error) {
                                                  next(error);
                                                  return;
                                              }

                                              gulp.src(path.join(dirPath, "**", "*.js"))
                                                  .pipe(gulp.dest(path.join(__dirname, "buildTemp",
                                                                            path.basename(vinylFile.path))))
                                                  .on("finish", function(e) {
                                                      next(e);
                                                  });
                                          });
                    });
                }
            }
        ));
});

gulp.task("_precompile-templates", ["_ensure-buildTemp"], function() {
    return gulp.src(["./partial/*.hbs", "./pages/**/*.hbs"], { read: false })
        .pipe(new stream.Writable({
            objectMode: true,
            write: function(vinylFile, encoding, next) {
                var outFile = path.basename(vinylFile.path, ".hbs") + ".js",
                    workDir = path.normalize(path.join(__dirname, "buildTemp", "template",
                                                       path.dirname(path.relative(__dirname, vinylFile.path)))),
                    switches = path.basename(workDir) === "partial" ?
                        " -a -p -e hbs -k resolve -k code " :
                        " -a -e hbs -k resolve -k code ";
                ensureDir(workDir, function() {
                    childProcess.exec(
                        "\"" + getNpmBinPath("handlebars") + "\"" + switches + " \"" +
                        path.relative(workDir, vinylFile.path) +
                        "\" -f \"" + outFile + "\" --map \"" + outFile + ".map\"",
                        {
                            cwd: workDir
                        },
                        function(error, stdout, stderr) {
                            if (stdout) {
                                console.log(stdout);
                            }
                            if (stderr) {
                                console.log(stderr);
                            }
                            if (error) {
                                next(error);
                                return;
                            }
                            next();
                        });
                });
            }
        }));
});

gulp.task("_precompile-pages", ["_precompile-templates"], function(cb) {
    var partialModules = ["template/resolve", "template/code", "template/doc-page"];
    gulp.src("./buildTemp/template/partial/*.js", { read: false })
        .pipe(new stream.Writable({
            objectMode: true,
            write: function(vinylFile, encoding, next) {
                partialModules.push(
                    path.relative(path.join(__dirname, "buildTemp"), vinylFile.path).replace(/\.js$/, "").replace(
                        /^[\.\/]*/, ""));
                next();
            }
        }))
        .on("finish", function(err) {
            if (err) {
                cb(err);
                return;
            }
            fs.readFile(path.join(__dirname, "partial", "documentation-table-of-contents.json"), { encoding: "utf8" },
                        function(e, data) {
                            if (e) {
                                cb(e);
                                return;
                            }
                            var documentationTableOfContentsJson = JSON.parse(data);
                            var req = requirejs.config({
                                                           context: "_precompile-pages",
                                                           baseUrl: path.join(__dirname, "buildTemp"),
                                                           packages: [{
                                                               "name": "lodash",
                                                               "location": "../node_modules/lodash-amd"
                                                           }],
                                                           paths: {
                                                               "handlebars.runtime": "../node_modules/handlebars/dist/handlebars.runtime",
                                                               "template/resolve": "../javascripts/template/resolve",
                                                               "template/code": "../javascripts/template/code",
                                                               "template/trim-block": "../javascripts/template/trim-block",
                                                               "template/doc-page": "../javascripts/template/doc-page"
                                                           }
                                                       });
                            gulp.src("./buildTemp/template/pages/**/*.js", { read: false })
                                .pipe(new stream.Transform({
                                    objectMode: true,
                                    transform: function(vinylFile, encoding, next) {
                                        var moduleName = path.relative(path.join(__dirname, "buildTemp"),
                                                                       vinylFile.path).replace(
                                            /\.js$/, "").replace(/^[\.\/]*/, "");
                                        req([moduleName].concat(partialModules), function(current) {
                                            vinylFile.path =
                                                path.join(path.dirname(vinylFile.path),
                                                          path.basename(vinylFile.path, ".js") + ".html");
                                            var html = current({
                                                                   pageUrl: path.relative(
                                                                       path.join(__dirname, "buildTemp", "template",
                                                                                 "pages"),
                                                                       vinylFile.path).replace(/\\/g, "/"),
                                                                   documentation: /^(|.*[\\\/])documentation(|[\\\/].*)$/i.test(
                                                                       vinylFile.path),
                                                                   demo: path.basename(vinylFile.path, ".html") ===
                                                                         "demo",
                                                                   documentationTableOfContents: documentationTableOfContentsJson
                                                               });
                                            vinylFile.contents = new Buffer(html, "utf8");
                                            next(null, vinylFile);
                                        });
                                    }
                                }))
                                .pipe(gulp.dest("./"))
                                .on("finish", function(e) {
                                    cb(e);
                                });
                        });
        });
});

gulp.task("_generate-almond-start", ["_ensure-buildTemp"], function(cb) {
    fs.writeFile(path.join(__dirname, "buildTemp", "almond-start.txt"),
                 "(function() {\n", { encoding: "utf8" }, cb);
});

gulp.task("_generate-almond-end", ["_ensure-buildTemp"], function(cb) {
    fs.readFile(path.join(__dirname, "javascripts", "config.js"), { encoding: "utf8" }, function(err, data) {
        if (err) {
            cb(err);
            return;
        }
        async.each(["main", "demo"], function(name, callback) {
            var outData = data + "\nrequire([\"" + name + "\"]);\n})();";
            fs.writeFile(path.join(__dirname, "buildTemp", "almond-end-require-" + name + ".txt"), outData,
                         { encoding: "utf8" }, callback);
        }, cb);
    });
});

gulp.task("_optimize-javascript",
          ["_copy-module-files", "_convert-from-common", "_precompile-templates", "_generate-almond-start",
           "_generate-almond-end"],
          function() {
              return gulp.src(["./javascripts/build*.json"], { read: false })
                  .pipe(new stream.Writable({
                      objectMode: true,
                      write: function(vinylFile, encoding, next) {
                          childProcess.exec("\"" + getNpmBinPath("r.js") + "\" -o " +
                                            path.relative(path.join(__dirname, "javascripts"), vinylFile.path), {
                                                cwd: path.join(__dirname, "javascripts")
                                            }, function(error, stdout, stderr) {
                              if (stdout) {
                                  console.log(stdout);
                              }
                              if (stderr) {
                                  console.error(stderr);
                              }
                              next(error);
                          });
                      }
                  }));
          });

gulp.task("default",
          ["_less", "_copy-module-files", "_convert-from-common", "_precompile-pages", "_optimize-javascript"],
          function(cb) {
              cb();
              process.exit(0);
          });