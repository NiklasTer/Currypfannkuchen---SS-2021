// Connecting to server. Don't touch this :-) 
let socket = io();



socket.on('connected', function (msg) {
    console.log(msg);
});



// Incoming events 
socket.on('serverEvent', function (message) {

});
