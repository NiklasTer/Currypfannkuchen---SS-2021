// Connecting to server. Don't touch this :-) 
let socket = io();


$('.button').click(handleButtonClick);

function handleButtonClick(ev) {
    console.log(ev.target);

    let element = $(ev.target);
    
    if (element.hasClass('border')) {
        element.removeClass('border');
    } else {
        element.addClass('border');
    }
    
    //socket.emit('serverEvent', "west");
}


socket.on('connected', function (msg) {
    console.log(msg);
});

// Incoming events 
socket.on('serverEvent', function (message) {
    console.log(message);


    if (message == "süd") {
        let x = $('#button1').position().top;
        x = x + 20;
        $('#button1').css("top", x);
    }

    if (message == "nord") {
        let x = $('#button1').position().top;
        x = x - 20;
        $('#button1').css("top", x);
    }

    if (message == "ost") {
        let x = $('#button1').position().left;
        x = x - 20;
        $('#button1').css("left", x);
    }

    if (message == "west") {
        let x = $('#button1').position().left;
        x = x + 20;
        $('#button1').css("left", x);
    }

});
