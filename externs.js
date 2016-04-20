/**
 * @param {!string} str
 * @return {?}
 */
var requireLib = function(str) {
};
var module = {};
module.exports = {};
var Java = {};
/**
 * @param {string} str
 * @return {*}
 */
Java.type = function(str) {
};
java.lang = {};
java.lang.System = {};
/**
 * @type {java.io.InputStream}
 */
java.lang.System.in = null;
/**
 * @type {java.io.PrintStream}
 */
java.lang.System.out = null;
/**
 * @type {java.io.PrintStream}
 */
java.lang.System.err = null;
/**
 * @return {!string}
 */
java.lang.System.lineSeparator = function() {
};
/**
 * @param {!number} exitCode
 */
java.lang.System.exit = function(exitCode) {
};
/**
 * @param {string=} str
 * @constructor
 */
java.lang.StringBuilder = function(str) {
};
/**
 * @param {?} item
 * @return {java.lang.StringBuilder}
 */
java.lang.StringBuilder.prototype.append = function(item) {
};
/**
 * @return {string}
 */
java.lang.StringBuilder.prototype.toString = function() {
};
java.io = {};
/**
 * @constructor
 */
java.io.InputStream = function() {
};
/**
 * @param {java.io.InputStream} inputStream
 * @constructor
 */
java.io.InputStreamReader = function(inputStream) {
};
/**
 * @constructor
 * @param {string=} file
 */
java.io.File = function(file) {
};
/**
 * @return {!boolean}
 */
java.io.File.prototype.exists = function() {
};
/**
 * @return {!boolean}
 */
java.io.File.prototype.isFile = function() {
};
/**
 * @return {!boolean}
 */
java.io.File.prototype.canRead = function() {
};
/**
 * @param {java.io.File} file
 * @constructor
 */
java.io.FileReader = function(file) {
};
java.io.FileReader.prototype.close = function() {
};
/**
 * @constructor
 * @param {(java.io.FileReader|java.io.InputStreamReader)} reader
 */
java.io.BufferedReader = function(reader) {
};
/**
 * @return {string}
 */
java.io.BufferedReader.prototype.readLine = function() {
};
java.io.BufferedReader.prototype.close = function() {
};
/**
 * @return {{forEachOrdered: function(function(string))}}
 */
java.io.BufferedReader.prototype.lines = function() {
};
/**
 * @param {string} str
 * @constructor
 */
java.io.FileWriter = function(str) {
};
java.io.FileWriter.prototype.close = function() {
};
/**
 * @param {java.io.FileWriter} writer
 * @constructor
 */
java.io.BufferedWriter = function(writer) {
};
java.io.BufferedWriter.prototype.close = function() {
};
/**
 * @constructor
 */
java.io.PrintStream = function() {
};
/**
 * @param {(java.io.BufferedWriter|java.io.PrintStream|string)} buffered
 * @constructor
 */
java.io.PrintWriter = function(buffered) {
};
java.io.PrintWriter.prototype.close = function() {
};
/**
 * @param {string} str
 */
java.io.PrintWriter.prototype.print = function(str) {
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
/**
 * @param {!string} str
 * @returns {java.util.logging.Logger}
 */
java.util.logging.Logger.getLogger = function(str) {
    return new java.util.logging.Logger();
};
/**
 * @param {?} level
 */
java.util.logging.Logger.prototype.setLevel = function(level) {
};
/**
 * @return {{toString: function():string}}
 */
java.util.logging.Logger.prototype.getLevel = function() {
};
/**
 * @param {!java.util.logging.ConsoleHandler} handler
 */
java.util.logging.Logger.prototype.addHandler = function(handler) {
};
/**
 * @constructor
 */
java.util.logging.ConsoleHandler = function() {
};
/**
 * @param {?} javaLevel
 */
java.util.logging.ConsoleHandler.prototype.setLevel = function(javaLevel) {
};
/**
 * @constructor
 */
java.util.BitSet = function() {
};
/**
 * @returns {!number}
 */
java.util.BitSet.prototype.cardinality = function() {
};
/**
 * @param {!number} index
 * @returns {!boolean}
 */
java.util.BitSet.prototype.get = function(index) {
};
/**
 * @param {!number} index
 * @param {!boolean} state
 */
java.util.BitSet.prototype.set = function(index, state) {
};
var readFile = function(fileName) {
};
var quit = function(exitCode) {
};
/**
 * @param {number=} exitCode
 */
var exit = function(exitCode) {
};
var print = function(msg) {
};
var process = {};
/**
 * @return {string}
 */
process.cwd = function() {};
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
var path = {};
/**
 * @param {string} p
 * @return {boolean}
 */
path.isAbsolute = function(p) {
};
/**
 * @param {...string} x
 * @return {string}
 */
path.join = function(x) {
};
/**
 * @param {string} p
 * @return {{root: string, dir: string, base: string, ext: string, name: string}}
 */
path.parse = function(p) {
};
/**
 * @param {string} p
 * @return {string}
 */
path.dirname = function(p) {
};
var fs = {};
/**
 * @param {string} f
 * @param {string=} opt
 * @return {(string|Buffer)}
 */
fs.readFileSync = function(f, opt) {
};
/**
 * @param {string} f
 * @param {(string|{encoding: ?string, flag: string})} opt
 * @param {function(?string, (string|Buffer))} cb
 */
fs.readFile = function(f, opt, cb) {
};
/**
 * @param {!string} f
 * @return {!boolean}
 */
fs.existsSync = function(f) {
};
/**
 * @param {!(string|number)} f
 * @param {!(string|Buffer)} d
 * @param {(string|{encoding: ?string, mode: number, flag: string})=} opt
 */
fs.writeFileSync = function(f, d, opt) {
};

var Components = {};
Components.interfaces = {};
Components.interfaces.nsIFileInputStream = {};
Components.interfaces.nsIConverterInputStream = {};
Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER = "";
Components.classes = {};
/**
 * @param {?} stream
 * @return {{init: function(?, (number|string), (number|boolean), (boolean|string)), available: function():boolean, readString: function(boolean, Object), close: function()}}
 */
Components.classes.createInstance = function(stream) {
};
Components.utils = {};
/**
 * @param {string} str
 */
Components.utils.import = function(str) {
};
var FileUtils = {};
/**
 * @param {string} str
 * @constructor
 */
FileUtils.File = function(str) {
};
