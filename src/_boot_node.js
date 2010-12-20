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
/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
Contibutions by Louis P. Santillan <lpsantil@gmail.com>
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	io_rhino.js
Author:	Louis P. Santillan
		Jan Max Meyer
Usage:	Console-based wrapper function set for JS/CC to be executed
		via Mozilla/Rhino.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

var DEFAULT_DRIVER = "driver_node.js_";

var sys=require("sys");
var fs=require("fs");

function _error( msg )
{
	if( show_errors )
		sys.print( file + ": error: " + msg );
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
		sys.print( file + ": warning: " + msg );
	
	warnings++;
}

var _print=sys.puts;

var _quit=process.exit;

function read_file( file )
{
	return fs.readFileSync(file,"utf-8");
}
function write_file( file, content )
{
	return fs.writeFileSync(file, content, "utf-8");
}
function get_arguments()
{
	return process.ARGV.splice(2);
}
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
	var f, i;
	for( i = begin; i < p.rhs.length; i++ )
	{
		item.lookahead = union( item.lookahead, symbols[p.rhs[i]].first );
		
		if( !symbols[p.rhs[i]].nullable )
			return false;
	}
	return true;
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
function print_dfa_table( dfa_states ){	
	var code ="";
	code += "\nvar DFA_DATA=[];\n\n";
	/*
	var json=[],ii,jj;
	for(ii=0;ii<dfa_states.length;ii++)(function(ii){
		var line={};
		for(jj=0;jj<dfa_states[ii].line.length;jj++)
			if(dfa_states[ii].line[jj]!=-1)
				line[jj]=dfa_states[ii].line[jj];
		json.push({
			line:line,
			accept:dfa_states[ii].accept,
			});
		//code+="\tDFA_DATA.push("+JSON.stringify({line:line,accept:dfa_states[ii].accept})+");\n";
		//code+="\tDFA_DATA.push("+JSON.stringify(line)+");\n";
	})(ii);*/
	//var json_str=JSON.stringify(json);
	//json_str=json_str.replace(/,/g,",\n\t");
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
				code += " ) set_state(" + j + ");\n";
		}
				
		code += "		";
		if( !first )
			code += "else ";
		code += "set_state(-1);\n"
		
		if( dfa_states[i].accept > -1 )
		{
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
function print_symbol_labels(){
	//var i,arr
	for(var i=0,arr=[];i<symbols.length;i++)
		arr.push(symbols[i].label);
	return "var labels = "+JSON.stringify(symbols)+";\n\n";
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
function print_term_actions(){
	var code = "(({\n";
	var re = /%match|%offset|%source/;
	var i, j, k;	
	var semcode;
	var strmatch;
	
	for( i = 0; i < symbols.length; i++ ){
		if( symbols[i].kind == SYM_TERM	&& symbols[i].code != "" ){			
			code += "	\"" + i + "\":";
			code += "function(){";
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
			code += "		},\n";
		}
	}
	code+="\n})[match.toString()]||(function(){}))()";
	return code;
}
function print_term_actions_old(){
	var code = "";
	var re = /%match|%offset|%source/;
	var i, j, k;	
	var semcode;
	var strmatch;
	
	for( i = 0; i < symbols.length; i++ ){
		if( symbols[i].kind == SYM_TERM	&& symbols[i].code != "" ){			
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
function print_actions(){
	var code = "";
	var re = /%[0-9]+|%%/;
	var semcode, strmatch;
	var i, j, k, idx;
	code += "rval=[";
	for( i = 0; i < productions.length; i++ ){
		semcode = "function(vstack){\n";
		semcode+="var rval;"
		for( j = 0, k = 0; j < productions[i].code.length; j++, k++ ){
			strmatch = re.exec( productions[i].code.substr( j, productions[i].code.length ) );
			if( strmatch && strmatch.index == 0 ){
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
				semcode += productions[i].code.charAt( j );
		}
		code += "		" + semcode + "\nreturn rval;},\n";
	}
	code += "][act](vstack);\n\n";
	return code;
}
/*
function print_actions_old(){
	var code = "";
	var re = /%[0-9]+|%%/;
	var semcode, strmatch;
	var i, j, k, idx;
	code += "switch( act ){\n";
	for( i = 0; i < productions.length; i++ ){
		code += "	case " + i + ":\n";
		code += "	{\n";
		semcode = "";
		for( j = 0, k = 0; j < productions[i].code.length; j++, k++ ){
			strmatch = re.exec( productions[i].code.substr( j, productions[i].code.length ) );
			if( strmatch && strmatch.index == 0 ){
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
				semcode += productions[i].code.charAt( j );
		}
		code += "		" + semcode + "\n";
		code += "	}\n";
		code += "	break;\n";
	}
	code += "}\n\n";
	return code;
}
*/

/* -FUNCTION--------------------------------------------------------------------
	Function:		get_eof_symbol_id()
	
	Author:			Jan Max Meyer
	
	Usage:			Returns the value of the eof-symbol.
					
	Parameters:	
		
	Returns:		eof_id					The id of the EOF-symbol.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_eof_symbol_id(){
	var eof_id = -1;
	//Find out which symbol is for EOF!	
	for( var i = 0; i < symbols.length; i++ ){
		if( symbols[i].special == SPECIAL_EOF ){
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
function get_error_symbol_id(){
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
function get_whitespace_symbol_id(){
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
function get_error_state(){
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
	var state = new STATE({
		kernel:[],
		epsilon:[],
		actionrow:[],
		gotorow:[],
		done:false,
		closed:false,
		def_act:0
		});
	states.push( state );
	return state;
}

function create_item( p )
{
	return new ITEM({
		prod:p,
		dot_offset:0,
		lookahead:[]
		});
}

function add_table_entry( row, sym, act )
{
	for(var i = 0; i < row.length; i++ )
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
	for(var i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
		{
			row.splice( i, 1 );
			return row;
		}
	return row;
}

function get_table_entry( row, sym )
{
	for(var i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row[i][1];
	return void(0);
}

function get_undone_state()
{
	for( var i = 0; i < states.length; i++ )
		if( states[i].done == false )///???
			return i;		
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
		if( symbols[i].label.toString() == label.toString()
			&& symbols[i].kind == kind
				&& symbols[i].special == special )
			return i;
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
	
	var sym = new SYMBOL({
		label:label,
		kind:kind,
		prods:[],
		nullable:false,
		id:symbols.length,
		code:"",
		assoc:ASSOC_NONE, //Could be changed by grammar parser
		level:0, //Could be changed by grammar parser
		special:special,
		defined:false,
		first:[]
		});
	
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
	return cnt == set1.length;
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
			closure.unshift( new ITEM({
				prod: states[s].kernel[i].prod,
				dot_offset: states[s].kernel[i].dot_offset,
				lookahead: []
				}) );
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
				if( item_set_equal( states[i].kernel, partition ) )
					break;
			
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
			if( reds[j] == reds[i] )
				count++;
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
	this.data=[];
}
BitSetBool.prototype={
	set:function(bit,state)
	{
		return this.data[bit]=(state&&true)||false;
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
function BitSet32()
{
  this.data=[];
}
BitSet32.prototype={
  set:function(bit,state)
  {///@TODO simplify this if possible
    this.data[bit >> 5] = (state ? (this.data[bit >> 5] | (1 << (bit & 31))) : (this.data[bit >> 5] & ~(1 << (bit & 31))));
  },
  get:function(bit)
  {
    return ((this.data[bit >> 5] & (1 << (bit & 31)))==0) ? false : true;
  },
  count:function()
  {
    var i,l,c=0;
    for(i=0,l=this.data.length*32;i<l;i++)
      if(this.get(i))c++;
    return c;
  }
};

function BitSetTest(size){
	this.size=size;
	this.b=new BitSetBool(size);
	this.i32=new BitSet32(size);
	}
BitSetTest.prototype={
	set:function(bit,state){
		var b=this.b.set(bit,state);
		this.i32.set(bit,state);
		this.test();
		return b;},
	get:function(bit){return this.b.get(bit);},
	count:function(){return this.b.count();},
	test:function(){
		for(var i=0;i<this.size;i++)
			if(((this.b.get(i)&&true)||false)!==((this.i32.get(i)&&true)||false)){
				_print("\nDifference: index="+i+"\tBooL="+this.b.get(i)+"\t I32="+this.i32.get(i));
				throw new Error("BITSET");}
		if(this.b.count()!==this.i32.count()){
			_print("\nDifferent Counts \t Bool="+this.b.count()+"\tI32="+this.i32.count());
			throw new Error("BITSET");}
		}
	}
var BitSet=(function(){
	if((DEFAULT_DRIVER === "driver_node.js_") && false){
		var Buffer = require('buffer').Buffer;
		var DBG=require('sys').debug;
		function BitSetBuffer(size){
			//DBG("\nBuffer "+size);
			this.data=new Buffer((size+7)>>3);
		}
		BitSetBuffer.prototype={
		  set:function(bit,state)
		  {///@TODO simplify this if possible
		    this.data[bit >> 3] = (state ? (this.data[bit >> 3] | (1 << (bit & 7))) : (this.data[bit >> 3] & ~(1 << (bit & 7))));
		    //DBG("\nSet "+ bit +" to "+state);
		  },
		  get:function(bit)
		  {
			//DBG("\nGet bit "+bit);
			if(this.gets>10000)throw new Error("LIMIT");
			else this.gets++;
		    return ((this.data[bit >> 3] & (1 << (bit & 7)))==0) ? false : true;
		  },
		  count:function()
		  {
			//DBG("Count");  
			var i,l,c=0;
		    for(i=0,l=this.data.length*8;i<l;i++)
		      if(this.get(i))c++;
		    return c;
		  },
		  gets:0
		};
		return BitSetBuffer;}
	else return BitSet32;
})();

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
	for(var i = 0; i < symbols.length; i++ )
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
	for(var i = 0; i < states.length; i++ )
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
{
	var dfa = new DFA({
		line:new Array( MAX_CHAR ),
		accept:-1,
		nfa_set:[],
		done:false,
		group:-1
		});
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
	try{
		do{
			tos = state_set.pop();
			if( machine[ tos ].edge == EDGE_CHAR )
				if( machine[ tos ].ccl.get( ch ) )
					hits.push( machine[ tos ].follow );		
		}while( state_set.length > 0 );
	}catch(e){
		_print("\n state_set= " + state_set + " machine= " + machine + " ch= "+ch);
		throw e;}
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
	
	do{
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
	}while( stack.length > 0 );
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
	//_print("\ndfa_states = "+dfa_states);
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
	do{
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
	}while( old_cnt != cnt );
	
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
			var chars = "";
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
	var str = "";
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
/**@file driver_node.js
 * @brief Contains functions and variables for nodejs
 * http://nodejs.org
*/

var __jscc_debug=(function(){///@TODO: create this variable without function
	
	var _dbg_withparsetree	= false;
	var _dbg_withtrace		= false;
	var _dbg_withstepbystep	= false;
	
	var __dbg_print=require('sys').print;
	
	function __dbg_flush()
	{
		///Not required here.
	}
	
	function __dbg_wait()
	{
		///Not required here.
	}
	
	function __dbg_parsetree( indent, nodes, tree )
	{
		var str = "";
		for( var i = 0; i < tree.length; i++ )
		{
			str = "";
			for( var j = indent; j > 0; j-- )
				str += "\t";
			
			str += nodes[ tree[i] ].sym;
			if( nodes[ tree[i] ].att != "" )
				str += " >" + nodes[ tree[i] ].att + "<" ;
				
			__dbg_print( str );
			if( nodes[ tree[i] ].child.length > 0 )
				__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
		}
	}
	return {
		__dbg_print:__dbg_print,
		_dbg_withtrace:_dbg_withtrace,
		__dbg_wait:__dbg_wait,
		_dbg_withparsetree:_dbg_withparsetree,
		_dbg_withstepbystep:_dbg_withstepbystep,
		__dbg_flush:__dbg_flush,
		__dbg_parsetree:__dbg_parsetree
	};
})();



/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/
	
var		first_lhs;
var		cur_line;

//Wrapper for semantic errors
function line_error( line, txt ){
	_error( "line " + line + ": " + txt );
}

var __jsccparse=(function(debug){
	with(debug){
		var dbg_print = __dbg_print;
		var dbg_withtrace = _dbg_withtrace;
		var dbg_wait = __dbg_wait;
		var dbg_withparsetree = _dbg_withparsetree;
		var dbg_withstepbystep = _dbg_withstepbystep;
		var dbg_flush = __dbg_flush;
		var dbg_parsetree = __dbg_parsetree;
	}


var DFA_DATA=[];

function DFA(state,chr,match,pos,set_match,set_match_pos,set_state){
switch( state )
{
	case 0:
		if( chr == 9 || chr == 13 || chr == 32 ) set_state(1);
		else if( chr == 10 ) set_state(2);
		else if( chr == 33 ) set_state(3);
		else if( chr == 38 ) set_state(4);
		else if( chr == 45 || ( chr >= 48 && chr <= 57 ) || ( chr >= 65 && chr <= 90 ) || chr == 95 || ( chr >= 97 && chr <= 122 ) ) set_state(5);
		else if( chr == 58 ) set_state(6);
		else if( chr == 59 ) set_state(7);
		else if( chr == 60 ) set_state(8);
		else if( chr == 62 ) set_state(9);
		else if( chr == 94 ) set_state(10);
		else if( chr == 124 ) set_state(11);
		else if( chr == 126 ) set_state(12);
		else if( chr == 34 ) set_state(18);
		else if( chr == 35 ) set_state(21);
		else if( chr == 39 ) set_state(22);
		else if( chr == 47 ) set_state(23);
		else if( chr == 91 ) set_state(24);
		else set_state(-1);
		break;

	case 1:
		if( chr == 9 || chr == 13 || chr == 32 ) set_state(1);
		else set_state(-1);
		set_match(18);
		set_match_pos(pos);
		break;

	case 2:
		set_state(-1);
		set_match(16);
		set_match_pos(pos);
		break;

	case 3:
		set_state(-1);
		set_match(6);
		set_match_pos(pos);
		break;

	case 4:
		set_state(-1);
		set_match(10);
		set_match_pos(pos);
		break;

	case 5:
		if( chr == 45 || ( chr >= 48 && chr <= 57 ) || ( chr >= 65 && chr <= 90 ) || chr == 95 || ( chr >= 97 && chr <= 122 ) ) set_state(5);
		else set_state(-1);
		set_match(15);
		set_match_pos(pos);
		break;

	case 6:
		set_state(-1);
		set_match(8);
		set_match_pos(pos);
		break;

	case 7:
		set_state(-1);
		set_match(7);
		set_match_pos(pos);
		break;

	case 8:
		set_state(-1);
		set_match(3);
		set_match_pos(pos);
		break;

	case 9:
		set_state(-1);
		set_match(4);
		set_match_pos(pos);
		break;

	case 10:
		set_state(-1);
		set_match(5);
		set_match_pos(pos);
		break;

	case 11:
		set_state(-1);
		set_match(9);
		set_match_pos(pos);
		break;

	case 12:
		set_state(-1);
		set_match(11);
		set_match_pos(pos);
		break;

	case 13:
		set_state(-1);
		set_match(14);
		set_match_pos(pos);
		break;

	case 14:
		set_state(-1);
		set_match(2);
		set_match_pos(pos);
		break;

	case 15:
		set_state(-1);
		set_match(13);
		set_match_pos(pos);
		break;

	case 16:
		set_state(-1);
		set_match(17);
		set_match_pos(pos);
		break;

	case 17:
		set_state(-1);
		set_match(12);
		set_match_pos(pos);
		break;

	case 18:
		if( chr == 34 ) set_state(13);
		else if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(18);
		else if( chr == 92 ) set_state(25);
		else set_state(-1);
		break;

	case 19:
		if( chr == 34 ) set_state(13);
		else if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(18);
		else if( chr == 92 ) set_state(25);
		else set_state(-1);
		set_match(14);
		set_match_pos(pos);
		break;

	case 20:
		if( chr == 39 ) set_state(15);
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(22);
		else if( chr == 92 ) set_state(26);
		else set_state(-1);
		set_match(13);
		set_match_pos(pos);
		break;

	case 21:
		if( chr == 35 ) set_state(14);
		else set_state(-1);
		break;

	case 22:
		if( chr == 39 ) set_state(15);
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(22);
		else if( chr == 92 ) set_state(26);
		else set_state(-1);
		break;

	case 23:
		if( chr == 126 ) set_state(27);
		else set_state(-1);
		break;

	case 24:
		if( chr == 42 ) set_state(35);
		else set_state(-1);
		break;

	case 25:
		if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(18);
		else if( chr == 34 ) set_state(19);
		else if( chr == 92 ) set_state(25);
		else set_state(-1);
		break;

	case 26:
		if( chr == 39 ) set_state(20);
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) set_state(22);
		else if( chr == 92 ) set_state(26);
		else set_state(-1);
		break;

	case 27:
		if( chr == 47 ) set_state(28);
		else if( chr == 126 ) set_state(29);
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) set_state(36);
		else set_state(-1);
		break;

	case 28:
		if( chr == 47 ) set_state(27);
		else set_state(-1);
		break;

	case 29:
		if( chr == 47 ) set_state(16);
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 254 ) ) set_state(27);
		else set_state(-1);
		break;

	case 30:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 254 ) ) set_state(30);
		else if( chr == 42 ) set_state(31);
		else set_state(-1);
		break;

	case 31:
		if( chr == 93 ) set_state(17);
		else if( ( chr >= 0 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) set_state(34);
		else set_state(-1);
		break;

	case 32:
		if( chr == 93 ) set_state(34);
		else set_state(-1);
		break;

	case 33:
		if( chr == 126 ) set_state(29);
		else if( chr == 47 ) set_state(33);
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) set_state(36);
		else set_state(-1);
		break;

	case 34:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) set_state(30);
		else if( chr == 42 ) set_state(31);
		else if( chr == 93 ) set_state(32);
		else set_state(-1);
		break;

	case 35:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) set_state(30);
		else if( chr == 42 ) set_state(31);
		else if( chr == 93 ) set_state(32);
		else set_state(-1);
		break;

	case 36:
		if( chr == 126 ) set_state(29);
		else if( chr == 47 ) set_state(33);
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) set_state(36);
		else set_state(-1);
		break;

}

}

	//function TERMINAL_ACTIONS(){
