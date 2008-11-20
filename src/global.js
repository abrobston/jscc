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

/*
	Constants
*/

//Program version info 
var JSCC_VERSION			= "0.30";

//Symbol types
var SYM_NONTERM				= 0;
var SYM_TERM				= 1;

//Symbol special cases
var SPECIAL_NO_SPECIAL		= 0;
var SPECIAL_EOF				= 1;
var SPECIAL_WHITESPACE		= 2;

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
function SYMBOL()
{
	var kind;			//Symbol kind (SYM_TERM, SYM_NONTERM)
	var label;			//Symbol label/name
	var prods;			//Array of associated productions (SYM_NONTERM only)
	var first;			//Array of first symbols
	
	var associativity;	//Associativity mode (SYM_TERM only)
	var level;			//Association level (SYM_TERM only)
	
	var code;			//Code to be executed at token recognition (SYM_TERM only)
	var special;		//Special symbol

	/* --- Flags --- */
	var nullable;		//Nullable-flag
	var defined;		//Defined flag
}

function PROD()
{
	var lhs;
	var rhs;
	var level;
	var code;
}

function ITEM()
{
	var prod;
	var dot_offset;
	var lookahead;
}

function STATE()
{
	var kernel;
	var epsilon;
	var done;
	var closed;
	
	var actionrow;
	var	gotorow;
}

function NFA()
{
	var		edge;
	var		ccl;
	var		follow;
	var		follow2;
	var		accept;
	var		weight;
}

function DFA()
{
	var		line;
	var		nfa_set;
	var		accept;
	var		done;
	var		group;
}

function PARAM()
{
	var start;
	var end;
}

function TOKEN()
{
	var token;
	var lexeme;
}

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
