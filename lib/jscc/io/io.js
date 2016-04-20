/**
 * @typedef {{filename: ?(string|undefined), chunkCallback: ?(function(string):void|undefined), endCallback:
 *     ?(function():void|undefined)}}
 * @property {?(string|undefined)} filename - The filename to read.  If omitted, read from standard input.
 * @property {?(function(string):void|undefined)} chunkCallback - The function to call when an input chunk is read
 *     asynchronously.
 * @property {?(function():void|undefined)} endCallback - The function to call when the asynchronous read operation has
 *     completed.
 */
var ioOptions;
/**
 * @typedef {{text: string, destination: ?(string|undefined), callback: ?(function():void|undefined)}}
 * @property {string} text - The text to be written.
 * @property {?(string|undefined)} destination - The filename to which to write the text.  If omitted, text is written
 *     to standard output.
 * @property {?(function():void|undefined)} callback - A callback to be executed when the asynchronous write operation
 *     has completed.  If omitted, the operation occurs synchronously instead.
 */
var ioWriteOutputOptions;
/**
 * Interface for engine-specific IO modules.
 * @interface
 */
jscc.io = function() {
};
jscc.io.prototype = {
    /**
     * Reads input from the specified file or from standard input.
     * If chunkCallback and/or endCallback are specified, the operation
     * is asynchronous, and the function returns nothing.  Otherwise,
     * the operation is synchronous, and the function returns a string
     * with the contents read from the file or from standard input.
     *
     * @param {(string|function(string):void|ioOptions)=} options -
     *     If a string, the filename to read.  If an object, has optional filename, chunkCallback, and endCallback
     *     properties.  If a function, the callback function to execute for each chunk read from standard input.
     * @returns {(string|void)} When running synchronously, the text read from
     * the file or standard input.  When running asynchronously, returns nothing.
     */
    read_all_input: function(options) {

    },

    /**
     * Reads the template file into which the parser code is inserted.
     * If not specified, uses the default driver specified in
     * {@link jscc.global.DEFAULT_DRIVER}.
     *
     * @param {(string|function(string):void|ioOptions)=} options -
     *     If a string, specifies the template filename.  If a function, specifies the callback function to be used
     *     when reading a file chunk has completed.  If an object, specifies either or both.  If omitted, causes the
     *     function to read
     * {@link jscc.global.DEFAULT_DRIVER} synchronously.
     * @returns {(string|void)} When running synchronously, returns the contents of
     * the template file as a string.  When running asynchronously, returns
     * nothing.
     */
    read_template: function(options) {

    },

    /**
     * Writes the provided text to the specified file or to standard output.
     *
     * @param {(string|ioWriteOutputOptions)} options - When a string, the text
     *     to be written to standard output.  When an object, contains text, destination, and callback properties.
     */
    write_output: function(options) {

    },

    /**
     * Writes the provided text to a debugging output, provided that such an output
     * exists in the implementation of this interface.
     *
     * @param {string} text - The text to write to the debugging output.
     */
    write_debug: function(text) {

    },

    /**
     * Attempts to exit the entire process with the provided exit code if the 
     * platform supports doing so.  Callers should also ensure that all functions
     * exit appropriately if the platform does not support this feature.
     * 
     * @param {number=} exitCode - The exit code to use.
     */
    exit: function(exitCode) {
        
    }
};
