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
var out_file	= new String();
var src_file	= new String();
var tpl_file	= DEFAULT_DRIVER;
var code_prefix	= new String();
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

				var driver = read_file( tpl_file );
									
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

