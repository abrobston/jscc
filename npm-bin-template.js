#!/usr/bin/env node
var runner = "##RUNNER##",
    child_process = require("child_process"),
    path = require("path"),
    execName = "jscc-" + runner + (process.platform === "win32" ? ".bat" : ".sh"),
    args = process.argv.slice(2);
try {
    child_process.execSync("\"" + path.join(__dirname, execName) + "\" " + args.join(" "), { stdio: "inherit" });
    process.exit(0);
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
