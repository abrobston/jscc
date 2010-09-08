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
var JSCC_VERSION			= "0.33.1";

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
	
	/* --- Flags & Information --- */
	var nullable;		//Nullable-flag
	var defined;		//Defined flag
	
	var defined_at;		//Line of definition
	var used_at;		//Line of use
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

	var def_act;

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
//This file remains empty.
var DEFAULT_DRIVER = "";

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
function print_parse_tables( mode )
{
	var code	= new String();
	var i, j, deepest = 0, val;
	
	/* Printing the pop table */
	if( mode == MODE_GEN_HTML )
	{
		code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
		code += "<tr>";
		code += "<td class=\"tabtitle\" colspan=\"2\">Pop-Table</td>";
		code += "</tr>";
		code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
		code += "<td class=\"coltitle\">Number of symbols to pop</td>";
		code += "</tr>";
	}
	else if( mode == MODE_GEN_JS )
	{
		code += "/* Pop-Table */\n";
		code += "var pop_tab = new Array(\n";
	}
	
	for( i = 0; i < productions.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			code += "<tr>";
			code += "<td style=\"border-right: 1px solid lightgray;\">" + productions[i].lhs + "</td>";
			code += "<td>" + productions[i].rhs.length + "</td>";
			code += "</tr>";
		}
		else if( mode == MODE_GEN_JS )
		{
			code += "\tnew Array( " + productions[i].lhs + "/* " + symbols[productions[i].lhs].label + " */, "
				+ productions[i].rhs.length + " )" +
					(( i < productions.length-1 ) ? ",\n" : "\n");
		}
	}
	
	if( mode == MODE_GEN_HTML )
	{
		code += "</table>";
	}
	else if( mode == MODE_GEN_JS )
	{
		code += ");\n\n";
	}
	
	/* Printing the action table */			
	if( mode == MODE_GEN_HTML )
	{
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
		
	}
	else if( mode == MODE_GEN_JS )
	{
		code += "/* Action-Table */\n";
		code += "var act_tab = new Array(\n";
		
		for( i = 0; i < states.length; i++ )
		{
			code += "\t/* State " + i + " */ new Array( "
			for( j = 0; j < states[i].actionrow.length; j++ )
				code += states[i].actionrow[j][0] + "/* \"" + 
					symbols[states[i].actionrow[j][0]].label + "\" */," + states[i].actionrow[j][1]
						+ ( ( j < states[i].actionrow.length-1 ) ? " , " : "" );
			
			code += " )" + ( ( i < states.length-1 ) ? ",\n" : "\n" );
		}
		
		code += ");\n\n";
	}
	
	/* Printing the goto table */			
	if( mode == MODE_GEN_HTML )
	{
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
		
	}
	else if( mode == MODE_GEN_JS )
	{
		code += "/* Goto-Table */\n";
		code += "var goto_tab = new Array(\n";
		
		for( i = 0; i < states.length; i++ )
		{
			code += "\t/* State " + i + " */";
			code += " new Array( "
							
			for( j = 0; j < states[i].gotorow.length; j++ )
				code += states[i].gotorow[j][0] + "/* " + symbols[ states[i].gotorow[j][0] ].label + " */,"
					+ states[i].gotorow[j][1] + ( ( j < states[i].gotorow.length-1 ) ? " , " : "" );
			
			code += " )" + ( ( i < states.length-1 ) ? ",\n" : "\n" );
		}
		
		code += ");\n\n";
	}
	
	/*
		JMM 16.04.2009:
		Printing the default action table
	*/
	if( mode == MODE_GEN_HTML )
	{
		code += "<table class=\"print\" cellpadding=\"0\" cellspacing=\"0\">";
		code += "<tr>";
		code += "<td class=\"tabtitle\" colspan=\"2\">Default Actions Table</td>";
		code += "</tr>";
		code += "<td class=\"coltitle\" width=\"1%\" style=\"border-right: 1px solid lightgray;\">Left-hand side</td>";
		code += "<td class=\"coltitle\">Number of symbols to pop</td>";
		code += "</tr>";
	}
	else if( mode == MODE_GEN_JS )
	{
		code += "/* Default-Actions-Table */\n";
		code += "var defact_tab = new Array(\n";
	}
	
	for( i = 0; i < states.length; i++ )
	{
		if( mode == MODE_GEN_HTML )
		{
			code += "<tr>";
			code += "<td style=\"border-right: 1px solid lightgray;\">State " + i + "</td>";
			code += "<td>" + ( ( states[ i ].def_act < 0 ) ? "(none)" : states[ i ].def_act ) + "</td>";
			code += "</tr>";
		}
		else if( mode == MODE_GEN_JS )
		{
			code += "\t /* State " + i + " */ " + states[i].def_act + " " +
						(( i < states.length-1 ) ? ",\n" : "\n");
		}
	}
	
	if( mode == MODE_GEN_HTML )
	{
		code += "</table>";
	}
	else if( mode == MODE_GEN_JS )
	{
		code += ");\n\n";
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
	var code = new String();
	var i, j, k, eof_id = -1;
	var grp_start, grp_first, first;
	
	code += "switch( state )\n"
	code += "{\n";
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
				code += " ) state = " + j + ";\n";
		}
				
		code += "		";
		if( !first )
			code += "else ";
		code += "state = -1;\n"
		
		if( dfa_states[i].accept > -1 )
		{
			code += "		match = " + dfa_states[i].accept + ";\n";
			code += "		match_pos = pos;\n";
		}
		
		code += "		break;\n\n";
	}
	
	code += "}\n\n";

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
function print_symbol_labels()
{
	var code = new String();
	var i;	
	
	code += "/* Symbol labels */\n";
	code += "var labels = new Array(\n";
	for( i = 0; i < symbols.length; i++ )
	{
		code += "\t\"" + symbols[i].label + "\" ";
		
		if( symbols[i].kind == SYM_TERM )
			code += "/* Terminal symbol */";
		else
			code += "/* Non-terminal symbol */";
			
		if( i < symbols.length-1 )
			code += ",";
			
		code += "\n";
	}

	code += ");\n\n";

	return code;
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
	var code = new String();
	var re = new RegExp( "%match|%offset|%source" );
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
			
			semcode = new String();
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
	var code = new String();
	var re = new RegExp( "%[0-9]+|%%" );
	var semcode, strmatch;
	var i, j, k, idx;
	
	code += "switch( act )\n";
	code += "{\n";
	
	for( i = 0; i < productions.length; i++ )
	{
		code += "	case " + i + ":\n";
		code += "	{\n";
		
		semcode = new String();
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
	
	state.kernel = new Array();
	state.epsilon = new Array();
	state.actionrow = new Array();
	state.gotorow = new Array();
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
	item.lookahead = new Array();
	
	return item;
}


function add_table_entry( row, sym, act )
{
	var i;
	for( i = 0; i < row.length; i++ )
		if( row[i][0] == sym )
			return row;
	
	row.push( new Array( sym, act ) );
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
	sym.prods = new Array();
	sym.nullable = false;
	sym.id = symbols.length;
	sym.code = new String();
	
	sym.assoc = ASSOC_NONE; //Could be changed by grammar parser
	sym.level = 0; //Could be changed by grammar parser

	sym.special = special;
	
	//Flags
	sym.defined = false;

	sym.first = new Array();
	
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
	var closure = new Array(), nclosure, partition;
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
			closure[0].lookahead = new Array();
		
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
		partition = new Array();
		nclosure = new Array();
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
	var reds = new Array();
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
						var warning	= new String();
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

	symbols = new Array();
	productions = new Array();
	states = new Array();
	nfa_states = new Array();
	dfa_states = new Array();
	lex = new Array();
	
	//Placeholder for the goal symbol
	create_symbol( "", SYM_NONTERM, SPECIAL_NO_SPECIAL );
	symbols[0].defined = true;
	
	//Error synchronization token
	create_symbol( "ERROR_RESYNC", SYM_TERM, SPECIAL_ERROR );
	symbols[1].defined = true;
	
	p = new PROD();
	p.lhs = 0;
	p.rhs = new Array();
	p.code = new String( "%% = %1;" );
	symbols[0].prods.push( productions.length );
	productions.push( p );
	
	whitespace_token = -1;
	
	/*
	src = new String();
	src_off = 0;
	line = 1;
	lookahead = void(0);
	*/
	file = new String();
	errors = 0;
	show_errors = true;
	warnings = 0;
	show_warnings = false;
	
	shifts = 0;
	reduces = 0;
	gotos = 0;
	
	regex_weight = 0;
	
	code_head = new String();
	code_foot = new String();
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

//I think there is no documentation required on these tiny functions...
function bitset_create( size )
{
	if( size <= 0 )
		return new Array();
	
	return new Array( Math.ceil( size / 8 ) );
}


function bitset_set( bitset, bit, state )
{
	if( !bitset && bit < 0 )
		return false;
		
	if( state )
		bitset[ Math.floor( bit / 8 ) ] |= ( 1 << (bit % 8) );
	else
		bitset[ Math.floor( bit / 8 ) ] &= ( 0xFF ^ ( 1 << (bit % 8) ) );
		
	return true;
}


function bitset_get( bitset, bit )
{
	if( !bitset && bit < 0 )
		return 0;

	return bitset[ Math.floor( bit / 8 ) ] & ( 1 << ( bit % 8 ) );
}


function bitset_count( bitset )
{
	var cnt = 0;

	for( var i = 0; i < bitset.length * 8; i++ )
		if( bitset_get( bitset, i ) )
			cnt++;
			
	return cnt;
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
	var		stack		= new Array();
	var		reachable	= new Array();
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
{
	var dfa = new DFA();
	
	dfa.line = new Array( MAX_CHAR );
	dfa.accept = -1;
	dfa.nfa_set = new Array();
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
	var	result		= new Array();
	var	accept;
	var	last_accept	= new Array();
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
	var hits	= new Array();
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
	var 	stack	= new Array();
	var		accept	= new Array();
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
	var dfa_states = new Array();
	var stack = new Array();
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
			trans = new Array();
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
	var		groups			= new Array();
	var		group			= new Array();
	var		accept_groups	= new Array();
	var		min_dfa_states	= new Array();
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
	groups.push( new Array() );
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
				groups.push( new Array() );
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
			new_group = new Array();
			
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
				groups[ groups.length ] = new Array();
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

var		first_lhs;
var		cur_line;

//Wrapper for semantic errors
function line_error( line, txt )
{
	_error( "line " + line + ": " + txt );
}


/*
	Default template driver for JS/CC generated parsers running as
	browser-based JavaScript/ECMAScript applications.
	
	WARNING: 	This parser template will not run as console and has lesser
				features for debugging than the console derivates for the
				various JavaScript platforms.
	
	Written 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies
	This is in the public domain.
*/

var		first_lhs;
var		cur_line;

//Wrapper for semantic errors
function line_error( line, txt )
{
	_error( "line " + line + ": " + txt );
}



var jscc_dbg_withparsetree	= false;
var jscc_dbg_withtrace		= false;
var jscc_dbg_withstepbystep	= false;
var jscc_dbg_string			= new String();

function __jsccdbg_print( text )
{
	jscc_dbg_string += text + "\n";
}

function __jsccdbg_flush()
{
	alert( jscc_dbg_string );
}

function __jsccdbg_wait()
{
	//Not implemented for Web.
}

function __jsccdbg_parsetree( indent, nodes, tree )
{
	//Not implemented for Web.
}

/* Code of driver.js will go here... */

/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/

function __jscclex( PCB )
{
	var state;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos;
	var chr;

	while( 1 )
	{
		state = 0;
		match = -1;
		match_pos = 0;
		start = 0;
		pos = PCB.offset + 1 + ( match_pos - start );

		do
		{
			pos--;
			state = 0;
			match = -2;
			start = pos;
	
			if( PCB.src.length <= start )
				return 38;
	
			do
			{
				chr = PCB.src.charCodeAt( pos );

switch( state )
{
	case 0:
		if( chr == 9 || chr == 13 || chr == 32 ) state = 1;
		else if( chr == 10 ) state = 2;
		else if( chr == 33 ) state = 3;
		else if( chr == 38 ) state = 4;
		else if( chr == 45 || ( chr >= 48 && chr <= 57 ) || ( chr >= 65 && chr <= 90 ) || chr == 95 || ( chr >= 97 && chr <= 122 ) ) state = 5;
		else if( chr == 58 ) state = 6;
		else if( chr == 59 ) state = 7;
		else if( chr == 60 ) state = 8;
		else if( chr == 62 ) state = 9;
		else if( chr == 94 ) state = 10;
		else if( chr == 124 ) state = 11;
		else if( chr == 126 ) state = 12;
		else if( chr == 34 ) state = 18;
		else if( chr == 35 ) state = 21;
		else if( chr == 39 ) state = 22;
		else if( chr == 47 ) state = 23;
		else if( chr == 91 ) state = 24;
		else state = -1;
		break;

	case 1:
		if( chr == 9 || chr == 13 || chr == 32 ) state = 1;
		else state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 5:
		if( chr == 45 || ( chr >= 48 && chr <= 57 ) || ( chr >= 65 && chr <= 90 ) || chr == 95 || ( chr >= 97 && chr <= 122 ) ) state = 5;
		else state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 8:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 9:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 12:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 13:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 14:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 15:
		state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 16:
		state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 17:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 18:
		if( chr == 34 ) state = 13;
		else if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 18;
		else if( chr == 92 ) state = 25;
		else state = -1;
		break;

	case 19:
		if( chr == 34 ) state = 13;
		else if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 18;
		else if( chr == 92 ) state = 25;
		else state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 20:
		if( chr == 39 ) state = 15;
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 22;
		else if( chr == 92 ) state = 26;
		else state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 21:
		if( chr == 35 ) state = 14;
		else state = -1;
		break;

	case 22:
		if( chr == 39 ) state = 15;
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 22;
		else if( chr == 92 ) state = 26;
		else state = -1;
		break;

	case 23:
		if( chr == 126 ) state = 27;
		else state = -1;
		break;

	case 24:
		if( chr == 42 ) state = 35;
		else state = -1;
		break;

	case 25:
		if( ( chr >= 0 && chr <= 33 ) || ( chr >= 35 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 18;
		else if( chr == 34 ) state = 19;
		else if( chr == 92 ) state = 25;
		else state = -1;
		break;

	case 26:
		if( chr == 39 ) state = 20;
		else if( ( chr >= 0 && chr <= 38 ) || ( chr >= 40 && chr <= 91 ) || ( chr >= 93 && chr <= 254 ) ) state = 22;
		else if( chr == 92 ) state = 26;
		else state = -1;
		break;

	case 27:
		if( chr == 47 ) state = 28;
		else if( chr == 126 ) state = 29;
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) state = 36;
		else state = -1;
		break;

	case 28:
		if( chr == 47 ) state = 27;
		else state = -1;
		break;

	case 29:
		if( chr == 47 ) state = 16;
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 254 ) ) state = 27;
		else state = -1;
		break;

	case 30:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 254 ) ) state = 30;
		else if( chr == 42 ) state = 31;
		else state = -1;
		break;

	case 31:
		if( chr == 93 ) state = 17;
		else if( ( chr >= 0 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) state = 34;
		else state = -1;
		break;

	case 32:
		if( chr == 93 ) state = 34;
		else state = -1;
		break;

	case 33:
		if( chr == 126 ) state = 29;
		else if( chr == 47 ) state = 33;
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) state = 36;
		else state = -1;
		break;

	case 34:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) state = 30;
		else if( chr == 42 ) state = 31;
		else if( chr == 93 ) state = 32;
		else state = -1;
		break;

	case 35:
		if( ( chr >= 0 && chr <= 41 ) || ( chr >= 43 && chr <= 92 ) || ( chr >= 94 && chr <= 254 ) ) state = 30;
		else if( chr == 42 ) state = 31;
		else if( chr == 93 ) state = 32;
		else state = -1;
		break;

	case 36:
		if( chr == 126 ) state = 29;
		else if( chr == 47 ) state = 33;
		else if( ( chr >= 0 && chr <= 46 ) || ( chr >= 48 && chr <= 125 ) || ( chr >= 127 && chr <= 254 ) ) state = 36;
		else state = -1;
		break;

}



				//Line- and column-counter
				if( state > -1 )
				{
					if( chr == 10 )
					{
						PCB.line++;
						PCB.column = 0;
					}
					PCB.column++;
				}

				pos++;
	
			}
			while( state > -1 );
	
		}
		while( -1 > -1 && match == -1 );
	
		if( match > -1 )
		{
			PCB.att = PCB.src.substr( start, match_pos - start );
			PCB.offset = match_pos;
			
	if( match == 12 )
	{
			PCB.att = PCB.att.substr(
																	2, PCB.att.length - 4 );
															
		}
	else if( match == 16 )
	{
		 	continue;	
		}
	else if( match == 17 )
	{
			continue;	
		}
	else if( match == 18 )
	{
			continue;	
		}

		}
		else
		{
			PCB.att = new String();
			match = -1;
		}
		
		break;
	}

	return match;
}

