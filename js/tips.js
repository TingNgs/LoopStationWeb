jQuery(document).ready(function ($) {
    var slideCount = $('#slider ul li').length;
    var slideWidth = $('#slider ul li').width();
    var slideHeight = $('#slider ul li').height();

    var sliderUlWidth = slideCount * slideWidth;

    $('#slider ul li:first-child').prependTo('#slider ul');

    function moveLeft() {
        console.log($('#slider ul li').width());
        $('#slider ul').animate(
            {
                left: +$('#slider ul li').width()
            },
            300,
            function () {
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
            function () {
                $('#slider ul li:first-child').appendTo('#slider ul');
                $('#slider ul').css('left', '');
            }
        );
    }

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });
});
