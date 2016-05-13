/*
 * Universal module definition for the Node version of the io module.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', '../global'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccio = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {jscc.io}
   */
  function(require, others) {
      //>>excludeStart("closure", pragmas.closure);
      var jscc = {};
      //>>excludeEnd("closure");
      var global = require("../global"), thisUtil, thisFs, thisPath;

      //>>excludeStart("amdclean", pragmas.amdclean);
      /*
      //>>excludeEnd("amdclean");
      thisUtil = util;
      thisFs = fs;
      thisPath = path;
      //>>excludeStart("amdclean", pragmas.amdclean);
      */
      thisUtil = require('util');
      thisFs = require('fs');
      thisPath = require('path');
      //>>excludeEnd("amdclean");

      /**
       * @constructor
       * @implements {jscc.io}
       */
      jscc.ioNode = function() {
      };

      /**
       * @inheritDoc
       */
      jscc.ioNode.prototype.read_all_input = function(options) {
          var filename = "";
          var async = false;
          /**
           * @param {string} chunk
           * @param {string=} encoding
           * @param {Function=} next
           */
          var chunkCallback = function(chunk, encoding, next) {
          };
          var endCallback = function() {
          };
          if (options) {
              if (typeof options === "string") {
                  filename = options;
              } else if (typeof options === "function") {
                  // amdclean
                  chunkCallback = /** @type {function(string)} */ (options);
                  async = true;
              } else if (typeof options === "object") {
                  if (typeof options.filename === "string") {
                      filename = options.filename;
                  }
                  if (typeof options.chunkCallback === "function") {
                      chunkCallback = options.chunkCallback;
                      async = true;
                  }
                  if (typeof options.endCallback === "function") {
                      endCallback = options.endCallback;
                      async = true;
                  }
              }
          }

          if (filename !== "" && !thisPath.isAbsolute(filename)) {
              filename = thisPath.join(process.cwd(), filename);
          }

          if (filename !== "" && !async) {
              return thisFs.readFileSync(filename, "utf-8");
          }

          if (filename === "" && !async) {
              /**
               * @type {string}
               */
              var result = "";
              var done = false;
              process.stdin.setEncoding("utf-8");
              process.stdin.on('end', function() {
                  done = true;
              });
              process.stdin.on('data', function(chunk, encoding, next) {
                  result += "" + chunk;
                  next();
              });
              while (!done) {

              }
              return /** @type {string} */ (result);
          }

          if (filename !== "") {
              thisFs.readFile(filename, "utf-8", chunkCallback);
          } else {
              process.stdin.setEncoding("utf-8");
              process.stdin.on("end", endCallback);
              process.stdin.on("data", chunkCallback);
          }
      };

      /**
       * @inheritDoc
       */
      jscc.ioNode.prototype.read_template = function(options) {
          var filename = null;
          var async = false;

          /**
           * @param {string} chunk
           * @param {string=} encoding
           * @param {Function=} next
           */
          var chunkCallback = function(chunk, encoding, next) {
          };

          if (options) {
              if (typeof options === "string") {
                  filename = options;
              } else if (typeof options === "function") {
                  chunkCallback = options.chunkCallback;
                  async = true;
              } else if (typeof options === "object") {
                  if (typeof options.filename === "string") {
                      filename = options.filename;
                  }
                  if (typeof options.chunkCallback === "function") {
                      chunkCallback = options.chunkCallback;
                      async = true;
                  }
              }
          }

          if (filename === null) {
              if (async) {
                  chunkCallback(global.DEFAULT_DRIVER, "utf-8", function() {
                  });
              } else {
                  return global.DEFAULT_DRIVER;
              }
          } else {
              if (!thisPath.isAbsolute(filename)) {
                  filename = thisPath.join(process.cwd(), filename);
              }
              if (!async) {
                  return thisFs.readFileSync(filename, "utf-8");
              }
              thisFs.readFile(filename, "utf-8", chunkCallback);
          }
      };

      /**
       * @inheritDoc
       */
      jscc.ioNode.prototype.write_output = function(options) {
          var text = "";
          var destination = "";
          var async = false;
          var callback = function() {
          };

          if (options) {
              if (typeof options === "string") {
                  text = options;
              } else if (typeof options === "object") {
                  if (typeof options.text === "string") {
                      text = options.text;
                  }
                  if (typeof options.destination === "string") {
                      destination = options.destination;
                  }
                  if (typeof options.callback === "function") {
                      callback = options.callback;
                      async = true;
                  }
              }
          }

          if (destination !== "" && !async) {
              thisFs.writeFileSync(destination, text, "utf-8");
          } else if (destination === "" && !async) {
              process.stdout.write(text, "utf-8");
          } else if (destination !== "") {
              thisFs.writeFile(destination, text, "utf-8", callback);
          } else {
              process.stdout.on('finish', callback);
              process.stdout.write(text, "utf-8");
              process.stdout.end();
          }
      };

      /**
       * @inheritDoc
       */
      jscc.ioNode.prototype.write_debug = function(text) {
          thisUtil.puts(text);
      };

      /**
       * @inheritDoc
       */
      jscc.ioNode.prototype.exit = function(exitCode) {
          process.exit(exitCode);
      };

      /**
       * @module jscc/io/io
       */
      return new jscc.ioNode();
  }));

