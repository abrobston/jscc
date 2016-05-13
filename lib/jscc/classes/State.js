/*
 * Universal module definition for module containing State class.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.jsccState = factory();
    }
}(this, function() {
    //>>excludeStart("closure", pragmas.closure);
    var jscc = {
        classes: {}
    };
    //>>excludeEnd("closure");
    /**
     * Creates a new State instance.
     * @classdesc Represents a state machine entry.
     * @param {StateOptions=} o - Optional overrides for default property values.
     * @constructor
     * @memberof {jscc.classes}
     */
    jscc.classes.State = function(o) {
        var p = o || {};
        if (Array.isArray(p.kernel)) {
            this.kernel = /** @type {!Array<!jscc.classes.Item>} */ (p.kernel);
        }
        if (Array.isArray(p.epsilon)) {
            this.epsilon = /** @type {!Array<!jscc.classes.Item>} */ (p.epsilon);
        }
        if (typeof p.def_act === 'number') {
            this.def_act = /** @type {!number} */ (p.def_act);
        }
        if (typeof p.done === 'boolean') {
            this.done = /** @type {!boolean} */ (p.done);
        }
        if (typeof p.closed === 'boolean') {
            this.closed = /** @type {!boolean} */ (p.closed);
        }
        if (Array.isArray(p.actionrow)) {
            this.actionrow = /** @type {!Array<!jscc.classes.TableEntry>} */ (p.actionrow);
        }
        if (Array.isArray(p.gotorow)) {
            this.gotorow = /** @type {!Array<!jscc.classes.TableEntry>} */ (p.gotorow);
        }
    };

    /**
     * An array of items forming the kernel of this state.
     * @type {!Array<!jscc.classes.Item>}
     */
    jscc.classes.State.prototype.kernel = [];
    /**
     * An array of items forming the epsilon of this state.
     * @type {!Array<!jscc.classes.Item>}
     */
    jscc.classes.State.prototype.epsilon = [];
    /**
     * A number representing a defined action.
     * @type {!number}
     */
    jscc.classes.State.prototype.def_act = 0;
    /**
     * Whether this state has been fully processed.
     * @type {!boolean}
     */
    jscc.classes.State.prototype.done = false;
    /**
     * Whether this state is closed.
     * @type {!boolean}
     */
    jscc.classes.State.prototype.closed = false;
    /**
     * Table entries representing actions for this state.
     * @type {!Array<!jscc.classes.TableEntry>}
     */
    jscc.classes.State.prototype.actionrow = [];
    /**
     * Table entries representing goto operations for this state.
     * @type {!Array<!jscc.classes.TableEntry>}
     */
    jscc.classes.State.prototype.gotorow = [];

    /**
     * The module containing the State class.
     * @module jscc/classes/State
     */
    return jscc.classes.State;
}));
