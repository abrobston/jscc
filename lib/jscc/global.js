/*
 * Universal module definition for global variables in JS/CC.
 */
(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['require', 'text!./template/parser-driver-js.txt', './nfaStates', './classes/Symbol',
                './classes/Production', './enums/SYM',
                './enums/SPECIAL', './enums/EXEC'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccglobal =
            factory(function(mod) {
                var parts = mod.split("/");
                var last = parts[parts.length - 1];
                if (/js\.txt$/.test(last)) {
                    return root.jsccDEFAULT_PARSER_DRIVER;
                }
                return root["jscc" + last];
            });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {jscc.global}
   */
  function(require, others) {
      //>>excludeStart("closure", pragmas.closure);
      var jscc = {};
      var has = /** @type {hasObject} */ (require("./localHas"));
      //>>excludeEnd("closure");
      var defaultParserDriver,
          nfaStates = /** @type {function(new:jscc.NFAStates)} */ (require("./nfaStates")),
          Symbol = /** @type {function(new:jscc.classes.Symbol, ?SymbolOptions=)} */ (require("./classes/Symbol")),
          Production = /** @type {function(new:jscc.classes.Production)} */ (require("./classes/Production")),
          SYM = require("./enums/SYM"),
          SPECIAL = require("./enums/SPECIAL"),
          EXEC = require("./enums/EXEC");

      /**
       * @suppress {uselessCode}
       */
      (function() {
          if (has("node")) {
              try {
                  defaultParserDriver = /** @type {string} */ (require("text!./template/parser-driver-js.txt"));
              } catch (e) {
                  if (typeof fs !== "undefined" && typeof path !== "undefined") {
                      defaultParserDriver = /** @type {string} */
                          (fs.readFileSync(path.join(__dirname, "template", "parser-driver-js.txt"), "utf8"));
                  } else if (typeof require === "function") {
                      defaultParserDriver = /** @type {string} */
                          (require("fs")
                              .readFileSync(require("path").join(__dirname, "template", "parser-driver-js.txt"),
                                            "utf8"));
                  }
              }
          } else {
              defaultParserDriver = /** @type {string} */ (require("text!./template/parser-driver-js.txt"));
          }
      })();

      /**
       * Constructs the singleton instance of jscc.global.
       * @classdesc The namespace to which the Global properties and objects belong.
       * @const
       * @constructor
       */
      jscc.global = function() {
          this.nfa_states = new nfaStates();
          var goalSymbol = new Symbol();
          goalSymbol.kind = SYM.NONTERM;
          goalSymbol.special = SPECIAL.NONE;
          goalSymbol.label = "";
          goalSymbol.id = 0;
          goalSymbol.defined = true;

          var errorResyncSymbol = new Symbol();
          errorResyncSymbol.kind = SYM.TERM;
          errorResyncSymbol.special = SPECIAL.ERROR;
          errorResyncSymbol.label = "ERROR_RESYNC";
          errorResyncSymbol.id = 1;
          errorResyncSymbol.defined = true;
          this.symbols = [goalSymbol, errorResyncSymbol];

          var p = new Production();
          p.lhs = 0;
          p.rhs = [];
          p.code = "%% = %1;";
          this.symbols[0].prods.push(0);
          this.productions = [p];
          this.whitespace_token = -1;
          this.file = "";
          this.errors = 0;
          this.warnings = 0;
          this.shifts = 0;
          this.reduces = 0;
          this.gotos = 0;
          this.regex_weight = 0;
          this.code_head = "";
          this.code_foot = "";

          // /**
          //  * @const
          //  * @type {string}
          //  */
          // this.JSCC_VERSION = module.config().version;

          /**
           * @const
           * @type {string}
           */
          this.DEFAULT_DRIVER = defaultParserDriver;

          /**
           * The default code contents for a production.
           * @const
           * @type {string}
           */
          this.DEF_PROD_CODE = "%% = %1;";

          /**
           * The minimum lexer-state index.
           * @type {number}
           * @const
           */
          this.MIN_CHAR = 0;

          /**
           * One greater than the maximum lexer-state index.
           * @type {number}
           * @const
           */
          this.MAX_CHAR = 255;
      };

      /**
       * The global symbol array.
       * @type {!Array<!jscc.classes.Symbol>}
       */
      jscc.global.prototype.symbols = [];

      /**
       * The global production array.
       * @type {!Array<!jscc.classes.Production>}
       */
      jscc.global.prototype.productions = [];

      /**
       * The global state array.
       * @type {!Array<!jscc.classes.State>}
       */
      jscc.global.prototype.states = [];


      /**
       * The global NfaStates object.
       * @type {jscc.NFAStates}
       */
      jscc.global.prototype.nfa_states = null;

      /**
       * The global array of DFA states.
       * @type {!Array<!jscc.classes.Dfa>}
       */
      jscc.global.prototype.dfa_states = [];

      /**
       * Contains the {@link jscc.global.Symbol#id} value of the
       * whitespace token, or -1 if the whitespace token
       * has not yet been created.
       * @type {!number}
       */
      jscc.global.prototype.whitespace_token = -1;

      /**
       * A string that the parser builds to replace the
       * ##HEADER## token in the template file.
       * @type {!string}
       */
      jscc.global.prototype.code_head = "";

      /**
       * A string that the parser builds to replace the
       * ##FOOTER## token in the template file.
       * @type {!string}
       */
      jscc.global.prototype.code_foot = "";

      /**
       * The filename of the grammar file currently in-process,
       * or the empty string when reading from a non-file input
       * source.
       * @type {!string}
       */
      jscc.global.prototype.file = "";

      /**
       * A running count of errors.
       * @type {!number}
       */
      jscc.global.prototype.errors = 0;

      /**
       * A running count of warnings.
       * @type {!number}
       */
      jscc.global.prototype.warnings = 0;

      /**
       * A running count of shift operations.
       * @type {!number}
       */
      jscc.global.prototype.shifts = 0;

      /**
       * A running count of reduce operations.
       * @type {!number}
       */
      jscc.global.prototype.reduces = 0;

      /**
       * A running count of goto operations.
       * @type {!number}
       */
      jscc.global.prototype.gotos = 0;

      /**
       * The execution mode for this program.
       * @type {!jscc.enums.EXEC}
       */
      jscc.global.prototype.exec_mode = EXEC.CONSOLE;

      /**
       * A value that the parser uses to keep track of
       * associativity levels to assign to the
       * {@link jscc.classes.Symbol#level} property.
       * @type {!number}
       */
      jscc.global.prototype.assoc_level = 1;

      /**
       * A value that the parser uses to track the
       * value assigned to the {@link jscc.classes.Nfa#weight}
       * property.
       * @type {!number}
       */
      jscc.global.prototype.regex_weight = 0;

      /**
       * When running in an environment without obvious IO,
       * contains a function with one parameter that accepts
       * the output.
       * @type {?function(string):void}
       */
      jscc.global.prototype.write_output_function = null;

      /**
       * When running in an environment without obvious IO,
       * contains a function that returns the grammar as
       * a string.
       * @type {?function():!string}
       */
      jscc.global.prototype.read_all_input_function = null;

      /**
       * When running in an environment without obvious IO,
       * contains a function that returns the template as
       * a string.
       * @type {?function():!string}
       */
      jscc.global.prototype.read_template_function = null;

      /**
       * When running in an environment without obvious IO,
       * contains a function that receives debugging output.
       * @type {?function(string):void}
       */
      jscc.global.prototype.write_debug_function = null;

      /**
       * The global module.
       * @module {jscc.global} jscc/global
       */
      return new jscc.global();
  }));
