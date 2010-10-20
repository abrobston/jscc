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
///SV: it is no reason to optimize data size, so we may use array of bool directly in code

function BitSetBool(size)
{
	this.data=new Array((size>0)?size:0);
}

BitSetBool.prototype={
	set:function(bit,state)
	{
		return this.data[bit]=state;
	},
	get:function(bit)
	{
		return this.data[bit];
	},
	count:function()
	{
		var i, c = 0;

		for( i = 0; i < this.data.length; i++ )
			if( this.data[i] )
				c++;
		return c;
	}
}

var BitSet=BitSetBool;

///SV: this functions used before deleting them call from code
function bitset_create(size)
{
	return new BitSet(size);
}
function bitset_set( bitset, bit, state )
{
	return bitset.set(bit,state);
}
function bitset_get( bitset, bit )
{
	return bitset.get(bit);
}
function bitset_count(bitset)
{
	return bitset.count();
}

