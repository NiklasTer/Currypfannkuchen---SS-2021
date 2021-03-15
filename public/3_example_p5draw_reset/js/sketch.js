// Connecting to server. Don't touch this :-) 
let socket = io();

// In some cases it might be good to have a user name
let userName = "Hartmut";


// Your script starts here ------------------------------------------------------


function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    fill(255, 128, 0);
}

function draw() {
    // put drawing code here
}

function mouseDragged() {
    // Sending an event 
    socket.emit('serverEvent', {type:"draw", x:mouseX, y:mouseY});
}

function keyPressed() {
    if (key == " ") {
        socket.emit('serverEvent', {type:"reset"});
    }
}

// Event when connecting 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', {type:"reset"});
});


// Incoming events 
socket.on('serverEvent', function (message) {
    // console.log("Incoming event: ", user, x, y);

    if (message.type == "reset") {
        background(255);
    }
});

// Event type "localEvent" occurs when something was send out by this script 
socket.on('localEvent', function (message) {
    // console.log("Incoming event from me: ", message);

    if (message.type == "draw") {
        fill(128, 80);
        circle(message.x, message.y, 20);
    }
});

// Event type "remoteEvent" occurs when something was send out by someone elses script 
socket.on('remoteEvent', function (message) {
    // console.log("Incoming event from outside: ", message);

    if (message.type == "draw") {
        fill(0, 128, 255, 80);
        circle(message.x, message.y, 20);
    }
});
