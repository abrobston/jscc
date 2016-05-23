require(
    ["knockout", "jscc-parser", "template/trim-block", "template/prism-language-jscc", "requirejs-domready", "./common",
     "jscc-parser/lib/jscc/enums/LOG_LEVEL", "./jsccCustomLogger", "jquery"],
    function(ko, jscc, trimBlock, prismLanguageJscc, domReady, common, LOG_LEVEL, log, $) {
        var data = {
            sourceString: ko.observable(""),
            templateString: ko.observable(""),
            outputString: ko.observable(""),
            useDefaultTemplate: ko.observable(true),
            logDisplay: ko.observable(""),
            isCompiling: ko.observable(false),
            compile: function() {
                data.isCompiling(true);
                data.outputString("");
                data.logDisplay("");
                var options = {
                    input: data.sourceString(),
                    outputCallback: function(result) {
                        data.outputString(trimBlock(result));
                    }
                };
                if (!data.useDefaultTemplate()) {
                    options.template = data.templateString();
                }
                setTimeout(function() {
                    try {
                        jscc(options);
                        ko.tasks.runEarly();
                        prismLanguageJscc.highlightAll();
                    } finally {
                        data.isCompiling(false);
                    }
                }, 4);
            }
        };
        data.toggleUseDefaultTemplate = ko.computed(function() {
            var actionName = data.useDefaultTemplate() ? "hide" : "show";
            $(".hide-use-default-template").collapse(actionName);
            return actionName;
        });
        domReady(function() {
            var sourceInputHeight = $("#source-input").innerHeight();
            $("#log-message-box").innerHeight(sourceInputHeight).css("overflow", "scroll");
            ko.options.deferUpdates = true;
            ko.applyBindings(data);
            log.setLevel(LOG_LEVEL.INFO);
            log.setCallback(function(msg, levelName) {
                data.logDisplay(data.logDisplay() + "\n" + levelName + ": " + msg);
            });
        });
    });