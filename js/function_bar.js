var function_page = 0;

function FunctionBarOnClick(n) {
	$('#main-function').toggleClass('hide');
	$('#back-function').toggleClass('hide');
	if (n == 0) n = function_page;
	if (n == 1) $('#timing-function').toggleClass('hide');
	function_page = n;
}