function __jsccparse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		rval;
	var		act;
	
	//PCB: Parser Control Block
	var 	parsercontrol	= new Function( "",
								"var la;" +
								"var act;" +
								"var offset;" +
								"var src;" +
								"var att;" +
								"var line;" +
								"var column;" +
								"var error_step;" );
	var		PCB	= new parsercontrol();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "",
								"var sym;"+
								"var att;"+
								"var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* def' */, 1 ),
	new Array( 23/* def */, 5 ),
	new Array( 19/* header_code */, 1 ),
	new Array( 22/* footer_code */, 1 ),
	new Array( 20/* token_assocs */, 2 ),
	new Array( 20/* token_assocs */, 1 ),
	new Array( 25/* token_assoc */, 3 ),
	new Array( 25/* token_assoc */, 3 ),
	new Array( 25/* token_assoc */, 3 ),
	new Array( 25/* token_assoc */, 2 ),
	new Array( 25/* token_assoc */, 2 ),
	new Array( 26/* token_defs */, 2 ),
	new Array( 26/* token_defs */, 1 ),
	new Array( 28/* token_def */, 3 ),
	new Array( 28/* token_def */, 2 ),
	new Array( 21/* grammar_defs */, 2 ),
	new Array( 21/* grammar_defs */, 1 ),
	new Array( 30/* grammar_def */, 4 ),
	new Array( 30/* grammar_def */, 2 ),
	new Array( 31/* productions */, 3 ),
	new Array( 31/* productions */, 1 ),
	new Array( 32/* rhs */, 3 ),
	new Array( 34/* rhs_prec */, 2 ),
	new Array( 34/* rhs_prec */, 2 ),
	new Array( 34/* rhs_prec */, 0 ),
	new Array( 33/* sequence_opt */, 1 ),
	new Array( 33/* sequence_opt */, 0 ),
	new Array( 35/* sequence */, 2 ),
	new Array( 35/* sequence */, 1 ),
	new Array( 36/* symbol */, 1 ),
	new Array( 36/* symbol */, 1 ),
	new Array( 36/* symbol */, 1 ),
	new Array( 24/* code_opt */, 1 ),
	new Array( 24/* code_opt */, 0 ),
	new Array( 37/* code */, 2 ),
	new Array( 37/* code */, 1 ),
	new Array( 27/* string */, 1 ),
	new Array( 27/* string */, 1 ),
	new Array( 29/* identifier */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 12/* "CODE" */,5 , 3/* "<" */,-33 , 4/* ">" */,-33 , 5/* "^" */,-33 , 6/* "!" */,-33 , 13/* "STRING_SINGLE" */,-33 , 14/* "STRING_DOUBLE" */,-33 ),
	/* State 1 */ new Array( 38/* "$" */,0 ),
	/* State 2 */ new Array( 3/* "<" */,8 , 4/* ">" */,9 , 5/* "^" */,10 , 6/* "!" */,12 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 3 */ new Array( 3/* "<" */,-2 , 4/* ">" */,-2 , 5/* "^" */,-2 , 6/* "!" */,-2 , 13/* "STRING_SINGLE" */,-2 , 14/* "STRING_DOUBLE" */,-2 ),
	/* State 4 */ new Array( 12/* "CODE" */,17 , 3/* "<" */,-32 , 4/* ">" */,-32 , 5/* "^" */,-32 , 6/* "!" */,-32 , 13/* "STRING_SINGLE" */,-32 , 14/* "STRING_DOUBLE" */,-32 , 7/* ";" */,-32 , 38/* "$" */,-32 , 9/* "|" */,-32 ),
	/* State 5 */ new Array( 3/* "<" */,-35 , 4/* ">" */,-35 , 5/* "^" */,-35 , 6/* "!" */,-35 , 13/* "STRING_SINGLE" */,-35 , 14/* "STRING_DOUBLE" */,-35 , 12/* "CODE" */,-35 , 7/* ";" */,-35 , 38/* "$" */,-35 , 9/* "|" */,-35 ),
	/* State 6 */ new Array( 2/* "##" */,19 , 3/* "<" */,8 , 4/* ">" */,9 , 5/* "^" */,10 , 6/* "!" */,12 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 7 */ new Array( 2/* "##" */,-5 , 3/* "<" */,-5 , 4/* ">" */,-5 , 5/* "^" */,-5 , 6/* "!" */,-5 , 13/* "STRING_SINGLE" */,-5 , 14/* "STRING_DOUBLE" */,-5 ),
	/* State 8 */ new Array( 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 9 */ new Array( 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 10 */ new Array( 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 11 */ new Array( 7/* ";" */,24 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 12 */ new Array( 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 13 */ new Array( 7/* ";" */,-12 , 13/* "STRING_SINGLE" */,-12 , 14/* "STRING_DOUBLE" */,-12 ),
	/* State 14 */ new Array( 15/* "IDENT" */,28 , 12/* "CODE" */,5 , 7/* ";" */,-33 , 13/* "STRING_SINGLE" */,-33 , 14/* "STRING_DOUBLE" */,-33 ),
	/* State 15 */ new Array( 15/* "IDENT" */,-36 , 12/* "CODE" */,-36 , 7/* ";" */,-36 , 13/* "STRING_SINGLE" */,-36 , 14/* "STRING_DOUBLE" */,-36 , 2/* "##" */,-36 , 3/* "<" */,-36 , 4/* ">" */,-36 , 5/* "^" */,-36 , 6/* "!" */,-36 , 10/* "&" */,-36 , 9/* "|" */,-36 , 11/* "~" */,-36 ),
	/* State 16 */ new Array( 15/* "IDENT" */,-37 , 12/* "CODE" */,-37 , 7/* ";" */,-37 , 13/* "STRING_SINGLE" */,-37 , 14/* "STRING_DOUBLE" */,-37 , 2/* "##" */,-37 , 3/* "<" */,-37 , 4/* ">" */,-37 , 5/* "^" */,-37 , 6/* "!" */,-37 , 10/* "&" */,-37 , 9/* "|" */,-37 , 11/* "~" */,-37 ),
	/* State 17 */ new Array( 3/* "<" */,-34 , 4/* ">" */,-34 , 5/* "^" */,-34 , 6/* "!" */,-34 , 13/* "STRING_SINGLE" */,-34 , 14/* "STRING_DOUBLE" */,-34 , 12/* "CODE" */,-34 , 7/* ";" */,-34 , 38/* "$" */,-34 , 9/* "|" */,-34 ),
	/* State 18 */ new Array( 2/* "##" */,-4 , 3/* "<" */,-4 , 4/* ">" */,-4 , 5/* "^" */,-4 , 6/* "!" */,-4 , 13/* "STRING_SINGLE" */,-4 , 14/* "STRING_DOUBLE" */,-4 ),
	/* State 19 */ new Array( 1/* "ERROR_RESYNC" */,32 , 15/* "IDENT" */,28 ),
	/* State 20 */ new Array( 7/* ";" */,33 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 21 */ new Array( 7/* ";" */,34 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 22 */ new Array( 7/* ";" */,35 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 23 */ new Array( 7/* ";" */,-11 , 13/* "STRING_SINGLE" */,-11 , 14/* "STRING_DOUBLE" */,-11 ),
	/* State 24 */ new Array( 2/* "##" */,-9 , 3/* "<" */,-9 , 4/* ">" */,-9 , 5/* "^" */,-9 , 6/* "!" */,-9 , 13/* "STRING_SINGLE" */,-9 , 14/* "STRING_DOUBLE" */,-9 ),
	/* State 25 */ new Array( 2/* "##" */,-10 , 3/* "<" */,-10 , 4/* ">" */,-10 , 5/* "^" */,-10 , 6/* "!" */,-10 , 13/* "STRING_SINGLE" */,-10 , 14/* "STRING_DOUBLE" */,-10 ),
	/* State 26 */ new Array( 7/* ";" */,-14 , 13/* "STRING_SINGLE" */,-14 , 14/* "STRING_DOUBLE" */,-14 ),
	/* State 27 */ new Array( 12/* "CODE" */,5 , 7/* ";" */,-33 , 13/* "STRING_SINGLE" */,-33 , 14/* "STRING_DOUBLE" */,-33 ),
	/* State 28 */ new Array( 12/* "CODE" */,-38 , 7/* ";" */,-38 , 13/* "STRING_SINGLE" */,-38 , 14/* "STRING_DOUBLE" */,-38 , 8/* ":" */,-38 , 10/* "&" */,-38 , 9/* "|" */,-38 , 15/* "IDENT" */,-38 , 11/* "~" */,-38 ),
	/* State 29 */ new Array( 1/* "ERROR_RESYNC" */,32 , 15/* "IDENT" */,28 , 12/* "CODE" */,5 , 38/* "$" */,-33 ),
	/* State 30 */ new Array( 12/* "CODE" */,-16 , 38/* "$" */,-16 , 15/* "IDENT" */,-16 , 1/* "ERROR_RESYNC" */,-16 ),
	/* State 31 */ new Array( 8/* ":" */,40 ),
	/* State 32 */ new Array( 7/* ";" */,41 ),
	/* State 33 */ new Array( 2/* "##" */,-6 , 3/* "<" */,-6 , 4/* ">" */,-6 , 5/* "^" */,-6 , 6/* "!" */,-6 , 13/* "STRING_SINGLE" */,-6 , 14/* "STRING_DOUBLE" */,-6 ),
	/* State 34 */ new Array( 2/* "##" */,-7 , 3/* "<" */,-7 , 4/* ">" */,-7 , 5/* "^" */,-7 , 6/* "!" */,-7 , 13/* "STRING_SINGLE" */,-7 , 14/* "STRING_DOUBLE" */,-7 ),
	/* State 35 */ new Array( 2/* "##" */,-8 , 3/* "<" */,-8 , 4/* ">" */,-8 , 5/* "^" */,-8 , 6/* "!" */,-8 , 13/* "STRING_SINGLE" */,-8 , 14/* "STRING_DOUBLE" */,-8 ),
	/* State 36 */ new Array( 7/* ";" */,-13 , 13/* "STRING_SINGLE" */,-13 , 14/* "STRING_DOUBLE" */,-13 ),
	/* State 37 */ new Array( 12/* "CODE" */,-15 , 38/* "$" */,-15 , 15/* "IDENT" */,-15 , 1/* "ERROR_RESYNC" */,-15 ),
	/* State 38 */ new Array( 38/* "$" */,-1 ),
	/* State 39 */ new Array( 38/* "$" */,-3 ),
	/* State 40 */ new Array( 11/* "~" */,49 , 15/* "IDENT" */,28 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 , 10/* "&" */,-26 , 12/* "CODE" */,-26 , 7/* ";" */,-26 , 9/* "|" */,-26 ),
	/* State 41 */ new Array( 12/* "CODE" */,-18 , 38/* "$" */,-18 , 15/* "IDENT" */,-18 , 1/* "ERROR_RESYNC" */,-18 ),
	/* State 42 */ new Array( 9/* "|" */,50 , 7/* ";" */,51 ),
	/* State 43 */ new Array( 7/* ";" */,-20 , 9/* "|" */,-20 ),
	/* State 44 */ new Array( 10/* "&" */,53 , 12/* "CODE" */,-24 , 7/* ";" */,-24 , 9/* "|" */,-24 ),
	/* State 45 */ new Array( 11/* "~" */,49 , 15/* "IDENT" */,28 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 , 10/* "&" */,-25 , 12/* "CODE" */,-25 , 7/* ";" */,-25 , 9/* "|" */,-25 ),
	/* State 46 */ new Array( 10/* "&" */,-28 , 12/* "CODE" */,-28 , 7/* ";" */,-28 , 9/* "|" */,-28 , 15/* "IDENT" */,-28 , 13/* "STRING_SINGLE" */,-28 , 14/* "STRING_DOUBLE" */,-28 , 11/* "~" */,-28 ),
	/* State 47 */ new Array( 10/* "&" */,-29 , 12/* "CODE" */,-29 , 7/* ";" */,-29 , 9/* "|" */,-29 , 15/* "IDENT" */,-29 , 13/* "STRING_SINGLE" */,-29 , 14/* "STRING_DOUBLE" */,-29 , 11/* "~" */,-29 ),
	/* State 48 */ new Array( 10/* "&" */,-30 , 12/* "CODE" */,-30 , 7/* ";" */,-30 , 9/* "|" */,-30 , 15/* "IDENT" */,-30 , 13/* "STRING_SINGLE" */,-30 , 14/* "STRING_DOUBLE" */,-30 , 11/* "~" */,-30 ),
	/* State 49 */ new Array( 10/* "&" */,-31 , 12/* "CODE" */,-31 , 7/* ";" */,-31 , 9/* "|" */,-31 , 15/* "IDENT" */,-31 , 13/* "STRING_SINGLE" */,-31 , 14/* "STRING_DOUBLE" */,-31 , 11/* "~" */,-31 ),
	/* State 50 */ new Array( 11/* "~" */,49 , 15/* "IDENT" */,28 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 , 10/* "&" */,-26 , 12/* "CODE" */,-26 , 7/* ";" */,-26 , 9/* "|" */,-26 ),
	/* State 51 */ new Array( 12/* "CODE" */,-17 , 38/* "$" */,-17 , 15/* "IDENT" */,-17 , 1/* "ERROR_RESYNC" */,-17 ),
	/* State 52 */ new Array( 12/* "CODE" */,5 , 7/* ";" */,-33 , 9/* "|" */,-33 ),
	/* State 53 */ new Array( 15/* "IDENT" */,28 , 13/* "STRING_SINGLE" */,15 , 14/* "STRING_DOUBLE" */,16 ),
	/* State 54 */ new Array( 10/* "&" */,-27 , 12/* "CODE" */,-27 , 7/* ";" */,-27 , 9/* "|" */,-27 , 15/* "IDENT" */,-27 , 13/* "STRING_SINGLE" */,-27 , 14/* "STRING_DOUBLE" */,-27 , 11/* "~" */,-27 ),
	/* State 55 */ new Array( 7/* ";" */,-19 , 9/* "|" */,-19 ),
	/* State 56 */ new Array( 7/* ";" */,-21 , 9/* "|" */,-21 ),
	/* State 57 */ new Array( 12/* "CODE" */,-23 , 7/* ";" */,-23 , 9/* "|" */,-23 ),
	/* State 58 */ new Array( 12/* "CODE" */,-22 , 7/* ";" */,-22 , 9/* "|" */,-22 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 23/* def */,1 , 19/* header_code */,2 , 24/* code_opt */,3 , 37/* code */,4 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array( 20/* token_assocs */,6 , 25/* token_assoc */,7 , 26/* token_defs */,11 , 28/* token_def */,13 , 27/* string */,14 ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array( 25/* token_assoc */,18 , 26/* token_defs */,11 , 28/* token_def */,13 , 27/* string */,14 ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array( 26/* token_defs */,20 , 28/* token_def */,13 , 27/* string */,14 ),
	/* State 9 */ new Array( 26/* token_defs */,21 , 28/* token_def */,13 , 27/* string */,14 ),
	/* State 10 */ new Array( 26/* token_defs */,22 , 28/* token_def */,13 , 27/* string */,14 ),
	/* State 11 */ new Array( 28/* token_def */,23 , 27/* string */,14 ),
	/* State 12 */ new Array( 27/* string */,25 ),
	/* State 13 */ new Array(  ),
	/* State 14 */ new Array( 24/* code_opt */,26 , 29/* identifier */,27 , 37/* code */,4 ),
	/* State 15 */ new Array(  ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array( 21/* grammar_defs */,29 , 30/* grammar_def */,30 , 29/* identifier */,31 ),
	/* State 20 */ new Array( 28/* token_def */,23 , 27/* string */,14 ),
	/* State 21 */ new Array( 28/* token_def */,23 , 27/* string */,14 ),
	/* State 22 */ new Array( 28/* token_def */,23 , 27/* string */,14 ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  ),
	/* State 25 */ new Array(  ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array( 24/* code_opt */,36 , 37/* code */,4 ),
	/* State 28 */ new Array(  ),
	/* State 29 */ new Array( 30/* grammar_def */,37 , 22/* footer_code */,38 , 24/* code_opt */,39 , 29/* identifier */,31 , 37/* code */,4 ),
	/* State 30 */ new Array(  ),
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array(  ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array(  ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array( 31/* productions */,42 , 32/* rhs */,43 , 33/* sequence_opt */,44 , 35/* sequence */,45 , 36/* symbol */,46 , 29/* identifier */,47 , 27/* string */,48 ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array( 34/* rhs_prec */,52 ),
	/* State 45 */ new Array( 36/* symbol */,54 , 29/* identifier */,47 , 27/* string */,48 ),
	/* State 46 */ new Array(  ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array(  ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array( 32/* rhs */,55 , 33/* sequence_opt */,44 , 35/* sequence */,45 , 36/* symbol */,46 , 29/* identifier */,47 , 27/* string */,48 ),
	/* State 51 */ new Array(  ),
	/* State 52 */ new Array( 24/* code_opt */,56 , 37/* code */,4 ),
	/* State 53 */ new Array( 27/* string */,57 , 29/* identifier */,58 ),
	/* State 54 */ new Array(  ),
	/* State 55 */ new Array(  ),
	/* State 56 */ new Array(  ),
	/* State 57 */ new Array(  ),
	/* State 58 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"def'" /* Non-terminal symbol */,
	"ERROR_RESYNC" /* Terminal symbol */,
	"##" /* Terminal symbol */,
	"<" /* Terminal symbol */,
	">" /* Terminal symbol */,
	"^" /* Terminal symbol */,
	"!" /* Terminal symbol */,
	";" /* Terminal symbol */,
	":" /* Terminal symbol */,
	"|" /* Terminal symbol */,
	"&" /* Terminal symbol */,
	"~" /* Terminal symbol */,
	"CODE" /* Terminal symbol */,
	"STRING_SINGLE" /* Terminal symbol */,
	"STRING_DOUBLE" /* Terminal symbol */,
	"IDENT" /* Terminal symbol */,
	"n" /* Terminal symbol */,
	"/~([^~]/|~[^/]|[^~/])*~/" /* Terminal symbol */,
	"[tr ]+" /* Terminal symbol */,
	"header_code" /* Non-terminal symbol */,
	"token_assocs" /* Non-terminal symbol */,
	"grammar_defs" /* Non-terminal symbol */,
	"footer_code" /* Non-terminal symbol */,
	"def" /* Non-terminal symbol */,
	"code_opt" /* Non-terminal symbol */,
	"token_assoc" /* Non-terminal symbol */,
	"token_defs" /* Non-terminal symbol */,
	"string" /* Non-terminal symbol */,
	"token_def" /* Non-terminal symbol */,
	"identifier" /* Non-terminal symbol */,
	"grammar_def" /* Non-terminal symbol */,
	"productions" /* Non-terminal symbol */,
	"rhs" /* Non-terminal symbol */,
	"sequence_opt" /* Non-terminal symbol */,
	"rhs_prec" /* Non-terminal symbol */,
	"sequence" /* Non-terminal symbol */,
	"symbol" /* Non-terminal symbol */,
	"code" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	PCB.line = 1;
	PCB.column = 1;
	PCB.offset = 0;
	PCB.error_step = 0;
	PCB.src = src;
	PCB.att = new String();

	if( !err_off )
		err_off	= new Array();
	if( !err_la )
		err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	PCB.la = __jscclex( PCB );
			
	while( true )
	{
		PCB.act = 60;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == PCB.la )
			{
				PCB.act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}
		
		if( PCB.act == 60 )
		{
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
		
		if( jscc_dbg_withtrace && sstack.length > 0 )
		{
			__jsccdbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[PCB.la] +
								" (\"" + PCB.att + "\")\n" +
							"\tAction: " + PCB.act + "\n" + 
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +
									( ( PCB.offset + 30 < PCB.src.length ) ?
										"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( jscc_dbg_withstepbystep )
				__jsccdbg_wait();
		}
		
			
		//Parse error? Try to recover!
		if( PCB.act == 60 )
		{
			if( jscc_dbg_withtrace )
			{
				var expect = new String();
				
				__jsccdbg_print( "Error detected: " +
					"There is no reduce or shift on the symbol " +
						labels[PCB.la] );
				
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
				{
					if( expect != "" )
						expect += ", ";
						
					expect += "\"" +
								labels[ act_tab[sstack[sstack.length-1]][i] ]
									+ "\"";
				}
				
				__jsccdbg_print( "Expecting: " + expect );
			}
			
			//Report errors only when error_step is 0, and this is not a
			//subsequent error from a previous parse
			if( PCB.error_step == 0 )
			{
				err_cnt++;
				err_off.push( PCB.offset - PCB.att.length );
				err_la.push( new Array() );
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
					err_la[err_la.length-1].push(
							labels[act_tab[sstack[sstack.length-1]][i]] );
			}
			
			//Perform error recovery			
			while( sstack.length > 1 && PCB.act == 60 )
			{
				sstack.pop();
				vstack.pop();
				
				//Try to shift on error token
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
				{
					if( act_tab[sstack[sstack.length-1]][i] == 1 )
					{
						PCB.act = act_tab[sstack[sstack.length-1]][i+1];
						
						sstack.push( PCB.act );
						vstack.push( new String() );
						
						if( jscc_dbg_withtrace )
						{
							__jsccdbg_print(
								"Error recovery: error token " +
									"could be shifted!" );
							__jsccdbg_print( "Error recovery: " +
									"current stack is " + sstack.join() );
						}

						break;
					}
				}
			}
			
			//Is it better to leave the parser now?
			if( sstack.length > 1 && PCB.act != 60 )
			{
				//Ok, now try to shift on the next tokens
				while( PCB.la != 38 )
				{
					if( jscc_dbg_withtrace )
						__jsccdbg_print( "Error recovery: " +
							"Trying to shift on \""
								+ labels[ PCB.la ] + "\"" );

					PCB.act = 60;
					
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
							i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == PCB.la )
						{
							PCB.act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
					
					if( PCB.act != 60 )
						break;
						
					if( jscc_dbg_withtrace )
						__jsccdbg_print( "Error recovery: Discarding \""
							+ labels[ PCB.la ] + "\"" );
					
					while( ( PCB.la = __jscclex( PCB ) )
								< 0 )
						PCB.offset++;
				
					if( jscc_dbg_withtrace )
						__jsccdbg_print( "Error recovery: New token \""
							+ labels[ PCB.la ] + "\"" );
				}
				while( PCB.la != 38 && PCB.act == 60 );
			}
			
			if( PCB.act == 60 || PCB.la == 38 )
			{
				if( jscc_dbg_withtrace )
					__jsccdbg_print( "\tError recovery failed, " +
							"terminating parse process..." );
				break;
			}

			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tError recovery succeeded, " +
											"continuing" );
			
			//Try to parse the next three tokens successfully...
			PCB.error_step = 3;
		}

		//Shift
		if( PCB.act > 0 )
		{
			//Parse tree generation
			if( jscc_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ PCB.la ];
				node.att = PCB.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "Shifting symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
		
			sstack.push( PCB.act );
			vstack.push( PCB.att );
			
			PCB.la = __jscclex( PCB );
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tNew lookahead symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
				
			//Successfull shift and right beyond error recovery?
			if( PCB.error_step > 0 )
				PCB.error_step--;
		}
		//Reduce
		else
		{		
			act = PCB.act * -1;
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "Reducing by production: " + act );
			
			rval = void( 0 );
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		rval = vstack[ vstack.length - 5 ];
	}
	break;
	case 2:
	{
		 code_head += vstack[ vstack.length - 1 ]; 
	}
	break;
	case 3:
	{
		 code_foot += vstack[ vstack.length - 1 ]; 
	}
	break;
	case 4:
	{
		rval = vstack[ vstack.length - 2 ];
	}
	break;
	case 5:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 6:
	{
			assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_LEFT;
														}
													
	}
	break;
	case 7:
	{
			assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_RIGHT;
														}
													
	}
	break;
	case 8:
	{
			assoc_level++;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_NOASSOC;
														}
													
	}
	break;
	case 9:
	{
		rval = vstack[ vstack.length - 2 ];
	}
	break;
	case 10:
	{
			if( whitespace_token == -1 )
														{
															var regex = vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2 );
															whitespace_token = create_symbol( "WHITESPACE", SYM_TERM, SPECIAL_WHITESPACE );
															compile_regex( regex, whitespace_token, 
																( vstack[ vstack.length - 1 ].charAt( 0 ) == '\'' ) ? false : true );
														}
														else
															line_error( PCB.line, "Multiple whitespace definition" );
													
	}
	break;
	case 11:
	{
			vstack[ vstack.length - 2 ].push( vstack[ vstack.length - 1 ] );
														rval = vstack[ vstack.length - 2 ];
													
	}
	break;
	case 12:
	{
			rval = new Array();
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 13:
	{
			rval = create_symbol( vstack[ vstack.length - 2 ], SYM_TERM, SPECIAL_NO_SPECIAL );
														var regex = vstack[ vstack.length - 3 ].substr( 1, vstack[ vstack.length - 3 ].length - 2 );
														symbols[rval].code = vstack[ vstack.length - 1 ];

														compile_regex( regex, symbols[ rval ].id, 
															( vstack[ vstack.length - 3 ].charAt( 0 ) == '\'' ) ? false : true );
													
	}
	break;
	case 14:
	{
			var regex = vstack[ vstack.length - 2 ].substr( 1, vstack[ vstack.length - 2 ].length - 2 );
														rval = create_symbol( regex.replace( /\\/g, "" ), SYM_TERM, SPECIAL_NO_SPECIAL );
														symbols[rval].code = vstack[ vstack.length - 1 ];

														compile_regex( regex, symbols[ rval ].id, 
															( vstack[ vstack.length - 2 ].charAt( 0 ) == '\'' ) ? false : true );
													
	}
	break;
	case 15:
	{
		rval = vstack[ vstack.length - 2 ];
	}
	break;
	case 16:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 17:
	{
			var nonterm = create_symbol( vstack[ vstack.length - 4 ], SYM_NONTERM, SPECIAL_NO_SPECIAL );
														symbols[nonterm].defined = true;
														for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															productions[ vstack[ vstack.length - 2 ][i] ].lhs = nonterm;
															symbols[nonterm].prods.push( vstack[ vstack.length - 2 ][i] );
														}
														
														if( first_lhs )
														{
															first_lhs = false;
															symbols[0].label = symbols[nonterm].label + "\'";
															productions[0].rhs.push( nonterm );
														}
													
	}
	break;
	case 18:
	{
		rval = vstack[ vstack.length - 2 ];
	}
	break;
	case 19:
	{
			rval = new Array();
														rval = rval.concat( vstack[ vstack.length - 3 ] );
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 20:
	{
			rval = new Array();
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 21:
	{
			var prod = new PROD();
														prod.id = productions.length;
														prod.rhs = vstack[ vstack.length - 3 ];
														prod.level = vstack[ vstack.length - 2 ];
														prod.code = vstack[ vstack.length - 1 ];														
														if( prod.code == "" )
															prod.code = new String( DEF_PROD_CODE );
														
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
														rval = prod.id;
													
	}
	break;
	case 22:
	{
		 	var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															rval = symbols[index].level;
														else
															line_error( PCB.line, "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
	}
	break;
	case 23:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ),
																		SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															rval = symbols[index].level;
														else
															line_error(  PCB.line, "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
	}
	break;
	case 24:
	{
			rval = 0; 
	}
	break;
	case 25:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 26:
	{
			rval = new Array(); 
	}
	break;
	case 27:
	{
			rval = new Array();
														rval = rval.concat( vstack[ vstack.length - 2 ] );
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 28:
	{
			rval = new Array();
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 29:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															rval = index;
														else
															rval = create_symbol( vstack[ vstack.length - 1 ], SYM_NONTERM, SPECIAL_NO_SPECIAL );
													
	}
	break;
	case 30:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ),
																SYM_TERM, SPECIAL_NO_SPECIAL ) ) > -1 )
															rval = index;
														else
															line_error(  PCB.line, "Call to undefined terminal " + vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 31:
	{
			rval = find_symbol( "ERROR_RESYNC", SYM_TERM,
																			SPECIAL_ERROR );
													
	}
	break;
	case 32:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 33:
	{
			rval = new String(); 
	}
	break;
	case 34:
	{
			rval = vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ]; 
	}
	break;
	case 35:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 36:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 37:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 38:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}


			
			if( jscc_dbg_withparsetree )
				tmptree = new Array();

			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tPopping " + 
									pop_tab[act][1] +  " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( jscc_dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}

			//Get goto-table entry
			PCB.act = 60;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					PCB.act = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			//Do some parse tree construction if desired
			if( jscc_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = rval;
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			//Goal symbol match?
			if( act == 0 ) //Don't use PCB.act here!
				break;
				
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tPushing non-terminal " + 
						labels[ pop_tab[act][0] ] );
			
			//...and push it!
			sstack.push( PCB.act );
			vstack.push( rval );
		}
	}

	if( jscc_dbg_withtrace )
	{
		__jsccdbg_print( "\nParse complete." );
		
		//This function is used for parser drivers that will output
		//the entire debug messages in a row.
		__jsccdbg_flush();
	}

	if( jscc_dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__jsccdbg_print( "\n\n--- Parse tree ---" );
			__jsccdbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__jsccdbg_print( "\n\nParse tree cannot be viewed. " +
									"There where parse errors." );
		}
	}
	
	return err_cnt;
}



function parse_grammar( str, filename )
{
	var error_offsets = new Array();
	var error_expects = new Array();
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
	
	if( i == where.length )
	{
		nfa = new NFA()			
		where.push( nfa );
	}
	
	where[i].edge = EDGE_EPSILON;
	where[i].ccl = bitset_create( MAX_CHAR );
	where[i].accept = -1;
	where[i].follow = -1;
	where[i].follow2 = -1;
	where[i].weight = -1;
	
	created_nfas.push( i );
	
	return i;
}


/*
	Default template driver for JS/CC generated parsers running as
	browser-based JavaScript/ECMAScript applications.
	
	WARNING: 	This parser template will not run as console and has lesser
				features for debugging than the console derivates for the
				various JavaScript platforms.
	
	Written 2007-2010 by Jan Max Meyer, J.M.K S.F. Software Technologies
	This is in the public domain.
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
	
	if( i == where.length )
	{
		nfa = new NFA()			
		where.push( nfa );
	}
	
	where[i].edge = EDGE_EPSILON;
	where[i].ccl = bitset_create( MAX_CHAR );
	where[i].accept = -1;
	where[i].follow = -1;
	where[i].follow2 = -1;
	where[i].weight = -1;
	
	created_nfas.push( i );
	
	return i;
}



var regex_dbg_withparsetree	= false;
var regex_dbg_withtrace		= false;
var regex_dbg_withstepbystep	= false;
var regex_dbg_string			= new String();

function __regexdbg_print( text )
{
	regex_dbg_string += text + "\n";
}

function __regexdbg_flush()
{
	alert( regex_dbg_string );
}

function __regexdbg_wait()
{
	//Not implemented for Web.
}

function __regexdbg_parsetree( indent, nodes, tree )
{
	//Not implemented for Web.
}

/* Code of driver.js will go here... */

/*
	This is the general, platform-independent part of every parser driver;
	Input-/Output and Feature-Functions are done by the particular drivers
	created for the particular platform.
*/

function __regexlex( PCB )
{
	var state;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos;
	var chr;

	while( 1 )
	{
		state = 0;
		match = -1;
		match_pos = 0;
		start = 0;
		pos = PCB.offset + 1 + ( match_pos - start );

		do
		{
			pos--;
			state = 0;
			match = -2;
			start = pos;
	
			if( PCB.src.length <= start )
				return 22;
	
			do
			{
				chr = PCB.src.charCodeAt( pos );

switch( state )
{
	case 0:
		if( ( chr >= 0 && chr <= 39 ) || ( chr >= 44 && chr <= 45 ) || ( chr >= 47 && chr <= 62 ) || ( chr >= 64 && chr <= 90 ) || ( chr >= 94 && chr <= 123 ) || ( chr >= 125 && chr <= 254 ) ) state = 1;
		else if( chr == 40 ) state = 2;
		else if( chr == 41 ) state = 3;
		else if( chr == 42 ) state = 4;
		else if( chr == 43 ) state = 5;
		else if( chr == 46 ) state = 6;
		else if( chr == 63 ) state = 7;
		else if( chr == 91 ) state = 8;
		else if( chr == 93 ) state = 9;
		else if( chr == 124 ) state = 10;
		else if( chr == 92 ) state = 13;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 5:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 8:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 9:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 12:
		if( ( chr >= 48 && chr <= 57 ) ) state = 12;
		else state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 13:
		if( ( chr >= 0 && chr <= 47 ) || ( chr >= 58 && chr <= 254 ) ) state = 11;
		else if( ( chr >= 48 && chr <= 57 ) ) state = 12;
		else state = -1;
		match = 13;
		match_pos = pos;
		break;

}



				//Line- and column-counter
				if( state > -1 )
				{
					if( chr == 10 )
					{
						PCB.line++;
						PCB.column = 0;
					}
					PCB.column++;
				}

				pos++;
	
			}
			while( state > -1 );
	
		}
		while( -1 > -1 && match == -1 );
	
		if( match > -1 )
		{
			PCB.att = PCB.src.substr( start, match_pos - start );
			PCB.offset = match_pos;
			

		}
		else
		{
			PCB.att = new String();
			match = -1;
		}
		
		break;
	}

	return match;
}

function __regexparse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		rval;
	var		act;
	
	//PCB: Parser Control Block
	var 	parsercontrol	= new Function( "",
								"var la;" +
								"var act;" +
								"var offset;" +
								"var src;" +
								"var att;" +
								"var line;" +
								"var column;" +
								"var error_step;" );
	var		PCB	= new parsercontrol();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "",
								"var sym;"+
								"var att;"+
								"var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* RegEx' */, 1 ),
	new Array( 15/* RegEx */, 1 ),
	new Array( 14/* Expression */, 3 ),
	new Array( 14/* Expression */, 1 ),
	new Array( 16/* Catenation */, 2 ),
	new Array( 16/* Catenation */, 1 ),
	new Array( 17/* Factor */, 2 ),
	new Array( 17/* Factor */, 2 ),
	new Array( 17/* Factor */, 2 ),
	new Array( 17/* Factor */, 1 ),
	new Array( 18/* Term */, 1 ),
	new Array( 18/* Term */, 1 ),
	new Array( 18/* Term */, 3 ),
	new Array( 20/* CharacterSet */, 3 ),
	new Array( 20/* CharacterSet */, 1 ),
	new Array( 21/* CharClass */, 2 ),
	new Array( 21/* CharClass */, 0 ),
	new Array( 19/* Character */, 1 ),
	new Array( 19/* Character */, 1 ),
	new Array( 19/* Character */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 6/* "(" */,8 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 , 8/* "[" */,12 , 10/* "ANY_CHAR" */,13 ),
	/* State 1 */ new Array( 22/* "$" */,0 ),
	/* State 2 */ new Array( 2/* "|" */,14 , 22/* "$" */,-1 ),
	/* State 3 */ new Array( 6/* "(" */,8 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 , 8/* "[" */,12 , 10/* "ANY_CHAR" */,13 , 22/* "$" */,-3 , 2/* "|" */,-3 , 7/* ")" */,-3 ),
	/* State 4 */ new Array( 22/* "$" */,-5 , 2/* "|" */,-5 , 6/* "(" */,-5 , 11/* "ASCII_CODE" */,-5 , 12/* "ESCAPED_CHAR" */,-5 , 13/* "ANY" */,-5 , 8/* "[" */,-5 , 10/* "ANY_CHAR" */,-5 , 7/* ")" */,-5 ),
	/* State 5 */ new Array( 5/* "?" */,16 , 4/* "+" */,17 , 3/* "*" */,18 , 22/* "$" */,-9 , 2/* "|" */,-9 , 6/* "(" */,-9 , 11/* "ASCII_CODE" */,-9 , 12/* "ESCAPED_CHAR" */,-9 , 13/* "ANY" */,-9 , 8/* "[" */,-9 , 10/* "ANY_CHAR" */,-9 , 7/* ")" */,-9 ),
	/* State 6 */ new Array( 3/* "*" */,-10 , 4/* "+" */,-10 , 5/* "?" */,-10 , 22/* "$" */,-10 , 2/* "|" */,-10 , 6/* "(" */,-10 , 11/* "ASCII_CODE" */,-10 , 12/* "ESCAPED_CHAR" */,-10 , 13/* "ANY" */,-10 , 8/* "[" */,-10 , 10/* "ANY_CHAR" */,-10 , 7/* ")" */,-10 ),
	/* State 7 */ new Array( 3/* "*" */,-11 , 4/* "+" */,-11 , 5/* "?" */,-11 , 22/* "$" */,-11 , 2/* "|" */,-11 , 6/* "(" */,-11 , 11/* "ASCII_CODE" */,-11 , 12/* "ESCAPED_CHAR" */,-11 , 13/* "ANY" */,-11 , 8/* "[" */,-11 , 10/* "ANY_CHAR" */,-11 , 7/* ")" */,-11 ),
	/* State 8 */ new Array( 6/* "(" */,8 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 , 8/* "[" */,12 , 10/* "ANY_CHAR" */,13 ),
	/* State 9 */ new Array( 3/* "*" */,-17 , 4/* "+" */,-17 , 5/* "?" */,-17 , 22/* "$" */,-17 , 2/* "|" */,-17 , 6/* "(" */,-17 , 11/* "ASCII_CODE" */,-17 , 12/* "ESCAPED_CHAR" */,-17 , 13/* "ANY" */,-17 , 8/* "[" */,-17 , 10/* "ANY_CHAR" */,-17 , 7/* ")" */,-17 , 9/* "]" */,-17 ),
	/* State 10 */ new Array( 3/* "*" */,-18 , 4/* "+" */,-18 , 5/* "?" */,-18 , 22/* "$" */,-18 , 2/* "|" */,-18 , 6/* "(" */,-18 , 11/* "ASCII_CODE" */,-18 , 12/* "ESCAPED_CHAR" */,-18 , 13/* "ANY" */,-18 , 8/* "[" */,-18 , 10/* "ANY_CHAR" */,-18 , 7/* ")" */,-18 , 9/* "]" */,-18 ),
	/* State 11 */ new Array( 3/* "*" */,-19 , 4/* "+" */,-19 , 5/* "?" */,-19 , 22/* "$" */,-19 , 2/* "|" */,-19 , 6/* "(" */,-19 , 11/* "ASCII_CODE" */,-19 , 12/* "ESCAPED_CHAR" */,-19 , 13/* "ANY" */,-19 , 8/* "[" */,-19 , 10/* "ANY_CHAR" */,-19 , 7/* ")" */,-19 , 9/* "]" */,-19 ),
	/* State 12 */ new Array( 9/* "]" */,-16 , 11/* "ASCII_CODE" */,-16 , 12/* "ESCAPED_CHAR" */,-16 , 13/* "ANY" */,-16 ),
	/* State 13 */ new Array( 3/* "*" */,-14 , 4/* "+" */,-14 , 5/* "?" */,-14 , 22/* "$" */,-14 , 2/* "|" */,-14 , 6/* "(" */,-14 , 11/* "ASCII_CODE" */,-14 , 12/* "ESCAPED_CHAR" */,-14 , 13/* "ANY" */,-14 , 8/* "[" */,-14 , 10/* "ANY_CHAR" */,-14 , 7/* ")" */,-14 ),
	/* State 14 */ new Array( 6/* "(" */,8 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 , 8/* "[" */,12 , 10/* "ANY_CHAR" */,13 ),
	/* State 15 */ new Array( 22/* "$" */,-4 , 2/* "|" */,-4 , 6/* "(" */,-4 , 11/* "ASCII_CODE" */,-4 , 12/* "ESCAPED_CHAR" */,-4 , 13/* "ANY" */,-4 , 8/* "[" */,-4 , 10/* "ANY_CHAR" */,-4 , 7/* ")" */,-4 ),
	/* State 16 */ new Array( 22/* "$" */,-8 , 2/* "|" */,-8 , 6/* "(" */,-8 , 11/* "ASCII_CODE" */,-8 , 12/* "ESCAPED_CHAR" */,-8 , 13/* "ANY" */,-8 , 8/* "[" */,-8 , 10/* "ANY_CHAR" */,-8 , 7/* ")" */,-8 ),
	/* State 17 */ new Array( 22/* "$" */,-7 , 2/* "|" */,-7 , 6/* "(" */,-7 , 11/* "ASCII_CODE" */,-7 , 12/* "ESCAPED_CHAR" */,-7 , 13/* "ANY" */,-7 , 8/* "[" */,-7 , 10/* "ANY_CHAR" */,-7 , 7/* ")" */,-7 ),
	/* State 18 */ new Array( 22/* "$" */,-6 , 2/* "|" */,-6 , 6/* "(" */,-6 , 11/* "ASCII_CODE" */,-6 , 12/* "ESCAPED_CHAR" */,-6 , 13/* "ANY" */,-6 , 8/* "[" */,-6 , 10/* "ANY_CHAR" */,-6 , 7/* ")" */,-6 ),
	/* State 19 */ new Array( 2/* "|" */,14 , 7/* ")" */,22 ),
	/* State 20 */ new Array( 9/* "]" */,24 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 ),
	/* State 21 */ new Array( 6/* "(" */,8 , 11/* "ASCII_CODE" */,9 , 12/* "ESCAPED_CHAR" */,10 , 13/* "ANY" */,11 , 8/* "[" */,12 , 10/* "ANY_CHAR" */,13 , 22/* "$" */,-2 , 2/* "|" */,-2 , 7/* ")" */,-2 ),
	/* State 22 */ new Array( 3/* "*" */,-12 , 4/* "+" */,-12 , 5/* "?" */,-12 , 22/* "$" */,-12 , 2/* "|" */,-12 , 6/* "(" */,-12 , 11/* "ASCII_CODE" */,-12 , 12/* "ESCAPED_CHAR" */,-12 , 13/* "ANY" */,-12 , 8/* "[" */,-12 , 10/* "ANY_CHAR" */,-12 , 7/* ")" */,-12 ),
	/* State 23 */ new Array( 9/* "]" */,-15 , 11/* "ASCII_CODE" */,-15 , 12/* "ESCAPED_CHAR" */,-15 , 13/* "ANY" */,-15 ),
	/* State 24 */ new Array( 3/* "*" */,-13 , 4/* "+" */,-13 , 5/* "?" */,-13 , 22/* "$" */,-13 , 2/* "|" */,-13 , 6/* "(" */,-13 , 11/* "ASCII_CODE" */,-13 , 12/* "ESCAPED_CHAR" */,-13 , 13/* "ANY" */,-13 , 8/* "[" */,-13 , 10/* "ANY_CHAR" */,-13 , 7/* ")" */,-13 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 15/* RegEx */,1 , 14/* Expression */,2 , 16/* Catenation */,3 , 17/* Factor */,4 , 18/* Term */,5 , 19/* Character */,6 , 20/* CharacterSet */,7 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array( 17/* Factor */,15 , 18/* Term */,5 , 19/* Character */,6 , 20/* CharacterSet */,7 ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array( 14/* Expression */,19 , 16/* Catenation */,3 , 17/* Factor */,4 , 18/* Term */,5 , 19/* Character */,6 , 20/* CharacterSet */,7 ),
	/* State 9 */ new Array(  ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array( 21/* CharClass */,20 ),
	/* State 13 */ new Array(  ),
	/* State 14 */ new Array( 16/* Catenation */,21 , 17/* Factor */,4 , 18/* Term */,5 , 19/* Character */,6 , 20/* CharacterSet */,7 ),
	/* State 15 */ new Array(  ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array(  ),
	/* State 20 */ new Array( 19/* Character */,23 ),
	/* State 21 */ new Array( 17/* Factor */,15 , 18/* Term */,5 , 19/* Character */,6 , 20/* CharacterSet */,7 ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"RegEx'" /* Non-terminal symbol */,
	"ERROR_RESYNC" /* Terminal symbol */,
	"|" /* Terminal symbol */,
	"*" /* Terminal symbol */,
	"+" /* Terminal symbol */,
	"?" /* Terminal symbol */,
	"(" /* Terminal symbol */,
	")" /* Terminal symbol */,
	"[" /* Terminal symbol */,
	"]" /* Terminal symbol */,
	"ANY_CHAR" /* Terminal symbol */,
	"ASCII_CODE" /* Terminal symbol */,
	"ESCAPED_CHAR" /* Terminal symbol */,
	"ANY" /* Terminal symbol */,
	"Expression" /* Non-terminal symbol */,
	"RegEx" /* Non-terminal symbol */,
	"Catenation" /* Non-terminal symbol */,
	"Factor" /* Non-terminal symbol */,
	"Term" /* Non-terminal symbol */,
	"Character" /* Non-terminal symbol */,
	"CharacterSet" /* Non-terminal symbol */,
	"CharClass" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	PCB.line = 1;
	PCB.column = 1;
	PCB.offset = 0;
	PCB.error_step = 0;
	PCB.src = src;
	PCB.att = new String();

	if( !err_off )
		err_off	= new Array();
	if( !err_la )
		err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	PCB.la = __regexlex( PCB );
			
	while( true )
	{
		PCB.act = 26;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == PCB.la )
			{
				PCB.act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}
		
		if( PCB.act == 26 )
		{
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
		
		if( regex_dbg_withtrace && sstack.length > 0 )
		{
			__regexdbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[PCB.la] +
								" (\"" + PCB.att + "\")\n" +
							"\tAction: " + PCB.act + "\n" + 
							"\tSource: \"" + PCB.src.substr( PCB.offset, 30 ) +
									( ( PCB.offset + 30 < PCB.src.length ) ?
										"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( regex_dbg_withstepbystep )
				__regexdbg_wait();
		}
		
			
		//Parse error? Try to recover!
		if( PCB.act == 26 )
		{
			if( regex_dbg_withtrace )
			{
				var expect = new String();
				
				__regexdbg_print( "Error detected: " +
					"There is no reduce or shift on the symbol " +
						labels[PCB.la] );
				
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
				{
					if( expect != "" )
						expect += ", ";
						
					expect += "\"" +
								labels[ act_tab[sstack[sstack.length-1]][i] ]
									+ "\"";
				}
				
				__regexdbg_print( "Expecting: " + expect );
			}
			
			//Report errors only when error_step is 0, and this is not a
			//subsequent error from a previous parse
			if( PCB.error_step == 0 )
			{
				err_cnt++;
				err_off.push( PCB.offset - PCB.att.length );
				err_la.push( new Array() );
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
					err_la[err_la.length-1].push(
							labels[act_tab[sstack[sstack.length-1]][i]] );
			}
			
			//Perform error recovery			
			while( sstack.length > 1 && PCB.act == 26 )
			{
				sstack.pop();
				vstack.pop();
				
				//Try to shift on error token
				for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
						i+=2 )
				{
					if( act_tab[sstack[sstack.length-1]][i] == 1 )
					{
						PCB.act = act_tab[sstack[sstack.length-1]][i+1];
						
						sstack.push( PCB.act );
						vstack.push( new String() );
						
						if( regex_dbg_withtrace )
						{
							__regexdbg_print(
								"Error recovery: error token " +
									"could be shifted!" );
							__regexdbg_print( "Error recovery: " +
									"current stack is " + sstack.join() );
						}

						break;
					}
				}
			}
			
			//Is it better to leave the parser now?
			if( sstack.length > 1 && PCB.act != 26 )
			{
				//Ok, now try to shift on the next tokens
				while( PCB.la != 22 )
				{
					if( regex_dbg_withtrace )
						__regexdbg_print( "Error recovery: " +
							"Trying to shift on \""
								+ labels[ PCB.la ] + "\"" );

					PCB.act = 26;
					
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length;
							i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == PCB.la )
						{
							PCB.act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
					
					if( PCB.act != 26 )
						break;
						
					if( regex_dbg_withtrace )
						__regexdbg_print( "Error recovery: Discarding \""
							+ labels[ PCB.la ] + "\"" );
					
					while( ( PCB.la = __regexlex( PCB ) )
								< 0 )
						PCB.offset++;
				
					if( regex_dbg_withtrace )
						__regexdbg_print( "Error recovery: New token \""
							+ labels[ PCB.la ] + "\"" );
				}
				while( PCB.la != 22 && PCB.act == 26 );
			}
			
			if( PCB.act == 26 || PCB.la == 22 )
			{
				if( regex_dbg_withtrace )
					__regexdbg_print( "\tError recovery failed, " +
							"terminating parse process..." );
				break;
			}

			if( regex_dbg_withtrace )
				__regexdbg_print( "\tError recovery succeeded, " +
											"continuing" );
			
			//Try to parse the next three tokens successfully...
			PCB.error_step = 3;
		}

		//Shift
		if( PCB.act > 0 )
		{
			//Parse tree generation
			if( regex_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ PCB.la ];
				node.att = PCB.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "Shifting symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
		
			sstack.push( PCB.act );
			vstack.push( PCB.att );
			
			PCB.la = __regexlex( PCB );
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "\tNew lookahead symbol: " +
						labels[PCB.la] + " (" + PCB.att + ")" );
				
			//Successfull shift and right beyond error recovery?
			if( PCB.error_step > 0 )
				PCB.error_step--;
		}
		//Reduce
		else
		{		
			act = PCB.act * -1;
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "Reducing by production: " + act );
			
			rval = void( 0 );
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
			rval = new PARAM();
													nfa_states[ first_nfa ].follow = vstack[ vstack.length - 1 ].start;
													last_nfa = vstack[ vstack.length - 1 ].end;
												
	}
	break;
	case 2:
	{
			rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = create_nfa( nfa_states );
													nfa_states[rval.start].follow = vstack[ vstack.length - 3 ].start;
													nfa_states[rval.start].follow2 = vstack[ vstack.length - 1 ].start;
													
													nfa_states[vstack[ vstack.length - 3 ].end].follow = rval.end;
													nfa_states[vstack[ vstack.length - 1 ].end].follow = rval.end;
												
	}
	break;
	case 3:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 4:
	{
			/*
														(As a C-junkie, I miss memcpy() here ;P)
													*/
													nfa_states[vstack[ vstack.length - 2 ].end].edge		= nfa_states[vstack[ vstack.length - 1 ].start].edge;
													nfa_states[vstack[ vstack.length - 2 ].end].ccl		= nfa_states[vstack[ vstack.length - 1 ].start].ccl;
													nfa_states[vstack[ vstack.length - 2 ].end].follow	= nfa_states[vstack[ vstack.length - 1 ].start].follow;
													nfa_states[vstack[ vstack.length - 2 ].end].follow2	= nfa_states[vstack[ vstack.length - 1 ].start].follow2;
													nfa_states[vstack[ vstack.length - 2 ].end].accept	= nfa_states[vstack[ vstack.length - 1 ].start].accept;
													
													nfa_states[vstack[ vstack.length - 1 ].start].edge = EDGE_FREE;
													
													vstack[ vstack.length - 2 ].end = vstack[ vstack.length - 1 ].end;
													
													rval = vstack[ vstack.length - 2 ];
												
	}
	break;
	case 5:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 6:
	{
		
													rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = create_nfa( nfa_states );
													
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;

													nfa_states[rval.start].follow2 = rval.end;
													nfa_states[vstack[ vstack.length - 2 ].end].follow2 = vstack[ vstack.length - 2 ].start;
												
	}
	break;
	case 7:
	{
		 	rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = create_nfa( nfa_states );
													
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;

													nfa_states[vstack[ vstack.length - 2 ].end].follow2 = vstack[ vstack.length - 2 ].start;
												
	}
	break;
	case 8:
	{
		 	rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = create_nfa( nfa_states );
													nfa_states[rval.start].follow = vstack[ vstack.length - 2 ].start;
													nfa_states[rval.start].follow2 = rval.end;
													nfa_states[vstack[ vstack.length - 2 ].end].follow = rval.end;
												
	}
	break;
	case 9:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 10:
	{
			rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													
													//_print( "SINGLE: >" + vstack[ vstack.length - 1 ] + "<" );
													
													bitset_set( nfa_states[rval.start].ccl,
															vstack[ vstack.length - 1 ].charCodeAt( 0 ), 1 );
												
	}
	break;
	case 11:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 12:
	{
			rval = vstack[ vstack.length - 2 ]; 
	}
	break;
	case 13:
	{
			var negate = false;
													var i = 0, j, start;
													
													//_print( "CHARCLASS: >" + vstack[ vstack.length - 2 ] + "<" );
													
													rval = new PARAM();
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													
													if( vstack[ vstack.length - 2 ].charAt( i ) == '^' )
													{
														negate = true;
														for( var j = MIN_CHAR; j < MAX_CHAR; j++ )
															bitset_set( nfa_states[rval.start].ccl, j, 1 );
														i++;
													}

													for( ; i < vstack[ vstack.length - 2 ].length; i++ )
													{
														if( vstack[ vstack.length - 2 ].charAt( i+1 ) == '-'
															&& i+2 < vstack[ vstack.length - 2 ].length )
														{
															i++;
															for( j = vstack[ vstack.length - 2 ].charCodeAt( i-1 );
																	j < vstack[ vstack.length - 2 ].charCodeAt( i+1 );
																		j++ )		
																bitset_set( nfa_states[rval.start].ccl,
																	j, negate ? 0 : 1 );
														}
														else
															bitset_set( nfa_states[rval.start].ccl,
																vstack[ vstack.length - 2 ].charCodeAt( i ), negate ? 0 : 1 );
													}
												
	}
	break;
	case 14:
	{
			rval = new PARAM();
				
													//_print( "ANYCHAR: >" + vstack[ vstack.length - 1 ] + "<" );
													
													rval.start = create_nfa( nfa_states );
													rval.end = nfa_states[rval.start].follow
														= create_nfa( nfa_states );
													nfa_states[rval.start].edge = EDGE_CHAR;
													for( var i = MIN_CHAR; i < MAX_CHAR; i++ )
														bitset_set( nfa_states[rval.start].ccl, i, 1 );
												
	}
	break;
	case 15:
	{
			rval = new String( vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 16:
	{
			rval = new String(); 
	}
	break;
	case 17:
	{
			rval = String.fromCharCode( vstack[ vstack.length - 1 ].substr( 1 ) ); 
	}
	break;
	case 18:
	{
			switch( vstack[ vstack.length - 1 ].substr( 1 ) )
													{
														case 'n':
															rval = '\n';
															break;
														case 'r':
															rval = '\r';
															break;
														case 't':
															rval = '\t';
															break;
														case 'a':
															rval = '\a';
															break;
														default:
															rval = vstack[ vstack.length - 1 ].substr( 1 );
															break;
													}
												
	}
	break;
	case 19:
	{
			rval = vstack[ vstack.length - 1 ]; 
	}
	break;
}


			
			if( regex_dbg_withparsetree )
				tmptree = new Array();

			if( regex_dbg_withtrace )
				__regexdbg_print( "\tPopping " + 
									pop_tab[act][1] +  " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( regex_dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}

			//Get goto-table entry
			PCB.act = 26;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					PCB.act = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			//Do some parse tree construction if desired
			if( regex_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = rval;
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			//Goal symbol match?
			if( act == 0 ) //Don't use PCB.act here!
				break;
				
			if( regex_dbg_withtrace )
				__regexdbg_print( "\tPushing non-terminal " + 
						labels[ pop_tab[act][0] ] );
			
			//...and push it!
			sstack.push( PCB.act );
			vstack.push( rval );
		}
	}

	if( regex_dbg_withtrace )
	{
		__regexdbg_print( "\nParse complete." );
		
		//This function is used for parser drivers that will output
		//the entire debug messages in a row.
		__regexdbg_flush();
	}

	if( regex_dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__regexdbg_print( "\n\n--- Parse tree ---" );
			__regexdbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__regexdbg_print( "\n\nParse tree cannot be viewed. " +
									"There where parse errors." );
		}
	}
	
	return err_cnt;
}



function compile_regex( str, accept, case_insensitive )
{
	var i, j;
	var weight = 0;
	var true_edges = 0;
	var error_offsets = new Array();
	var error_expects = new Array();
	var error_count = 0;
	
	if( str == "" )
		return;
	
	//_print( "str = >" + str + "< " + case_insensitive );
	
	created_nfas = new Array();
	
	first_nfa = create_nfa( nfa_states );
	if( ( error_count = __regexparse( str, error_offsets, error_expects ) ) == 0 )
	{
		//If the symbol should be case-insensitive, manipulate the
		//character sets on the newly created items.
		if( case_insensitive )
		{
			for( i = 0; i < created_nfas.length; i++ )
			{
				if( nfa_states[ created_nfas[i] ].edge == EDGE_CHAR )
				{
					for( j = MIN_CHAR; j < MAX_CHAR; j++ )
					{
						if( bitset_get( nfa_states[ created_nfas[i] ].ccl, j ) )
						{
							bitset_set( nfa_states[ created_nfas[i] ].ccl,
								String.fromCharCode( j ).toUpperCase().charCodeAt( 0 ), 1 );
							bitset_set( nfa_states[ created_nfas[i] ].ccl,
								String.fromCharCode( j ).toLowerCase().charCodeAt( 0 ), 1 );
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

		if( first_nfa > 0 )
		{
			i = 0;
			while( nfa_states[i].follow2 != -1 )
				i = nfa_states[i].follow2;

			nfa_states[i].follow2 = first_nfa;
		}
	}
	else
	{
		for( i = 0; i < error_count; i++ )
		{
			var spaces = new String();
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