//## TERMINAL_ACTIONS ##
	//}
	function lex( PCB ){
		var state, match, match_pos, start, pos, chr;
		while(true){
			state = 0;
			match = -1;
			match_pos = 0;
			start = 0;
			pos = PCB.offset + 1 + ( match_pos - start );
			///Functions for manipulation of variables
			function set_match(v){match=v;}
			function set_state(v){state=v;}
			function set_match_pos(v){match_pos=v;}
			do{
				pos--;
				state = 0;
				match = -2;
				start = pos;
				if( PCB.src.length <= start )
					return 38;
				do{
					chr = PCB.src.charCodeAt( pos );
					DFA(state,chr,match,pos,set_match,set_match_pos,set_state);//## DFA ##
					//Line- and column-counter
					if( state > -1 ){
						if( chr == 10 ){
							PCB.line++;
							PCB.column = 0;
						}
						PCB.column++;
					}
					pos++;
				}while( state > -1 );
			}while( -1 > -1 && match == -1 );
	
			if( match > -1 ){
				PCB.att = PCB.src.substr( start, match_pos - start );
				PCB.offset = match_pos;
				if((function(){
					try{
(({
	"12":function(){			PCB.att = PCB.att.substr(2, PCB.att.length - 4 ); 
		},
	"16":function(){		 throw Continue;
		},
	"17":function(){		 throw Continue;
		},
	"18":function(){		 throw Continue;
		},

})[match.toString()]||(function(){}))()
					}catch(e){
						if(e===Continue)return true;
						else throw e;
					}
				})())continue;
			}else{
				PCB.att = "";
				match = -1;
			}
			break;
		}
		return match;
	}


