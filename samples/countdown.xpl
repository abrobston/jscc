//A rocketry launch countdown ;)
say '--- The final countdown progam ---';

do
{
	say 'Enter your starting number (it must be greater or equal 10!):';
	read count;

	if count < 10 say 'The number is lower 10!';
}
while count < 10;

say 'Starting sequence...';
while count >= 0 do
{
	write count;

	//Ignition at 3 loops before lift-off...
	if count == 3 say 'Ignition...';
	else if count == 0 say '...and lift-off!';
	count = count - 1;
}