/*
 * Universal module definition for global variables in JS/CC.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['module', './nfaStates', './classes/Symbol', './classes/Production', './enums/SYM',
                './enums/SPECIAL', './enums/EXEC', './namespace'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports =
            factory(require('module'), require('./nfaStates'), require('./classes/Symbol'),
                    require('./classes/Production'), require('./enums/SYM'), require('./enums/SPECIAL'),
                    require('./enums/EXEC'), require('./namespace'));
    } else {
        root.global =
            factory(root.module, root.nfaStates, /** @type {function(new:jscc.classes.Symbol)} */ (root.Symbol),
                    root.Production, root.SYM,
                    root.SPECIAL, root.EXEC, root.namespace);
    }
}(this,
  function(module, /** function(new:jscc.NFAStates) */ nfaStates,
           /** function(new:jscc.classes.Symbol) */ Symbol, /** function(new:jscc.classes.Production) */ Production,
           SYM, SPECIAL, EXEC, jscc) {
      /**
       * Constructs the singleton instance of jscc.global.
       * @classdesc The namespace to which the Global properties and objects belong.
       * @const
       * @constructor
       */
      jscc.global = function() {
          this.NFAStates = new nfaStates();
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

          /**
           * @const
           * @type {string}
           */
          this.JSCC_VERSION = module.config().version;

          /**
           * @const
           * @type {string}
           */
          this.DEFAULT_DRIVER = module.config().defaultDriver;

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

      jscc.global.prototype = {
          /**
           * The global symbol array.
           * @type {!Array<!jscc.classes.Symbol>}
           */
          symbols: [],

          /**
           * The global production array.
           * @type {!Array<!jscc.classes.Production>}
           */
          productions: [],

          /**
           * The global state array.
           * @type {!Array<!jscc.classes.State>}
           */
          states: [],

          /**
           * The global array of Nfa states.
           * @returns {!Array.<!jscc.classes.Nfa>}
           */
          get nfa_states() {
              return this.NFA_states.value;
          },

          /**
           * The global NfaStates object.
           * @type {jscc.NFAStates}
           */
          NFA_states: null,

          /**
           * The global array of DFA states.
           * @type {!Array<!jscc.classes.Dfa>}
           */
          dfa_states: [],

          /**
           * Contains the {@link jscc.global.Symbol#id} value of the
           * whitespace token, or -1 if the whitespace token
           * has not yet been created.
           * @type {!number}
           */
          whitespace_token: -1,

          /**
           * A string that the parser builds to replace the
           * ##HEADER## token in the template file.
           * @type {!string}
           */
          code_head: "",

          /**
           * A string that the parser builds to replace the
           * ##FOOTER## token in the template file.
           * @type {!string}
           */
          code_foot: "",

          /**
           * The filename of the grammar file currently in-process,
           * or the empty string when reading from a non-file input
           * source.
           * @type {!string}
           */
          file: "",

          /**
           * A running count of errors.
           * @type {!number}
           */
          errors: 0,

          /**
           * A running count of warnings.
           * @type {!number}
           */
          warnings: 0,

          /**
           * A running count of shift operations.
           * @type {!number}
           */
          shifts: 0,

          /**
           * A running count of reduce operations.
           * @type {!number}
           */
          reduces: 0,

          /**
           * A running count of goto operations.
           * @type {!number}
           */
          gotos: 0,

          /**
           * The execution mode for this program.
           * @type {!jscc.enums.EXEC}
           */
          exec_mode: EXEC.CONSOLE,

          /**
           * A value that the parser uses to keep track of
           * associativity levels to assign to the
           * {@link jscc.classes.Symbol#level} property.
           * @type {!number}
           */
          assoc_level: 1,

          /**
           * A value that the parser uses to track the
           * value assigned to the {@link jscc.classes.Nfa#weight}
           * property.
           * @type {!number}
           */
          regex_weight: 0,

          /**
           * When running in an environment without obvious IO,
           * contains a function with one parameter that accepts
           * the output.
           * @type {?function(string):void}
           */
          write_output_function: null,

          /**
           * When running in an environment without obvious IO,
           * contains a function that returns the grammar as
           * a string.
           * @type {?function():!string}
           */
          read_all_input_function: null,

          /**
           * When running in an environment without obvious IO,
           * contains a function that returns the template as
           * a string.
           * @type {?function():!string}
           */
          read_template_function: null
      };

      jscc['global'] = jscc.global;
      /**
       * The global module.
       * @module {jscc.global} jscc/global
       */
      return new jscc.global();
  }));
