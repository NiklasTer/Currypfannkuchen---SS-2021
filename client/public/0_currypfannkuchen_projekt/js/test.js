// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Sending a userID will help to know if the message came from me or from others
let myUserID = Math.random().toString(36).substr(2, 9).toUpperCase();


// Your script starts here ------------------------------------------------------


 // Sending an event 
 socket.emit('serverEvent', myUserID, bgColor);

 
// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
    body.style.backgroundColor = message;
});
