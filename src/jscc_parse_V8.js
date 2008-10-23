/*
	Default driver template for JS/CC generated parsers for V8
	
	WARNING: Do not use for parsers that should run as browser-based JavaScript!
			 Use driver_web.js_ instead!
	
	Features:
	- Parser trace messages
	- Step-by-step parsing
	- Integrated panic-mode error recovery
	- Pseudo-graphical parse tree generation
	
	Written 2007 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2008 from driver.js_ to support V8 by Louis P.Santillan <lpsantil@gmail.com>
	
	This is in the public domain.
*/

var		first_lhs;


var jscc_dbg_withparsetree	= false;
var jscc_dbg_withtrace		= false;
var jscc_dbg_withstepbystep	= false;

function __jsccdbg_print( text )
{
	print( text );
}

function __jsccdbg_wait()
{
   var v = read_line();
}

function __jscclex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 31;

		do
		{

switch( state )
{
	case 0:
		if( ( info.src.charCodeAt( pos ) >= 9 && info.src.charCodeAt( pos ) <= 10 ) || info.src.charCodeAt( pos ) == 13 || info.src.charCodeAt( pos ) == 32 || info.src.charCodeAt( pos ) == 94 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 33 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 38 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 4;
		else if( info.src.charCodeAt( pos ) == 58 ) state = 5;
		else if( info.src.charCodeAt( pos ) == 59 ) state = 6;
		else if( info.src.charCodeAt( pos ) == 60 ) state = 7;
		else if( info.src.charCodeAt( pos ) == 62 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 124 ) state = 9;
		else if( info.src.charCodeAt( pos ) == 34 ) state = 14;
		else if( info.src.charCodeAt( pos ) == 35 ) state = 17;
		else if( info.src.charCodeAt( pos ) == 39 ) state = 18;
		else if( info.src.charCodeAt( pos ) == 47 ) state = 19;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 20;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 4:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 4;
		else state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 5:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 8:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 9:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 12:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 13:
		state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 14:
		if( info.src.charCodeAt( pos ) == 34 ) state = 10;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 14;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 21;
		else state = -1;
		break;

	case 15:
		if( info.src.charCodeAt( pos ) == 34 ) state = 10;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 14;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 21;
		else state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 16:
		if( info.src.charCodeAt( pos ) == 39 ) state = 12;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 18;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 22;
		else state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 17:
		if( info.src.charCodeAt( pos ) == 35 ) state = 11;
		else state = -1;
		break;

	case 18:
		if( info.src.charCodeAt( pos ) == 39 ) state = 12;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 18;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 22;
		else state = -1;
		break;

	case 19:
		if( info.src.charCodeAt( pos ) == 126 ) state = 23;
		else state = -1;
		break;

	case 20:
		if( info.src.charCodeAt( pos ) == 42 ) state = 31;
		else state = -1;
		break;

	case 21:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 14;
		else if( info.src.charCodeAt( pos ) == 34 ) state = 15;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 21;
		else state = -1;
		break;

	case 22:
		if( info.src.charCodeAt( pos ) == 39 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 91 ) || ( info.src.charCodeAt( pos ) >= 93 && info.src.charCodeAt( pos ) <= 254 ) ) state = 18;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 22;
		else state = -1;
		break;

	case 23:
		if( info.src.charCodeAt( pos ) == 47 ) state = 24;
		else if( info.src.charCodeAt( pos ) == 126 ) state = 25;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 125 ) || ( info.src.charCodeAt( pos ) >= 127 && info.src.charCodeAt( pos ) <= 254 ) ) state = 32;
		else state = -1;
		break;

	case 24:
		if( info.src.charCodeAt( pos ) == 47 ) state = 23;
		else state = -1;
		break;

	case 25:
		if( info.src.charCodeAt( pos ) == 47 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 254 ) ) state = 23;
		else state = -1;
		break;

	case 26:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 254 ) ) state = 26;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 27;
		else state = -1;
		break;

	case 27:
		if( info.src.charCodeAt( pos ) == 93 ) state = 13;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 92 ) || ( info.src.charCodeAt( pos ) >= 94 && info.src.charCodeAt( pos ) <= 254 ) ) state = 30;
		else state = -1;
		break;

	case 28:
		if( info.src.charCodeAt( pos ) == 93 ) state = 30;
		else state = -1;
		break;

	case 29:
		if( info.src.charCodeAt( pos ) == 126 ) state = 25;
		else if( info.src.charCodeAt( pos ) == 47 ) state = 29;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 125 ) || ( info.src.charCodeAt( pos ) >= 127 && info.src.charCodeAt( pos ) <= 254 ) ) state = 32;
		else state = -1;
		break;

	case 30:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 92 ) || ( info.src.charCodeAt( pos ) >= 94 && info.src.charCodeAt( pos ) <= 254 ) ) state = 26;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 27;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 28;
		else state = -1;
		break;

	case 31:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 92 ) || ( info.src.charCodeAt( pos ) >= 94 && info.src.charCodeAt( pos ) <= 254 ) ) state = 26;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 27;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 28;
		else state = -1;
		break;

	case 32:
		if( info.src.charCodeAt( pos ) == 126 ) state = 25;
		else if( info.src.charCodeAt( pos ) == 47 ) state = 29;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 125 ) || ( info.src.charCodeAt( pos ) >= 127 && info.src.charCodeAt( pos ) <= 254 ) ) state = 32;
		else state = -1;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		

	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __jsccparse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "", "var sym; var att; var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* def' */, 1 ),
	new Array( 18/* def */, 5 ),
	new Array( 14/* header_code */, 1 ),
	new Array( 17/* footer_code */, 1 ),
	new Array( 15/* token_assocs */, 2 ),
	new Array( 15/* token_assocs */, 0 ),
	new Array( 20/* token_assoc */, 3 ),
	new Array( 20/* token_assoc */, 3 ),
	new Array( 20/* token_assoc */, 3 ),
	new Array( 20/* token_assoc */, 2 ),
	new Array( 20/* token_assoc */, 2 ),
	new Array( 21/* token_defs */, 2 ),
	new Array( 21/* token_defs */, 0 ),
	new Array( 23/* token_def */, 3 ),
	new Array( 23/* token_def */, 2 ),
	new Array( 16/* grammar_defs */, 2 ),
	new Array( 16/* grammar_defs */, 0 ),
	new Array( 25/* grammar_def */, 4 ),
	new Array( 26/* productions */, 3 ),
	new Array( 26/* productions */, 1 ),
	new Array( 27/* rhs */, 3 ),
	new Array( 29/* rhs_prec */, 2 ),
	new Array( 29/* rhs_prec */, 2 ),
	new Array( 29/* rhs_prec */, 0 ),
	new Array( 28/* sequence */, 2 ),
	new Array( 28/* sequence */, 0 ),
	new Array( 30/* symbol */, 1 ),
	new Array( 30/* symbol */, 1 ),
	new Array( 19/* code */, 2 ),
	new Array( 19/* code */, 0 ),
	new Array( 22/* string */, 1 ),
	new Array( 22/* string */, 1 ),
	new Array( 24/* identifier */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 3/* "<" */,-29 , 4/* ">" */,-29 , 1/* "^" */,-29 , 5/* "!" */,-29 , 6/* ";" */,-29 , 11/* "STRING_SINGLE" */,-29 , 12/* "STRING_DOUBLE" */,-29 , 2/* "##" */,-29 , 10/* "CODE" */,-29 ),
	/* State 1 */ new Array( 31/* "$" */,0 ),
	/* State 2 */ new Array( 2/* "##" */,-5 , 3/* "<" */,-5 , 4/* ">" */,-5 , 1/* "^" */,-5 , 5/* "!" */,-5 , 6/* ";" */,-5 , 11/* "STRING_SINGLE" */,-5 , 12/* "STRING_DOUBLE" */,-5 ),
	/* State 3 */ new Array( 10/* "CODE" */,5 , 3/* "<" */,-2 , 4/* ">" */,-2 , 1/* "^" */,-2 , 5/* "!" */,-2 , 6/* ";" */,-2 , 11/* "STRING_SINGLE" */,-2 , 12/* "STRING_DOUBLE" */,-2 , 2/* "##" */,-2 ),
	/* State 4 */ new Array( 2/* "##" */,7 , 3/* "<" */,8 , 4/* ">" */,9 , 1/* "^" */,10 , 5/* "!" */,12 , 6/* ";" */,-12 , 11/* "STRING_SINGLE" */,-12 , 12/* "STRING_DOUBLE" */,-12 ),
	/* State 5 */ new Array( 3/* "<" */,-28 , 4/* ">" */,-28 , 1/* "^" */,-28 , 5/* "!" */,-28 , 6/* ";" */,-28 , 11/* "STRING_SINGLE" */,-28 , 12/* "STRING_DOUBLE" */,-28 , 2/* "##" */,-28 , 10/* "CODE" */,-28 , 31/* "$" */,-28 , 8/* "|" */,-28 ),
	/* State 6 */ new Array( 2/* "##" */,-4 , 3/* "<" */,-4 , 4/* ">" */,-4 , 1/* "^" */,-4 , 5/* "!" */,-4 , 6/* ";" */,-4 , 11/* "STRING_SINGLE" */,-4 , 12/* "STRING_DOUBLE" */,-4 ),
	/* State 7 */ new Array( 10/* "CODE" */,-16 , 31/* "$" */,-16 , 13/* "IDENT" */,-16 ),
	/* State 8 */ new Array( 6/* ";" */,-12 , 11/* "STRING_SINGLE" */,-12 , 12/* "STRING_DOUBLE" */,-12 ),
	/* State 9 */ new Array( 6/* ";" */,-12 , 11/* "STRING_SINGLE" */,-12 , 12/* "STRING_DOUBLE" */,-12 ),
	/* State 10 */ new Array( 6/* ";" */,-12 , 11/* "STRING_SINGLE" */,-12 , 12/* "STRING_DOUBLE" */,-12 ),
	/* State 11 */ new Array( 6/* ";" */,18 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 12 */ new Array( 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 13 */ new Array( 13/* "IDENT" */,27 , 31/* "$" */,-29 , 10/* "CODE" */,-29 ),
	/* State 14 */ new Array( 6/* ";" */,28 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 15 */ new Array( 6/* ";" */,29 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 16 */ new Array( 6/* ";" */,30 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 17 */ new Array( 6/* ";" */,-11 , 11/* "STRING_SINGLE" */,-11 , 12/* "STRING_DOUBLE" */,-11 ),
	/* State 18 */ new Array( 2/* "##" */,-9 , 3/* "<" */,-9 , 4/* ">" */,-9 , 1/* "^" */,-9 , 5/* "!" */,-9 , 6/* ";" */,-9 , 11/* "STRING_SINGLE" */,-9 , 12/* "STRING_DOUBLE" */,-9 ),
	/* State 19 */ new Array( 13/* "IDENT" */,27 , 6/* ";" */,-29 , 11/* "STRING_SINGLE" */,-29 , 12/* "STRING_DOUBLE" */,-29 , 10/* "CODE" */,-29 ),
	/* State 20 */ new Array( 13/* "IDENT" */,-30 , 10/* "CODE" */,-30 , 6/* ";" */,-30 , 11/* "STRING_SINGLE" */,-30 , 12/* "STRING_DOUBLE" */,-30 , 2/* "##" */,-30 , 3/* "<" */,-30 , 4/* ">" */,-30 , 1/* "^" */,-30 , 5/* "!" */,-30 , 9/* "&" */,-30 , 8/* "|" */,-30 ),
	/* State 21 */ new Array( 13/* "IDENT" */,-31 , 10/* "CODE" */,-31 , 6/* ";" */,-31 , 11/* "STRING_SINGLE" */,-31 , 12/* "STRING_DOUBLE" */,-31 , 2/* "##" */,-31 , 3/* "<" */,-31 , 4/* ">" */,-31 , 1/* "^" */,-31 , 5/* "!" */,-31 , 9/* "&" */,-31 , 8/* "|" */,-31 ),
	/* State 22 */ new Array( 2/* "##" */,-10 , 3/* "<" */,-10 , 4/* ">" */,-10 , 1/* "^" */,-10 , 5/* "!" */,-10 , 6/* ";" */,-10 , 11/* "STRING_SINGLE" */,-10 , 12/* "STRING_DOUBLE" */,-10 ),
	/* State 23 */ new Array( 10/* "CODE" */,-15 , 31/* "$" */,-15 , 13/* "IDENT" */,-15 ),
	/* State 24 */ new Array( 31/* "$" */,-1 ),
	/* State 25 */ new Array( 10/* "CODE" */,5 , 31/* "$" */,-3 ),
	/* State 26 */ new Array( 7/* ":" */,33 ),
	/* State 27 */ new Array( 7/* ":" */,-32 , 10/* "CODE" */,-32 , 6/* ";" */,-32 , 11/* "STRING_SINGLE" */,-32 , 12/* "STRING_DOUBLE" */,-32 , 9/* "&" */,-32 , 8/* "|" */,-32 , 13/* "IDENT" */,-32 ),
	/* State 28 */ new Array( 2/* "##" */,-6 , 3/* "<" */,-6 , 4/* ">" */,-6 , 1/* "^" */,-6 , 5/* "!" */,-6 , 6/* ";" */,-6 , 11/* "STRING_SINGLE" */,-6 , 12/* "STRING_DOUBLE" */,-6 ),
	/* State 29 */ new Array( 2/* "##" */,-7 , 3/* "<" */,-7 , 4/* ">" */,-7 , 1/* "^" */,-7 , 5/* "!" */,-7 , 6/* ";" */,-7 , 11/* "STRING_SINGLE" */,-7 , 12/* "STRING_DOUBLE" */,-7 ),
	/* State 30 */ new Array( 2/* "##" */,-8 , 3/* "<" */,-8 , 4/* ">" */,-8 , 1/* "^" */,-8 , 5/* "!" */,-8 , 6/* ";" */,-8 , 11/* "STRING_SINGLE" */,-8 , 12/* "STRING_DOUBLE" */,-8 ),
	/* State 31 */ new Array( 10/* "CODE" */,5 , 6/* ";" */,-14 , 11/* "STRING_SINGLE" */,-14 , 12/* "STRING_DOUBLE" */,-14 ),
	/* State 32 */ new Array( 6/* ";" */,-29 , 11/* "STRING_SINGLE" */,-29 , 12/* "STRING_DOUBLE" */,-29 , 10/* "CODE" */,-29 ),
	/* State 33 */ new Array( 9/* "&" */,-25 , 10/* "CODE" */,-25 , 6/* ";" */,-25 , 8/* "|" */,-25 , 13/* "IDENT" */,-25 , 11/* "STRING_SINGLE" */,-25 , 12/* "STRING_DOUBLE" */,-25 ),
	/* State 34 */ new Array( 10/* "CODE" */,5 , 6/* ";" */,-13 , 11/* "STRING_SINGLE" */,-13 , 12/* "STRING_DOUBLE" */,-13 ),
	/* State 35 */ new Array( 8/* "|" */,38 , 6/* ";" */,39 ),
	/* State 36 */ new Array( 6/* ";" */,-19 , 8/* "|" */,-19 ),
	/* State 37 */ new Array( 9/* "&" */,42 , 13/* "IDENT" */,27 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 , 10/* "CODE" */,-23 , 6/* ";" */,-23 , 8/* "|" */,-23 ),
	/* State 38 */ new Array( 9/* "&" */,-25 , 10/* "CODE" */,-25 , 6/* ";" */,-25 , 8/* "|" */,-25 , 13/* "IDENT" */,-25 , 11/* "STRING_SINGLE" */,-25 , 12/* "STRING_DOUBLE" */,-25 ),
	/* State 39 */ new Array( 10/* "CODE" */,-17 , 31/* "$" */,-17 , 13/* "IDENT" */,-17 ),
	/* State 40 */ new Array( 9/* "&" */,-24 , 10/* "CODE" */,-24 , 6/* ";" */,-24 , 8/* "|" */,-24 , 13/* "IDENT" */,-24 , 11/* "STRING_SINGLE" */,-24 , 12/* "STRING_DOUBLE" */,-24 ),
	/* State 41 */ new Array( 6/* ";" */,-29 , 8/* "|" */,-29 , 10/* "CODE" */,-29 ),
	/* State 42 */ new Array( 13/* "IDENT" */,27 , 11/* "STRING_SINGLE" */,20 , 12/* "STRING_DOUBLE" */,21 ),
	/* State 43 */ new Array( 9/* "&" */,-26 , 10/* "CODE" */,-26 , 6/* ";" */,-26 , 8/* "|" */,-26 , 13/* "IDENT" */,-26 , 11/* "STRING_SINGLE" */,-26 , 12/* "STRING_DOUBLE" */,-26 ),
	/* State 44 */ new Array( 9/* "&" */,-27 , 10/* "CODE" */,-27 , 6/* ";" */,-27 , 8/* "|" */,-27 , 13/* "IDENT" */,-27 , 11/* "STRING_SINGLE" */,-27 , 12/* "STRING_DOUBLE" */,-27 ),
	/* State 45 */ new Array( 6/* ";" */,-18 , 8/* "|" */,-18 ),
	/* State 46 */ new Array( 10/* "CODE" */,5 , 6/* ";" */,-20 , 8/* "|" */,-20 ),
	/* State 47 */ new Array( 10/* "CODE" */,-22 , 6/* ";" */,-22 , 8/* "|" */,-22 ),
	/* State 48 */ new Array( 10/* "CODE" */,-21 , 6/* ";" */,-21 , 8/* "|" */,-21 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 18/* def */,1 , 14/* header_code */,2 , 19/* code */,3 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array( 15/* token_assocs */,4 ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array( 20/* token_assoc */,6 , 21/* token_defs */,11 ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array( 16/* grammar_defs */,13 ),
	/* State 8 */ new Array( 21/* token_defs */,14 ),
	/* State 9 */ new Array( 21/* token_defs */,15 ),
	/* State 10 */ new Array( 21/* token_defs */,16 ),
	/* State 11 */ new Array( 23/* token_def */,17 , 22/* string */,19 ),
	/* State 12 */ new Array( 22/* string */,22 ),
	/* State 13 */ new Array( 25/* grammar_def */,23 , 17/* footer_code */,24 , 19/* code */,25 , 24/* identifier */,26 ),
	/* State 14 */ new Array( 23/* token_def */,17 , 22/* string */,19 ),
	/* State 15 */ new Array( 23/* token_def */,17 , 22/* string */,19 ),
	/* State 16 */ new Array( 23/* token_def */,17 , 22/* string */,19 ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array( 19/* code */,31 , 24/* identifier */,32 ),
	/* State 20 */ new Array(  ),
	/* State 21 */ new Array(  ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  ),
	/* State 25 */ new Array(  ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array(  ),
	/* State 28 */ new Array(  ),
	/* State 29 */ new Array(  ),
	/* State 30 */ new Array(  ),
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array( 19/* code */,34 ),
	/* State 33 */ new Array( 26/* productions */,35 , 27/* rhs */,36 , 28/* sequence */,37 ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array( 30/* symbol */,40 , 29/* rhs_prec */,41 , 24/* identifier */,43 , 22/* string */,44 ),
	/* State 38 */ new Array( 27/* rhs */,45 , 28/* sequence */,37 ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array(  ),
	/* State 41 */ new Array( 19/* code */,46 ),
	/* State 42 */ new Array( 22/* string */,47 , 24/* identifier */,48 ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array(  ),
	/* State 45 */ new Array(  ),
	/* State 46 */ new Array(  ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"def'" /* Non-terminal symbol */,
	"^" /* Terminal symbol */,
	"##" /* Terminal symbol */,
	"<" /* Terminal symbol */,
	">" /* Terminal symbol */,
	"!" /* Terminal symbol */,
	";" /* Terminal symbol */,
	":" /* Terminal symbol */,
	"|" /* Terminal symbol */,
	"&" /* Terminal symbol */,
	"CODE" /* Terminal symbol */,
	"STRING_SINGLE" /* Terminal symbol */,
	"STRING_DOUBLE" /* Terminal symbol */,
	"IDENT" /* Terminal symbol */,
	"header_code" /* Non-terminal symbol */,
	"token_assocs" /* Non-terminal symbol */,
	"grammar_defs" /* Non-terminal symbol */,
	"footer_code" /* Non-terminal symbol */,
	"def" /* Non-terminal symbol */,
	"code" /* Non-terminal symbol */,
	"token_assoc" /* Non-terminal symbol */,
	"token_defs" /* Non-terminal symbol */,
	"string" /* Non-terminal symbol */,
	"token_def" /* Non-terminal symbol */,
	"identifier" /* Non-terminal symbol */,
	"grammar_def" /* Non-terminal symbol */,
	"productions" /* Non-terminal symbol */,
	"rhs" /* Non-terminal symbol */,
	"sequence" /* Non-terminal symbol */,
	"rhs_prec" /* Non-terminal symbol */,
	"symbol" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __jscclex( info );
			
	while( true )
	{
		act = 50;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		/*
		_print( "state " + sstack[sstack.length-1] + " la = " + la + " info.att = >" +
				info.att + "< act = " + act + " src = >" + info.src.substr( info.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
		*/
		
		if( jscc_dbg_withtrace && sstack.length > 0 )
		{
			__jsccdbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( jscc_dbg_withstepbystep )
				__jsccdbg_wait();
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 50 )
		{
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 50 && la != 31 )
			{
				if( jscc_dbg_withtrace )
					__jsccdbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 50 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 50;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 50 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __jscclex( info );
			}
			
			if( act == 50 )
			{
				if( jscc_dbg_withtrace )
					__jsccdbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 50 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree generation
			if( jscc_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ la ];
				node.att = info.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __jscclex( info );
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
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
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 6:
	{
			for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_LEFT;
														}
														
														assoc_level++;
													
	}
	break;
	case 7:
	{
			for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
														{
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
															symbols[ vstack[ vstack.length - 2 ][i] ].assoc = ASSOC_RIGHT;
														}
														
														assoc_level++;
													
	}
	break;
	case 8:
	{
			for( var i = 0; i < vstack[ vstack.length - 2 ].length; i++ )
															symbols[ vstack[ vstack.length - 2 ][i] ].level = assoc_level;
																													
														assoc_level++;
													
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
															whitespace_token = create_symbol( "^", SYM_TERM, false );
															compile_regex( regex, whitespace_token, 
																( vstack[ vstack.length - 1 ].charAt( 0 ) == '\'' ) ? false : true );
														}
														else
															_error( "Double whitespace-token definition" );
													
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
	}
	break;
	case 13:
	{
			rval = create_symbol( vstack[ vstack.length - 2 ], SYM_TERM, false );
														var regex = vstack[ vstack.length - 3 ].substr( 1, vstack[ vstack.length - 3 ].length - 2 );
														symbols[rval].code = vstack[ vstack.length - 1 ];
														
														compile_regex( regex, symbols[ rval ].id, 
															( vstack[ vstack.length - 3 ].charAt( 0 ) == '\'' ) ? false : true );
													
	}
	break;
	case 14:
	{
			var regex = vstack[ vstack.length - 2 ].substr( 1, vstack[ vstack.length - 2 ].length - 2 );
														rval = create_symbol( regex.replace( /\\/g, "" ), SYM_TERM, false );
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
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 17:
	{
			var nonterm = create_symbol( vstack[ vstack.length - 4 ], SYM_NONTERM, false );
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
			rval = new Array();
														rval = rval.concat( vstack[ vstack.length - 3 ] );
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 19:
	{
			rval = new Array();
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 20:
	{
			var prod = new PROD();
														prod.id = productions.length;
														prod.rhs = vstack[ vstack.length - 3 ];
														prod.level = vstack[ vstack.length - 2 ];
														prod.code = vstack[ vstack.length - 1 ];														
														if( prod.code == "" )
															prod.code = new String( DEF_PROD_CODE );
															
														if( prod.level == 0 )
														{
															if( prod.rhs.length > 0 )
																for( var i = prod.rhs.length-1; i >= 0; i-- )
																	if( symbols[prod.rhs[i]].kind == SYM_TERM )
																	{
																		prod.level = symbols[prod.rhs[i]].level;
																		break;
																	}
														}

														productions.push( prod );
														rval = prod.id;
													
	}
	break;
	case 21:
	{
		 	var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, false ) ) > -1 )
															rval = symbols[index].level;
														else
															_error( "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
	}
	break;
	case 22:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ),
																		SYM_TERM, false ) ) > -1 )
															rval = symbols[index].level;
														else
															_error( "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
	}
	break;
	case 23:
	{
			rval = 0; 
	}
	break;
	case 24:
	{
			rval = new Array();
														rval = rval.concat( vstack[ vstack.length - 2 ] );
														rval.push( vstack[ vstack.length - 1 ] );
													
	}
	break;
	case 25:
	{
			rval = new Array(); 
	}
	break;
	case 26:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ], SYM_TERM, false ) ) > -1 )
															rval = index;
														else
															rval = create_symbol( vstack[ vstack.length - 1 ], SYM_NONTERM, false );
													
	}
	break;
	case 27:
	{
			var index;
														if( ( index = find_symbol( vstack[ vstack.length - 1 ].substr( 1, vstack[ vstack.length - 1 ].length - 2).replace( /\\/g, "" ),
																SYM_TERM, false ) ) > -1 )
															rval = index;
														else
															_error( "Call to undefined terminal \"" + vstack[ vstack.length - 1 ] + "\"" );
													
	}
	break;
	case 28:
	{
			rval = vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ].substr( 2, vstack[ vstack.length - 1 ].length - 4 ); 
	}
	break;
	case 29:
	{
			rval = new String(); 
	}
	break;
	case 30:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 31:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 32:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}


			
			if( jscc_dbg_withparsetree )
				tmptree = new Array();

			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( jscc_dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			if( jscc_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = new String();
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( act == 0 )
				break;
				
			if( jscc_dbg_withtrace )
				__jsccdbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
	}

	if( jscc_dbg_withtrace )
		__jsccdbg_print( "\nParse complete." );

	if( jscc_dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__jsccdbg_print( "\n\n--- Parse tree ---" );
			__jsccdbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__jsccdbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
	}
	
	return err_cnt;
}


function __jsccdbg_parsetree( indent, nodes, tree )
{
	var str = new String();
	for( var i = 0; i < tree.length; i++ )
	{
		str = "";
		for( var j = indent; j > 0; j-- )
			str += "\t";
		
		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att != "" )
			str += " >" + nodes[ tree[i] ].att + "<" ;
			
		__jsccdbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__jsccdbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
}



function parse_grammar( str, filename )
{
	var error_offsets = new Array();
	var error_expects = new Array();
	var error_count = 0;
	
	first_lhs = true;

	if( ( error_count += __jsccparse( str, error_offsets, error_expects ) ) > 0 )
	{
		for( i = 0; i < error_count; i++ )
			_error( filename + ", line " + ( str.substr( 0, error_offsets[i] ).match( /\n/g ) ?
				str.substr( 0, error_offsets[i] ).match( /\n/g ).length : 1 ) + 
					": Parse error near \"" 
						+ str.substr( error_offsets[i], 30 ) +
							( ( error_offsets[i] + 30 < str.substr( error_offsets[i] ).length ) ? 
								"..." : "" ) + "\", expecting \"" + error_expects[i].join() + "\"" );
	}
}
	

