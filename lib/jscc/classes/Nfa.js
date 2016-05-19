/*
 * Universal module definition for module containing the Nfa class.
 */
(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['require', '../enums/EDGE', '../bitset'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccNfa = factory(function(mod) {
            return root["jscc" + mod.split("/").pop()];
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {function(new:jscc.classes.Nfa, NfaOptions=)}
   */
  function(require, others) {
      //>>excludeStart("closure", pragmas.closure);
      var jscc = {
          classes: {}
      };
      var has = /** @type {hasObject} */ (require("../localHas"));
      //>>excludeEnd("closure");
      var BitSet, tmpBitSet, EDGE = require("../enums/EDGE");

      /**
       * @suppress {uselessCode}
       */
      (function() {
          if (has("node")) {
              tmpBitSet = require("../bitset/BitSet32");
          } else {
              tmpBitSet = require("../bitset");
          }
      })();
      BitSet = /** @type {function(new:jscc.bitset)} */ (tmpBitSet);

      /**
       * Creates a new Nfa instance.
       * @classdesc Represents a state in a nondeterministic finite automata.
       * @param {NfaOptions=} o - Optional overrides for default property values.
       * @constructor
       * @const
       */
      jscc.classes.Nfa = function(o) {
          var p = o || {};
          if (p.edge === EDGE.CHAR || p.edge === EDGE.FREE) {
              this.edge = /** @type {!jscc.enums.EDGE} */ (p.edge);
          }
          if (typeof p.ccl === 'object' && p.ccl.hasOwnProperty("get") && p.ccl.hasOwnProperty("set") &&
              p.ccl.hasOwnProperty("count")) {
              this.ccl = /** @type {!jscc.bitset} */ (p.ccl);
          } else {
              this.ccl = new BitSet();
          }
          if (typeof p.follow === 'number') {
              this.follow = /** @type {!number} */ (p.follow);
          }
          if (typeof p.follow2 === 'number') {
              this.follow2 = /** @type {!number} */ (p.follow2);
          }
          if (typeof p.accept === 'number') {
              this.accept = /** @type {!number} */ (p.accept);
          }
          if (typeof p.weight === 'number') {
              this.weight = /** @type {!number} */ (p.weight);
          }
      };

      /**
       * The type of edge in this NFA state.
       * @type {!jscc.enums.EDGE}
       */
      jscc.classes.Nfa.prototype.edge = EDGE.EPSILON;
      /**
       * The bitset for this NFA state.
       * @type {!jscc.bitset}
       */
      jscc.classes.Nfa.prototype.ccl = new BitSet();
      /**
       * Index of an immediately-following state.
       * @type {!number}
       */
      jscc.classes.Nfa.prototype.follow = -1;
      /**
       * Index of a second following state.
       * @type {!number}
       */
      jscc.classes.Nfa.prototype.follow2 = -1;
      /**
       * Index of an accepting state.
       * @type {!number}
       */
      jscc.classes.Nfa.prototype.accept = -1;
      /**
       * The weight of this particular state.
       * @type {!number}
       */
      jscc.classes.Nfa.prototype.weight = -1;

      /**
       * The module containing the Nfa class.
       * @module jscc/classes/Nfa
       */
      return jscc.classes.Nfa;
  }));
