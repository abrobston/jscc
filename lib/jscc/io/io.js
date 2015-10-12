/**
 * Interface for engine-specific IO modules.
 * @interface
 */
var io = {
    /**
     * Reads input from the specified file or from standard input.
     * If chunkCallback and/or endCallback are specified, the operation
     * is asynchronous, and the function returns nothing.  Otherwise,
     * the operation is synchronous, and the function returns a string
     * with the contents read from the file or from standard input.
     *
     * @param {(string|object|function)=} options - If a string, the filename
     * to read.  If an object, has optional filename, chunkCallback,
     * and endCallback properties.  If a function, the callback function
     * to execute for each chunk read from standard input.
     * @param {string=} options[].filename - The filename to read.
     * If omitted, read from standard input.
     * @param {function=} options[].chunkCallback - The function to call
     * when an input chunk is read asynchronously.
     * @param {function=} options[].endCallback - The function to call
     * when the asynchronous read operation has completed.
     * @returns {?string} When running synchronously, the text read from
     * the file or standard input.  When running asynchronously, returns nothing.
     */
    read_all_input: function(options) {

    },

    /**
     * Reads the template file into which the parser code is inserted.
     * If not specified, uses the default driver specified in
     * {@link module:jscc/global.DEFAULT_DRIVER}.
     *
     * @param {(string|object|function)=} options - If a string, specifies the
     * template filename.  If a function, specifies the callback function
     * to be used when reading a file chunk has completed.  If an object,
     * specifies either or both.  If omitted, causes the function to read
     * {@link module:jscc/global.DEFAULT_DRIVER} synchronously.
     * @param {string=} options[].filename - Specifies the template filename.
     * @param {function=} options[].chunkCallback - The callback function
     * to be used when reading a file chunk has completed.
     * @param {function=} options[].endCallback = The function to call when
     * the asynchronous read operation has completed.
     * @returns {?string} When running synchronously, returns the contents of
     * the template file as a string.  When running asynchronously, returns
     * nothing.
     */
    read_template: function(options) {

    },

    /**
     * Writes the provided text to the specified file or to standard output.
     *
     * @param {(string|object)} options - When a string, the text to be written
     * to standard output.  When an object, contains text, destination, and
     * callback properties.
     * @param {string=} options[].text - The text to be written.
     * @param {string=} options[].destination - The filename to which to write
     * the text.  If omitted, text is written to standard output.
     * @param {function=} options[].callback - A callback to be executed when
     * the asynchronous write operation has completed.  If omitted, the
     * operation occurs synchronously instead.
     */
    write_output: function(options) {

    }
};