var pop_tab =[[0,1],[23,5],[19,1],[22,1],[20,2],[20,1],[25,3],[25,3],[25,3],[25,2],[25,2],[26,2],[26,1],[28,3],[28,2],[21,2],[21,1],[30,4],[30,2],[31,3],[31,1],[32,3],[34,2],[34,2],[34,0],[33,1],[33,0],[35,2],[35,1],[36,1],[36,1],[36,1],[24,1],[24,0],[37,2],[37,1],[27,1],[27,1],[29,1]];

var act_tab =[[12,5],[],[3,8,4,9,5,10,6,12,13,15,14,16],[],[12,17],[],[2,19,3,8,4,9,5,10,6,12,13,15,14,16],[],[13,15,14,16],[13,15,14,16],[13,15,14,16],[7,24,13,15,14,16],[13,15,14,16],[],[15,28,12,5],[],[],[],[],[1,32,15,28],[7,33,13,15,14,16],[7,34,13,15,14,16],[7,35,13,15,14,16],[],[],[],[],[12,5],[],[1,32,15,28,12,5],[],[8,40],[7,41],[],[],[],[],[],[],[],[11,49,15,28,13,15,14,16],[],[9,50,7,51],[],[10,53],[11,49,15,28,13,15,14,16],[],[],[],[],[11,49,15,28,13,15,14,16],[],[12,5],[15,28,13,15,14,16],[],[],[],[],[]];

var goto_tab =[[23,1,19,2,24,3,37,4],[],[20,6,25,7,26,11,28,13,27,14],[],[],[],[25,18,26,11,28,13,27,14],[],[26,20,28,13,27,14],[26,21,28,13,27,14],[26,22,28,13,27,14],[28,23,27,14],[27,25],[],[24,26,29,27,37,4],[],[],[],[],[21,29,30,30,29,31],[28,23,27,14],[28,23,27,14],[28,23,27,14],[],[],[],[],[24,36,37,4],[],[30,37,22,38,24,39,29,31,37,4],[],[],[],[],[],[],[],[],[],[],[31,42,32,43,33,44,35,45,36,46,29,47,27,48],[],[],[],[34,52],[36,54,29,47,27,48],[],[],[],[],[32,55,33,44,35,45,36,46,29,47,27,48],[],[24,56,37,4],[27,57,29,58],[],[],[],[],[]];

var defact_tab =[33,0,-1,2,32,35,-1,5,-1,-1,-1,-1,-1,12,33,36,37,34,4,-1,-1,-1,-1,11,9,10,14,33,38,33,16,-1,-1,6,7,8,13,15,1,3,26,18,-1,20,24,25,28,29,30,31,26,17,33,-1,27,19,21,23,22];


var labels = [{"label":"def'","kind":0,"prods":[0],"nullable":0,"id":0,"code":"","level":0,"special":0,"defined":true,"first":[3,4,5,6,12,13,14]},{"label":"ERROR_RESYNC","kind":1,"prods":[],"nullable":false,"id":1,"code":"","level":0,"special":3,"defined":true,"first":[1]},{"label":"##","kind":1,"prods":[],"nullable":false,"id":2,"code":"","level":0,"special":0,"defined":false,"first":[2]},{"label":"<","kind":1,"prods":[],"nullable":false,"id":3,"code":"","level":0,"special":0,"defined":false,"first":[3]},{"label":">","kind":1,"prods":[],"nullable":false,"id":4,"code":"","level":0,"special":0,"defined":false,"first":[4]},{"label":"^","kind":1,"prods":[],"nullable":false,"id":5,"code":"","level":0,"special":0,"defined":false,"first":[5]},{"label":"!","kind":1,"prods":[],"nullable":false,"id":6,"code":"","level":0,"special":0,"defined":false,"first":[6]},{"label":";","kind":1,"prods":[],"nullable":false,"id":7,"code":"","level":0,"special":0,"defined":false,"first":[7]},{"label":":","kind":1,"prods":[],"nullable":false,"id":8,"code":"","level":0,"special":0,"defined":false,"first":[8]},{"label":"|","kind":1,"prods":[],"nullable":false,"id":9,"code":"","level":0,"special":0,"defined":false,"first":[9]},{"label":"&","kind":1,"prods":[],"nullable":false,"id":10,"code":"","level":0,"special":0,"defined":false,"first":[10]},{"label":"~","kind":1,"prods":[],"nullable":false,"id":11,"code":"","level":0,"special":0,"defined":false,"first":[11]},{"label":"CODE","kind":1,"prods":[],"nullable":false,"id":12,"code":"\t%match = %match.substr(2, %match.length - 4 ); ","level":0,"special":0,"defined":false,"first":[12]},{"label":"STRING_SINGLE","kind":1,"prods":[],"nullable":false,"id":13,"code":"","level":0,"special":0,"defined":false,"first":[13]},{"label":"STRING_DOUBLE","kind":1,"prods":[],"nullable":false,"id":14,"code":"","level":0,"special":0,"defined":false,"first":[14]},{"label":"IDENT","kind":1,"prods":[],"nullable":false,"id":15,"code":"","level":0,"special":0,"defined":false,"first":[15]},{"label":"n","kind":1,"prods":[],"nullable":false,"id":16,"code":" throw Continue;","level":0,"special":0,"defined":false,"first":[16]},{"label":"/~([^~]/|~[^/]|[^~/])*~/","kind":1,"prods":[],"nullable":false,"id":17,"code":" throw Continue;","level":0,"special":0,"defined":false,"first":[17]},{"label":"[tr ]+","kind":1,"prods":[],"nullable":false,"id":18,"code":" throw Continue;","level":0,"special":0,"defined":false,"first":[18]},{"label":"header_code","kind":0,"prods":[2],"nullable":1,"id":19,"code":"","level":0,"special":0,"defined":true,"first":[12]},{"label":"token_assocs","kind":0,"prods":[4,5],"nullable":0,"id":20,"code":"","level":0,"special":0,"defined":true,"first":[3,4,5,6,13,14]},{"label":"grammar_defs","kind":0,"prods":[15,16],"nullable":0,"id":21,"code":"","level":0,"special":0,"defined":true,"first":[15,1]},{"label":"footer_code","kind":0,"prods":[3],"nullable":1,"id":22,"code":"","level":0,"special":0,"defined":true,"first":[12]},{"label":"def","kind":0,"prods":[1],"nullable":0,"id":23,"code":"","level":0,"special":0,"defined":true,"first":[3,4,5,6,12,13,14]},{"label":"code_opt","kind":0,"prods":[32,33],"nullable":1,"id":24,"code":"","level":0,"special":0,"defined":true,"first":[12]},{"label":"token_assoc","kind":0,"prods":[6,7,8,9,10],"nullable":0,"id":25,"code":"","level":0,"special":0,"defined":true,"first":[3,4,5,6,13,14]},{"label":"token_defs","kind":0,"prods":[11,12],"nullable":0,"id":26,"code":"","level":0,"special":0,"defined":true,"first":[13,14]},{"label":"string","kind":0,"prods":[36,37],"nullable":0,"id":27,"code":"","level":0,"special":0,"defined":true,"first":[13,14]},{"label":"token_def","kind":0,"prods":[13,14],"nullable":0,"id":28,"code":"","level":0,"special":0,"defined":true,"first":[13,14]},{"label":"identifier","kind":0,"prods":[38],"nullable":0,"id":29,"code":"","level":0,"special":0,"defined":true,"first":[15]},{"label":"grammar_def","kind":0,"prods":[17,18],"nullable":0,"id":30,"code":"","level":0,"special":0,"defined":true,"first":[15,1]},{"label":"productions","kind":0,"prods":[19,20],"nullable":1,"id":31,"code":"","level":0,"special":0,"defined":true,"first":[10,12,9,15,13,14,11]},{"label":"rhs","kind":0,"prods":[21],"nullable":1,"id":32,"code":"","level":0,"special":0,"defined":true,"first":[10,12,15,13,14,11]},{"label":"sequence_opt","kind":0,"prods":[25,26],"nullable":1,"id":33,"code":"","level":0,"special":0,"defined":true,"first":[15,13,14,11]},{"label":"rhs_prec","kind":0,"prods":[22,23,24],"nullable":1,"id":34,"code":"","level":0,"special":0,"defined":true,"first":[10]},{"label":"sequence","kind":0,"prods":[27,28],"nullable":0,"id":35,"code":"","level":0,"special":0,"defined":true,"first":[15,13,14,11]},{"label":"symbol","kind":0,"prods":[29,30,31],"nullable":0,"id":36,"code":"","level":0,"special":0,"defined":true,"first":[15,13,14,11]},{"label":"code","kind":0,"prods":[34,35],"nullable":0,"id":37,"code":"","level":0,"special":0,"defined":true,"first":[12]},{"label":"$","kind":1,"prods":[],"nullable":false,"id":38,"code":"","level":0,"special":1,"defined":false,"first":[38]}];



	function ACTIONS(act,sstack,vstack){
		var rval;
rval=[		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 5 ];
return rval;},
		function(vstack){
var rval; code_head += vstack[ vstack.length - 1 ]; 
return rval;},
		function(vstack){
var rval; code_foot += vstack[ vstack.length - 1 ]; 
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 2 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ ){
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_LEFT;
														}
													
