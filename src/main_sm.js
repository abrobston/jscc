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
				driver = driver.replace( /##ERROR##/gi, get_error_symbol_id() );
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
