(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["require", "has"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jscclocalHas = factory(function() {
            // We're only using this module for Node, which clearly isn't
            // present here.  So, just return a function that returns
            // false.
            return function() {
                return false;
            };
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {hasObject}
   */
  function(require, others) {
      var has;
      try {
          has = /** @type {hasObject} */ (require("has"));
      } catch (e) {
          has = /** @type {hasObject} */ (require("../../volo/has"));
      }

      has.add("node", function() {
          return typeof process === "object" && typeof process.version === "string" &&
                 (typeof define !== "function" || !define.amd);
      }, false);

      return has;
  }));