return rval;},
		function(vstack){
var rval;	assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_RIGHT;
														}
													
return rval;},
		function(vstack){
var rval;	assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ ){
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_NOASSOC;
														}
													
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 2 ];
return rval;},
		function(vstack){
var rval;	if( whitespace_token == -1 ){
															var regex = vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2 );
															whitespace_token = create_symbol( "WHITESPACE", SYM_TERM, SPECIAL_WHITESPACE );
															compile_regex( regex, whitespace_token, vstack[ vstack.length - 1 ].charAt( 0 ) != '\''  );
														}
														else
															line_error( PCB.line, "Multiple whitespace definition" );
													
return rval;},
		function(vstack){
var rval;	rval = vstack[ vstack.length - 2 ]; rval.push( vstack[ vstack.length - 1 ] );	
return rval;},
		function(vstack){
var rval;	return [vstack[ vstack.length - 1 ]]; 
return rval;},
		function(vstack){
var rval;	rval = create_symbol( vstack[ vstack.length - 2 ], SYM_TERM, SPECIAL_NO_SPECIAL );
														var regex = vstack[ vstack.length - 3 ].substr( 1, vstack[ vstack.length - 3 ].length - 2 );
														symbols[rval].code = vstack[ vstack.length - 1 ];
														compile_regex( regex, symbols[ rval ].id, vstack[ vstack.length - 3 ].charAt( 0 ) != '\''  );
													
return rval;},
		function(vstack){
var rval;	var regex = vstack[ vstack.length - 2 ].substr( 1, vstack[ vstack.length - 2 ].length - 2 );
														rval = create_symbol( regex.replace( /\\/g, "" ), SYM_TERM, SPECIAL_NO_SPECIAL );
														symbols[rval].code = vstack[ vstack.length - 1 ];

														compile_regex( regex, symbols[ rval ].id,  vstack[ vstack.length - 2 ].charAt( 0 ) != '\'' );
													
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 2 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	
														var nonterm = create_symbol( vstack[ vstack.length - 4 ], SYM_NONTERM, SPECIAL_NO_SPECIAL );
														symbols[nonterm].defined = true;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ ){
															productions[ vstack[ vstack.length - 2 ][i] ].lhs = nonterm;
															symbols[nonterm].prods.push( vstack[ vstack.length - 2 ][i] );
														}
														
														if( first_lhs ){
															first_lhs = false;
															symbols[0].label = symbols[nonterm].label + "\'";
															productions[0].rhs.push( nonterm );
														}
													
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 2 ];
return rval;},
		function(vstack){
var rval;	rval=vstack[ vstack.length - 3 ];rval.push(vstack[ vstack.length - 1 ]); 
return rval;},
		function(vstack){
var rval;	return [vstack[ vstack.length - 1 ]]; 
return rval;},
		function(vstack){
var rval;	
														var prod = new PROD({
															id:productions.length,
															rhs:vstack[ vstack.length - 3 ],
															level:vstack[ vstack.length - 2 ],
															code:(vstack[ vstack.length - 1 ]=="")?DEF_PROD_CODE:(vstack[ vstack.length - 1 ])
														});
														//Get level of the leftmost terminal
														//as production level.
														if( prod.level == 0 )
														{
															if( prod.rhs.length > 0 )
																for( var i = prod.rhs.length-1; i >= 0; i-- )
																	if( symbols[prod.rhs[i]] &&
																		symbols[prod.rhs[i]].kind == SYM_TERM )
																	{
																		prod.level = symbols[prod.rhs[i]].level;
																		break;
																	}
														}

														productions.push( prod );
														return prod.id;
													
return rval;},
		function(vstack){
var rval; 	var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															return symbols[index].level;
														else
															line_error( PCB.line, "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
return rval;},
		function(vstack){
var rval;	var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ),
																		SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															return symbols[index].level;
														else
															line_error(  PCB.line, "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
return rval;},
		function(vstack){
var rval;	return 0; 
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	return []; 
return rval;},
		function(vstack){
var rval; rval=vstack[ vstack.length - 2 ];rval.push(vstack[ vstack.length - 1 ]); 
return rval;},
		function(vstack){
var rval; return [vstack[ vstack.length - 1 ]]; 
return rval;},
		function(vstack){
var rval;	
														if( ( rval = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, SPECIAL_NO_SPECIAL ) ) <= -1 )
															rval = create_symbol( vstack[ vstack.length - 1 ], SYM_NONTERM, SPECIAL_NO_SPECIAL );
													
return rval;},
		function(vstack){
var rval;	
														if( ( rval = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ), SYM_TERM, SPECIAL_NO_SPECIAL ) ) <= -1 )
															line_error(  PCB.line, "Call to undefined terminal " + vstack[ vstack.length - 1 ] );
													
