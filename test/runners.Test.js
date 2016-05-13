suite("runners", function() {
    var path = require('path');
    var child_process = require('child_process');
    var os = require('os');
    var temp = require('temp').track();

    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../lib/jscc'),
                             nodeRequire: require,
                             packages: [
                                 {
                                     name: "squirejs",
                                     location: "../../node_modules/squirejs",
                                     main: "src/Squire"
                                 }
                             ],
                             paths: {
                                 "sinon": "../../node_modules/sinon/pkg/sinon",
                                 "text": "../../node_modules/requirejs-text/text"
                             }
                         });
    }

    var chai = requirejs('chai');
    var assert = chai.assert;
    var tempDir;
    setup("setup", function() {
        tempDir = temp.mkdirSync();
    });

    teardown("teardown", function() {
        temp.cleanupSync();
    });

    [
        "browser",
        "nashorn",
        "node",
        "rhino"
    ].forEach(function(platformName) {
        test("Runner for " + platformName + " executes without errors",
             function(done) {
                 this.timeout(40000);
                 var outFilePath = path.join(tempDir, "output-" + platformName + ".js");
                 var srcFilePath = path.join(__dirname, "../samples/xpl.par");
                 var runnerPath = path.join(__dirname, "../bin",
                                            "jscc-" + platformName + (os.platform() === "win32" ? ".bat" : ".sh"));
                 var command = "\"" + runnerPath + "\" --src_file \"" + srcFilePath + "\" --out_file \"" + outFilePath +
                               "\" --logLevel INFO";
                 child_process.exec(command, { timeout: 38000 }, function(error, stdout, stderr) {
                     if (error) {
                         console.error(error.message);
                     }
                     if (stdout) {
                         console.log("Standard output:");
                         console.log(stdout);
                     }
                     if (stderr) {
                         console.log("Standard error:");
                         console.log(stderr);
                     }
                     done(error);
                 }); /*.on("exit", function(code, signal) {
                     assert.isTrue(code === null || code === 0, "There was a non-zero exit code");
                     assert.isNull(signal);
                     done();
                 }); */
             });

        test("Runner for " + platformName + " has a non-zero exit code when there is an error",
             function(done) {
                 this.timeout(40000);
                 try {
                 var outFilePath = path.join(tempDir, "output-" + platformName + ".js");
                 var srcFilePath = path.join(__dirname, "../samples/xpl.par.invalid");
                 var runnerPath = path.join(__dirname, "../bin",
                                            "jscc-" + platformName + (os.platform() === "win32" ? ".bat" : ".sh"));
                 var command = "\"" + runnerPath + "\" --src_file \"" + srcFilePath + "\" --out_file \"" + outFilePath +
                               "\" --logLevel INFO";
                 child_process.exec(command, { timeout: 38000, stdio: "inherit" }).on("exit", function(code, signal) {
                     try {
			 assert.isNull(signal);
			 assert.isNumber(code);
			 assert.notStrictEqual(code, 0);
                     } catch (e) {
                         done(e);
                         return;
                     }
                     done();
                 });
                 } catch (e) {
                     done(e);
                 }
             });
    });
});
