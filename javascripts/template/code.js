define(["handlebars.runtime", "./trim-block"], function(hbRuntime, trimBlock) {
    function code(language, options) {
        var block = trimBlock(options.fn(this)), opening;

        if (language) {
            opening = "<pre>\n<code class=\"language-" + language + "\">\n";
        } else {
            opening = "<pre>\n<code>\n";
        }

        return new hbRuntime.SafeString(opening + block + "\n</code>\n</pre>\n");
    }
    
    hbRuntime.registerHelper("code", code);
    
    return code;
});