return rval;},
		function(vstack){
var rval; return find_symbol( "ERROR_RESYNC", SYM_TERM,	SPECIAL_ERROR ); 
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval; return ""; 
return rval;},
		function(vstack){
var rval; return vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ]; 
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
][act](vstack);


		return rval;
	}
	function parse( src, err_off, err_la ){
		var		sstack			= [];
		var		vstack			= [];
		var 	err_cnt			= 0;
		var		rval;
		var		act;
	
		//Visual parse tree generation

		var		treenodes		= [];
		var		tree			= [];
		var		tmptree			= null;
		
		/*
			This is the parser control block (PCB);
			It is used to hold the entire parser state
			in one object, to be quickly accessed from
			various functions.
		*/ 
		var PCB	= {
			line:1,
			column:1,
			offset:0,
			error_step:0,
			src:src,
			att:""
		};

		if( !err_off )
			err_off	= [];
		if( !err_la )
			err_la = [];
	
		sstack.push( 0 );
		vstack.push( 0 );
	
		PCB.la = lex( PCB );
			
		while(true){
			PCB.act = 60;
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 ){
				if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
					PCB.act = act_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
		
			if( PCB.act == 60 ){
				if( ( PCB.act = defact_tab[ sstack[sstack.length-1] ] ) < 0 )
					PCB.act = 60;
				else
					PCB.act *= -1;
			}

			/*
			_print( "state " + sstack[sstack.length-1] +
					" la = " +
					PCB.la + " att = >" +
					PCB.att + "< act = " +
					PCB.act + " src = >" +
					PCB.src.substr( PCB.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
			*/
		
			if( dbg_withtrace && sstack.length > 0 )
			{
				dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[PCB.la] +
								" (\"" + PCB.att + "\")\n" +
							"\tAction: " + PCB.act + "\n" + 
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +
									( ( PCB.offset + 30 < PCB.src.length ) ?
										"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
				if( dbg_withstepbystep )
					dbg_wait();
			}
		
			
			//Parse error? Try to recover!
			if( PCB.act == 60 )
			{
				if( dbg_withtrace )
				{
					var expect = "";
				
					dbg_print( "Error detected: " +
						"There is no reduce or shift on the symbol " +
							labels[PCB.la] );
				
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
					{
						if( expect != "" )
							expect += ", ";
						
						expect += "\"" +
								labels[ act_tab[sstack[sstack.length-1]][i] ]
									+ "\"";
					}
					dbg_print( "Expecting: " + expect );
				}
			
				//Report errors only when error_step is 0, and this is not a
				//subsequent error from a previous parse
				if( PCB.error_step == 0 ){
					err_cnt++;
					err_off.push( PCB.offset - PCB.att.length );
					err_la.push([]);
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
						err_la[err_la.length-1].push(
							labels[act_tab[sstack[sstack.length-1]][i]] );
				}
			
				//Perform error recovery			
				while( sstack.length > 1 && PCB.act == 60 ){
					sstack.pop();
					vstack.pop();
				
					//Try to shift on error token
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 ){
						if( act_tab[sstack[sstack.length-1]][i] == 1 ){
							PCB.act = act_tab[sstack[sstack.length-1]][i+1];
						
							sstack.push( PCB.act );
							vstack.push("");
						
							if( dbg_withtrace ){
								dbg_print("Error recovery: error token could be shifted!" );
								dbg_print( "Error recovery: current stack is " + sstack.join() );
							}
							break;
						}
					}
				}
			
				//Is it better to leave the parser now?
				if( sstack.length > 1 && PCB.act != 60 ){
					//Ok, now try to shift on the next tokens
					while( PCB.la != 38 ){
						if( dbg_withtrace )
							dbg_print( "Error recovery: " +
								"Trying to shift on \""
								+ labels[ PCB.la ] + "\"" );

						PCB.act = 60;
					
						for( var i = 0;
							i < act_tab[sstack[sstack.length-1]].length;
							i+=2 ){
							if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
								PCB.act = act_tab[sstack[sstack.length-1]][i+1];
								break;
							}
						}
					
						if( PCB.act != 60 )
							break;
						
						if( dbg_withtrace )
							dbg_print( "Error recovery: Discarding \""
								+ labels[ PCB.la ] + "\"" );
					
						while( ( PCB.la = lex( PCB ) ) < 0 )
							PCB.offset++;
				
						if( dbg_withtrace )
							dbg_print( "Error recovery: New token \""
								+ labels[ PCB.la ] + "\"" );
					}
				}
			
				if( PCB.act == 60 || PCB.la == 38 )
				{
					if( dbg_withtrace )
						dbg_print( "\tError recovery failed, terminating parse process..." );
					break;
				}

				if( dbg_withtrace )
					dbg_print( "\tError recovery succeeded, continuing" );
			
				//Try to parse the next three tokens successfully...
				PCB.error_step = 3;
			}

			//Shift
			if( PCB.act > 0 ){
				//Parse tree generation
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push({
						sym:labels[ PCB.la ],
						att:PCB.att,
						child:[]
					});
				}
			
				if( dbg_withtrace )
					dbg_print( "Shifting symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
		
				sstack.push( PCB.act );
				vstack.push( PCB.att );
			
				PCB.la = lex( PCB );
			
				if( dbg_withtrace )
					dbg_print( "\tNew lookahead symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
				
				//Successfull shift and right beyond error recovery?
				if( PCB.error_step > 0 )
					PCB.error_step--;
			}
			//Reduce
			else
			{		
				act = PCB.act * -1;
			
				if( dbg_withtrace )
					dbg_print( "Reducing by production: " + act );
			
				rval = void( 0 );
			
				if( dbg_withtrace )
					dbg_print( "\tPerforming semantic action..." );
			
				rval=ACTIONS(act,sstack,vstack);
	
				if( dbg_withparsetree )
					tmptree = [];

				if( dbg_withtrace )
					dbg_print( "\tPopping " + 
									pop_tab[act][1] +  " off the stack..." );
				
				for( var i = 0; i < pop_tab[act][1]; i++ ){
					if( dbg_withparsetree )
						tmptree.push( tree.pop() );
					
					sstack.pop();
					vstack.pop();
				}

				//Get goto-table entry
				PCB.act = 60;
				for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 ){
					if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] ){
						PCB.act = goto_tab[sstack[sstack.length-1]][i+1];
						break;
					}
				}
			
				//Do some parse tree construction if desired
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push( {
						sym:labels[ pop_tab[act][0] ],
						att:rval,
						child:tmptree.reverse()
						} );
				}
				//Goal symbol match?
				if( act == 0 ) break; //Don't use PCB.act here!
				if( dbg_withtrace )
					dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
			
				//...and push it!
				sstack.push( PCB.act );
				vstack.push( rval );
			}
		}

		if( dbg_withtrace ){
			dbg_print( "\nParse complete." );
			//This function is used for parser drivers that will output
			//the entire debug messages in a row.
			dbg_flush();
		}

		if( dbg_withparsetree ){
			if( err_cnt == 0 ){
				dbg_print( "\n\n--- Parse tree ---" );
				dbg_parsetree( 0, treenodes, tree );
			}
			else dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
		return err_cnt;
	}
	return parse;
})(__jscc_debug);


function parse_grammar( str, filename ){
	var error_offsets = [];
	var error_expects = [];
	var parse_error = 0;
	
	first_lhs = true;
	cur_line = 1;
	
	//jscc_dbg_withstepbystep = true;
	//jscc_dbg_withtrace = true;

	if( ( parse_error += __jsccparse( str, error_offsets, error_expects ) ) > 0 )
	{
		for( i = 0; i < parse_error; i++ )
			line_error( ( str.substr( 0, error_offsets[i] ).match( /\n/g ) ?
				str.substr( 0, error_offsets[i] ).match( /\n/g ).length : 1 ),
					"Parse error near\n\t"  + str.substr( error_offsets[i], 30 ) +
						( ( error_offsets[i] + 30 < str.substr( error_offsets[i] ).length ) ? 
							"..." : "" ) + "\n\t" + error_expects[i].join() + " expected" );
	}
	return parse_error;
}


/**@file driver_node.js
 * @brief Contains functions and variables for nodejs
 * http://nodejs.org
*/

var __regex_debug=(function(){///@TODO: create this variable without function
	
	var _dbg_withparsetree	= false;
	var _dbg_withtrace		= false;
	var _dbg_withstepbystep	= false;
	
	var __dbg_print=require('sys').print;
	
	function __dbg_flush()
	{
		///Not required here.
	}
	
	function __dbg_wait()
	{
		///Not required here.
	}
	
	function __dbg_parsetree( indent, nodes, tree )
	{
		var str = "";
		for( var i = 0; i < tree.length; i++ )
		{
			str = "";
			for( var j = indent; j > 0; j-- )
				str += "\t";
			
			str += nodes[ tree[i] ].sym;
			if( nodes[ tree[i] ].att != "" )
				str += " >" + nodes[ tree[i] ].att + "<" ;
				
			__dbg_print( str );
			if( nodes[ tree[i] ].child.length > 0 )
				__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
		}
	}
	return {
		__dbg_print:__dbg_print,
		_dbg_withtrace:_dbg_withtrace,
		__dbg_wait:__dbg_wait,
		_dbg_withparsetree:_dbg_withparsetree,
		_dbg_withstepbystep:_dbg_withstepbystep,
		__dbg_flush:__dbg_flush,
		__dbg_parsetree:__dbg_parsetree
	};
})();



/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/
	
var first_nfa;
var last_nfa;
var created_nfas; //Must always be initialized by compile_regex()...

function create_nfa( where )
{
	var pos;
	var nfa;
	var i;
	
	/*
		Use an empty item if available,
		else create a new one...
	*/
	for( i = 0; i < where.length; i++ )
		if( where[i].edge == EDGE_FREE )
			break;
	
	if( i == where.length ){
		nfa = new NFA()			
		where.push( nfa );
	}else
		nfa=where[i];
	
	nfa.edge = EDGE_EPSILON;
	nfa.ccl=new BitSet(MAX_CHAR);
	nfa.accept = -1;
	nfa.follow = -1;
	nfa.follow2 = -1;
	nfa.weight = -1;
	
	created_nfas.push( i );
	
	return i;
}


