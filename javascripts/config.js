requirejs.config({
                     baseUrl: ".",
                     packages: [{
                         name: "jquery",
                         location: "../node_modules/jquery",
                         main: "dist/jquery"
                     }, {
                         name: "handlebars",
                         location: "../node_modules/handlebars",
                         main: "lib/index"
                     }, {
                         name: "requirejs-domready",
                         location: "../node_modules/requirejs-domready",
                         main: "domReady"
                     }, {
                         name: "knockout",
                         location: "../node_modules/knockout",
                         main: "build/output/knockout-latest"
                     }, {
                         name: "jscc-parser",
                         location: "../node_modules/jscc-parser",
                         main: "main"
                     }, {
                         name: "lodash",
                         location: "../node_modules/lodash-amd"
                     }],
                     paths: {
                         "browser-cookies": "../buildTemp/browser-cookies/src/browser-cookies",
                         "bootstrap": "../node_modules/bootstrap/dist/js/bootstrap",
                         "prismjs": "../buildTemp/prismjs/prism",
                         "template": "../buildTemp/template",
                         "template/trim-block": "template/trim-block",
                         "template/resolve": "template/resolve",
                         "template/code": "template/code",
                         "template/prism-language-jscc": "template/prism-language-jscc",
                         "template/doc-page": "template/doc-page",
                         "text": "../node_modules/requirejs-text/text",
                         "common": "common"
                     },
                     shim: {
                         "bootstrap": ["jquery"]
                     },
                     map: {
                         "*": {
                             "jscc": "jscc-parser"
                         },
                         "jscc-parser": {
                             "jscc-parser/lib/jscc/io/io": "jscc-parser/lib/jscc/io/ioBrowser",
                             "jscc-parser/lib/jscc/log/log": "jsccCustomLogger",
                             "jscc-parser/lib/jscc/bitset": "jscc-parser/lib/jscc/bitset/BitSet32",
                             "jscc-parser/lib/jscc/localHas": "moduleStub"
                         }
                     }
                 });
