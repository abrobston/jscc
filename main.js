(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["require", "./lib/jscc/main"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jsccmain = factory(function() {
            return root.jscc;
        });
    }
}(this,
  /**
   * @param {reqParameter} require
   * @param {...*} others
   * @returns {function(?mainOptions=)}
   */
  function(require, others) {
    var main = /** @type {function(?mainOptions=)} */ (require("./lib/jscc/main"));
    return main;
}));