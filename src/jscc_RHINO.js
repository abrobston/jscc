/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	jscc.js
Author:	Jan Max Meyer
Usage:	Console-based ersion of the JS/CC LALR(1) Parser Generator
		to be executed as Mozilla/Rhino code on a local machine.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

function _error( msg )
{
	if( show_errors )
	{
		print( "Error: " + msg );
	}
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
	{
		print( "Warning: " + msg );
	}
	
	warnings++;
}

function _print( txt )
{
	print( txt );
}

function read_file( file )
{
	var src = new String();
	
	if( ( new java.io.File( file ).exists() ) )
	{
		src = readFile( file );
	}
	else
	{
		_error( "File " + file + " is necessary, but does not exist." );

		quit();
	}
	
	return src;
}

function write_file( file, content )
{
        var src = new String();
	var f = new java.io.PrintWriter( file );
		
	if( f )
	{
		f.write( content );
		f.close();
	}
	else
		_error( "Unable to create file " + file );
	
	return src;
}

var args_global_var = arguments;
function get_arguments()
{
   return( args_global_var );
}

function copyright_info()
{
	var info = new String();
	info += "JS/CC v" + JSCC_VERSION + ": A LALR(1) Parser Generator written in JavaScript\n";
	info += "Copyright (C) 2007 by J.M.K S.F. Software Technologies, Jan Max Meyer\n";
	info += "Contributions (C) 2007 by Louis P. Santillan <lpsantil@gmail.com>\n";
	info += "http://jscc.jmksf.com ++ jscc@jmksf.com\n\n";
	
	info += "You may use, modify and distribute this software under the terms and conditions\n";
	info += "of the Artistic License. Please see ARTISTIC for more information.\n\n";
	
	_print( info );
}

function help_opt()
{
	var help_str = new String();
	help_str += "Usage: \tjscc [ -o <output-file> ] [ -t <parser-template> ]\n\t\t[ -p <prefix> ] [ -nologo ] [ -w ] <grammar-file>\n\n";

	help_str += "\t-o <output-file>\tSpecifies the generated output file\n";
	help_str += "\t\t\t\tIf not specified, output is written to stdout.\n";
	
	help_str += "\t-t <template-file>\tSpecifies the parser driver to be used\n";
	help_str += "\t\t\t\tIf not specified, driver.js_ will be the\n";
	help_str += "\t\t\t\tstandard driver.\n";
	
	help_str += "\t-p <prefix>\t\tSpecifies a prefix to be inserted in the\n"
	help_str += "\t\t\t\toutput-file's positions marked with ##PREFIX##.\n";
	
	help_str += "\t-w\t\t\tPrints warnings\n";
	
	help_str += "\t-nologo\t\t\tHides the copyright message and outputs\n";	
	
	help_str += "\t<grammar file>\t\tThe grammar definition file; This is required!\n";
	
	_print( help_str );
}

// --- JS/CC entry ---

//Initialize the globals
reset_all( EXEC_CONSOLE );

//Processing the command line arguments
var out_file	= new String();
var src_file	= new String();
var tpl_file	= new String( "driver.js_" );
var code_prefix	= new String();
var show_logo	= true;
var dump_nfa	= false;
var dump_dfa	= false;
var	dfa_table;

var argv = get_arguments();
for( var i = 0; i < argv.length; i++ )
{
	if( argv[i].toLowerCase() == "-o" )
		out_file = argv[++i];
	else if( argv[i].toLowerCase() == "-t" )
		tpl_file = argv[++i];
	else if( argv[i].toLowerCase() == "-p" )
		code_prefix = argv[++i];
	else if( argv[i].toLowerCase() == "-w" )
		show_warnings = true;
	else if( argv[i].toLowerCase() == "-d" )
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
	else if( argv[i].toLowerCase() == "-nologo" )
		show_logo = false;
	else
		if( src_file == "" )
			src_file = argv[i];
}

if( show_logo )
	copyright_info();

if( src_file != "" )
{
	var src = read_file( src_file );
	parse_grammar( src, src_file );
	
	if( errors == 0 )
	{
		//Check grammar integrity
		undefined();
		unreachable();
		
		if( errors == 0 )
		{
			//LALR(1) parse table generation
			first();
			
			//print_symbols( MODE_GEN_TEXT );
			//print_grammar( MODE_GEN_TEXT );
			lalr1_parse_table( false );

			check_empty_lines();

			if( errors == 0 )
			{		
				//DFA state table generation
				if( dump_nfa )
					print_nfa( nfa_states );
					
				dfa_table = create_subset( nfa_states );
				dfa_table = minimize_dfa( dfa_table );
				
				if( dump_dfa )
					print_dfa( dfa_table );	
				
				if( out_file != "" )
				{
					var driver;
					driver = read_file( tpl_file );
										
					driver = driver.replace( /##HEADER##/gi, code_head );
					driver = driver.replace( /##TABLES##/gi, print_parse_tables( MODE_GEN_JS ) );
					driver = driver.replace( /##DFA##/gi, print_dfa_table( dfa_table ) );
					driver = driver.replace( /##TERMINAL_ACTIONS##/gi, print_term_actions() );
					driver = driver.replace( /##LABELS##/gi, print_symbol_labels() );
					driver = driver.replace( /##ACTIONS##/gi, print_actions() );
					driver = driver.replace( /##FOOTER##/gi, code_foot );
					driver = driver.replace( /##PREFIX##/gi, code_prefix );
					driver = driver.replace( /%%PREFIX%%/gi, code_prefix );
					driver = driver.replace( /##ERROR##/gi, get_error_symbol_id() );
					driver = driver.replace( /##EOF##/gi, get_eof_symbol_id() );
					driver = driver.replace( /##WHITESPACE##/gi, get_whitespace_symbol_id() );

					write_file( out_file, driver );
				}
				else
				{
					var gen_code = new String();
					gen_code = print_parse_tables( MODE_GEN_JS );	
					gen_code += print_dfa_table( dfa_table );
					gen_code += print_actions();
					_print( code_head + gen_code + code_foot );
				}
				
				if( show_logo )
					_print( "\n\"" + src_file + "\" produced " + states.length + " states (" + shifts + " shifts, " +
							reduces + " reductions, " + gotos + " gotos)" );
			}
		}
	}
	
	if( show_logo )
		_print( warnings + " warning" + ( warnings > 1 ? "s" : "" ) + ", "
			+ errors + " error" + ( errors > 1 ? "s" : "" ) );
}
else
{
	if( !show_logo )
		copyright_info();

	help_opt();
}

