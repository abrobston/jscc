/* -HEADER----------------------------------------------------------------------
JS/CC LALR(1) Parser Generator
Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
http://jscc.phorward-software.com ++ contact<<AT>>phorward-software<<DOT>>com

File:	global.js
Author:	Jan Max Meyer
Usage:	General variables, constants and defines

You may use, modify and distribute this software under the terms and conditions
of the BSD license. Please see LICENSE for more information.
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
var Continue ={};
/*
	Constants
*/

//Program version info
var JSCC_VERSION			= "0.35";

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

var SYMBOL=createConstructor(['id','kind','label','prods','first','associativity','level','code','special','nullable','defined','defined_at','used_at']);
var PROD=createConstructor(['id','lhs','rhs','level','code']);
var ITEM=createConstructor(['prod','dot_offset','lookahead']);
var STATE=createConstructor(['kernel','epsilon','def_act','done','closed','actionrow','gotorow']);
var NFA=createConstructor(['edge','ccl','follow','follow2','accept','weight']);
var DFA=createConstructor(['line','object','nfa_set','accept','done','group']);
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
