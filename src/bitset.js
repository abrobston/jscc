/* -MODULE----------------------------------------------------------------------
JS/CC LALR(1) Parser Generator
Copyright (C) 2007-2012 by Phorward Software Technologies, Jan Max Meyer
http://jscc.phorward-software.com ++ contact<<AT>>phorward-software<<DOT>>com

File:	bitset.js
Author:	Jan Max Meyer
Usage:	Bitset functionalities implemented in JavaScript.

You may use, modify and distribute this software under the terms and conditions
of the BSD license. Please see LICENSE for more information.
----------------------------------------------------------------------------- */
///SV: it is no reason to optimize data size, so we may use array of bool directly in code
function BitSetBool(size){
	this.data=[];
}
BitSetBool.prototype = {
	set:function(bit,state){
		return this.data[bit]=(state&&true)||false;
	},
	get:function(bit){
		return this.data[bit];
	},
	count:function(){
		var i, c = 0;
		for( i = 0; i < this.data.length; i++ )
			if( this.data[i] )
				c++;
		return c;
	}
}
function BitSet32(){
  this.data=[];
}
BitSet32.prototype={
  set:function(bit,state){///@TODO simplify this if possible
    this.data[bit >> 5] = (state ? (this.data[bit >> 5] | (1 << (bit & 31))) : (this.data[bit >> 5] & ~(1 << (bit & 31))));
  },
  get:function(bit){
    return ((this.data[bit >> 5] & (1 << (bit & 31)))==0) ? false : true;
  },
  count:function(){
    var i,l,c=0;
    for(i=0,l=this.data.length*32;i<l;i++)
      if(this.get(i))c++;
    return c;
  }
};

function BitSetTest(size){
	this.size=size;
	this.b=new BitSetBool(size);
	this.i32=new BitSet32(size);
	}
BitSetTest.prototype={
	set:function(bit,state){
		var b=this.b.set(bit,state);
		this.i32.set(bit,state);
		this.test();
		return b;},
	get:function(bit){return this.b.get(bit);},
	count:function(){return this.b.count();},
	test:function(){
		for(var i=0;i<this.size;i++)
			if(((this.b.get(i)&&true)||false)!==((this.i32.get(i)&&true)||false)){
				_print("\nDifference: index="+i+"\tBooL="+this.b.get(i)+"\t I32="+this.i32.get(i));
				throw new Error("BITSET");}
		if(this.b.count()!==this.i32.count()){
			_print("\nDifferent Counts \t Bool="+this.b.count()+"\tI32="+this.i32.count());
			throw new Error("BITSET");}
		}
	}
var BitSet=(function(){
	if((DEFAULT_DRIVER === "driver_node.js_") && false){
		var Buffer = require('buffer').Buffer;
		function BitSetBuffer(size){
			this.data=new Buffer((size+7)>>3);
		}
		BitSetBuffer.prototype={
		  set:function(bit,state){///@TODO simplify this if possible
		    this.data[bit >> 3] = (state ? (this.data[bit >> 3] | (1 << (bit & 7))) : (this.data[bit >> 3] & ~(1 << (bit & 7))));
		  },
		  get:function(bit){
			if(this.gets>10000)throw new Error("LIMIT");
			else this.gets++;
		    return ((this.data[bit >> 3] & (1 << (bit & 7)))==0) ? false : true;
		  },
		  count:function(){
			var i,l,c=0;
		    for(i=0,l=this.data.length*8;i<l;i++)
		      if(this.get(i))c++;
		    return c;
		  },
		  gets:0
		};
		return BitSetBuffer;}
	else return BitSet32;
})();