var __regexparse=(function(debug){
	with(debug){
		var dbg_print = __dbg_print;
		var dbg_withtrace = _dbg_withtrace;
		var dbg_wait = __dbg_wait;
		var dbg_withparsetree = _dbg_withparsetree;
		var dbg_withstepbystep = _dbg_withstepbystep;
		var dbg_flush = __dbg_flush;
		var dbg_parsetree = __dbg_parsetree;
	}


var DFA_DATA=[];

function DFA(state,chr,match,pos,set_match,set_match_pos,set_state){
switch( state )
{
	case 0:
		if( ( chr >= 0 && chr <= 39 ) || ( chr >= 44 && chr <= 45 ) || ( chr >= 47 && chr <= 62 ) || ( chr >= 64 && chr <= 90 ) || ( chr >= 94 && chr <= 123 ) || ( chr >= 125 && chr <= 254 ) ) set_state(1);
		else if( chr == 40 ) set_state(2);
		else if( chr == 41 ) set_state(3);
		else if( chr == 42 ) set_state(4);
		else if( chr == 43 ) set_state(5);
		else if( chr == 46 ) set_state(6);
		else if( chr == 63 ) set_state(7);
		else if( chr == 91 ) set_state(8);
		else if( chr == 93 ) set_state(9);
		else if( chr == 124 ) set_state(10);
		else if( chr == 92 ) set_state(13);
		else set_state(-1);
		break;

	case 1:
		set_state(-1);
		set_match(13);
		set_match_pos(pos);
		break;

	case 2:
		set_state(-1);
		set_match(6);
		set_match_pos(pos);
		break;

	case 3:
		set_state(-1);
		set_match(7);
		set_match_pos(pos);
		break;

	case 4:
		set_state(-1);
		set_match(3);
		set_match_pos(pos);
		break;

	case 5:
		set_state(-1);
		set_match(4);
		set_match_pos(pos);
		break;

	case 6:
		set_state(-1);
		set_match(10);
		set_match_pos(pos);
		break;

	case 7:
		set_state(-1);
		set_match(5);
		set_match_pos(pos);
		break;

	case 8:
		set_state(-1);
		set_match(8);
		set_match_pos(pos);
		break;

	case 9:
		set_state(-1);
		set_match(9);
		set_match_pos(pos);
		break;

	case 10:
		set_state(-1);
		set_match(2);
		set_match_pos(pos);
		break;

	case 11:
		set_state(-1);
		set_match(12);
		set_match_pos(pos);
		break;

	case 12:
		if( ( chr >= 48 && chr <= 57 ) ) set_state(12);
		else set_state(-1);
		set_match(11);
		set_match_pos(pos);
		break;

	case 13:
		if( ( chr >= 0 && chr <= 47 ) || ( chr >= 58 && chr <= 254 ) ) set_state(11);
		else if( ( chr >= 48 && chr <= 57 ) ) set_state(12);
		else set_state(-1);
		set_match(13);
		set_match_pos(pos);
		break;

}

}

	//function TERMINAL_ACTIONS(){
//## TERMINAL_ACTIONS ##
	//}
	function lex( PCB ){
		var state, match, match_pos, start, pos, chr;
		while(true){
			state = 0;
			match = -1;
			match_pos = 0;
			start = 0;
			pos = PCB.offset + 1 + ( match_pos - start );
			///Functions for manipulation of variables
			function set_match(v){match=v;}
			function set_state(v){state=v;}
			function set_match_pos(v){match_pos=v;}
			do{
				pos--;
				state = 0;
				match = -2;
				start = pos;
				if( PCB.src.length <= start )
					return 22;
				do{
					chr = PCB.src.charCodeAt( pos );
					DFA(state,chr,match,pos,set_match,set_match_pos,set_state);//## DFA ##
					//Line- and column-counter
					if( state > -1 ){
						if( chr == 10 ){
							PCB.line++;
							PCB.column = 0;
						}
						PCB.column++;
					}
					pos++;
				}while( state > -1 );
			}while( -1 > -1 && match == -1 );
	
			if( match > -1 ){
				PCB.att = PCB.src.substr( start, match_pos - start );
				PCB.offset = match_pos;
				if((function(){
					try{
(({

})[match.toString()]||(function(){}))()
					}catch(e){
						if(e===Continue)return true;
						else throw e;
					}
				})())continue;
			}else{
				PCB.att = "";
				match = -1;
			}
			break;
		}
		return match;
	}


var pop_tab =[[0,1],[15,1],[14,3],[14,1],[16,2],[16,1],[17,2],[17,2],[17,2],[17,1],[18,1],[18,1],[18,3],[20,3],[20,1],[21,2],[21,0],[19,1],[19,1],[19,1]];

var act_tab =[[6,8,11,9,12,10,13,11,8,12,10,13],[],[2,14],[6,8,11,9,12,10,13,11,8,12,10,13],[],[5,16,4,17,3,18],[],[],[6,8,11,9,12,10,13,11,8,12,10,13],[],[],[],[],[],[6,8,11,9,12,10,13,11,8,12,10,13],[],[],[],[],[7,22,2,14],[9,24,11,9,12,10,13,11],[6,8,11,9,12,10,13,11,8,12,10,13],[],[],[]];

var goto_tab =[[15,1,14,2,16,3,17,4,18,5,19,6,20,7],[],[],[17,15,18,5,19,6,20,7],[],[],[],[],[14,19,16,3,17,4,18,5,19,6,20,7],[],[],[],[21,20],[],[16,21,17,4,18,5,19,6,20,7],[],[],[],[],[],[19,23],[17,15,18,5,19,6,20,7],[],[],[]];

var defact_tab =[-1,0,1,3,5,9,10,11,-1,17,18,19,16,14,-1,4,8,7,6,-1,-1,2,12,15,13];


var labels = [{"label":"RegEx'","kind":0,"prods":[0],"nullable":0,"id":0,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"ERROR_RESYNC","kind":1,"prods":[],"nullable":false,"id":1,"code":"","level":0,"special":3,"defined":true,"first":[1]},{"label":"|","kind":1,"prods":[],"nullable":false,"id":2,"code":"","level":0,"special":0,"defined":false,"first":[2]},{"label":"*","kind":1,"prods":[],"nullable":false,"id":3,"code":"","level":0,"special":0,"defined":false,"first":[3]},{"label":"+","kind":1,"prods":[],"nullable":false,"id":4,"code":"","level":0,"special":0,"defined":false,"first":[4]},{"label":"?","kind":1,"prods":[],"nullable":false,"id":5,"code":"","level":0,"special":0,"defined":false,"first":[5]},{"label":"(","kind":1,"prods":[],"nullable":false,"id":6,"code":"","level":0,"special":0,"defined":false,"first":[6]},{"label":")","kind":1,"prods":[],"nullable":false,"id":7,"code":"","level":0,"special":0,"defined":false,"first":[7]},{"label":"[","kind":1,"prods":[],"nullable":false,"id":8,"code":"","level":0,"special":0,"defined":false,"first":[8]},{"label":"]","kind":1,"prods":[],"nullable":false,"id":9,"code":"","level":0,"special":0,"defined":false,"first":[9]},{"label":"ANY_CHAR","kind":1,"prods":[],"nullable":false,"id":10,"code":"","level":0,"special":0,"defined":false,"first":[10]},{"label":"ASCII_CODE","kind":1,"prods":[],"nullable":false,"id":11,"code":"","level":0,"special":0,"defined":false,"first":[11]},{"label":"ESCAPED_CHAR","kind":1,"prods":[],"nullable":false,"id":12,"code":"","level":0,"special":0,"defined":false,"first":[12]},{"label":"ANY","kind":1,"prods":[],"nullable":false,"id":13,"code":"","level":0,"special":0,"defined":false,"first":[13]},{"label":"Expression","kind":0,"prods":[2,3],"nullable":0,"id":14,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"RegEx","kind":0,"prods":[1],"nullable":0,"id":15,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"Catenation","kind":0,"prods":[4,5],"nullable":0,"id":16,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"Factor","kind":0,"prods":[6,7,8,9],"nullable":0,"id":17,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"Term","kind":0,"prods":[10,11,12],"nullable":0,"id":18,"code":"","level":0,"special":0,"defined":true,"first":[6,11,12,13,8,10]},{"label":"Character","kind":0,"prods":[17,18,19],"nullable":0,"id":19,"code":"","level":0,"special":0,"defined":true,"first":[11,12,13]},{"label":"CharacterSet","kind":0,"prods":[13,14],"nullable":0,"id":20,"code":"","level":0,"special":0,"defined":true,"first":[8,10]},{"label":"CharClass","kind":0,"prods":[15,16],"nullable":1,"id":21,"code":"","level":0,"special":0,"defined":true,"first":[11,12,13]},{"label":"$","kind":1,"prods":[],"nullable":false,"id":22,"code":"","level":0,"special":1,"defined":false,"first":[22]}];



	function ACTIONS(act,sstack,vstack){
		var rval;
rval=[		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	rval = new PARAM();
													nfa_states[ first_nfa ].follow = vstack[ vstack.length - 1 ].start;
													last_nfa = vstack[ vstack.length - 1 ].end;
												
return rval;},
		function(vstack){
var rval;	
													rval = new PARAM({
														start:create_nfa( nfa_states ),
														end:create_nfa( nfa_states )
														});
													nfa_states[rval.start].follow = vstack[ vstack.length - 3 ].start;
													nfa_states[rval.start].follow2 = vstack[ vstack.length - 1 ].start;
													
													nfa_states[vstack[ vstack.length - 3 ].end].follow = rval.end;
													nfa_states[vstack[ vstack.length - 1 ].end].follow = rval.end;
												
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	
													var weight=nfa_states[vstack[ vstack.length - 2 ].end].weight;///SV: if weight unused - delete this
													nfa_states[vstack[ vstack.length - 2 ].end]=new NFA(nfa_states[vstack[ vstack.length - 1 ].start]);
													nfa_states[vstack[ vstack.length - 2 ].end].weight=weight;///SV: if weight unused - delete this
													nfa_states[vstack[ vstack.length - 1 ].start].edge = EDGE_FREE;
													
													vstack[ vstack.length - 2 ].end = vstack[ vstack.length - 1 ].end;
													
													rval = vstack[ vstack.length - 2 ];
												
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;
													rval = new PARAM({
														start:create_nfa( nfa_states ),
														end:create_nfa( nfa_states )
													});
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;

													nfa_states[rval.start].follow2 = rval.end;
													nfa_states[vstack[ vstack.length - 2 ].end].follow2 = vstack[ vstack.length - 2 ].start;
												
return rval;},
		function(vstack){
var rval; 	
													rval = new PARAM({
														start:create_nfa( nfa_states ),
														end:create_nfa( nfa_states )
													});
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;

													nfa_states[vstack[ vstack.length - 2 ].end].follow2 = vstack[ vstack.length - 2 ].start;
												
return rval;},
		function(vstack){
var rval; 	
													rval = new PARAM({
														start:create_nfa( nfa_states ),
														end:create_nfa( nfa_states )
														});
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[rval.start].follow2 = rval.end;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;
												
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													
													nfa_states[rval.start].ccl.set(vstack[ vstack.length - 1 ].charCodeAt( 0 ), true );
												
return rval;},
		function(vstack){
var rval;rval = vstack[ vstack.length - 1 ];
return rval;},
		function(vstack){
var rval;	rval = vstack[ vstack.length - 2 ]; 
return rval;},
		function(vstack){
var rval;	var negate = false;
													var i = 0, j, start;													
													rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													
													if( vstack[ vstack.length - 2 ].charAt( i ) == '^' ){
														negate = true;
														for( var j = MIN_CHAR; j < MAX_CHAR; j++ )
															nfa_states[rval.start].ccl.set(j,true);
														i++;
													}
													for( ; i < vstack[ vstack.length - 2 ].length; i++ ){
														if( vstack[ vstack.length - 2 ].charAt( i+1 ) == '-'	&& i+2 < vstack[ vstack.length - 2 ].length ){
															i++;
															for( j = vstack[ vstack.length - 2 ].charCodeAt( i-1 );
																	j < vstack[ vstack.length - 2 ].charCodeAt( i+1 );
																		j++ )		
																nfa_states[rval.start].ccl.set(j, !negate);
														}
														else
															nfa_states[rval.start].ccl.set(vstack[ vstack.length - 2 ].charCodeAt(i), !negate);
													}
												
return rval;},
		function(vstack){
var rval;	rval = new PARAM();
				
													
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													for( var i = MIN_CHAR; i < MAX_CHAR; i++ )
														nfa_states[rval.start].ccl.set(i, true);
												
return rval;},
		function(vstack){
var rval;	return vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ]; 
return rval;},
		function(vstack){
var rval;	return ""; 
return rval;},
		function(vstack){
var rval;	return String.fromCharCode( vstack[ vstack.length - 1 ].substr( 1 ) ); 
return rval;},
		function(vstack){
var rval;	return {n:'\n',r:'\r',t:'\t',a:'\a'}[vstack[ vstack.length - 1 ].substr(1)]||vstack[ vstack.length - 1 ].substr(1); 
return rval;},
		function(vstack){
var rval;	return vstack[ vstack.length - 1 ]; 
return rval;},
][act](vstack);


		return rval;
	}
	function parse( src, err_off, err_la ){
		var		sstack			= [];
		var		vstack			= [];
		var 	err_cnt			= 0;
		var		rval;
		var		act;
	
		//Visual parse tree generation

		var		treenodes		= [];
		var		tree			= [];
		var		tmptree			= null;
		
		/*
			This is the parser control block (PCB);
			It is used to hold the entire parser state
			in one object, to be quickly accessed from
			various functions.
		*/ 
		var PCB	= {
			line:1,
			column:1,
			offset:0,
			error_step:0,
			src:src,
			att:""
		};

		if( !err_off )
			err_off	= [];
		if( !err_la )
			err_la = [];
	
		sstack.push( 0 );
		vstack.push( 0 );
	
		PCB.la = lex( PCB );
			
		while(true){
			PCB.act = 26;
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 ){
				if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
					PCB.act = act_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
		
			if( PCB.act == 26 ){
				if( ( PCB.act = defact_tab[ sstack[sstack.length-1] ] ) < 0 )
					PCB.act = 26;
				else
					PCB.act *= -1;
			}

			/*
			_print( "state " + sstack[sstack.length-1] +
					" la = " +
					PCB.la + " att = >" +
					PCB.att + "< act = " +
					PCB.act + " src = >" +
					PCB.src.substr( PCB.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
			*/
		
			if( dbg_withtrace && sstack.length > 0 )
			{
				dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[PCB.la] +
								" (\"" + PCB.att + "\")\n" +
							"\tAction: " + PCB.act + "\n" + 
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +
									( ( PCB.offset + 30 < PCB.src.length ) ?
										"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
				if( dbg_withstepbystep )
					dbg_wait();
			}
		
			
			//Parse error? Try to recover!
			if( PCB.act == 26 )
			{
				if( dbg_withtrace )
				{
					var expect = "";
				
					dbg_print( "Error detected: " +
						"There is no reduce or shift on the symbol " +
							labels[PCB.la] );
				
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
					{
						if( expect != "" )
							expect += ", ";
						
						expect += "\"" +
								labels[ act_tab[sstack[sstack.length-1]][i] ]
									+ "\"";
					}
					dbg_print( "Expecting: " + expect );
				}
			
				//Report errors only when error_step is 0, and this is not a
				//subsequent error from a previous parse
				if( PCB.error_step == 0 ){
					err_cnt++;
					err_off.push( PCB.offset - PCB.att.length );
					err_la.push([]);
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
						err_la[err_la.length-1].push(
							labels[act_tab[sstack[sstack.length-1]][i]] );
				}
			
				//Perform error recovery			
				while( sstack.length > 1 && PCB.act == 26 ){
					sstack.pop();
					vstack.pop();
				
					//Try to shift on error token
					for( var i = 0;
						i < act_tab[sstack[sstack.length-1]].length;
						i+=2 ){
						if( act_tab[sstack[sstack.length-1]][i] == 1 ){
							PCB.act = act_tab[sstack[sstack.length-1]][i+1];
						
							sstack.push( PCB.act );
							vstack.push("");
						
							if( dbg_withtrace ){
								dbg_print("Error recovery: error token could be shifted!" );
								dbg_print( "Error recovery: current stack is " + sstack.join() );
							}
							break;
						}
					}
				}
			
				//Is it better to leave the parser now?
				if( sstack.length > 1 && PCB.act != 26 ){
					//Ok, now try to shift on the next tokens
					while( PCB.la != 22 ){
						if( dbg_withtrace )
							dbg_print( "Error recovery: " +
								"Trying to shift on \""
								+ labels[ PCB.la ] + "\"" );

						PCB.act = 26;
					
						for( var i = 0;
							i < act_tab[sstack[sstack.length-1]].length;
							i+=2 ){
							if( act_tab[sstack[sstack.length-1]][i] == PCB.la ){
								PCB.act = act_tab[sstack[sstack.length-1]][i+1];
								break;
							}
						}
					
						if( PCB.act != 26 )
							break;
						
						if( dbg_withtrace )
							dbg_print( "Error recovery: Discarding \""
								+ labels[ PCB.la ] + "\"" );
					
						while( ( PCB.la = lex( PCB ) ) < 0 )
							PCB.offset++;
				
						if( dbg_withtrace )
							dbg_print( "Error recovery: New token \""
								+ labels[ PCB.la ] + "\"" );
					}
				}
			
				if( PCB.act == 26 || PCB.la == 22 )
				{
					if( dbg_withtrace )
						dbg_print( "\tError recovery failed, terminating parse process..." );
					break;
				}

				if( dbg_withtrace )
					dbg_print( "\tError recovery succeeded, continuing" );
			
				//Try to parse the next three tokens successfully...
				PCB.error_step = 3;
			}

			//Shift
			if( PCB.act > 0 ){
				//Parse tree generation
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push({
						sym:labels[ PCB.la ],
						att:PCB.att,
						child:[]
					});
				}
			
				if( dbg_withtrace )
					dbg_print( "Shifting symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
		
				sstack.push( PCB.act );
				vstack.push( PCB.att );
			
				PCB.la = lex( PCB );
			
				if( dbg_withtrace )
					dbg_print( "\tNew lookahead symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
				
				//Successfull shift and right beyond error recovery?
				if( PCB.error_step > 0 )
					PCB.error_step--;
			}
			//Reduce
			else
			{		
				act = PCB.act * -1;
			
				if( dbg_withtrace )
					dbg_print( "Reducing by production: " + act );
			
				rval = void( 0 );
			
				if( dbg_withtrace )
					dbg_print( "\tPerforming semantic action..." );
			
				rval=ACTIONS(act,sstack,vstack);
	
				if( dbg_withparsetree )
					tmptree = [];

				if( dbg_withtrace )
					dbg_print( "\tPopping " + 
									pop_tab[act][1] +  " off the stack..." );
				
				for( var i = 0; i < pop_tab[act][1]; i++ ){
					if( dbg_withparsetree )
						tmptree.push( tree.pop() );
					
					sstack.pop();
					vstack.pop();
				}

				//Get goto-table entry
				PCB.act = 26;
				for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 ){
					if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] ){
						PCB.act = goto_tab[sstack[sstack.length-1]][i+1];
						break;
					}
				}
			
				//Do some parse tree construction if desired
				if( dbg_withparsetree ){
					tree.push( treenodes.length );
					treenodes.push( {
						sym:labels[ pop_tab[act][0] ],
						att:rval,
						child:tmptree.reverse()
						} );
				}
				//Goal symbol match?
				if( act == 0 ) break; //Don't use PCB.act here!
				if( dbg_withtrace )
					dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
			
				//...and push it!
				sstack.push( PCB.act );
				vstack.push( rval );
			}
		}

		if( dbg_withtrace ){
			dbg_print( "\nParse complete." );
			//This function is used for parser drivers that will output
			//the entire debug messages in a row.
			dbg_flush();
		}

		if( dbg_withparsetree ){
			if( err_cnt == 0 ){
				dbg_print( "\n\n--- Parse tree ---" );
				dbg_parsetree( 0, treenodes, tree );
			}
			else dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
		return err_cnt;
	}
	return parse;
})(__regex_debug);



