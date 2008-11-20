/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	printtab.js
Author:	Jan Max Meyer
Usage:	Functions for printing the parse tables and related functions.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */


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
						code += "info.src.charCodeAt( pos ) == " + grp_start;
					else					
						code += "( info.src.charCodeAt( pos ) >= " + grp_start +
									" && info.src.charCodeAt( pos ) <= " + (k-1) + " )";
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
----------------------------------------------------------------------------- */
function print_term_actions()
{
	var code = new String();
	var re = new RegExp( "%match|%offset|%source" );
	var i, j, k;	
	var matches = 0;
	var semcode;
	var strmatch;
	
	code += "switch( match )\n"
	code += "{\n";
	for( i = 0; i < symbols.length; i++ )
	{
		if( symbols[i].kind == SYM_TERM
			&& symbols[i].code != "" )
		{
			code += "	case " + i + ":\n";
			code += "		{\n";
			
			semcode = new String();
			for( j = 0, k = 0; j < symbols[i].code.length; j++, k++ )
			{
				strmatch = re.exec( symbols[i].code.substr( j, symbols[i].code.length ) );
				if( strmatch && strmatch.index == 0 )
				{
					if( strmatch[0] == "%match" )
						semcode += "info.att";
					else if( strmatch[0] == "%offset" )
						semcode += "( info.offset - info.att.length )";
					else if( strmatch[0] == "%source" )
						semcode += "info.src";
					
					j += strmatch[0].length - 1;
					k = semcode.length;
				}
				else
					semcode += symbols[i].code.charAt( j );
			}

			code += "		" + semcode + "\n";
			
			code += "		}\n";
			code += "		break;\n\n";
			
			matches++;
		}
	}
	
	code += "}\n\n";

	return ( matches == 0 ) ? (new String()) : code;
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
		
	Returns:		length					The length of the symbol array.
  
	~~~ CHANGES & NOTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Date:		Author:			Note:
----------------------------------------------------------------------------- */
function get_error_symbol_id()
{
	return states.length + 1;
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

