/* -MODULE----------------------------------------------------------------------
JS/CC: A LALR(1) Parser Generator written in JavaScript
Copyright (C) 2007 by J.M.K S.F. Software Technologies, Jan Max Meyer
http://www.jmksf.com ++ jscc<-AT->jmksf.com

File:	jscc.js
Author:	Jan Max Meyer
Usage:	Console-based WSH version of the JS/CC LALR(1) Parser Generator
		to be executed as JScript code on a local machine.

You may use, modify and distribute this software under the terms and conditions
of the Artistic License. Please see ARTISTIC for more information.
----------------------------------------------------------------------------- */

@if( @_jscript_version >= 7 )
@set @js_dotnet = 1
@else
@set @js_dotnet = 0
@end

@if( @js_dotnet )
import System;
@end

function _error( msg )
{
	if( show_errors )
	{
		@if( @js_dotnet )
		print( "Error: " + msg  + "\n" );
		@else
		WScript.Echo( "Error: " + msg + "\n" );
		@end
	}
	
	errors++;
}

function _warning( msg )
{
	if( show_warnings )
	{
		@if( @js_dotnet )
		print( "Warning: " + msg + "\n" );
		@else
		WScript.Echo( "Warning: " + msg + "\n" );
		@end
	}
	
	warnings++;
}

function _print( txt )
{
	@if( @js_dotnet )
	print( txt );
	@else
	WScript.Echo( txt );
	@end
}

function read_file( file )
{
	var fs = new ActiveXObject( "Scripting.FileSystemObject" );	
	var src = new String();
	
	if( !fs )
		return null;
	
	if( fs.fileExists( file ) )
	{
		var f = fs.OpenTextFile( file, 1 );
		
		if( f && !f.AtEndOfStream )
		{
			src = f.ReadAll();
			f.Close();
		}
	}
	else
	{
		_error( "File " + file + " is necessary, but does not exist." );
		
		@if( !@js_dotnet )
		WScript.Quit( -1 );
		@else
		Environment.Exit( -1 );
		@end
	}
	
	return src;
}

function write_file( file, content )
{
	var fs = new ActiveXObject( "Scripting.FileSystemObject" );	
	var src = new String();
	
	if( !fs )
		return null;
	
	var f = fs.OpenTextFile( file, 2, true );
		
	if( f )
	{
		f.write( content );
		f.Close();
	}
	else
		_error( "Unable to create file " + file );
	
	return src;
}

@if( !@js_dotnet )
function get_arguments()
{
	var enu = new Enumerator( WScript.Arguments )
	var params = new Array();
	
	for( ; !enu.atEnd(); enu.moveNext() )
		params.push( enu.item() );
		
	return params;
}
@else
function get_arguments()
{
	var params = new Array( Environment.GetCommandLineArgs() );
	
	params.shift();
	return params;
}
@end

function copyright_info()
{
	var info = new String();
	info += "JS/CC v" + JSCC_VERSION + ": A LALR(1) Parser Generator written in JavaScript\n";
	info += "Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer\n";
	info += "http://jscc.jmksf.com ++ jscc@jmksf.com\n\n";
	
	info += "You may use, modify and distribute this software under the terms and conditions\n";
	info += "of the Artistic License. Please see ARTISTIC for more information.\n\n";
	
	_print( info );
}

function help()
{
	var help = new String();
	help += "Usage: \tjscc [ -o <output-file> ] [ -t <parser-template> ]\n\t\t[ -p <prefix> ] [ -nologo ] [ -w ] <grammar-file>\n\n";
	
	help += "\t-o <output-file>\tSpecifies the generated output file\n";
	help += "\t\t\t\tIf not specified, output is written to stdout.\n";
	
	help += "\t-t <template-file>\tSpecifies the parser driver to be used\n";
	help += "\t\t\t\tIf not specified, driver.js_ will be the\n";
	help += "\t\t\t\tstandard driver.\n";
	
	help += "\t-p <prefix>\t\tSpecifies a prefix to be inserted in the\n"
	help += "\t\t\t\toutput-file's positions marked with ##PREFIX##.\n";
	
	help += "\t-w\t\t\tPrints warnings\n";
	
	help += "\t-nologo\t\t\tHides the copyright message and outputs\n";	
	
	help += "\t<grammar file>\t\tThe grammar definition file; This is required!\n";
	
	_print( help );
}

// --- JS/CC entry ---

//Reading the modules (WSH only!)
@if( !@js_dotnet )
eval( read_file( "jscc_global.js" ) );
eval( read_file( "jscc_first.js" ) );
eval( read_file( "jscc_parse.js" ) );
eval( read_file( "jscc_printtab.js" ) );
eval( read_file( "jscc_tabgen.js" ) );
eval( read_file( "jscc_util.js" ) );
eval( read_file( "jscc_integrity.js" ) );
eval( read_file( "jscc_bitset.js" ) );
eval( read_file( "jscc_REGEX.js" ) );
eval( read_file( "jscc_lexdfa.js" ) );
eval( read_file( "jscc_lexdbg.js" ) );
eval( read_file( "jscc_debug.js" ) );
@end

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

	help();
}

//Exit with number of errors
@if( !@js_dotnet )
WScript.Quit( errors );
@else
Environment.Exit( errors );
@end
