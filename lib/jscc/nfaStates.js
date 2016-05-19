/*
 * Universal module definition for NFAStates (previously in global.js).
 */
(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['require', './bitset', './enums/EDGE', './classes/Nfa'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccnfaStates = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {function(new:jscc.NFAStates)}
   */
  function(require, others) {
      //>>excludeStart("closure", pragmas.closure);
      var jscc = {};
      //>>excludeEnd("closure");

      var BitSet,
          tmpBitSet,
          EDGE = require("./enums/EDGE"),
          Nfa = /** @type {function(new:jscc.classes.Nfa, ?NfaOptions=)} */ (require("./classes/Nfa"));
      //>>excludeStart("closure", pragmas.closure);
      var has = /** @type {hasObject} */ (require("./localHas"));
      //>>excludeEnd("closure");
      
      /**
       * @suppress {uselessCode}
       */
      (function() {
          if (has("node")) {
              tmpBitSet = require("./bitset/BitSet32");
          } else {
              tmpBitSet = require("./bitset");
          }
      })();
      BitSet = /** @type {function(new:jscc.bitset)} */ (tmpBitSet);

      /**
       * Module with a class that creates and stores Nfa objects.
       * @module {jscc.NFAStates} jscc/nfaStates
       * @constructor
       */
      jscc.NFAStates = function() {
      };
      /**
       * The inner array of Nfa objects.
       * @type {!Array<!jscc.classes.Nfa>}
       */
      jscc.NFAStates.prototype.value = [];
      /**
       * Finds an empty Nfa already in the value array if possible,
       * and returns its index.  Otherwise, creates a new Nfa object
       * and returns its index within the value array.
       * @returns {number} The index of the new or recycled Nfa
       * object within the value array.
       */
      jscc.NFAStates.prototype.create = function() {
          var nfa;
          var i;
          // Use an empty item if available, else create a new one...
          for (i = 0; i < this.value.length; i++) {
              if (this.value[i].edge === EDGE.FREE) {
                  break;
              }
          }

          if (i == this.value.length) {
              nfa = new Nfa();
              this.value.push(nfa);
          } else {
              nfa = this.value[i];
          }
          nfa.edge = EDGE.EPSILON;
          nfa.ccl = new BitSet();
          nfa.accept = -1;
          nfa.follow = -1;
          nfa.follow2 = -1;
          nfa.weight = -1;
          return i;
      };
      return jscc.NFAStates;
  }));