define(["jscc-parser/lib/jscc/log/logBrowser", "jscc-parser/lib/jscc/enums/LOG_LEVEL"],
       function(logBrowser, LOG_LEVEL) {
           // Define our own custom JS/CC logger so that log messages can be captured
           // and displayed instead of going just to the browser console.  For debugging
           // purposes, errors should continue going to the console, however -- so
           // log messages will go both to the page and to the console.

           var CustomLogger = function() {
               this._inner = logBrowser;
               this._level = LOG_LEVEL.WARN;
           };
           CustomLogger.prototype._inner = null;
           CustomLogger.prototype._level = LOG_LEVEL.WARN;
           CustomLogger.prototype._callback = function() {
           };
           CustomLogger.prototype.setCallback = function(callback) {
               if (typeof callback !== "function") {
                   throw new Error("The parameter to setCallback() must be a function.  Actual type was " +
                                   (typeof callback) + ".");
               }
               this._callback = callback;
           };
           CustomLogger.prototype.fatal = function(msg) {
               if (this._level <= LOG_LEVEL.FATAL) {
                   this._callback(msg, "FATAL");
               }
               this._inner.fatal(msg);
           };
           CustomLogger.prototype.error = function(msg) {
               if (this._level <= LOG_LEVEL.ERROR) {
                   this._callback(msg, "ERROR");
               }
               this._inner.error(msg);
           };
           CustomLogger.prototype.warn = function(msg) {
               if (this._level <= LOG_LEVEL.WARN) {
                   this._callback(msg, "WARN");
               }
               this._inner.warn(msg);
           };
           CustomLogger.prototype.info = function(msg) {
               if (this._level <= LOG_LEVEL.INFO) {
                   this._callback(msg, "INFO");
               }
               this._inner.info(msg);
           };
           CustomLogger.prototype.debug = function(msg) {
               if (this._level <= LOG_LEVEL.DEBUG) {
                   this._callback(msg, "DEBUG");
               }
               this._inner.debug(msg);
           };
           CustomLogger.prototype.trace = function(msg) {
               if (this._level <= LOG_LEVEL.TRACE) {
                   this._callback(msg, "TRACE");
               }
               this._inner.trace(msg);
           };
           CustomLogger.prototype.setLevel = function(level) {
               this._level = level;
               this._inner.setLevel(level);
           };
           
           return new CustomLogger();
       });