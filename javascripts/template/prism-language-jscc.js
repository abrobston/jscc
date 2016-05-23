define(["prismjs"], function(prism) {
    prism.languages.jscc = {
        "comment": /\/~[\w\W]*?~\//,
        "code-block": {
            pattern: /\[\*(?:[^\*]|\*[^\]])+\*]/,
            alias: "function",
            inside: {
                "delimiters": {
                    pattern: /(?:\[\*|\*])/,
                    alias: "punctuation"
                },
                "wildcard": {
                    pattern: /%(?:match|offset|source)/,
                    alias: "symbol"
                },
                "backreference": {
                    pattern: /%[1-9]\d*/,
                    alias: "symbol"
                },
                "retval": {
                    pattern: /%%/,
                    alias: "symbol"
                }
            }
        },
        "nonterminal": {
            pattern: /(^\s*)[-_A-Za-z0-9]+(?=\s*:)/m,
            lookbehind: true,
            alias: "variable"
        },
        "terminal-label": [{
            pattern: /(^\s*[>^<]?\s*'(?:[^'\\]|\\.)+'\s+)[-_A-Za-z0-9]+/m,
            lookbehind: true,
            alias: "symbol"
        }, {
            pattern: /(^\s*[>^<]?\s*"(?:[^"\\]|\\.)+"\s+)[-_A-Za-z0-9]+/m,
            lookbehind: true,
            alias: "symbol"
        }],
        "regex": [{
            pattern: /(^\s*[!>^<]?\s*)'(?:[^'\\]|\\.)+'/m,
            lookbehind: true
        }, {
            pattern: /(^\s*[!>^<]?\s*)"(?:[^"\\]|\\.)+"/m,
            lookbehind: true
        }],
        "keyword": {
            pattern: /(\b=>\s*)Continue/,
            lookbehind: true
        },
        "operator": {
            pattern: /(?:##|[>^;!\|&~:<]|=>)/,
            alias: "punctuation"
        }
    };

    prism.languages.jscc["code-block"].inside.rest = prism.util.clone(prism.languages.javascript);

    return prism;
});