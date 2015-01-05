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
/*
	Constants
*/

//Program version info
var JSCC_VERSION = "0.37";

//Symbol types
var SYM_NONTERM = {};
var SYM_TERM = {};

//Symbol special cases
var SPECIAL_NO_SPECIAL = {};
var SPECIAL_EOF = {};
var SPECIAL_WHITESPACE = {};
var SPECIAL_ERROR = {};

//Symbol associativity
var ASSOC_NONE = {};
var ASSOC_LEFT = {};
var ASSOC_RIGHT = {};
var ASSOC_NOASSOC = {};

//Token-Definitions

var TOK_ERROR = {};
var TOK_EOF = {};
var TOK_ID = {};
var TOK_TERM = {};
var TOK_TERM_S = {};
var TOK_COLON = {};
var TOK_SEMICOLON = {};
var TOK_DELIMITER = {};
var TOK_SEMANTIC = {};
var	TOK_IGNORE = {};
var TOK_PREFIX = {};

//Miscelleanous constants
var DEF_PROD_CODE = "%% = %1;";

//Code generation/output modes
var MODE_GEN_TEXT = {};
var MODE_GEN_JS = {};
var MODE_GEN_HTML = {};

//Executable environment
var EXEC_CONSOLE = {};
var EXEC_WEB = {};

//Lexer state construction
var MIN_CHAR = 0;
var MAX_CHAR = 255;

var EDGE_FREE = {};
var EDGE_EPSILON = {};
var EDGE_CHAR = {};

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

function NFAStates(){
	this.value = [];
}
NFAStates.prototype.create = function(){
	var nfa;
	var i;
	/*
		Use an empty item if available,
		else create a new one...
	*/
	for( i = 0; i < this.value.length; i++ )
		if( this.value[i].edge === EDGE_FREE )
			break;

	if( i == this.value.length ){
		nfa = new NFA()
		this.value.push( nfa );
	}else
		nfa = this.value[i];

	nfa.edge = EDGE_EPSILON;
	nfa.ccl=new BitSet(MAX_CHAR);
	nfa.accept = -1;
	nfa.follow = -1;
	nfa.follow2 = -1;
	nfa.weight = -1;

	//created_nfas.push( i );

	return i;
}

/*
	Globals (will be initialized via reset_all()!)
*/
var symbols;
var productions;
var states;
var lex;

var nfa_states, NFA_states;
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
