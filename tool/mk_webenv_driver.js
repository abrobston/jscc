//Utlity to convert drivers to a string to be copied into the web-environment
//(c) 2008 by Jan Max Meyer

var line;
var str	= new String();
var stdin = WScript.StdIn;

while( !stdin.AtEndOfStream )
{
	line =  new String();
	
	while( !stdin.AtEndOfLine && !stdin.AtEndOfStream )
		str += stdin.Read(1);

	if( !stdin.AtEndOfStream )
		stdin.SkipLine();
	
	str += line + "\n";
}

str = str.replace( /\/~.*~\//g, "" );
str = str.replace( /##PREFIX##/g, "" );
str = str.replace( /\\/g, "\\\\" );
str = str.replace( /\"/g, "\\\"" );
str = str.replace( /\n/g, "\\n" );
str = str.replace( /\t/g, "\\t" );
//str = str.replace( /</g, "&lt;" );
//str = str.replace( />/g, "&gt;" );

WScript.Echo( str );
