#!/usr/bin/js
var driver = "/*\n\tDefault driver template for JS/CC generated parsers for Mozilla/Spidermonkey\n\t\n\tWritten 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies\n\tThis is in the public domain.\n*/\nvar __##PREFIX##_debug=(function(){///@TODO: create this variable without function\n\n\tvar _dbg_withparsetree\t= false;\n\tvar _dbg_withtrace\t\t= false;\n\tvar _dbg_withstepbystep\t= false;\n\t\n\tfunction __dbg_print( text )\n\t{\n\t\tprint( text );\n\t}\n\t\n\tfunction __dbg_flush()\n\t{\n\t\t//Not required here.\n\t}\n\t\n\tfunction __dbg_wait()\n\t{\n\t\t// Not implemented for Spidermonkey.\n\t}\n\t\n\tfunction __dbg_parsetree( indent, nodes, tree )\n\t{\n\t\t// Not implemented for Spidermonkey.\n\t}\n\n\treturn {\n\t\t__dbg_print:__dbg_print,\n\t\t_dbg_withtrace:_dbg_withtrace,\n\t\t__dbg_wait:__dbg_wait,\n\t\t_dbg_withparsetree:_dbg_withparsetree,\n\t\t_dbg_withstepbystep:_dbg_withstepbystep,\n\t\t__dbg_flush:__dbg_flush,\n\t\t__dbg_parsetree:__dbg_parsetree\n\t};\n})();\n/*\n\tThis is the general, platform-independent part of every parser driver;\n\tInput-/Output and Feature-Functions are done by the particular drivers\n\tcreated for the particular platform.\n*/\n\t##HEADER##\nvar __##PREFIX##parse=(function(debug){\n\twith(debug){\n\t\tvar dbg_print = __dbg_print;\n\t\tvar dbg_withtrace = _dbg_withtrace;\n\t\tvar dbg_wait = __dbg_wait;\n\t\tvar dbg_withparsetree = _dbg_withparsetree;\n\t\tvar dbg_withstepbystep = _dbg_withstepbystep;\n\t\tvar dbg_flush = __dbg_flush;\n\t\tvar dbg_parsetree = __dbg_parsetree;\n\t}\n\n##DFA##\n\n\tfunction lex( PCB )\n\t{\n\t\tvar state;\n\t\tvar match\t\t= -1;\n\t\tvar match_pos\t= 0;\n\t\tvar start\t\t= 0;\n\t\tvar pos;\n\t\tvar chr;\n\n\t\twhile(true)\n\t\t{\n\t\t\tstate = 0;\n\t\t\tmatch = -1;\n\t\t\tmatch_pos = 0;\n\t\t\tstart = 0;\n\t\t\tpos = PCB.offset + 1 + ( match_pos - start );\n\t\t\t///Functions for manipulation of variables\n\t\t\tfunction set_match(v){match=v;}\n\t\t\tfunction set_state(v){state=v;}\n\t\t\tfunction set_match_pos(v){match_pos=v;}\n\t\t\tdo\n\t\t\t{\n\t\t\t\tpos--;\n\t\t\t\tstate = 0;\n\t\t\t\tmatch = -2;\n\t\t\t\tstart = pos;\n\t\n\t\t\t\tif( PCB.src.length <= start )\n\t\t\t\t\treturn ##EOF##;\n\t\n\t\t\t\tdo\n\t\t\t\t{\n\t\t\t\t\tchr = PCB.src.charCodeAt( pos );\n\n\n\t\t\t\t\tDFA(state,chr,match,pos,set_match,set_match_pos,set_state);//## DFA ##\n\t\t\t\t\t//Line- and column-counter\n\t\t\t\t\tif( state > -1 )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( chr == 10 )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tPCB.line++;\n\t\t\t\t\t\t\tPCB.column = 0;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tPCB.column++;\n\t\t\t\t\t}\n\n\t\t\t\t\tpos++;\n\t\n\t\t\t\t}\n\t\t\t\twhile( state > -1 );\n\t\n\t\t\t}\n\t\t\twhile( ##WHITESPACE## > -1 && match == ##WHITESPACE## );\n\t\n\t\t\tif( match > -1 )\n\t\t\t{\n\t\t\t\tPCB.att = PCB.src.substr( start, match_pos - start );\n\t\t\t\tPCB.offset = match_pos;\n\n##TERMINAL_ACTIONS##\n\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tPCB.att = \"\";\n\t\t\t\tmatch = -1;\n\t\t\t}\n\t\t\n\t\t\tbreak;\n\t\t}\n\n\t\treturn match;\n\t}\n\n##TABLES##\n\n##LABELS##\n\n\tfunction ACTIONS(act,sstack,vstack){\n\t\tvar rval;\n##ACTIONS##\n\t\treturn rval;\n\t}\n\tfunction parse( src, err_off, err_la )\n\t{\n\t\tvar\t\tsstack\t\t\t= [];\n\t\tvar\t\tvstack\t\t\t= [];\n\t\tvar \terr_cnt\t\t\t= 0;\n\t\tvar\t\trval;\n\t\tvar\t\tact;\n\t\n\t\t//Visual parse tree generation\n\n\t\tvar\t\ttreenodes\t\t= [];\n\t\tvar\t\ttree\t\t\t= [];\n\t\tvar\t\ttmptree\t\t\t= null;\n\t\t\n\t\t/*\n\t\t\tThis is the parser control block (PCB);\n\t\t\tIt is used to hold the entire parser state\n\t\t\tin one object, to be quickly accessed from\n\t\t\tvarious functions.\n\t\t*/ \n\t\tvar PCB\t= {\n\t\t\tline:1,\n\t\t\tcolumn:1,\n\t\t\toffset:0,\n\t\t\terror_step:0,\n\t\t\tsrc:src,\n\t\t\tatt:\"\"\n\t\t};\n\n\t\tif( !err_off )\n\t\t\terr_off\t= [];\n\t\tif( !err_la )\n\t\t\terr_la = [];\n\t\n\t\tsstack.push( 0 );\n\t\tvstack.push( 0 );\n\t\n\t\tPCB.la = lex( PCB );\n\t\t\t\n\t\twhile( true )\n\t\t{\n\t\t\tPCB.act = ##ERROR##;\n\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t{\n\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == PCB.la )\n\t\t\t\t{\n\t\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t\n\t\t\tif( PCB.act == ##ERROR## )\n\t\t\t{\n\t\t\t\tif( ( PCB.act = defact_tab[ sstack[sstack.length-1] ] ) < 0 )\n\t\t\t\t\tPCB.act = ##ERROR##;\n\t\t\t\telse\n\t\t\t\t\tPCB.act *= -1;\n\t\t\t}\n\n\t\t\t/*\n\t\t\t_print( \"state \" + sstack[sstack.length-1] +\n\t\t\t\t\t\" la = \" +\n\t\t\t\t\tPCB.la + \" att = >\" +\n\t\t\t\t\tPCB.att + \"< act = \" +\n\t\t\t\t\tPCB.act + \" src = >\" +\n\t\t\t\t\tPCB.src.substr( PCB.offset, 30 ) + \"...\" + \"<\" +\n\t\t\t\t\t\" sstack = \" + sstack.join() );\n\t\t\t*/\n\t\t\n\t\t\tif( dbg_withtrace && sstack.length > 0 )\n\t\t\t{\n\t\t\t\tdbg_print( \"\\nState \" + sstack[sstack.length-1] + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tLookahead: \" + labels[PCB.la] +\n\t\t\t\t\t\t\t\t\" (\\\"\" + PCB.att + \"\\\")\\n\" +\n\t\t\t\t\t\t\t\"\\tAction: \" + PCB.act + \"\\n\" + \n\t\t\t\t\t\t\t\"\\tSource: \\\"\" + PCB.src.substr( PCB.offset, 30 ) +\n\t\t\t\t\t\t\t\t\t( ( PCB.offset + 30 < PCB.src.length ) ?\n\t\t\t\t\t\t\t\t\t\t\"...\" : \"\" ) + \"\\\"\\n\" +\n\t\t\t\t\t\t\t\"\\tStack: \" + sstack.join() + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tValue stack: \" + vstack.join() + \"\\n\" );\n\t\t\t\n\t\t\t\tif( dbg_withstepbystep )\n\t\t\t\t\tdbg_wait();\n\t\t\t}\n\t\t\n\t\t\t\n\t\t\t//Parse error? Try to recover!\n\t\t\tif( PCB.act == ##ERROR## )\n\t\t\t{\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t{\n\t\t\t\t\tvar expect = \"\";\n\t\t\t\t\n\t\t\t\t\tdbg_print( \"Error detected: \" +\n\t\t\t\t\t\t\"There is no reduce or shift on the symbol \" +\n\t\t\t\t\t\t\tlabels[PCB.la] );\n\t\t\t\t\n\t\t\t\t\tfor( var i = 0;\n\t\t\t\t\t\ti < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( expect != \"\" )\n\t\t\t\t\t\t\texpect += \", \";\n\t\t\t\t\t\t\n\t\t\t\t\t\texpect += \"\\\"\" +\n\t\t\t\t\t\t\t\tlabels[ act_tab[sstack[sstack.length-1]][i] ]\n\t\t\t\t\t\t\t\t\t+ \"\\\"\";\n\t\t\t\t\t}\n\t\t\t\t\n\t\t\t\t\tdbg_print( \"Expecting: \" + expect );\n\t\t\t\t}\n\t\t\t\n\t\t\t\t//Report errors only when error_step is 0, and this is not a\n\t\t\t\t//subsequent error from a previous parse\n\t\t\t\tif( PCB.error_step == 0 )\n\t\t\t\t{\n\t\t\t\t\terr_cnt++;\n\t\t\t\t\terr_off.push( PCB.offset - PCB.att.length );\n\t\t\t\t\terr_la.push([]);\n\t\t\t\t\tfor( var i = 0;\n\t\t\t\t\t\ti < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t\t\terr_la[err_la.length-1].push(\n\t\t\t\t\t\t\tlabels[act_tab[sstack[sstack.length-1]][i]] );\n\t\t\t\t}\n\t\t\t\n\t\t\t\t//Perform error recovery\t\t\t\n\t\t\t\twhile( sstack.length > 1 && PCB.act == ##ERROR## )\n\t\t\t\t{\n\t\t\t\t\tsstack.pop();\n\t\t\t\t\tvstack.pop();\n\t\t\t\t\n\t\t\t\t\t//Try to shift on error token\n\t\t\t\t\tfor( var i = 0;\n\t\t\t\t\t\ti < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\ti+=2 )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == ##ERROR_TOKEN## )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\t\n\t\t\t\t\t\t\tsstack.push( PCB.act );\n\t\t\t\t\t\t\tvstack.push(\"\");\n\t\t\t\t\t\t\n\t\t\t\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tdbg_print(\n\t\t\t\t\t\t\t\t\t\"Error recovery: error token \" +\n\t\t\t\t\t\t\t\t\t\"could be shifted!\" );\n\t\t\t\t\t\t\t\tdbg_print( \"Error recovery: \" +\n\t\t\t\t\t\t\t\t\t\"current stack is \" + sstack.join() );\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\n\t\t\t\t//Is it better to leave the parser now?\n\t\t\t\tif( sstack.length > 1 && PCB.act != ##ERROR## )\n\t\t\t\t{\n\t\t\t\t\t//Ok, now try to shift on the next tokens\n\t\t\t\t\twhile( PCB.la != ##EOF## )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\t\t\tdbg_print( \"Error recovery: \" +\n\t\t\t\t\t\t\t\t\"Trying to shift on \\\"\"\n\t\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\n\t\t\t\t\t\tPCB.act = ##ERROR##;\n\t\t\t\t\t\n\t\t\t\t\t\tfor( var i = 0;\n\t\t\t\t\t\t\ti < act_tab[sstack[sstack.length-1]].length;\n\t\t\t\t\t\t\ti+=2 )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == PCB.la )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tPCB.act = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t\tif( PCB.act != ##ERROR## )\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\n\t\t\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\t\t\tdbg_print( \"Error recovery: Discarding \\\"\"\n\t\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\t\t\t\t\t\n\t\t\t\t\t\twhile( ( PCB.la = lex( PCB ) ) < 0 )\n\t\t\t\t\t\t\tPCB.offset++;\n\t\t\t\t\n\t\t\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\t\t\tdbg_print( \"Error recovery: New token \\\"\"\n\t\t\t\t\t\t\t\t+ labels[ PCB.la ] + \"\\\"\" );\n\t\t\t\t\t}\n\t\t\t\t\twhile( PCB.la != ##EOF## && PCB.act == ##ERROR## );\n\t\t\t\t}\n\t\t\t\n\t\t\t\tif( PCB.act == ##ERROR## || PCB.la == ##EOF## )\n\t\t\t\t{\n\t\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\t\tdbg_print( \"\\tError recovery failed, \" +\n\t\t\t\t\t\t\t\"terminating parse process...\" );\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"\\tError recovery succeeded, \" +\n\t\t\t\t\t\t\t\t\t\t\t\"continuing\" );\n\t\t\t\n\t\t\t\t//Try to parse the next three tokens successfully...\n\t\t\t\tPCB.error_step = 3;\n\t\t\t}\n\n\t\t\t//Shift\n\t\t\tif( PCB.act > 0 )\n\t\t\t{\n\t\t\t\t//Parse tree generation\n\t\t\t\tif( dbg_withparsetree )\n\t\t\t\t{\n\t\t\t\t\ttree.push( treenodes.length );\n\t\t\t\t\ttreenodes.push({\n\t\t\t\t\t\tsym:labels[ PCB.la ],\n\t\t\t\t\t\tatt:PCB.att,\n\t\t\t\t\t\tchild:[]\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"Shifting symbol: \" +\n\t\t\t\t\t\tlabels[PCB.la] + \" (\" + PCB.att + \")\" );\n\t\t\n\t\t\t\tsstack.push( PCB.act );\n\t\t\t\tvstack.push( PCB.att );\n\t\t\t\n\t\t\t\tPCB.la = lex( PCB );\n\t\t\t\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"\\tNew lookahead symbol: \" +\n\t\t\t\t\t\tlabels[PCB.la] + \" (\" + PCB.att + \")\" );\n\t\t\t\t\n\t\t\t\t//Successfull shift and right beyond error recovery?\n\t\t\t\tif( PCB.error_step > 0 )\n\t\t\t\t\tPCB.error_step--;\n\t\t\t}\n\t\t\t//Reduce\n\t\t\telse\n\t\t\t{\t\t\n\t\t\t\tact = PCB.act * -1;\n\t\t\t\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"Reducing by production: \" + act );\n\t\t\t\n\t\t\t\trval = void( 0 );\n\t\t\t\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"\\tPerforming semantic action...\" );\n\t\t\t\n\t\t\t\trval=ACTIONS(act,sstack,vstack);/// this for ## ACIONS ## usage\t\n\t\n\t\t\t\tif( dbg_withparsetree )\n\t\t\t\t\ttmptree = [];\n\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"\\tPopping \" + \n\t\t\t\t\t\t\t\t\tpop_tab[act][1] +  \" off the stack...\" );\n\t\t\t\t\n\t\t\t\tfor( var i = 0; i < pop_tab[act][1]; i++ )\n\t\t\t\t{\n\t\t\t\t\tif( dbg_withparsetree )\n\t\t\t\t\t\ttmptree.push( tree.pop() );\n\t\t\t\t\t\n\t\t\t\t\tsstack.pop();\n\t\t\t\t\tvstack.pop();\n\t\t\t\t}\n\n\t\t\t\t//Get goto-table entry\n\t\t\t\tPCB.act = ##ERROR##;\n\t\t\t\tfor( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t\t{\n\t\t\t\t\tif( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )\n\t\t\t\t\t{\n\t\t\t\t\t\tPCB.act = goto_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\n\t\t\t\t//Do some parse tree construction if desired\n\t\t\t\tif( dbg_withparsetree )\n\t\t\t\t{\n\t\t\t\t\ttree.push( treenodes.length );\n\t\t\t\t\ttreenodes.push( {\n\t\t\t\t\t\tsym:labels[ pop_tab[act][0] ],\n\t\t\t\t\t\tatt:rval,\n\t\t\t\t\t\tchild:tmptree.reverse()\n\t\t\t\t\t\t} );\n\t\t\t\t}\n\t\t\t\n\t\t\t\t//Goal symbol match?\n\t\t\t\tif( act == 0 ) //Don't use PCB.act here!\n\t\t\t\t\tbreak;\n\t\t\t\t\n\t\t\t\tif( dbg_withtrace )\n\t\t\t\t\tdbg_print( \"\\tPushing non-terminal \" + \n\t\t\t\t\t\tlabels[ pop_tab[act][0] ] );\n\t\t\t\n\t\t\t\t//...and push it!\n\t\t\t\tsstack.push( PCB.act );\n\t\t\t\tvstack.push( rval );\n\t\t\t}\n\t\t}\n\n\t\tif( dbg_withtrace )\n\t\t{\n\t\t\tdbg_print( \"\\nParse complete.\" );\n\t\t\n\t\t\t//This function is used for parser drivers that will output\n\t\t\t//the entire debug messages in a row.\n\t\t\tdbg_flush();\n\t\t}\n\n\t\tif( dbg_withparsetree )\n\t\t{\n\t\t\tif( err_cnt == 0 )\n\t\t\t{\n\t\t\t\tdbg_print( \"\\n\\n--- Parse tree ---\" );\n\t\t\t\tdbg_parsetree( 0, treenodes, tree );\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tdbg_print( \"\\n\\nParse tree cannot be viewed. \" +\n\t\t\t\t\t\t\t\t\t\"There where parse errors.\" );\n\t\t\t}\n\t\t}\n\t\n\t\treturn err_cnt;\n\t}\n\t\n\treturn parse;\n})(__##PREFIX##_debug);\n\n##FOOTER##";

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
      escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

        var i,          
            k,          
            v,          
            length,
            mind = gap,
            partial,
            value = holder[key];


        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }


            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }


            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }



    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }


            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }


            throw new SyntaxError('JSON.parse');
        };
    }
}());
/* -HEADER----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	global.js
Author:	Jan Max Meyer
Usage:	General variables, constants and defines

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

/// constructors generator:
function createConstructor(a){
    var arr={};
    for(var i = 0;i<a.length;i++)
        arr[a[i]]=true;
    return function(o){
        o=o||{};
        for(var f in o)
            if(f in arr)
                this[f]=o[f];
    }
}
/// there was "continue" in code, we must to replace it
function Continue(){}
/*
	Constants
*/
var NEW_VERSION=true;
//var DEFAULT_DRIVER="";
//Program version info 
var JSCC_VERSION			= "0.33";