function compile_regex( str, accept, case_insensitive ){
	var i, j;
	var weight = 0;
	var true_edges = 0;
	var error_offsets = [];
	var error_expects = [];
	var error_count = 0;
	
	if( str == "" )
		return;
	
	//_print( "str = >" + str + "< " + case_insensitive );
	
	created_nfas = [];
	
	first_nfa = create_nfa( nfa_states );
	if( ( error_count = __regexparse( str, error_offsets, error_expects ) ) == 0 ){
		//If the symbol should be case-insensitive, manipulate the
		//character sets on the newly created items.
		if( case_insensitive ){
			for( i = 0; i < created_nfas.length; i++ ){
				if( nfa_states[ created_nfas[i] ].edge == EDGE_CHAR ){
					for( j = MIN_CHAR; j < MAX_CHAR; j++ ){
						if( nfa_states[ created_nfas[i] ].ccl.get( j ) ){
							nfa_states[ created_nfas[i] ].ccl.set(String.fromCharCode( j ).toUpperCase().charCodeAt( 0 ), true );
							nfa_states[ created_nfas[i] ].ccl.set(String.fromCharCode( j ).toLowerCase().charCodeAt( 0 ), true );
						}
					}
				}
			}
		}

		/* 
			2008-5-9	Radim Cebis:
			
			I think that computing weight of the nfa_states is weird,
			IMHO nfa_state which accepts a symbol, should have
			weight according to the order...
		*/
		nfa_states[ last_nfa ].accept = accept;   
		nfa_states[ last_nfa ].weight = regex_weight++;

		if( first_nfa > 0 ){
			i = 0;
			while( nfa_states[i].follow2 != -1 )
				i = nfa_states[i].follow2;

			nfa_states[i].follow2 = first_nfa;
		}
	}else{
		for( i = 0; i < error_count; i++ ){
			var spaces = '';
			for( j = 0; j < error_offsets[i]; j++ )
				spaces += " ";
			
			line_error( cur_line, "Regular expression:\n\t" + str + "\n\t" +
			 		spaces + "^ expecting " + error_expects[i].join() );
		}
	}
}


