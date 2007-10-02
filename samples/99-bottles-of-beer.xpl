//The wonderful "99 bottles of beer"-program
bottles = 99;
do
{
	//The output will not be the prettiest, but that is limited
	//by the implementation (you can change it if you want ;))
	write bottles;

	if bottles == 1 say 'bottle of beer on the wall,';
	else say 'bottles of beer on the wall,';

	write bottles;
	if bottles == 1
		say 'bottle of beer';
	else
		say 'bottles of beer';
	
	say 'Take one down, pass it around,';
	bottles = bottles - 1;
	
	write bottles;
	if bottles == 0 say 'no more bottles of beer on the wall';
	else if bottles == 1 say 'bottle of beer on the wall';
	else say 'bottles of beer on the wall';
		
	say '';	//Empty line
}
while bottles > 0;

say 'That''s it!';