//Symbol types
var SYM_NONTERM				= 0;
var SYM_TERM				= 1;

//Symbol special cases
var SPECIAL_NO_SPECIAL		= 0;
var SPECIAL_EOF				= 1;
var SPECIAL_WHITESPACE		= 2;
var SPECIAL_ERROR			= 3;

//Symbol associativity
var ASSOC_NONE				= 0;
var ASSOC_LEFT				= 1;
var ASSOC_RIGHT				= 2;
var ASSOC_NOASSOC			= 3;

//Token-Definitions

var TOK_ERROR				= 0;
var TOK_EOF					= 1;
var TOK_ID					= 2;
var TOK_TERM				= 3;
var TOK_TERM_S				= 4;
var TOK_COLON				= 5;
var TOK_SEMICOLON			= 6;
var TOK_DELIMITER			= 7;
var TOK_SEMANTIC			= 8;
var	TOK_IGNORE				= 9;
var TOK_PREFIX				= 10;

//Miscelleanous constants
var DEF_PROD_CODE			= "%% = %1;";

//Code generation/output modes
var MODE_GEN_TEXT			= 0;
var MODE_GEN_JS				= 1;
var MODE_GEN_HTML			= 2;

//Executable environment
var EXEC_CONSOLE			= 0;
var EXEC_WEB				= 1;

//Lexer state construction
var MIN_CHAR				= 0;
var MAX_CHAR				= 255;

var EDGE_FREE				= 0;
var EDGE_EPSILON			= 1;
var EDGE_CHAR				= 2;

/*
	Structs
*/

var SYMBOL=createConstructor(['kind','label','prods','first','associativity','level','code','special','nullable','defined','defined_at','used_at']);
var PROD=createConstructor(['id','lhs','rhs','level','code']);
var ITEM=createConstructor(['prod','dot_offset','lookahead']);
var STATE=createConstructor(['kernel','epsilon','def_act','done','closed','actionrow','gotorow']);
var NFA=createConstructor(['edge','ccl','follow','follow2','accept','weight']);
var DFA=createConstructor(['line','object','nfa_set','accept','done','group']);//object
var PARAM=createConstructor(['start','end']);
var TOKEN=createConstructor(['token','lexeme']);

/*
	Globals (will be initialized via reset_all()!)
*/
var symbols;
var productions;
var states;
var lex;

var nfa_states;
var dfa_states;

var whitespace_token;

var code_head;
var code_foot;

var file;
var errors;
var show_errors;
var warnings;
var show_warnings;

var shifts;
var reduces;
var gotos;

var exec_mode;

var assoc_level;

var	regex_weight;
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer

File:	io_sm.js
Author: Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Mozilla/Spidermonkey

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function _error( msg )
{
	if( show_errors )
		print( "/*--- error: " + msg + " */" );
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		print( "/*--- warning: " + msg + " */" );
	
	warnings++;
}