//TESTING AREA ;)
//compile_regex( "[A-Z][A-Z0-9]*", 0 );
//compile_regex( "ab|c", 1 );
//compile_regex( "[0-9]+", 1 );
//print_nfa();
//var d = create_subset( nfa_states );
//print_dfa( d );
//d = minimize_dfa( d );
//print_dfa( d );



/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	main.js
Author:	Jan Max Meyer
Usage:	Console-based program entry for the JS/CC parser generator.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function version()
{
	var info = "";

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
	var help = "";

	help += "usage: jscc [options] filename\n\n";

	help += "       -h   --help               Print this usage help\n";
	help += "       -i   --version            Print version and copyright\n";
	help += "       -o   --output <file>      Save output source to <file>\n";
	help += "       -p   --prefix <prefix>    Use <prefix> as sequence pre-\n";
	help += "                                 fixing methods and variables\n";
	help += "       -t   --template <file>    Use template file <file> as\n";
	help += "                                 parser template\n";
	help += "       -v   --verbose            Run in verbose mode\n";
	help += "       -w   --warnings           Print warnings\n";
		
	_print( help );
}

// --- JS/CC entry ---

//Initialize the globals
reset_all( EXEC_CONSOLE );

//Processing the command line arguments
var out_file	= "";
var src_file	= "";
var tpl_file	= DEFAULT_DRIVER;
var code_prefix	= "";
var dump_nfa	= false;
var dump_dfa	= false;
var verbose		= false;
var	dfa_table;

var argv = get_arguments();
for( var i = 0; i < argv.length; i++ )
{
	if( argv[i].toLowerCase() == "-o"
			|| argv[i].toLowerCase() == "--output" )
		out_file = argv[++i];
	else if( argv[i].toLowerCase() == "-t"
			|| argv[i].toLowerCase() == "--template" )
		tpl_file = argv[++i];
	else if( argv[i].toLowerCase() == "-p"
			|| argv[i].toLowerCase() == "--prefix" )
		code_prefix = argv[++i];
	else if( argv[i].toLowerCase() == "-w"
			|| argv[i].toLowerCase() == "--warnings" )
		show_warnings = true;
	else if( argv[i].toLowerCase() == "-v"
			|| argv[i].toLowerCase() == "--verbose" )
		verbose = true;
	else if( argv[i].toLowerCase() == "-d"
			|| argv[i].toLowerCase() == "--debug" )
	{
		for( var j = 0; j < argv[i+1].length; j++ )
			switch( argv[i+1].charAt( j ) )
			{
				case 'n':
					dump_nfa = true;
					break;
				case 'd':
					dump_dfa = true;
					break;
			}
		
		i++;
	}
	else if( argv[i].toLowerCase() == "-i"
			|| argv[i].toLowerCase() == "--version" )
	{
		version();
		_quit( 0 );
	}
	else if( argv[i].toLowerCase() == "-h"
			|| argv[i].toLowerCase() == "--help" )
	{
		help();
		_quit( 0 );
	}
	else if( src_file == "" )
		src_file = argv[i];
}

//file is global source filename
file = src_file;

if( src_file != "" )
{
	var src = read_file( src_file );
	parse_grammar( src, src_file );
	
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
				//DFA state table generation
				if( dump_nfa )
					print_nfa( nfa_states );
					
				dfa_table = create_subset( nfa_states );
				dfa_table = minimize_dfa( dfa_table );
				
				if( dump_dfa )
					print_dfa( dfa_table );	
					
				//Here, we read the template from file.
				//I think in this case it is useful to choose the
				//way used in main_sm.js.
				//we can read 2 files here
				//driver and parse.js
				
				//No! parse.js is the driver!
				//driver and debugger for current platform
				//ah ok - so you think the Make target "driver" should be removed, and we put the platform selection logic here.
				//yes
				//and where is the decision done which
				//platform is selected? New command line
				//parameter?
				
				// tpl_file <_< what is this variable?
				var driver = read_file( tpl_file );
									
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

				if( out_file != "" )
					write_file( out_file, driver );
				else
					_print( driver );
				
				if( verbose )
					_print( "\"" + src_file + "\" produced " + states.length + " states (" + shifts + " shifts, " +
							reduces + " reductions, " + gotos + " gotos)" );
			}
		}
	}
	
	if( verbose )
		_print( warnings + " warning" + ( warnings > 1 ? "s" : "" ) + ", "
			+ errors + " error" + ( errors > 1 ? "s" : "" ) );
}
else
	help();

//Exit with number of errors
_quit( errors );

