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