function _print( txt )
{
	print( txt );
}

var DEFAULT_DRIVER = "";

//The rest of the platform-dependent code is done in jscc_main_sm.js,
//because Spidermonkey can't handle files.
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	debug.js
Author:	Jan Max Meyer
Usage:	Debug-Functions / Detail progress output
		These functions had been designed to both output plain text as well
		as HTML-formatted output.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function print_symbols( mode )
{
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"3\">Symbols Overview</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\">Symbol</td>" );
		_print( "<td class=\"coltitle\">Type</td>" );
		_print( "</tr>" );
	}
	else if( mode == MODE_GEN_TEXT )
		_print( "--- Symbol Dump ---" );
	
	for( var i = 0; i < symbols.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			_print( "<tr>" );
			
			_print( "<td>" );
			_print( symbols[i].label );
			_print( "</td>" );
		
			_print( "<td>" );
			_print( ( ( symbols[i].kind == SYM_NONTERM ) ? "Non-terminal" : "Terminal" ) );
			_print( "</td>" );
		}
		else if( mode == MODE_GEN_TEXT )
		{
			var output = new String();			
			
			output = symbols[i].label;
			for( var j = output.length; j < 20; j++ )
				output += " ";
			
			output += ( ( symbols[i].kind == SYM_NONTERM ) ? "Non-terminal" : "Terminal" );
			
			if( symbols[i].kind == SYM_TERM )
			{
				for( var j = output.length; j < 40; j++ )
					output += " ";
			
				output += symbols[i].level + "/";
				
				switch( symbols[i].assoc )
				{
					case ASSOC_NONE:
						output += "^";
						break;
					case ASSOC_LEFT:
						output += "<";
						break;
					case ASSOC_RIGHT:
						output += ">";
						break;
	
				}
			}
			
			_print( output );
		}
		
	}	
	
	if( mode == MODE_GEN_HTML )
		_print( "</table>" );
	else if( mode == MODE_GEN_TEXT )
		_print( "" );
}


function print_grammar( mode )
{
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"3\">Grammar Overview</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\">Left-hand side</td>" );
		_print( "<td class=\"coltitle\">FIRST-set</td>" );
		_print( "<td class=\"coltitle\">Right-hand side</td>" );
		_print( "</tr>" );
		
		for( var i = 0; i < symbols.length; i++ )
		{
			_print( "<tr>" );
			
			//alert( "symbols " + i +  " = " + symbols[i].label + "(" + symbols[i].kind + ")" );
			if( symbols[i].kind == SYM_NONTERM )
			{
				_print( "<td>" );
				_print( symbols[i].label );
				_print( "</td>" );
	
				_print( "<td>" );
				for( var j = 0; j < symbols[i].first.length; j++ )
				{
					_print( " <b>" + symbols[symbols[i].first[j]].label + "</b> " );
				}
				_print( "</td>" );
	
				_print( "<td>" );
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						if( symbols[productions[symbols[i].prods[j]].rhs[k]].kind == SYM_TERM )
							_print( " <b>" + symbols[productions[symbols[i].prods[j]].rhs[k]].label + "</b> " );
						else
							_print( " " + symbols[productions[symbols[i].prods[j]].rhs[k]].label + " " );					
					}
					_print( "<br />" );
				}
				_print( "</td>" );
			}
			
			_print( "</tr>" );
		}
		
		_print( "</table>" );
	}
	else if( mode == MODE_GEN_TEXT )
	{
		var output = new String();
				
		for( var i = 0; i < symbols.length; i++ )
		{
			if( symbols[i].kind == SYM_NONTERM )
			{
				output += symbols[i].label + " {";
				
				for( var j = 0; j < symbols[i].first.length; j++ )
					output += " " + symbols[symbols[i].first[j]].label + " ";
	
				output += "}\n";			
	
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					output += "\t";
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						if( symbols[productions[symbols[i].prods[j]].rhs[k]].kind == SYM_TERM )
							output += "#" + symbols[productions[symbols[i].prods[j]].rhs[k]].label + " ";
						else
							output += symbols[productions[symbols[i].prods[j]].rhs[k]].label + " ";
					}
					output += "\n";
				}
			}
		}
		
		_print( output );
	}
}

function print_item_set( mode, label, item_set )
{
	var i, j;
	
	if( item_set.length == 0 )
		return;
	
	if( mode == MODE_GEN_HTML )
	{
		_print( "<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">" );
		_print( "<tr>" );
		_print( "<td class=\"tabtitle\" colspan=\"2\">" + label + "</td>" );
		_print( "</tr>" );
		_print( "<tr>" );
		_print( "<td class=\"coltitle\" width=\"35%\">Lookahead</td>" );
		_print( "<td class=\"coltitle\" width=\"65%\">Production</td>" );
		_print( "</tr>" );
	}
	else if( mode == MODE_GEN_TEXT )
		_print( "--- " + label + " ---" );
			
	for( i = 0; i < item_set.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			_print( "<tr>" );
			
			//alert( "symbols " + i +  " = " + symbols[i].label + "(" + symbols[i].kind + ")" );
			_print( "<td>" );
			for( j = 0; j < item_set[i].lookahead.length; j++ )
			{
				_print( " <b>" + symbols[item_set[i].lookahead[j]].label + "</b> " );
			}
			_print( "</td>" );
	
			_print( "<td>" );
			
			_print( symbols[productions[item_set[i].prod].lhs].label + " -&gt; " );
			for( j = 0; j < productions[item_set[i].prod].rhs.length; j++ )
			{
				if( j == item_set[i].dot_offset )
					_print( "." );
				
				if( symbols[productions[item_set[i].prod].rhs[j]].kind == SYM_TERM )
					_print( " <b>" + symbols[productions[item_set[i].prod].rhs[j]].label + "</b> " );
				else
					_print( " " + symbols[productions[item_set[i].prod].rhs[j]].label + " " );					
			}
			
			if( j == item_set[i].dot_offset )
					_print( "." );
			_print( "</td>" );
			
			_print( "</tr>" );
		}
		else if( mode == MODE_GEN_TEXT )
		{
			var out = new String();
			
			out += symbols[productions[item_set[i].prod].lhs].label;
						
			for( j = out.length; j < 20; j++ )
				out += " ";
				
			out += " -> ";
			
			for( j = 0; j < productions[item_set[i].prod].rhs.length; j++ )
			{
				if( j == item_set[i].dot_offset )
					out += ".";
				
				if( symbols[productions[item_set[i].prod].rhs[j]].kind == SYM_TERM )
					out += " #" + symbols[productions[item_set[i].prod].rhs[j]].label + " ";
				else
					out += " " + symbols[productions[item_set[i].prod].rhs[j]].label + " ";					
			}
			
			if( j == item_set[i].dot_offset )
				out += ".";

			for( j = out.length; j < 60; j++ )
				out += " ";
			out += "{ ";
			
			for( j = 0; j < item_set[i].lookahead.length; j++ )
				out += "#" + symbols[item_set[i].lookahead[j]].label + " ";
				
			out += "}";
			
			_print( out );
		}
	}
	
	if( mode == MODE_GEN_HTML )
		_print( "</table>" );
}

