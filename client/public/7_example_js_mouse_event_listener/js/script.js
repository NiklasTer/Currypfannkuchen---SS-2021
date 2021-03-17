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

button.addEventListener('mouseenter', mouseEnterEvent);
button.addEventListener('mouseleave', mouseLeaveEvent);
button.addEventListener('mousemove', mouseMoveEvent);
button.addEventListener('mouseup', mouseUpEvent);
button.addEventListener('mousedown', mouseDownEvent);


function mouseEnterEvent(e) {
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type);
}

function mouseLeaveEvent(e) {
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type);
}

function mouseMoveEvent(e) {
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type + " - mouse position: " + e.offsetX + " / " + e.offsetY);
}

function mouseUpEvent(e) {
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type);
}

function mouseDownEvent(e) {
    // Sending an event 
    socket.emit('serverEvent', myUserID, e.type);
}

// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
});
