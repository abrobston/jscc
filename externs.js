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
/**
 * @constructor
 */
java.lang.System = function() {
};
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
 * @param {string=} encoding
 * @constructor
 */
java.io.InputStreamReader = function(inputStream, encoding) {
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
 * @return {java.lang.String}
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
/**
 * @constructor
 */
java.util.logging.Level = function() {
};
/**
 * @type {java.util.logging.Level}
 */
java.util.logging.Level.SEVERE = new java.util.logging.Level();
/**
 * @type {java.util.logging.Level}
 */
java.util.logging.Level.WARNING = new java.util.logging.Level();
/**
 * @type {java.util.logging.Level}
 */
java.util.logging.Level.INFO = new java.util.logging.Level();
/**
 * @type {java.util.logging.Level}
 */
java.util.logging.Level.FINE = new java.util.logging.Level();
/**
 * @type {java.util.logging.Level}
 */
java.util.logging.Level.FINER = new java.util.logging.Level();
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
 * @param {java.util.logging.Level} level
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
// do not actually GULP REMOVE START
var path = {};
/**
 * @param {string} p
 * @return {boolean}
 */
path.isAbsolute = function(p) {
};
/**
 * @param {...(null|string|undefined)} x
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
/**
 * @constructor
 */
var fs = function() {
};
/**
 * @param {string} f
 * @param {(string|Object)=} opt
 * @return {(string|Buffer)}
 */
fs.prototype.readFileSync = function(f, opt) {
};
/**
 * @param {string} f
 * @param {(string|{encoding: ?string, flag: string})} opt
 * @param {function(?string, (string|Buffer))} cb
 */
fs.prototype.readFile = function(f, opt, cb) {
};
/**
 * @param {!string} f
 * @return {!boolean}
 */
fs.prototype.existsSync = function(f) {
};
/**
 * @param {!(string|number)} f
 * @param {!(string|Buffer)} d
 * @param {(string|{encoding: ?string, mode: number, flag: string})=} opt
 */
fs.prototype.writeFileSync = function(f, d, opt) {
};
// do not actually GULP REMOVE END
/**
 * @param {string=} str
 * @param {string=} encoding
 * @constructor
 */
var Buffer = function(str, encoding) {
};
/**
 * @param {?} obj
 * @return {!boolean}
 */
Buffer.isBuffer = function(obj) {
};
/**
 * @param {!Array<Buffer>} list
 * @param {number=} totalLength
 * @return {Buffer}
 */
Buffer.concat = function(list, totalLength) {
};
/**
 * @param {string=} encoding
 * @param {number=} start
 * @param {number=} end
 * @return {string}
 */
Buffer.prototype.toString = function(encoding, start, end) {
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

/**
 * @constructor
 */
var Config = function() {
};
Config.prototype = {
    /**
     * @returns {(XMLHttpRequest|ActiveXObject)}
     */
    createXhr: function() {

    },

    /**
     * @type {?boolean}
     */
    isBuild: false,

    /**
     * @type {?boolean}
     */
    inlineText: false,

    /**
     *
     * @param {string} url
     * @param {string=} protocol
     * @param {string=} hostname
     * @param {string=} port
     * @returns {boolean}
     */
    useXhr: function(url, protocol, hostname, port) {
    },

    /**
     * @type {?string}
     */
    env: ""
};

/**
 * @param {string=} str
 * @constructor
 */
java.lang.StringBuffer = function(str) {
};
/**
 * @param {!*} s
 * @returns {java.lang.StringBuffer}
 */
java.lang.StringBuffer.prototype.append = function(s) {
};
/**
 * @returns {string}
 */
java.lang.StringBuffer.prototype.toString = function() {
};

/**
 * @constructor
 */
java.lang.String = function() {
};
/**
 * @returns {!number}
 */
java.lang.String.prototype.length = function() {
};
/**
 * @param {!number} index
 * @returns {(number|string)}
 */
java.lang.String.prototype.charAt = function(index) {
};
/**
 * @param {!number} beginIndex
 * @param {number=} endIndex
 * @returns {java.lang.String}
 */
java.lang.String.prototype.substring = function(beginIndex, endIndex) {
};
