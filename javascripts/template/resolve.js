define(["handlebars.runtime"], function(hbRuntime) {
    function resolve(url, options) {
        var pageArray, urlArray = url.split("/");
        if (this.pageUrl) {
            pageArray = this.pageUrl.split("/");
        } else if (options && options.data && options.data.root && options.data.root.pageUrl) {
            pageArray = options.data.root.pageUrl.split("/");
        } else {
            return url;
        }
        while (pageArray.length > 0 && /^\.?$/.test(pageArray[0])) {
            pageArray.shift();
        }
        while (urlArray.length > 0 && urlArray[0] === "") {
            urlArray.shift();
        }
        if (pageArray.length > 0 && /\.html?$/i.test(pageArray[pageArray.length - 1])) {
            pageArray.pop();
        }
        while (pageArray.length > 0 && urlArray.length > 0 && pageArray[0].toLowerCase() === urlArray[0].toLowerCase()) {
            pageArray.shift();
            urlArray.shift();
        }
        while (pageArray.length > 0) {
            pageArray.shift();
            urlArray.unshift("..");
        }
        return urlArray.join("/");
    }

    hbRuntime.registerHelper("resolve", resolve);
    return resolve;
});