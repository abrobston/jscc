/*
 * type {function(?, ?=, ?=)}
 */
//var define = function(name, deps, callback) {
//};
//define.amd = {};
var module = {};
module.exports = {};
java.lang = {};
java.io = {};
/**
 * @constructor
 * @param {string=} file
 */
java.io.File = function(file) {
};
java.util = {};
java.util.logging = {};
java.util.logging.Level = {};
java.util.logging.Level.SEVERE = {};
java.util.logging.Level.WARNING = {};
java.util.logging.Level.INFO = {};
java.util.logging.Level.FINE = {};
java.util.logging.Level.FINER = {};
/**
 * @constructor
 */
java.util.logging.Logger = function() {
};
java.util.logging.Logger.getLogger = function(str) {
    return new java.util.logging.Logger();
};
java.util.logging.Logger.setLevel = function(level) {
};
var readFile = function(fileName) {
};
var quit = function(exitCode) {
};
var print = function(msg) {
};
//var require = function(path) {
//};
var process = {};
process.stdin = {};
/**
 * @param {string} enc
 */
process.stdin.setEncoding = function(enc) {
};
/**
 * @param {string} e
 * @param {Function} cb
 */
process.stdin.on = function(e, cb) {
};
process.stdout = {};
/**
 * @param {string} text
 * @param {string} enc
 */
process.stdout.write = function(text, enc) {
};
/**
 * @param {string} e
 * @param {Function} cb
 */
process.stdout.on = function(e, cb) {
};
process.stdout.end = function() {
};
/**
 * @type {?string}
 */
var __dirname = "";