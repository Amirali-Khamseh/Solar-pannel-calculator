$(document).ready(function () {
    // Add the following code inside the document ready function

    // Toggle the navbar collapse on click
    $('.navbar-toggler').click(function () {
        $('.navbar-collapse').toggleClass('show');
    });

    // Hide the navbar collapse when a link is clicked
    $('.nav-link').click(function () {
        $('.navbar-collapse').removeClass('show');
    });
});


