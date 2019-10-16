jQuery(document).ready(function ($) {
    var slideCount = $('#slider ul li').length;
    var slideWidth = $('#slider ul li').width();
    var slideHeight = $('#slider ul li').height();
    var index = 0, total = slideCount;
    var sliderUlWidth = slideCount * slideWidth;


    $('#slider ul li:first-child').prependTo('#slider ul');

    function moveLeft() {

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

    page = 1;
    document.querySelector('.counter').innerHTML = (page) + ' of ' + total;
    $('a.control_prev').click(function () {
        moveLeft();
        page--;
        if (page == 0) {
            page = 10;
        }
        document.querySelector('.counter').innerHTML = (page) + ' of ' + total;

    });

    $('a.control_next').click(function () {
        moveRight();
        page++;
        if (page == 11) {
            page = 1;
        }
        document.querySelector('.counter').innerHTML = (page) + ' of ' + total;
    });



});
