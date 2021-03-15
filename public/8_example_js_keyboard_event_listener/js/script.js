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

document.addEventListener('keyup', keyboardEvent);
document.addEventListener('keypress', keyboardEvent); // Tastenkombinatonen möglich
document.addEventListener('keydown', keyboardEvent);


function keyboardEvent(e) {
    console.log(e);
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type);
}


// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
});