/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	first.js
Author:	Jan Max Meyer
Usage:	FIRST-set calculation

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		first()
	
	Author:			Jan Max Meyer
	
	Usage:			Computes the FIRST-sets for all non-terminals of the
					grammar. Must be called right after the parse and before
					the table generation methods are performed.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	25.08.2008	Jan Max Meyer	Here was a bad bug that sometimes came up when
								nonterminals are nullable. An example is the
								grammar
								
								"A" "B";
								##
								x: y "B";
								y: y "A" | ;
								
								Now it works... embarrassing bug... ;(
----------------------------------------------------------------------------- */
function first()
{
	var	cnt			= 0,
		old_cnt		= 0;
	var nullable;

	do
	{
		old_cnt = cnt;
		cnt = 0;
		
		for( var i = 0; i < symbols.length; i++ )
		{
			if( symbols[i].kind == SYM_NONTERM )
			{
				for( var j = 0; j < symbols[i].prods.length; j++ )
				{
					nullable = false;
					for( var k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
					{
						symbols[i].first = union( symbols[i].first, symbols[productions[symbols[i].prods[j]].rhs[k]].first );

						nullable = symbols[productions[symbols[i].prods[j]].rhs[k]].nullable;
						if( !nullable )
							break;
					}
					cnt += symbols[i].first.length;
					
					if( k == productions[symbols[i].prods[j]].rhs.length )
						nullable = true;

					symbols[i].nullable |= nullable;
				}
			}
		}
		
		//_print( "first: cnt = " + cnt + " old_cnt = " + old_cnt + "<br />" );
	}
	while( cnt != old_cnt );
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		rhs_first()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns all terminals that are possible from a given position
					of a production's right-hand side.
					
	Parameters:		item			Item to which the lookaheads are added to.
					p				The production where the computation should
									be done on.
					begin			The offset of the symbol where rhs_first()
									begins its calculation from.
	
	Returns:		true			If the whole rest of the right-hand side can
									be null (epsilon),
					false			else.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function rhs_first( item, p, begin )
{
	var f, i, nullable = true;
	for( i = begin; i < p.rhs.length; i++ )
	{
		item.lookahead = union( item.lookahead, symbols[p.rhs[i]].first );
		
		if( !symbols[p.rhs[i]].nullable )
			nullable = false;
		
		if( !nullable )
			break;
	}
	
	return nullable;
}
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007-2009 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	printtab.js
Author:	Jan Max Meyer
Usage:	Functions for printing the parse tables and related functions.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/*
	15.04.2009	Jan Max Meyer	Removed the HTML-Code generation flag and re-
								placed it with text output; In WebEnv, this
								will be placed in <pre>-tags, and we finally
								can view the parse-tables even on the console.
*/
/* -FUNCTION--------------------------------------------------------------------
	Function:		print_parse_tables()
	
	Author:			Jan Max Meyer
	
	Usage:			Prints the parse tables in a desired format.
					
	Parameters:		mode					The output mode. This can be either
											MODE_GEN_JS to create JavaScript/
											JScript code as output or MODE_GEN_HTML
											to create HTML-tables as output
											(the HTML-tables are formatted to
											look nice with the JS/CC Web
											Environment).
	
	Returns:		code					The code to be printed to a file or
											web-site.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.04.2009	Jan Max Meyer	New table generator section to build default
								reduction table on each state.
----------------------------------------------------------------------------- */
function print_parse_tables( mode ){
	var code	= "";
	var i, j, deepest = 0, val;
	switch(mode){
		case MODE_GEN_HTML:case "html":{
			code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
			code += "<tr>";
			code += "<td class=\"tabtitle\" colspan=\"2\">Pop-Table</td>";
			code += "</tr>";
			code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
			code += "<td class=\"coltitle\">Number of symbols to pop</td>";
			code += "</tr>";
			for( i = 0; i < productions.length; i++ ){
				code += "<tr>";
				code += "<td style=\"border-right: 1px solid lightgray;\">" + productions[i].lhs + "</td>";
				code += "<td>" + productions[i].rhs.length + "</td>";
				code += "</tr>";
			}
			code += "</table>";

			for( i = 0; i < symbols.length; i++ )
				if( symbols[i].kind == SYM_TERM )
					deepest++;
			
			code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
			code += "<tr>";
			code += "<td class=\"tabtitle\" colspan=\"" + (deepest + 1) + "\">Action-Table</td>";
			code += "</tr>";
			
			code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">State</td>";
			for( i = 0; i < symbols.length; i++ )
			{
				if( symbols[i].kind == SYM_TERM )
					code += "<td><b>" + symbols[i].label + "</b></td>";
			}
			
			code += "</tr>";
			
			for( i = 0; i < states.length; i++ )
			{
				code += "<tr>" ;
				code += "<td class=\"coltitle\" style=\"border-right: 1px solid lightgray;\">" + i + "</td>";
				
				for( j = 0; j < symbols.length; j++ )
				{
					if( symbols[j].kind == SYM_TERM )
					{
						code += "<td>";
						if( ( val = get_table_entry( states[i].actionrow, j ) ) != void(0) )
						{
							if( val <= 0 )
								code += "r" + (val * -1);
							else
								code += "s" + val;
						}
						code += "</td>";
					}
				}
				
				code += "</tr>" ;
			}
			
			code += "</table>";

			for( i = 0; i < symbols.length; i++ )
				if( symbols[i].kind == SYM_NONTERM )
					deepest++;
			
			code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
			code += "<tr>";
			code += "<td class=\"tabtitle\" colspan=\"" + (deepest + 1) + "\">Goto-Table</td>";
			code += "</tr>";
			
			code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">State</td>";
			for( i = 0; i < symbols.length; i++ )
			{
				if( symbols[i].kind == SYM_NONTERM )
					code += "<td>" + symbols[i].label + "</td>";
			}
			
			code += "</tr>";
			
			for( i = 0; i < states.length; i++ )
			{
				code += "<tr>" ;
				code += "<td class=\"coltitle\" style=\"border-right: 1px solid lightgray;\">" + i + "</td>";
				
				for( j = 0; j < symbols.length; j++ )
				{
					if( symbols[j].kind == SYM_NONTERM )
					{
						code += "<td>";
						if( ( val = get_table_entry( states[i].gotorow, j ) ) != void(0) )
						{
							code += val;
						}
						code += "</td>";
					}
				}
				
				code += "</tr>" ;
			}
			
			code += "</table>";

			code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
			code += "<tr>";
			code += "<td class=\"tabtitle\" colspan=\"2\">Default Actions Table</td>";
			code += "</tr>";
			code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
			code += "<td class=\"coltitle\">Number of symbols to pop</td>";
			code += "</tr>";
			for( i = 0; i < states.length; i++ ){
				code += "<tr>";
				code += "<td style=\"border-right: 1px solid lightgray;\">State " + i + "</td>";
				code += "<td>" + ( ( states[ i ].def_act < 0 ) ? "(none)" : states[ i ].def_act ) + "</td>";
				code += "</tr>";
			}
			code += "</table>";

		break;}
		case MODE_GEN_JS:case "js":{
			var pop_tab_json =[];
			for( i = 0; i < productions.length; i++ )
				pop_tab_json.push([productions[i].lhs,productions[i].rhs.length]);
			code +="\nvar pop_tab ="+JSON.stringify(pop_tab_json)+";\n";
			
			var act_tab_json =[];
			for( i = 0; i < states.length; i++ ){
				var act_tab_json_item=[];
				for( j = 0; j < states[i].actionrow.length; j++ )
					act_tab_json_item.push(states[i].actionrow[j][0],states[i].actionrow[j][1]);
				act_tab_json.push(act_tab_json_item);}
			code +="\nvar act_tab ="+JSON.stringify(act_tab_json)+";\n";
			
			var goto_tab_json = [];
			for( i = 0; i < states.length; i++ ){
				var goto_tab_json_item=[];
				for( j = 0; j < states[i].gotorow.length; j++ )
					goto_tab_json_item.push(states[i].gotorow[j][0],states[i].gotorow[j][1]);
				goto_tab_json.push(goto_tab_json_item);}
			code +="\nvar goto_tab ="+JSON.stringify(goto_tab_json)+";\n";	
			
			var defact_tab_json=[];
			for( i = 0; i < states.length; i++ )
				defact_tab_json.push(states[i].def_act);
			code +="\nvar defact_tab ="+JSON.stringify(defact_tab_json)+";\n";
			
		break;}		
	}	
	return code;
}
/* -FUNCTION--------------------------------------------------------------------
	Function:		print_dfa_table()
	
	Author:			Jan Max Meyer
	
	Usage:			Generates a state-machine construction from the deterministic
					finite automata.
					
	Parameters:		dfa_states				The dfa state machine for the lexing
											function.
	
	Returns:		code					The code to be inserted into the
											static parser driver framework.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function print_dfa_table( dfa_states )
{	
	var code ="";
	//code += "\nvar DFA_DATA=[];\n\n";
	//var json=[],ii,jj;
	
	//This is how I would format it
	/*for( ii=0; ii < dfa_states.length; ii++)
	(
		function( ii )
		{
			var line = {};
			for( jj = 0; jj < dfa_states[ii].line.length; jj++ )
				if(dfa_states[ii].line[jj]!=-1)
					line[jj] = dfa_states[ii].line[jj];
					
		//and so on... ;)
		
		json.push({
			line:line,
			accept:dfa_states[ii].accept,
			});
		//code+="\tDFA_DATA.push("+JSON.stringify({line:line,accept:dfa_states[ii].accept})+");\n";
		//code+="\tDFA_DATA.push("+JSON.stringify(line)+");\n";
	})(ii);*/
	//var json_str = JSON.stringify( json );
	//json_str=json_str.replace( /,/g , ",\n\t" );
	//code+="\nvar DFA_DATA="+json_str+";\n\n";
	code += "function DFA(state,chr,match,pos,set_match,set_match_pos,set_state){\n";
	/*
	code+="var st=DATA[state].line[chr];\n"+
	"if(typeof st == \"undefined\")st=-1;\n"+
	"var ac=DATA[state].accept;\n"+
	"set_state(st)\n"+
	"if(ac!=-1){\n"+
	"\tset_match(ac);\n"+
	"\tset_match_pos(pos);\n"+
	"}\n"+
	"return;\n\n";
	*/
	var i, j, k, eof_id = -1;
	var grp_start, grp_first, first;
	
	code += "switch( state )\n{\n";
	for( i = 0; i < dfa_states.length; i++ )
	{
		code += "	case " + i + ":\n";
		
		first = true;
		for( j = 0; j < dfa_states.length; j++ )
		{
			grp_start = -1;
			grp_first = true;
			for( k = 0; k < dfa_states[i].line.length + 1; k++ )
			{
				if( k < dfa_states[i].line.length && dfa_states[i].line[k] == j )
				{
					if( grp_start == -1 )
						grp_start = k;
				}
				else if( grp_start > -1 )
				{
					if( grp_first )
					{
						code += "		";
						if( !first )
							code += "else ";
						code += "if( ";
						
						grp_first = false;
						first = false;
					}
					else
						code += " || ";
					
					if( grp_start == k - 1 )
						code += "chr == " + grp_start;
					else					
						code += "( chr >= " + grp_start +
									" && chr <= " + (k-1) + " )";
					grp_start = -1;
					k--;
				}
			}
			
			if( !grp_first )
				//code += " ) state = " + j + ";\n";
				code += " ) set_state(" + j + ");\n";
		}
				
		code += "		";
		if( !first )
			code += "else ";
		//code += "state = -1;\n"
		code += "set_state(-1);\n"
		
		if( dfa_states[i].accept > -1 )
		{
			//code += "		match = " + dfa_states[i].accept + ";\n";
			//code += "		match_pos = pos;\n";
			code += "		set_match(" + dfa_states[i].accept + ");\n";
			code += "		set_match_pos(pos);\n";
		}
		
		code += "		break;\n\n";
	}
	
	code += "}\n\n";
	code += "}\n";
	return code;
}

/* -FUNCTION--------------------------------------------------------------------
	Function:		print_symbol_labels()
	
	Author:			Jan Max Meyer
	
	Usage:			Prints all symbol labels into an array; This is used for
					error reporting purposes only in the resulting parser.
					
	Parameters:		void
	
	Returns:		code					The code to be inserted into the
											static parser driver framework.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function print_symbol_labels(){//Generate code without comments
	var i,arr
	for(var i = 0, arr= []; i < symbols.length ; i++ )
		arr.push( symbols[ i ].label );
	return "var labels = "+JSON.stringify( symbols )+";\n\n";
}

/* -FUNCTION--------------------------------------------------------------------
	Function:		print_term_actions()
	
	Author:			Jan Max Meyer
	
	Usage:			Prints the terminal symbol actions to be associated with a
					terminal definition into a switch-case-construct.
					
	Parameters:		void
	
	Returns:		code					The code to be inserted into the
											static parser driver framework.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	22.08.2008	Jan Max Meyer	Bugfix: %offset returned the offset BEHIND the
								terminal, now it's the correct value; %source,
								which was documented in the manual since v0.24
								was not implemented.
	10.12.2008	Jan Max Meyer	Removed the switch...case structure and replaced
								it with if...else, because of new possibilities
								with the lexical analyzer (more lex-like beha-
								vior). continue can now be used in semantic
								actions, or break, which is automatically done
								in each parser template.
----------------------------------------------------------------------------- */
function print_term_actions()
{
	var code = "";
	var re = /%match|%offset|%source/;
	var i, j, k;	
	var semcode;
	var strmatch;
	
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_TERM
			&& symbols[i].code != "" )
		{			
			code += "	" + ( code != "" ? "else " : "" ) +
						"if( match == " + i + " )\n";
			code += "	{\n";
			
			semcode = "";
			for( j = 0, k = 0; j < symbols[i].code.length; j++, k++ )
			{
				strmatch = re.exec( symbols[i].code.substr( j, symbols[i].code.length ) );
				if( strmatch && strmatch.index == 0 )
				{
					if( strmatch[0] == "%match" )
						semcode += "PCB.att";
					else if( strmatch[0] == "%offset" )
						semcode += "( PCB.offset - PCB.att.length )";
					else if( strmatch[0] == "%source" )
						semcode += "PCB.src";
					
					j += strmatch[0].length - 1;
					k = semcode.length;
				}
				else
					semcode += symbols[i].code.charAt( j );
			}

			code += "		" + semcode + "\n";
			
			code += "		}\n";
		}
	}

	return code;
}

	
/* -FUNCTION--------------------------------------------------------------------
	Function:		print_actions()
	
	Author:			Jan Max Meyer
	
	Usage:			Generates a switch-case-construction that contains all
					the semantic actions. This construction should then be
					generated into the static parser driver template.
					
	Parameters:		void
	
	Returns:		code					The code to be inserted into the
											static parser driver framework.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function print_actions()
{
	var code = "";
	var re = /%[0-9]+|%%/;
	var semcode, strmatch;
	var i, j, k, idx;
	
	code += "switch( act )\n";
	code += "{\n";
	
	for( i = 0; i < productions.length; i++ )
	{
		code += "	case " + i + ":\n";
		code += "	{\n";
		
		semcode = "";
		for( j = 0, k = 0; j < productions[i].code.length; j++, k++ )
		{
			strmatch = re.exec( productions[i].code.substr( j, productions[i].code.length ) );
			if( strmatch && strmatch.index == 0 )
			{
				if( strmatch[0] == "%%" )
					semcode += "rval";
				else
				{
					idx = parseInt( strmatch[0].substr( 1, strmatch[0].length ) );
					idx = productions[i].rhs.length - idx + 1;
					semcode += "vstack[ vstack.length - " + idx + " ]";
				}
				
				j += strmatch[0].length - 1;
				k = semcode.length;
			}
			else
			{
				semcode += productions[i].code.charAt( j );
			}
		}

		code += "		" + semcode + "\n";
		code += "	}\n";
		code += "	break;\n";
	}
	
	code += "}\n\n";

	return code;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		get_eof_symbol_id()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns the value of the eof-symbol.
					
	Parameters:	
		
	Returns:		eof_id					The id of the EOF-symbol.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_eof_symbol_id()
{
	var eof_id = -1;
	
	//Find out which symbol is for EOF!	
	for( var i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].special == SPECIAL_EOF )
		{
			eof_id = i;
			break;
		}
	}

	if( eof_id == -1 )
		_error( "No EOF-symbol defined - This might not be possible (bug!)" );
	
	return eof_id;
}

/* -FUNCTION--------------------------------------------------------------------
	Function:		get_error_symbol_id()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns the value of the error-symbol.
					
	Parameters:	
		
	Returns:		eof_id					The id of the EOF-symbol.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_error_symbol_id()
{
	var error_id = -1;
	
	//Find out which symbol is for EOF!	
	for( var i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].special == SPECIAL_ERROR )
		{
			error_id = i;
			break;
		}
	}

	if( error_id == -1 )
		_error( "No ERROR-symbol defined - This might not be possible (bug!)" );
	
	return error_id;
}

/* -FUNCTION--------------------------------------------------------------------
	Function:		get_whitespace_symbol_id()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns the ID of the whitespace-symbol.
					
	Parameters:	
		
	Returns:		whitespace				The id of the whitespace-symbol.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_whitespace_symbol_id()
{
	return whitespace_token;
}

/* -FUNCTION--------------------------------------------------------------------
	Function:		get_error_state()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns the ID of a non-existing state.
					
	Parameters:	
		
	Returns:		length					The length of the states array.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_error_state()
{
	return states.length + 1;
}
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007-2009 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	tabgen.js
Author:	Jan Max Meyer
Usage:	LALR(1) closure and table construction

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

// --- Utility functions: I think there is no documentation necessary ;) ---
function create_state()
{
	var state = new STATE();
	
	state.kernel = [];
	state.epsilon = [];
	state.actionrow = [];
	state.gotorow = [];
	state.done = false;
	state.closed = false;
	state.def_act = 0;

	states.push( state );
	
	return state;
}


function create_item( p )
{
	var item = new ITEM();
	
	item.prod = p;
	item.dot_offset = 0;
	item.lookahead = [];
	
	return item;
}


function add_table_entry( row, sym, act )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row;
	
	row.push( [ sym, act ] );
	return row;
}



function update_table_entry( row, sym, act )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
		{
			row[i][1] = act;
			return row;
		}

	return row;
}


function remove_table_entry( row, sym )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
		{
			row.splice( i, 1 );
			return row;
		}

	return row;
}

function get_table_entry( row, sym )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row[i][1];
	
	return void(0);
}


function get_undone_state()
{
	for( var i = 0; i < states.length; i++ )
	{
		if( states[i].done == false )
			return i;
	}
			
	return -1;
}


function sort_partition( a, b )
{
	return a.prod - b.prod;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		find_symbol()
	
	Author:			Jan Max Meyer
	
	Usage:			Searches for a symbol using its label and kind.
					
	Parameters:		label				The label of the symbol.
					kind				Type of the symbol. This can be
										SYM_NONTERM or SYM_TERM
					special				Specialized symbols 

	Returns:		The index of the desired object in the symbol table,
					-1 if the symbol was not found.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.11.2007	Jan Max Meyer	Allow to find eof_character
	19.11.2008	Jan Max Meyer	Special character checking
----------------------------------------------------------------------------- */
function find_symbol( label, kind, special )
{
	if( !special )
		special = SPECIAL_NO_SPECIAL;

	for( var i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].label.toString() == label.toString()
			&& symbols[i].kind == kind
				&& symbols[i].special == special )
		{
			return i;
		}
	}
	
	return -1;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_symbol()
	
	Author:			Jan Max Meyer
	
	Usage:			Creates a new symbol (if necessary) and appends it to the
					global symbol array. If the symbol does already exist, the
					instance of that symbol is returned only.
					
	Parameters:		label				The label of the symbol. In case of
										kind == SYM_NONTERM, the label is the
										name of the right-hand side, else it
										is the regular expression for the
										terminal symbol.
					kind				Type of the symbol. This can be
										SYM_NONTERM or SYM_TERM
					special				Specialized symbols 
	
	Returns:		The particular object of type SYMBOL.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.11.2007	Jan Max Meyer	Bugfix: EOF-character is a special case!
	19.11.2008	Jan Max Meyer	Special character checking
