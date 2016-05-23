define(
    ["jquery", "bootstrap", "browser-cookies", "prismjs", "template/trim-block", "requirejs-domready",
     "template/prism-language-jscc"],
    function($, bootstrap, browserCookies, prismjs, trimBlock, domReady) {
        var solarizedCookie = browserCookies.get("jscc-solarized") || "light";
        if (!/^(light|dark)$/.test(solarizedCookie)) {
            solarizedCookie = "light";
        }

        domReady(function() {
            var $mainStylesheet = $("#main-stylesheet");

            function setSolarizedTheme(name) {
                solarizedCookie = name;
                browserCookies.set("jscc-solarized", name, { expires: 36500 });
                var oldSource = $mainStylesheet.attr("href");
                $mainStylesheet.attr("href", oldSource.replace(/(light|dark)/g, name));
            }

            setSolarizedTheme(solarizedCookie);

            $("#toggle-theme").on("click", function() {
                setSolarizedTheme(solarizedCookie === "light" ? "dark" : "light");
            });

            $("pre > code").html(function(index, oldHtml) {
                return trimBlock(oldHtml);
            });

            prismjs.highlightAll();
        });
        
        return "common";
    });