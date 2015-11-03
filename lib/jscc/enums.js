/*
 * Universal module definition for enum definitions.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./enums/ASSOC', './enums/EDGE', './enums/EXEC', './enums/LOG_LEVEL', './enums/MODE_GEN',
                './enums/SPECIAL', './enums/SYM'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./enums/ASSOC'), require('./enums/EDGE'), require('./enums/EXEC'),
                                 require('./enums/LOG_LEVEL'), require('./enums/MODE_GEN'), require('./enums/SPECIAL'),
                                 require('./enums/SYM'));
    } else {
        root.enums = factory(root.ASSOC, root.EDGE, root.EXEC, root.LOG_LEVEL, root.MODE_GEN, root.SPECIAL, root.SYM);
    }
}(this, function(ASSOC,
                 EDGE,
                 EXEC,
                 LOG_LEVEL,
                 MODE_GEN,
                 SPECIAL,
                 SYM) {
    /**
     * Namespace containing enumerations.
     * @type {{ASSOC: *, EDGE: *, EXEC: *, LOG_LEVEL: *, MODE_GEN: *, SPECIAL: *, SYM: *}}
     */
    jscc.enums = {
        ASSOC: ASSOC,
        EDGE: EDGE,
        EXEC: EXEC,
        LOG_LEVEL: LOG_LEVEL,
        MODE_GEN: MODE_GEN,
        SPECIAL: SPECIAL,
        SYM: SYM
    };
    /**
     * @module {jscc.enums} jscc/enums
     */
    return jscc.enums;
}));