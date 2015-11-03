/**
 * Interface for engine-specific logging modules.
 * @interface
 */
jscc.log = function() {

};
jscc.log.prototype = {
    /**
     * Logs a message at the fatal level.
     * @param {string} msg - The message to log.
     */
    fatal: function(msg) {
    },
    /**
     * Logs a message at the error level.
     * @param {string} msg - The message to log.
     */
    error: function(msg) {
    },
    /**
     * Logs a message at the warning level.
     * @param {string} msg - The message to log.
     */
    warn: function(msg) {
    },
    /**
     * Logs a message at the info level.
     * @param {string} msg - The message to log.
     */
    info: function(msg) {
    },
    /**
     * Logs a message at the debug level.
     * @param {string} msg - The message to log.
     */
    debug: function(msg) {
    },
    /**
     * Logs a message at the trace level.
     * @param {string} msg - The message to log.
     */
    trace: function(msg) {
    },
    /**
     * Sets the minimum level to log.  This function
     * may not have an effect at all times with all
     * loggers.
     * @param {jscc.enums.LOG_LEVEL} level - The
     * minimum level to log.
     */
    setLevel: function(level) {
    }
};

