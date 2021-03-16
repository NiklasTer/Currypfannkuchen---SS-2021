// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help to know if the message came from me or from others
let myUserID = Math.random().toString(36).substr(2, 9).toUpperCase();


// Your script starts here ------------------------------------------------------


let body = document.querySelector("body");
var button = document.querySelector(".button")

document.addEventListener('wheel', wheelEvent);

function wheelEvent(e) {
    console.log(e.deltaY);
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.deltaY);
}

let scale = 1;

// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
    scale += message * -0.01;

    // Apply scale transform
    button.style.transform = "scale("+scale+")";
});
