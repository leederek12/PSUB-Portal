/*global $, jQuery, alert */
$(document).ready(function () {
    "use strict";
    if ($(document).width() < 1000) {
        $("div.col-md-4").removeClass("border-desktop");
        $("div.col-md-4").addClass("border-mobile");
        $("div.col-md-6").removeClass("right-left-aligned");
        $("div.col-md-6").append("<br>");
        $("div.col-md-3").removeClass("border-desktop");
        $("div.col-md-3").addClass("border-mobile");
        $("div.desktop").addClass("padding");
    }
    if ($(document).width() < 500) {
        $("div.desktop").remove();
        $("div.phone").prepend('<div class="mobile">');
        $("li.button-links").addClass("button-pad");
    }
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });
    if ($(document).width() < 989) {
        $("div.phone").removeClass("image");
        $("div.phone").addClass("drop-mobile");
        $("div.phone").removeClass("descriptions");
        
    }
    if ($(".active") === true) {
        $("a.active").removeClass("a:hover");
    }
});