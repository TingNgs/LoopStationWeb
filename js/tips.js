jQuery(document).ready(function($) {
	var slideCount = $('#slider ul li').length;
	var slideWidth = $('#slider ul li').width();
	var slideHeight = $('#slider ul li').height();
	var tipsPage = 1;
	var index = 0,
		total = slideCount;
	var sliderUlWidth = slideCount * slideWidth;

	$('#slider ul li:first-child').prependTo('#slider ul');

	function moveLeft() {
		$('#slider ul').animate(
			{
				left: +$('#slider ul li').width()
			},
			300,
			function() {
				$('#slider ul li:last-child').prependTo('#slider ul');
				$('#slider ul').css('left', '');
			}
		);
	}

	function moveRight() {
		$('#slider ul').animate(
			{
				left: -$('#slider ul li').width()
			},
			300,
			function() {
				$('#slider ul li:first-child').appendTo('#slider ul');
				$('#slider ul').css('left', '');
			}
		);
	}

	document.querySelector('.counter').innerHTML = tipsPage + ' of ' + total;
	$('a.control_prev').click(function() {
		moveLeft();
		tipsPage--;
		if (tipsPage == 0) {
			tipsPage = 10;
		}
		document.querySelector('.counter').innerHTML =
			tipsPage + ' of ' + total;
	});
	$('a.control_next').click(function() {
		moveRight();
		tipsPage++;
		if (tipsPage == 11) {
			tipsPage = 1;
		}
		document.querySelector('.counter').innerHTML =
			tipsPage + ' of ' + total;
	});
});
