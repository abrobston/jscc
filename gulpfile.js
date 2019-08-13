const { series, parallel, src, dest } = require("gulp"),
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
    var relative = path.relative(__dirname, fullPath)
        .split(path.sep);
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

function _ensureBuildTemp(cb) {
    ensureDir(path.join(__dirname, "buildTemp"), function() {
        cb();
    });
}

function _less() {
    return src("./stylesheets/less/main-*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, "node_modules", "bootstrap", "less"),
                               path.join(__dirname, "stylesheets", "less")]
        }))
        .pipe(autoprefix())
        .pipe(cleanCss())
        .pipe(sourcemaps.write("./"))
        .pipe(dest("./stylesheets"));
}

function _copyModuleFiles() {
    return src(
        ["./node_modules/requirejs/require.js",
         "./node_modules/jscc-parser/lib/jscc/template/parser-driver-js.txt"])
        .pipe(dest("./buildTemp"));
}

function _convertFromCommon() {
    return src(["./node_modules/browser-cookies", "./node_modules/prismjs"], { read: false })
        .pipe(new stream.Writable({
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

                            src(path.join(dirPath, "**", "*.js"))
                                .pipe(dest(path.join(__dirname, "buildTemp",
                                    path.basename(vinylFile.path))))
                                .on("finish", function(e) {
                                    next(e);
                                });
                        });
                });
            }
        }));
}

function _precompileTemplates() {
    return src(["./partial/*.hbs", "./pages/**/*.hbs"], { read: false })
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
                        "\" -f \"" + outFile + "\" --map \"" + outFile + ".map\"", {
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
}

function _precompilePages(cb) {
    var partialModules = ["template/resolve", "template/code", "template/doc-page"];
    src("./buildTemp/template/partial/*.js", { read: false })
        .pipe(new stream.Writable({
            objectMode: true,
            write: function(vinylFile, encoding, next) {
                partialModules.push(
                    path.relative(path.join(__dirname, "buildTemp"), vinylFile.path)
                    .replace(/\.js$/, "")
                    .replace(
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
                        context: "_precompilePages",
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
                    src("./buildTemp/template/pages/**/*.js", { read: false })
                        .pipe(new stream.Transform({
                            objectMode: true,
                            transform: function(vinylFile, encoding, next) {
                                var moduleName = path.relative(path.join(__dirname, "buildTemp"),
                                        vinylFile.path)
                                    .replace(
                                        /\.js$/, "")
                                    .replace(/^[\.\/]*/, "");
                                req([moduleName].concat(partialModules), function(current) {
                                    vinylFile.path =
                                        path.join(path.dirname(vinylFile.path),
                                            path.basename(vinylFile.path, ".js") + ".html");
                                    var html = current({
                                        pageUrl: path.relative(
                                                path.join(__dirname, "buildTemp", "template",
                                                    "pages"),
                                                vinylFile.path)
                                            .replace(/\\/g, "/"),
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
                        .pipe(dest("./"))
                        .on("finish", function(e) {
                            cb(e);
                        });
                });
        });
}

function _generateAlmondStart(cb) {
    fs.writeFile(path.join(__dirname, "buildTemp", "almond-start.txt"),
        "(function() {\n", { encoding: "utf8" }, cb);
}

function _generateAlmondEnd(cb) {
    fs.readFile(path.join(__dirname, "javascripts", "config.js"), { encoding: "utf8" }, function(err, data) {
        if (err) {
            cb(err);
            return;
        }
        async.each(["main", "demo"], function(name, callback) {
            var outData = data + "\nrequire([\"" + name + "\"]);\n})();";
            fs.writeFile(path.join(__dirname, "buildTemp", "almond-end-require-" + name + ".txt"), outData, { encoding: "utf8" }, callback);
        }, cb);
    });
}

function _optimizeJavascript() {
    return src(["./javascripts/build*.json"], { read: false })
        .pipe(new stream.Writable({
            objectMode: true,
            write: function(vinylFile, encoding, next) {
                childProcess.exec("\"" + getNpmBinPath("r.js") + "\" -o " +
                    path.relative(path.join(__dirname, "javascripts"), vinylFile.path), {
                        cwd: path.join(__dirname, "javascripts")
                    },
                    function(error, stdout, stderr) {
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
}

exports.default =
    parallel(_less,
        series(_ensureBuildTemp,
            parallel(_copyModuleFiles,
                _convertFromCommon,
                series(_precompileTemplates,
                    _precompilePages),
                _generateAlmondStart,
                _generateAlmondEnd),
            _optimizeJavascript));
