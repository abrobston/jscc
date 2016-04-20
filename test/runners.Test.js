suite("runners", function() {
    var path = require('path');
    var child_process = require('child_process');
    var os = require('os');
    var temp = require('temp').track();

    if (typeof requirejs === 'undefined') {
        requirejs = require('requirejs');
        requirejs.config({
                             baseUrl: path.join(__dirname, '../lib'),
                             nodeRequire: require,
                             packages: [
                                 {
                                     name: "squirejs",
                                     location: "../node_modules/squirejs",
                                     main: "src/Squire"
                                 }
                             ],
                             paths: {
                                 "sinon": "../node_modules/sinon/pkg/sinon",
                                 "jscc/bitset": "jscc/bitset/BitSet32",
                                 "jscc/io/io": "jscc/io/ioNode",
                                 "jscc/log/log": "jscc/log/logNode",
                                 "text": "../node_modules/requirejs-text/text"
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
                 this.timeout(30000);
                 var outFilePath = path.join(tempDir, "output-" + platformName + ".js");
                 var srcFilePath = path.join(__dirname, "../samples/xpl.par");
                 var runnerPath = path.join(__dirname, "../bin",
                                            "jscc-" + platformName + (os.platform() === "win32" ? ".bat" : ".sh"));
                 var command = "\"" + runnerPath + "\" --src_file \"" + srcFilePath + "\" --out_file \"" + outFilePath +
                               "\" --logLevel INFO";
                 child_process.exec(command, { timeout: 28000, stdio: "inherit" }).on("exit", function(code, signal) {
                     assert.isTrue(code === null || code === 0, "There was a non-zero exit code");
                     assert.isNull(signal);
                     done();
                 });
             });

        test("Runner for " + platformName + " has a non-zero exit code when there is an error",
             function(done) {
                 this.timeout(30000);
                 var outFilePath = path.join(tempDir, "output-" + platformName + ".js");
                 var srcFilePath = path.join(__dirname, "../samples/xpl.par.invalid");
                 var runnerPath = path.join(__dirname, "../bin",
                                            "jscc-" + platformName + (os.platform() === "win32" ? ".bat" : ".sh"));
                 var command = "\"" + runnerPath + "\" --src_file \"" + srcFilePath + "\" --out_file \"" + outFilePath +
                               "\" --logLevel INFO";
                 child_process.exec(command, { timeout: 28000, stdio: "inherit" }).on("exit", function(code, signal) {
                     assert.isNumber(code);
                     assert.notStrictEqual(code, 0);
                     assert.isNull(signal);
                     done();
                 });
             });
    });
});