----------------------------------------------------------------------------- */
function create_symbol( label, kind, special )
{
	var exists;
	
	if( ( exists = find_symbol( label, kind, special ) ) > -1 )
		return symbols[ exists ].id;
	
	var sym = new SYMBOL();
	sym.label = label;
	sym.kind = kind;
	sym.prods = [];
	sym.nullable = false;
	sym.id = symbols.length;
	sym.code = "";
	
	sym.assoc = ASSOC_NONE; //Could be changed by grammar parser
	sym.level = 0; //Could be changed by grammar parser

	sym.special = special;
	
	//Flags
	sym.defined = false;

	sym.first = [];
	
	if( kind == SYM_TERM )
		sym.first.push( sym.id );

	symbols.push( sym );
	
	//_print( "Creating new symbol " + sym.id + " kind = " + kind + " >" + label + "<" );
	
	return sym.id;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		item_set_equal()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if two item sets contain the same items. The items
					may only differ in their lookahead.
					
	Parameters:		set1					Set to be compared with set2.
					set2					Set to be compared with set1.
	
	Returns:		true					If equal,
					false					else.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function item_set_equal( set1, set2 )
{
	var i, j, cnt = 0;
	
	if( set1.length != set2.length )
		return false;

	for( i = 0; i < set1.length; i++ )
	{
		for( j = 0; j < set2.length; j++ )
		{			
			if( set1[i].prod == set2[j].prod &&
				set1[i].dot_offset == set2[j].dot_offset )
			{
				cnt++;
				break;
			}
		}
	}
	
	if( cnt == set1.length )
		return true;
		
	return false;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		close_items()
	
	Author:			Jan Max Meyer
	
	Usage:			
					
	Parameters:		
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function close_items( seed, closure )
{
	var i, j, k;
	var cnt = 0, tmp_cnt = 0;
	var item;
	
	for( i = 0; i < seed.length; i++ )
	{
		if( seed[i].dot_offset < productions[seed[i].prod].rhs.length )
		{
			if( symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].kind == SYM_NONTERM )
			{
				for( j = 0; j < symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods.length; j++ )
				{
					for( k = 0; k < closure.length; k++ )
					{
						if( closure[k].prod == symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j] )
							break;
					}
					
					if( k == closure.length )
					{
						item = create_item( symbols[productions[seed[i].prod].rhs[seed[i].dot_offset]].prods[j] );									
						closure.push( item );
						
						cnt++;
					}
					
					tmp_cnt = closure[k].lookahead.length;
					if( rhs_first( closure[k], productions[seed[i].prod], seed[i].dot_offset+1 ) )
						closure[k].lookahead = union( closure[k].lookahead, seed[i].lookahead );
						
					cnt += closure[k].lookahead.length - tmp_cnt;
				}
			}
		}
	}
	
	return cnt;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		lalr1_closure()
	
	Author:			Jan Max Meyer
	
	Usage:			Implements the LALR(1) closure algorithm. A short overview:
	
					1. Closing a closure_set of ITEM() objects from a given
					   kernel seed (this includes the kernel seed itself!)
					2. Moving all epsilon items to the current state's epsilon
					   set.
					3. Moving all symbols with the same symbol right to the
					   dot to a partition set.
					4. Check if there is already a state with the same items
					   as there are in the partition. If so, union the look-
					   aheads, else, create a new state and set the partition
					   as kernel seed.
					5. If the (probably new state) was not closed yet, perform
					   some table creation: If there is a terminal to the
					   right of the dot, do a shift on the action table, else
					   do a goto on the goto table. Reductions are performed
					   later, when all states are closed.
					
	Parameters:		s				Id of the state that should be closed.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	29.02.2009	Jan Max Meyer	There was a bug that rose up with some grammars
								and caused wrong lookahead computation.
----------------------------------------------------------------------------- */
function lalr1_closure( s )
{
	var closure = [], nclosure, partition;
	var item, partition_sym;
	var i, j, k, l, cnt = 0, old_cnt = 0, tmp_cnt, ns;
	
	/*
	for( i = 0; i < states[s].kernel.length; i++ )
	{
		closure.push( new ITEM() );
		closure[i].prod = states[s].kernel[i].prod;
		closure[i].dot_offset = states[s].kernel[i].dot_offset;
		closure[i].lookahead = new Array();
	
		for( j = 0; j < states[s].kernel[i].lookahead.length; j++ )
			closure[i].lookahead[j] = states[s].kernel[i].lookahead[j];
	}
	*/
		
	do
	{
		old_cnt = cnt;
		cnt = close_items( ( ( old_cnt == 0 ) ? states[s].kernel : closure ), closure );
		//_print( "closure: cnt = " + cnt + " old_cnt = " + old_cnt + "<br />" );
	}
	while( cnt != old_cnt );
	
	for( i = 0; i < states[s].kernel.length; i++ )
	{
		if( states[s].kernel[i].dot_offset < productions[states[s].kernel[i].prod].rhs.length )
		{
			closure.unshift( new ITEM() );

			closure[0].prod = states[s].kernel[i].prod;
			closure[0].dot_offset = states[s].kernel[i].dot_offset;
			closure[0].lookahead = [];
		
			for( j = 0; j < states[s].kernel[i].lookahead.length; j++ )
				closure[0].lookahead[j] = states[s].kernel[i].lookahead[j];
		}
	}
	
	/*
	print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
		"closure in " + s, closure );
	print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML, 
		"states[" + s + "].epsilon", states[s].epsilon );
	*/
	
	for( i = 0; i < closure.length; i++ )
	{
		if( productions[closure[i].prod].rhs.length == 0 )
		{
			for( j = 0; j < states[s].epsilon.length; j++ )
				if( states[s].epsilon[j].prod == closure[i].prod
						&& states[s].epsilon[j].dot_offset == closure[i].dot_offset )
							break;
			
			if( j == states[s].epsilon.length )			
				states[s].epsilon.push( closure[i] );

			closure.splice( i, 1 );
		}
	}
	
	while( closure.length > 0 )
	{
		partition = [];
		nclosure = [];
		partition_sym = -1;
		
		for( i = 0; i < closure.length; i++ )
		{
			if( partition.length == 0 )
				partition_sym = productions[closure[i].prod].rhs[closure[i].dot_offset];
						
			if( closure[i].dot_offset < productions[closure[i].prod].rhs.length )
			{
				if( productions[closure[i].prod].rhs[closure[i].dot_offset]
						== partition_sym )
				{
					closure[i].dot_offset++;
					partition.push( closure[i] );
				}
				else
					nclosure.push( closure[i] );
			}
		}
		
		if( partition.length > 0 )
		{

			/*
				beachcoder Feb 23, 2009:
				Uhh here was a very exciting bug that only came up on
				special grammar constellations: If we don't sort the
				partition set by production here, it may happen that
				states get wrong lookahead, and unexpected conflicts
				or failing grammars come up.
			*/
			partition.sort( sort_partition );
			
			//Now one can check for equality!
			for( i = 0; i < states.length; i++ )
			{	
				if( item_set_equal( states[i].kernel, partition ) )
					break;
			}
			
			if( i == states.length )
			{				
				ns = create_state();
				//_print( "Generating state " + (states.length - 1) );
				ns.kernel = partition;
			}
			
			tmp_cnt = 0;
			cnt = 0;
			
			for( j = 0; j < partition.length; j++ )
			{
				tmp_cnt += states[i].kernel[j].lookahead.length;
				states[i].kernel[j].lookahead = union( states[i].kernel[j].lookahead,
													partition[j].lookahead );

				cnt += states[i].kernel[j].lookahead.length;
			}					
			
			if( tmp_cnt != cnt )
				states[i].done = false;
			
			//_print( "<br />states[" + s + "].closed = " + states[s].closed );
			if( !(states[s].closed) )
			{
				for( j = 0; j < partition.length; j++ )
				{
					//_print( "<br />partition[j].dot_offset-1 = " + 
					//	(partition[j].dot_offset-1) + " productions[partition[j].prod].rhs.length = " 
					//		+ productions[partition[j].prod].rhs.length );
							
					if( partition[j].dot_offset-1 < productions[partition[j].prod].rhs.length )
					{
						//_print( "<br />symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind = " + 
						//	symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind );
						if( symbols[productions[partition[j].prod].rhs[partition[j].dot_offset-1]].kind
								== SYM_TERM )
						{
							states[s].actionrow = add_table_entry( states[s].actionrow,
								productions[partition[j].prod].rhs[partition[j].dot_offset-1], i );
								
							shifts++;
						}
						else
						{
							states[s].gotorow = add_table_entry( states[s].gotorow,
								productions[partition[j].prod].rhs[partition[j].dot_offset-1], i );
							
							gotos++;
						}
					}
				}
			}
		}
		
		closure = nclosure;
	}
	
	states[s].closed = true;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		do_reductions()
	
	Author:			Jan Max Meyer
	
	Usage:			Inserts reduce-cells into the action table. A reduction
					does always occur for items with the dot to the far right
					of the production and to items with no production (epsilon
					items).
					The reductions are done on the corresponding lookahead
					symbols. If a shift-reduce conflict appears, the function
					will always behave in favor of the shift.
					
					Reduce-reduce conflicts are reported immediatelly, and need
					to be solved.
					
	Parameters:		item_set				The item set to work on.
					s						The index of the state where the
											reductions take effect.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function do_reductions( s )
{
	var n, i, j, ex, act, output_warning, item_set;
	var reds = [];
	var max = 0, count;
	
	for( n = 0; n < 2; n++ )
	{
		if( !n )
			item_set = states[ s ].kernel;
		else
			item_set = states[ s ].epsilon;
			
		// Do the reductions
		for( i = 0; i < item_set.length; i++ )
		{
			if( item_set[i].dot_offset == productions[item_set[i].prod].rhs.length )
			{
				for( j = 0; j < item_set[i].lookahead.length; j++ )
				{
					output_warning = true;
	
					ex = get_table_entry( states[s].actionrow,
							item_set[i].lookahead[j] );
	
					act = ex;
					if( ex == void(0) )
					{
						act = -1 * item_set[i].prod;

						states[s].actionrow = add_table_entry( states[s].actionrow,
							item_set[i].lookahead[j], act );
							
						reduces++;
					}
					else
					{
						var warning	= "";
						if( ex > 0 )
						{
							//Shift-reduce conflict
	
							//Is there any level specified?
							if( symbols[item_set[i].lookahead[j]].level > 0
								|| productions[ item_set[i].prod ].level > 0 )
							{
								//Is the level the same?
								if( symbols[item_set[i].lookahead[j]].level ==
									productions[ item_set[i].prod ].level )
								{
									//In case of left-associativity, reduce
									if( symbols[item_set[i].lookahead[j]].assoc
											== ASSOC_LEFT )
									{
										//Reduce
										act = -1 * item_set[i].prod;
									}
									//else, if nonassociativity is set,
									//remove table entry.
									else
									if( symbols[item_set[i].lookahead[j]].assoc
											== ASSOC_NOASSOC )
									{
										remove_table_entry( states[s].actionrow,
												item_set[i].lookahead[j] );
	
										_warning(
											"Removing nonassociative symbol '" +
											symbols[item_set[i].lookahead[j]].label +
												"' in state " + s );
	
										output_warning = false;
									}
								}
								else
								{
									//If symbol precedence is lower production's
									//precedence, reduce
									if( symbols[item_set[i].lookahead[j]].level <
											productions[ item_set[i].prod ].level )
										//Reduce
										act = -1 * item_set[i].prod;
								}
							}
							
							warning = "Shift";
						}
						else
						{
							//Reduce-reduce conflict
							act = ( ( act * -1 < item_set[i].prod ) ?
										act : -1 * item_set[i].prod );
							
							warning = "Reduce";
						}
	
						warning += "-reduce conflict on symbol '" +
							symbols[item_set[i].lookahead[j]].label +
								"' in state " + s;
						warning += "\n         Conflict resolved by " +
							( ( act <= 0 ) ? "reducing with production" :
								"shifting to state" ) + " " +
							( ( act <= 0 ) ? act * -1 : act );
	
						if( output_warning )
							_warning( warning );
	
						if( act != ex )
							update_table_entry( states[s].actionrow,
								item_set[i].lookahead[j], act );
					}
					
					//Remember this reduction, if there is any
					if( act <= 0 )
						reds.push( act * -1 );
				}
			}
		}
	}
	
	/*
		JMM 16.04.2009
		Find most common reduction
	*/
	states[ s ].def_act = -1; //Define no default action
	
	//Are there any reductions? Then select the best of them!
	for( i = 0; i < reds.length; i++ )
	{
		for( j = 0, count = 0; j < reds.length; j++ )
		{
			if( reds[j] == reds[i] )
				count++;
		}
		
		if( max < count )
		{
			max = count;
			states[ s ].def_act = reds[ i ];
		}
	}
	
	//Remove all default reduce action reductions, if they exist.
	if( states[s].def_act >= 0 )
	{
		do
		{
			count = states[s].actionrow.length;

			for( i = 0; i < states[s].actionrow.length; i++ )
				if( states[s].actionrow[i][1] == states[s].def_act * -1 )
					states[s].actionrow.splice( i, 1 );
		}
		while( count != states[s].actionrow.length );
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		lalr1_parse_table()
	
	Author:			Jan Max Meyer
	
	Usage:			Entry function to perform table generation. If all states
					of the parsing state machine are constructed, all reduce
					operations are inserted in the particular positions of the
					action table.
					
					If there is a Shift-reduce conflict, the shift takes the
					higher precedence. Reduce-reduce conflics are resolved by
					choosing the first defined production.
					
	Parameters:		debug					Toggle debug trace output; This
											should only be switched on when
											JS/CC is executed in a web environ-
											ment, because HTML-code will be
											printed.
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.04.2009	Jan Max Meyer	Added the feature of default productions; The
								most common production will be defined as the
								default, and all entries referencing this rule
								are removed.
----------------------------------------------------------------------------- */
function lalr1_parse_table( debug )
{
	var i, j, k, item, s, p;
	
	//Create EOF symbol
	item = create_item( 0 );
	s = create_symbol( "$", SYM_TERM, SPECIAL_EOF );
	item.lookahead.push( s );
	
	//Create first state
	s = create_state();
	s.kernel.push( item );
	
	while( ( i = get_undone_state() ) >= 0 )
	{
		states[i].done = true;
		lalr1_closure( i );
	}
	
	for( i = 0; i < states.length; i++ )
		do_reductions( i );

	if( debug )
	{		
		for( i = 0; i < states.length; i++ )
		{
			print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
				"states[" + i + "].kernel", states[i].kernel );
			print_item_set( (exec_mode == EXEC_CONSOLE) ? MODE_GEN_TEXT : MODE_GEN_HTML,
				"states[" + i + "].epsilon", states[i].epsilon );
		}

		_print( states.length + " States created." );
	}
}



/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	util.js
Author:	Jan Max Meyer
Usage:	Utility functions used by several modules

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		union()
	
	Author:			Jan Max Meyer
	
	Usage:			Unions the content of two arrays.
					
	Parameters:		dest_array				The destination array.
					src_array				The source array. Elements that are
											not in dest_array but in src_array
											are copied to dest_array.
	
	Returns:		The destination array, the union of both input arrays.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function union( dest_array, src_array )
{
	var i, j;
	for( i = 0; i < src_array.length; i++ )
	{
		for( j = 0; j < dest_array.length; j++ )
		{
			if( src_array[i] == dest_array[j] )
				break;
		}
		
		if( j == dest_array.length )
			dest_array.push( src_array[i] );
	}
	
	return dest_array;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		reset_all()
	
	Author:			Jan Max Meyer
	
	Usage:			Resets all global variables. reset_all() should be called
					each time a new grammar is compiled.
					
	Parameters:		mode			Exec-mode; This can be either
									JSCC_EXEC_CONSOLE or JSCC_EXEC_WEB
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function reset_all( mode )
{
	var p;
	
	assoc_level = 1;
	exec_mode = mode;

	symbols = [];
	productions = [];
	states = [];
	nfa_states = [];
	dfa_states = [];
	lex = [];
	
	//Placeholder for the goal symbol
	create_symbol( "", SYM_NONTERM, SPECIAL_NO_SPECIAL );
	symbols[0].defined = true;
	
	//Error synchronization token
	create_symbol( "ERROR_RESYNC", SYM_TERM, SPECIAL_ERROR );
	symbols[1].defined = true;
	
	p = new PROD();
	p.lhs = 0;
	p.rhs = [];
	p.code = "%% = %1;";
	symbols[0].prods.push( productions.length );
	productions.push( p );
	
	whitespace_token = -1;
	
	/*
	src = new String();
	src_off = 0;
	line = 1;
	lookahead = void(0);
	*/
	file = "";
	errors = 0;
	show_errors = true;
	warnings = 0;
	show_warnings = false;
	
	shifts = 0;
	reduces = 0;
	gotos = 0;
	
	regex_weight = 0;
	
	code_head = "";
	code_foot = "";
}


/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	bitset.js
Author:	Jan Max Meyer
Usage:	Bitset functionalities implemented in JavaScript.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */
///SV: it is no reason to optimize data size, so we may use array of bool directly in code
function BitSetBool(size)
{
	this.data=new Array((size>0)?size:0);
}
BitSetBool.prototype={
	set:function(bit,state)
	{
		return this.data[bit]=state;
	},
	get:function(bit)
	{
		return this.data[bit];
	},
	count:function()
	{
		var i, c = 0;

		for( i = 0; i < this.data.length; i++ )
			if( this.data[i] )
				c++;
		return c;
	}
}
function BitSet32(size){
	this.data=new Array((size>0)?(size+1)>>5:0);
	}
BitSet32.prototype={
	set:function(bit,state)
	{///@TODO simplify this if possible
		this.data[bit >> 5] = state ? (this.data[bit >> 5] | (1 << (bit & 31))) : (this.data[bit >> 5] & ~(1 << (bit & 31)));
	},
	get:function(bit)
	{
		return (this.data[bit >> 5] | (1 << (bit & 31))) ? true : false;
	},
	count:function()
	{
		var i,l,c=0;
		for(i=0,l=this.data.length*32;i<l;i++)
			if(this.get(i))c++;
		return c;
	}
}
//var BitSet=BitSetBool;
var BitSet=BitSet32;

///SV: this functions used before deleting them call from code
function bitset_create(size)
{
	return new BitSet(size);
}
function bitset_set( bitset, bit, state )
{
	return bitset.set(bit,state);
}
function bitset_get( bitset, bit )
{
	return bitset.get(bit);
}
function bitset_count(bitset)
{
	return bitset.count();
}

/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	integrity.js
Author:	Jan Max Meyer
Usage:	Checks the integrity of the grammar by performing several tests.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


/* -FUNCTION--------------------------------------------------------------------
	Function:		undef()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are undefined non-terminals.
					Prints an error message for each undefined non-terminal
					that appears on a right-hand side.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function undef()
{
	var i;
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_NONTERM
			&& symbols[i].defined == false )
		{
			_error( "Call to undefined non-terminal \"" +
						symbols[i].label + "\"" );
		}
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		unreachable()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are unreachable productions.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function unreachable()
{
	var		stack		= [];
	var		reachable	= [];
	var		i, j, k, l;
	
	for( i = 0; i < symbols.length; i++ )
		if( symbols[i].kind == SYM_NONTERM )
			break;
			
	if( i == symbols.length )
		return;
		
	stack.push( i );
	reachable.push( i );
	
	while( stack.length > 0 )
	{
		i = stack.pop();
		for( j = 0; j < symbols[i].prods.length; j++ )
		{
			for( k = 0; k < productions[symbols[i].prods[j]].rhs.length; k++ )
			{
				if( symbols[ productions[symbols[i].prods[j]].rhs[k] ].kind
							== SYM_NONTERM )
				{
					for( l = 0; l < reachable.length; l++ )
						if( reachable[l] == productions[symbols[i].prods[j]].rhs[k] )
							break;
							
					if( l == reachable.length )
					{
						stack.push( productions[symbols[i].prods[j]].rhs[k] );
						reachable.push( productions[symbols[i].prods[j]].rhs[k] );
					}
				}
			}
		}
	}
	
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_NONTERM )
		{
			for( j = 0; j < reachable.length; j++ )
				if( reachable[j] == i )
					break;
			
			if( j == reachable.length )
				_warning( "Unreachable non-terminal \"" + symbols[i].label + "\"" );
		}
	}
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		check_empty_states()
	
	Author:			Jan Max Meyer
	
	Usage:			Checks if there are LALR(1) states that have no lookaheads
					(no shifts or reduces) within their state row.
					
	Parameters:		void
	
	Returns:		void
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
	16.04.2009	Jan Max Meyer	Fixed bug with new default-production
								recognition
----------------------------------------------------------------------------- */
function check_empty_states()
{
	var i;
	for( i = 0; i < states.length; i++ )
		if( states[i].actionrow.length == 0 && states[i].def_act == -1 )
			_error( "No lookaheads in state " + i + 
						", watch for endless list definitions" );
}
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	lexdfa.js
Author:	Jan Max Meyer
Usage:	Deterministic finite automation construction and minimization.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

//Utility functions; I think there is no documentation required about them.

function create_dfa( where )
{///SV0L0CH: this array better to replace by object with single characters like indexes
	var dfa = new DFA();
	
	dfa.line = new Array( MAX_CHAR );
	dfa.accept = -1;
	dfa.nfa_set = [];
	dfa.done = false;
	dfa.group = -1;
	
	where.push( dfa );
	return where.length - 1;
}


function same_nfa_items( dfa_states, items )
{
	var i, j;
	for( i = 0; i < dfa_states.length; i++ )
		if( dfa_states[i].nfa_set.length == items.length )
		{
			for( j = 0; j < dfa_states[i].nfa_set.length; j++ )
				if( dfa_states[i].nfa_set[j] != items[j] )
					break;
			
			if( j == dfa_states[i].nfa_set.length )
				return i;
		}
			
	return -1;
}


function get_undone_dfa( dfa_states )
{
	for( var i = 0; i < dfa_states.length; i++ )
		if( !dfa_states[i].done )
			return i;
			
	return -1;
}


//NFA test function; Has no use currently.
function execute_nfa( machine, str )
{
	var	result		= [];
	var	accept;
	var	last_accept	= [];
	var last_length = 0;
	var	chr_cnt		= 0;

	if( machine.length == 0 )
		return -1;
		
	result.push( 0 );
	while( result.length > 0
		&& chr_cnt < str.length )
	{
		accept = epsilon_closure( result, machine );
		
		if( accept.length > 0 )
		{
			last_accept = accept;
			last_length = chr_cnt;
		}
		
		result = move( result, machine, str.charCodeAt( chr_cnt ) );
		chr_cnt++;
	}
	
	return last_accept;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		move()
	
	Author:			Jan Max Meyer
	
	Usage:			Performs a move operation on a given input character from a
					set of NFA states.
					
	Parameters:		state_set				The set of epsilon-closure states
											on which base the move should be
											performed.
					machine					The NFA state machine.
					ch						A character code to be moved on.
	
	Returns:		If there is a possible move, a new set of NFA-states is
					returned, else the returned array has a length of 0.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function move( state_set, machine, ch )
{
	var hits	= [];
	var tos		= -1;
	
	do
	{
		tos = state_set.pop();
		if( machine[ tos ].edge == EDGE_CHAR )
			if( bitset_get( machine[ tos ].ccl, ch ) )
				hits.push( machine[ tos ].follow );		
	}
	while( state_set.length > 0 );
	
	return hits;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		epsilon_closure()
	
	Author:			Jan Max Meyer
	
	Usage:			Performs an epsilon closure from a set of NFA states.
					
	Parameters:		state_set				The set of states on which base
											the closure is started.
											The whole epsilon closure will be
											appended to this parameter, so this
											parameter acts as input/output value.
					machine					The NFA state machine.
	
	Returns:		An array of accepting states, if available.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function epsilon_closure( state_set, machine )
{
	var 	stack	= [];
	var		accept	= [];
	var		tos		= -1;
	
	for( var i = 0; i < state_set.length; i++ )
		stack.push( state_set[i] );
	
	do
	{
		tos = stack.pop();
		if( machine[ tos ].accept >= 0 )
			accept.push( machine[ tos ].accept );
			
		if( machine[ tos ].edge == EDGE_EPSILON )
		{
			if( machine[ tos ].follow > -1 )
			{
				for( var i = 0; i < state_set.length; i++ )
					if( state_set[i] == machine[ tos ].follow )
						break;
				
				if( i == state_set.length )
				{
					state_set.push( machine[ tos ].follow );
					stack.push( machine[ tos ].follow );
				}
			}
			
			if( machine[ tos ].follow2 > -1 )
			{
				for( var i = 0; i < state_set.length; i++ )
					if( state_set[i] == machine[ tos ].follow2 )
						break;
				
				if( i == state_set.length )
				{
					state_set.push( machine[ tos ].follow2 );
					stack.push( machine[ tos ].follow2 );
				}
			}
		}
	}
	while( stack.length > 0 );
	
	return accept.sort();
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_subset()
	
	Author:			Jan Max Meyer
	
	Usage:			Constructs a deterministic finite automata (DFA) from a non-
					deterministic finite automata, by using the subset construc-
					tion algorithm.
					
	Parameters:		nfa_states				The NFA-state machine on which base
											the DFA will be constructed.

	Returns:		An array of DFA-objects forming the new DFA-state machine.
					This machine is not minimized here.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function create_subset( nfa_states )
{
	var dfa_states = [];
	var stack = [];
	var current = create_dfa( dfa_states );
	var trans;
	var next = -1;
	var lowest_weight;
	
	if( nfa_states.length == 0 )
		return dfa_states;
		
	stack.push( 0 );
	epsilon_closure( stack, nfa_states );
		
	dfa_states[ current ].nfa_set = dfa_states[ current ].nfa_set.concat( stack );
	
	while( ( current = get_undone_dfa( dfa_states ) ) > -1 )
	{
		//_print( "Next DFA-state to process is " + current );
		dfa_states[ current ].done = true;
		
		lowest_weight = -1;
		for( var i = 0; i < dfa_states[ current ].nfa_set.length; i++ )
		{
			if( nfa_states[ dfa_states[ current ].nfa_set[i] ].accept > -1
					&& nfa_states[ dfa_states[ current ].nfa_set[i] ].weight < lowest_weight 
						|| lowest_weight == -1 )
			{
				dfa_states[ current ].accept = nfa_states[ dfa_states[ current ].nfa_set[i] ].accept;
				lowest_weight = nfa_states[ dfa_states[ current ].nfa_set[i] ].weight;
			}
		}
			
		for( var i = MIN_CHAR; i < MAX_CHAR; i++ )
		{
			trans = [];
			trans = trans.concat( dfa_states[ current ].nfa_set );
			
			trans = move( trans, nfa_states, i );
			
			if( trans.length > 0 )
			{
				//_print( "Character >" + String.fromCharCode( i ) + "< from " + dfa_states[ current ].nfa_set.join() + " to " + trans.join() );
				epsilon_closure( trans, nfa_states );
			}

			if( trans.length == 0 )
				next = -1;
			else if( ( next = same_nfa_items( dfa_states, trans ) ) == -1 )
			{				
				next = create_dfa( dfa_states );
				dfa_states[ next ].nfa_set = trans;
				
				//_print( "Creating new state " + next );
			}
			
			dfa_states[ current ].line[ i ] = next;
		}
	}
	
	return dfa_states;
}


/* -FUNCTION--------------------------------------------------------------------
	Function:		create_subset()
	
	Author:			Jan Max Meyer
	
	Usage:			Minimizes a DFA, by grouping equivalent states together.
					These groups form the new, minimized dfa-states.
					
	Parameters:		dfa_states				The DFA-state machine on which base
											the minimized DFA is constructed.

	Returns:		An array of DFA-objects forming the minimized DFA-state
					machine.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function minimize_dfa( dfa_states )
{
	var		groups			= [];
	var		group			= [];
	var		accept_groups	= [];
	var		min_dfa_states	= [];
	var		old_cnt 		= 0;
	var		cnt 			= 0;
	var		new_group;
	var		i, j, k;
	
	if( dfa_states.length == 0 )
		return min_dfa_states;

	/*
		Forming a general starting state:
		Accepting and non-accepting states are pushed in
		separate groups first
	*/
	groups.push( [] );
	for( i = 0; i < dfa_states.length; i++ )
	{
		if( dfa_states[i].accept > -1 )
		{
			for( j = 0; j < accept_groups.length; j++ )
				if( accept_groups[j] == dfa_states[i].accept )
					break;
			
			if( j == accept_groups.length )
			{
				accept_groups.push( dfa_states[i].accept );
				groups.push( [] );
			}
			groups[ j+1 ].push( i );
			dfa_states[ i ].group = j+1;
		}
		else
		{
			groups[ 0 ].push( i );
			dfa_states[ i ].group = 0;
		}
	}

	/*
		Now the minimization is performed on base of
		these default groups
	*/
	do
	{
		old_cnt = cnt;

		for( i = 0; i < groups.length; i++ )
		{
			new_group = [];
			
			if( groups[i].length > 0 )
			{
				for( j = 1; j < groups[i].length; j++ )
				{
					for( k = MIN_CHAR; k < MAX_CHAR; k++ )
					{
						/*
							This verifies the equality of the
							first state in this group with its
							successors
						*/
						if( dfa_states[ groups[i][0] ].line[k] !=
								dfa_states[ groups[i][j] ].line[k] &&
							( dfa_states[ groups[i][0] ].line[k] == -1 ||
								dfa_states[ groups[i][j] ].line[k] == -1 ) ||
									( dfa_states[ groups[i][0] ].line[k] > -1 && 
											dfa_states[ groups[i][j] ].line[k] > -1 &&
										dfa_states[ dfa_states[ groups[i][0] ].line[k] ].group
											!= dfa_states[ dfa_states[ groups[i][j] ].line[k] ].group ) )
						{
							/*
								If this item does not match, but it to a new group
							*/
							dfa_states[ groups[i][j] ].group = groups.length;
							new_group = new_group.concat( groups[i].splice( j, 1 ) );
							j--;
							
							break;
						}
					}
				}
			}

			if( new_group.length > 0 )
			{
				groups[ groups.length ] = [];
				groups[ groups.length-1 ] = groups[ groups.length-1 ].concat( new_group );
				cnt += new_group.length;
			}
		}
		
		//_print( "old_cnt = " + old_cnt + " cnt = " + cnt );
		//_print( "old_cnt = " + old_cnt + " cnt = " + cnt );
	}
	while( old_cnt != cnt );
	
	/*
		Updating the dfa-state transitions;
		Each group forms a new state.
	*/
	for( i = 0; i < dfa_states.length; i++ )
		for( j = MIN_CHAR; j < MAX_CHAR; j++ )
			if( dfa_states[i].line[j] > -1 )
				dfa_states[i].line[j] = dfa_states[ dfa_states[i].line[j] ].group;

	for( i = 0; i < groups.length; i++ )			
		min_dfa_states.push( dfa_states[ groups[i][0] ] );

	return min_dfa_states;
}

/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	lexdbg.js
Author:	Jan Max Meyer
Usage:	NFA/DFA state machines debugging/dumping functions

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function print_nfa( ta )
{
	_print( "Pos\tType\t\tfollow\t\tfollow2\t\taccept" );
	_print( "-------------------------------------------------------------------" );
	for( var i = 0; i < ta.length; i++ )
	{
		_print( i + "\t" + ( ( nfa_states[i].edge == EDGE_FREE ) ? "FREE" :
			( ( nfa_states[i].edge == EDGE_EPSILON ) ? "EPSILON" : "CHAR" ) ) + "\t\t" +
				( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].follow > -1 ) ? nfa_states[i].follow : "" ) + "\t\t" +
					( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].follow2 > -1 ) ? nfa_states[i].follow2 : "" ) + "\t\t" +
						( ( nfa_states[i].edge != EDGE_FREE && nfa_states[i].accept > -1 ) ? nfa_states[i].accept : "" ) );
						
		if( nfa_states[i].edge == EDGE_CHAR )
		{
			var chars = new String();
			for( var j = MIN_CHAR; j < MAX_CHAR; j++)
			{
				if( bitset_get( nfa_states[i].ccl, j ) )
				{
					chars += String.fromCharCode( j );
					if( chars.length == 10 )
					{
						_print( "\t" + chars );
						chars = "";
					}
				}
			}
			
			if( chars.length > 0 )
				_print( "\t" + chars );
		}
	}
	_print( "" );
}


function print_dfa( dfa_states )
{
	var str = new String();
	var chr_cnt = 0;
	for( var i = 0; i < dfa_states.length; i++ )
	{
		str = i + " => (";
		
		chr_cnt = 0;
		for( var j = 0; j < dfa_states[i].line.length; j++ )
		{
			if( dfa_states[i].line[j] > -1 )
			{
				str += " >" + String.fromCharCode( j ) + "<," + dfa_states[i].line[j] + " ";
				chr_cnt++;
				
				if( ( chr_cnt % 5 ) == 0 )
					str += "\n      ";
			}
		}
		
		str += ") " + dfa_states[i].accept;
		_print( str );
	}
}
/*--- error: line 1: Parse error near
	PARSER------------------------...
	[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] expected */
/*--- error: line 1: Parse error near
	PARSER------------------------...
	[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] expected */
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	main_sm.js [Modified]
Author:	Jan Max Meyer
Usage:	Console-based program entry for the JS/CC parser generator being
		executed using Mozilla/Spidermonkey's smjs script shell.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function _print( txt )
{
	print( txt );
}

function version()
{
	var info = new String();

	info += "JS/CC v" + JSCC_VERSION + ": A LALR(1) Parser and Lexer " +
				"Generator written in JavaScript\n";
	info += "Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies," +
				"Jan Max Meyer\n";
	info += "http://jscc.jmksf.com ++ jscc@jmksf.com\n\n";
	
	info += "You may use, modify and distribute this software under the " +
				"terms and conditions\n";
	info += "of the Artistic License. Please see ARTISTIC for more " +
				"information.\n";
	
	_print( info );
}

function help()
{
	var help = new String();

	help += "usage: jscc [options] input-source\n\n";

	help += "       -h   --help               Print this usage help\n";
	help += "       -i   --version            Print version and copyright\n";
	help += "       -p   --prefix <prefix>    Use <prefix> as sequence pre-\n";
	help += "                                 fixing methods and variables\n";
	help += "       -w   --warnings           Print warnings\n";
		
	_print( help );
}

// --- JS/CC entry ---
var	dfa_table;

//Initialize the globals
reset_all( EXEC_CONSOLE );

//Processing the command line arguments
var src = new String();
var code_prefix	= new String();

for( var i = 0; i < arguments.length; i++ )
{
	if( arguments[i].toLowerCase() == "-p"
			|| arguments[i].toLowerCase() == "--prefix" )
		code_prefix = arguments[++i];
	else if( arguments[i].toLowerCase() == "-w"
			|| arguments[i].toLowerCase() == "--warnings" )
		show_warnings = true;
	else if( arguments[i].toLowerCase() == "-i"
			|| arguments[i].toLowerCase() == "--version" )
	{
		version();
		quit();
	}
	else if( arguments[i].toLowerCase() == "-h"
			|| arguments[i].toLowerCase() == "--help" )
	{
		help();
		quit();
	}
	else if( src == "" )
	{
		src = arguments[i];
		break;
	}
}

if( src != "" )
{
	parse_grammar( src, "" );
	
	if( errors == 0 )
	{
		//Check grammar integrity
		undef();
		unreachable();
		
		if( errors == 0 )
		{
			//LALR(1) parse table generation
			first();
			
			//print_symbols( MODE_GEN_TEXT );
			//print_grammar( MODE_GEN_TEXT );
			lalr1_parse_table( false );

			check_empty_states();

			if( errors == 0 )
			{		
				dfa_table = create_subset( nfa_states );
				dfa_table = minimize_dfa( dfa_table );
				
				driver = driver.replace( /##HEADER##/gi, code_head );
				driver = driver.replace( /##TABLES##/gi, print_parse_tables( MODE_GEN_JS ) );
				driver = driver.replace( /##DFA##/gi, print_dfa_table( dfa_table ) );
				driver = driver.replace( /##TERMINAL_ACTIONS##/gi, print_term_actions() );
				driver = driver.replace( /##LABELS##/gi, print_symbol_labels() );
				driver = driver.replace( /##ACTIONS##/gi, print_actions() );
				driver = driver.replace( /##FOOTER##/gi, code_foot );
				driver = driver.replace( /##PREFIX##/gi, code_prefix );
				driver = driver.replace( /##ERROR##/gi, get_error_state() );
				driver = driver.replace( /##ERROR_TOKEN##/gi, get_error_symbol_id() );
				driver = driver.replace( /##EOF##/gi, get_eof_symbol_id() );
				driver = driver.replace( /##WHITESPACE##/gi, get_whitespace_symbol_id() );

				_print( driver );
			}
		}
	}
}
else
	help();

quit();
