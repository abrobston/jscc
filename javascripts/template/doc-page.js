define(["handlebars.runtime", "lodash/flatMap", "lodash/memoize", "lodash/find"], function(hbRuntime, flatMap, memoize, find) {
    var flattenTree = memoize(function(tree) {
        return flatMap(tree, function(item) {
            return item.tree;
        });
    }, function() {
        return true;
    });

    var getRawPreviousNextInfo = memoize(function(url, flatTree) {
        var matchIndex = -1;
        var currentItem = find(flatTree, function(item, index) {
            matchIndex = index;
            return item.url === url;
        });
        var result = {};
        if (matchIndex > 0) {
            var previousItem = flatTree[matchIndex - 1];
            result.previousUrl = previousItem.url;
            result.previousTitle = previousItem.title;
        }
        
        if (matchIndex < flatTree.length - 1) {
            var nextItem = flatTree[matchIndex + 1];
            result.nextUrl = nextItem.url;
            result.nextTitle = nextItem.title;
        }
        
        return result;
    }, function(url) {
        return url;
    });

    function docPage(options) {
        var toc = flattenTree(this.documentationTableOfContents.tree);
        var pageUrl = this.pageUrl;
        var rawInfo = getRawPreviousNextInfo(pageUrl.replace(/^\.{0,2}\//, ""), toc);
        var data = hbRuntime.createFrame(options.data);
        hbRuntime.Utils.extend(data, rawInfo);
        return options.fn(data);
    }

    hbRuntime.registerHelper("doc-page", docPage);
    return docPage;
});