/*global $, jQuery, alert */
function contactSend() {
    "use strict";
    var name = $('#Name').val(),
        email = $('#Email').val(),
        device = $('#Device').val(),
        why = $('#Why').val();

    $.ajax({
        url: "https://docs.google.com/forms/d/1JDUqM1cnXcmaDClnn2bwE-9BcK_r1J8V34GEV0fXBXY/formResponse",
        data: { "entry_1505403535": email,
                "entry_1348842742": name,
                "entry_783749720": device,
                "entry_1260694824": why },
        type: "POST",
        dataType: "xml",
        statusCode: {
        }
    });
    window.alert("Thanks for signing up! We'll let you know when it's available.");
    window.location.replace("index.html");
    
}