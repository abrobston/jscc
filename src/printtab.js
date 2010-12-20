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
