#!/usr/bin/js
//Utlity to convert drivers to a string to be used as JavaScript String within
//the web-environment. This uses Spidermonkey smjs shell for execution.

var vname = new String( arguments[0] );
var str = new String( arguments[1] );

str = str.replace( /\/\*.*\*\//g, "" );
//str = str.replace( /##PREFIX##/g, "" );
str = str.replace( /\\/g, "\\\\" );
str = str.replace( /\"/g, "\\\"" );
str = str.replace( /\n/g, "\\n" );
str = str.replace( /\t/g, "\\t" );
//str = str.replace( /</g, "&lt;" );
//str = str.replace( />/g, "&gt;" );

print( "var " + vname + " = \"" + str + "\";" );
