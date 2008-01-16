/*
	Default driver template for JS/CC generated parsers for Mozilla/Rhino
	
	WARNING: Do not use for parsers that should run as browser-based JavaScript!
			 Use driver_web.js_ instead!
	
	Features:
	- Parser trace messages
	- Step-by-step parsing
	- Integrated panic-mode error recovery
	- Pseudo-graphical parse tree generation
	
	Written 2007 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2007 from driver.js_ to support Mozilla/Rhino
           by Louis P.Santillan <lpsantil@gmail.com>
	
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

function __regexdbg_print( text )
{
	print( text );
}

function __regexdbg_wait()
{
   var kbd = new java.io.BufferedReader(
                new java.io.InputStreamReader( java.lang.System[ "in" ] ) );

   kbd.readLine();
}

function __regexlex( info )
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
			return 21;

		do
		{

switch( state )
{
	case 0:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 39 ) || ( info.src.charCodeAt( pos ) >= 44 && info.src.charCodeAt( pos ) <= 45 ) || ( info.src.charCodeAt( pos ) >= 47 && info.src.charCodeAt( pos ) <= 62 ) || ( info.src.charCodeAt( pos ) >= 64 && info.src.charCodeAt( pos ) <= 90 ) || ( info.src.charCodeAt( pos ) >= 94 && info.src.charCodeAt( pos ) <= 123 ) || ( info.src.charCodeAt( pos ) >= 125 && info.src.charCodeAt( pos ) <= 254 ) ) state = 1;
		else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 4;
		else if( info.src.charCodeAt( pos ) == 43 ) state = 5;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 6;
		else if( info.src.charCodeAt( pos ) == 63 ) state = 7;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 9;
		else if( info.src.charCodeAt( pos ) == 124 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 92 ) state = 13;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 5:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 8:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 9:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 12:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 12;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 13:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 47 ) || ( info.src.charCodeAt( pos ) >= 58 && info.src.charCodeAt( pos ) <= 254 ) ) state = 11;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 12;
		else state = -1;
		match = 12;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( -1 > -1 && match == -1 );

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


function __regexparse( src, err_off, err_la )
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
	new Array( 0/* RegEx' */, 1 ),
	new Array( 14/* RegEx */, 1 ),
	new Array( 13/* Expression */, 3 ),
	new Array( 13/* Expression */, 1 ),
	new Array( 15/* Catenation */, 2 ),
	new Array( 15/* Catenation */, 1 ),
	new Array( 16/* Factor */, 2 ),
	new Array( 16/* Factor */, 2 ),
	new Array( 16/* Factor */, 2 ),
	new Array( 16/* Factor */, 1 ),
	new Array( 17/* Term */, 1 ),
	new Array( 17/* Term */, 1 ),
	new Array( 17/* Term */, 3 ),
	new Array( 19/* CharacterSet */, 3 ),
	new Array( 19/* CharacterSet */, 1 ),
	new Array( 20/* CharClass */, 2 ),
	new Array( 20/* CharClass */, 0 ),
	new Array( 18/* Character */, 1 ),
	new Array( 18/* Character */, 1 ),
	new Array( 18/* Character */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 5/* "(" */,8 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 , 7/* "[" */,12 , 9/* "ANY_CHAR" */,13 ),
	/* State 1 */ new Array( 21/* "$" */,0 ),
	/* State 2 */ new Array( 1/* "|" */,14 , 21/* "$" */,-1 ),
	/* State 3 */ new Array( 5/* "(" */,8 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 , 7/* "[" */,12 , 9/* "ANY_CHAR" */,13 , 21/* "$" */,-3 , 1/* "|" */,-3 , 6/* ")" */,-3 ),
	/* State 4 */ new Array( 21/* "$" */,-5 , 1/* "|" */,-5 , 5/* "(" */,-5 , 10/* "ASCII_CODE" */,-5 , 11/* "ESCAPED_CHAR" */,-5 , 12/* "ANY" */,-5 , 7/* "[" */,-5 , 9/* "ANY_CHAR" */,-5 , 6/* ")" */,-5 ),
	/* State 5 */ new Array( 4/* "?" */,16 , 3/* "+" */,17 , 2/* "*" */,18 , 21/* "$" */,-9 , 1/* "|" */,-9 , 5/* "(" */,-9 , 10/* "ASCII_CODE" */,-9 , 11/* "ESCAPED_CHAR" */,-9 , 12/* "ANY" */,-9 , 7/* "[" */,-9 , 9/* "ANY_CHAR" */,-9 , 6/* ")" */,-9 ),
	/* State 6 */ new Array( 2/* "*" */,-10 , 3/* "+" */,-10 , 4/* "?" */,-10 , 21/* "$" */,-10 , 1/* "|" */,-10 , 5/* "(" */,-10 , 10/* "ASCII_CODE" */,-10 , 11/* "ESCAPED_CHAR" */,-10 , 12/* "ANY" */,-10 , 7/* "[" */,-10 , 9/* "ANY_CHAR" */,-10 , 6/* ")" */,-10 ),
	/* State 7 */ new Array( 2/* "*" */,-11 , 3/* "+" */,-11 , 4/* "?" */,-11 , 21/* "$" */,-11 , 1/* "|" */,-11 , 5/* "(" */,-11 , 10/* "ASCII_CODE" */,-11 , 11/* "ESCAPED_CHAR" */,-11 , 12/* "ANY" */,-11 , 7/* "[" */,-11 , 9/* "ANY_CHAR" */,-11 , 6/* ")" */,-11 ),
	/* State 8 */ new Array( 5/* "(" */,8 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 , 7/* "[" */,12 , 9/* "ANY_CHAR" */,13 ),
	/* State 9 */ new Array( 2/* "*" */,-17 , 3/* "+" */,-17 , 4/* "?" */,-17 , 21/* "$" */,-17 , 1/* "|" */,-17 , 5/* "(" */,-17 , 10/* "ASCII_CODE" */,-17 , 11/* "ESCAPED_CHAR" */,-17 , 12/* "ANY" */,-17 , 7/* "[" */,-17 , 9/* "ANY_CHAR" */,-17 , 6/* ")" */,-17 , 8/* "]" */,-17 ),
	/* State 10 */ new Array( 2/* "*" */,-18 , 3/* "+" */,-18 , 4/* "?" */,-18 , 21/* "$" */,-18 , 1/* "|" */,-18 , 5/* "(" */,-18 , 10/* "ASCII_CODE" */,-18 , 11/* "ESCAPED_CHAR" */,-18 , 12/* "ANY" */,-18 , 7/* "[" */,-18 , 9/* "ANY_CHAR" */,-18 , 6/* ")" */,-18 , 8/* "]" */,-18 ),
	/* State 11 */ new Array( 2/* "*" */,-19 , 3/* "+" */,-19 , 4/* "?" */,-19 , 21/* "$" */,-19 , 1/* "|" */,-19 , 5/* "(" */,-19 , 10/* "ASCII_CODE" */,-19 , 11/* "ESCAPED_CHAR" */,-19 , 12/* "ANY" */,-19 , 7/* "[" */,-19 , 9/* "ANY_CHAR" */,-19 , 6/* ")" */,-19 , 8/* "]" */,-19 ),
	/* State 12 */ new Array( 8/* "]" */,-16 , 10/* "ASCII_CODE" */,-16 , 11/* "ESCAPED_CHAR" */,-16 , 12/* "ANY" */,-16 ),
	/* State 13 */ new Array( 2/* "*" */,-14 , 3/* "+" */,-14 , 4/* "?" */,-14 , 21/* "$" */,-14 , 1/* "|" */,-14 , 5/* "(" */,-14 , 10/* "ASCII_CODE" */,-14 , 11/* "ESCAPED_CHAR" */,-14 , 12/* "ANY" */,-14 , 7/* "[" */,-14 , 9/* "ANY_CHAR" */,-14 , 6/* ")" */,-14 ),
	/* State 14 */ new Array( 5/* "(" */,8 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 , 7/* "[" */,12 , 9/* "ANY_CHAR" */,13 ),
	/* State 15 */ new Array( 21/* "$" */,-4 , 1/* "|" */,-4 , 5/* "(" */,-4 , 10/* "ASCII_CODE" */,-4 , 11/* "ESCAPED_CHAR" */,-4 , 12/* "ANY" */,-4 , 7/* "[" */,-4 , 9/* "ANY_CHAR" */,-4 , 6/* ")" */,-4 ),
	/* State 16 */ new Array( 21/* "$" */,-8 , 1/* "|" */,-8 , 5/* "(" */,-8 , 10/* "ASCII_CODE" */,-8 , 11/* "ESCAPED_CHAR" */,-8 , 12/* "ANY" */,-8 , 7/* "[" */,-8 , 9/* "ANY_CHAR" */,-8 , 6/* ")" */,-8 ),
	/* State 17 */ new Array( 21/* "$" */,-7 , 1/* "|" */,-7 , 5/* "(" */,-7 , 10/* "ASCII_CODE" */,-7 , 11/* "ESCAPED_CHAR" */,-7 , 12/* "ANY" */,-7 , 7/* "[" */,-7 , 9/* "ANY_CHAR" */,-7 , 6/* ")" */,-7 ),
	/* State 18 */ new Array( 21/* "$" */,-6 , 1/* "|" */,-6 , 5/* "(" */,-6 , 10/* "ASCII_CODE" */,-6 , 11/* "ESCAPED_CHAR" */,-6 , 12/* "ANY" */,-6 , 7/* "[" */,-6 , 9/* "ANY_CHAR" */,-6 , 6/* ")" */,-6 ),
	/* State 19 */ new Array( 1/* "|" */,14 , 6/* ")" */,22 ),
	/* State 20 */ new Array( 8/* "]" */,24 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 ),
	/* State 21 */ new Array( 5/* "(" */,8 , 10/* "ASCII_CODE" */,9 , 11/* "ESCAPED_CHAR" */,10 , 12/* "ANY" */,11 , 7/* "[" */,12 , 9/* "ANY_CHAR" */,13 , 21/* "$" */,-2 , 1/* "|" */,-2 , 6/* ")" */,-2 ),
	/* State 22 */ new Array( 2/* "*" */,-12 , 3/* "+" */,-12 , 4/* "?" */,-12 , 21/* "$" */,-12 , 1/* "|" */,-12 , 5/* "(" */,-12 , 10/* "ASCII_CODE" */,-12 , 11/* "ESCAPED_CHAR" */,-12 , 12/* "ANY" */,-12 , 7/* "[" */,-12 , 9/* "ANY_CHAR" */,-12 , 6/* ")" */,-12 ),
	/* State 23 */ new Array( 8/* "]" */,-15 , 10/* "ASCII_CODE" */,-15 , 11/* "ESCAPED_CHAR" */,-15 , 12/* "ANY" */,-15 ),
	/* State 24 */ new Array( 2/* "*" */,-13 , 3/* "+" */,-13 , 4/* "?" */,-13 , 21/* "$" */,-13 , 1/* "|" */,-13 , 5/* "(" */,-13 , 10/* "ASCII_CODE" */,-13 , 11/* "ESCAPED_CHAR" */,-13 , 12/* "ANY" */,-13 , 7/* "[" */,-13 , 9/* "ANY_CHAR" */,-13 , 6/* ")" */,-13 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 14/* RegEx */,1 , 13/* Expression */,2 , 15/* Catenation */,3 , 16/* Factor */,4 , 17/* Term */,5 , 18/* Character */,6 , 19/* CharacterSet */,7 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array( 16/* Factor */,15 , 17/* Term */,5 , 18/* Character */,6 , 19/* CharacterSet */,7 ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array( 13/* Expression */,19 , 15/* Catenation */,3 , 16/* Factor */,4 , 17/* Term */,5 , 18/* Character */,6 , 19/* CharacterSet */,7 ),
	/* State 9 */ new Array(  ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array( 20/* CharClass */,20 ),
	/* State 13 */ new Array(  ),
	/* State 14 */ new Array( 15/* Catenation */,21 , 16/* Factor */,4 , 17/* Term */,5 , 18/* Character */,6 , 19/* CharacterSet */,7 ),
	/* State 15 */ new Array(  ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array(  ),
	/* State 20 */ new Array( 18/* Character */,23 ),
	/* State 21 */ new Array( 16/* Factor */,15 , 17/* Term */,5 , 18/* Character */,6 , 19/* CharacterSet */,7 ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"RegEx'" /* Non-terminal symbol */,
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


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __regexlex( info );
			
	while( true )
	{
		act = 26;
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
		
		if( regex_dbg_withtrace && sstack.length > 0 )
		{
			__regexdbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( regex_dbg_withstepbystep )
				__regexdbg_wait();
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 26 )
		{
			if( regex_dbg_withtrace )
				__regexdbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
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
			
			while( act == 26 && la != 21 )
			{
				if( regex_dbg_withtrace )
					__regexdbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 26 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 26;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 26 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __regexlex( info );
			}
			
			if( act == 26 )
			{
				if( regex_dbg_withtrace )
					__regexdbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( regex_dbg_withtrace )
				__regexdbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 26 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree generation
			if( regex_dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ la ];
				node.att = info.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __regexlex( info );
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( regex_dbg_withtrace )
				__regexdbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
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
				__regexdbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( regex_dbg_withparsetree )
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
			
			if( regex_dbg_withparsetree )
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
				
			if( regex_dbg_withtrace )
				__regexdbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
	}

	if( regex_dbg_withtrace )
		__regexdbg_print( "\nParse complete." );

	if( regex_dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__regexdbg_print( "\n\n--- Parse tree ---" );
			__regexdbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__regexdbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
	}
	
	return err_cnt;
}


function __regexdbg_parsetree( indent, nodes, tree )
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
			
		__regexdbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__regexdbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
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

		//Compute the symbol's weight
		for( i = 0; i < created_nfas.length; i++ )
		{
			if( nfa_states[ created_nfas[i] ].edge != EDGE_FREE )
			{
				true_edges++;
				if( nfa_states[ created_nfas[i] ].edge == EDGE_CHAR )
					weight += bitset_count( nfa_states[ created_nfas[i] ].ccl );
			}
		}
		
		nfa_states[ last_nfa ].accept = accept;
		nfa_states[ last_nfa ].weight = weight * true_edges;
		
		//_print( "For symbol " + accept + " I computed the weight " + nfa_states[ last_nfa ].weight );
		
						
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
			_error( "Regular expression parse error near \"" 
					+ str.substr( error_offsets[i], 30 ) +
						( ( error_offsets[i] + 30 < str.substr( error_offsets[i] ).length ) ? 
								"..." : "" ) + "\", expecting \"" + error_expects.join() + "\"" );
	}
}

//compile_regex( "[A-Z][A-Z0-9]*", 0 );
//compile_regex( "ab|c", 1 );
//compile_regex( "[0-9]+", 1 );
//print_nfa();
//var d = create_subset( nfa_states );
//print_dfa( d );
//d = minimize_dfa( d );
//print_dfa( d );


