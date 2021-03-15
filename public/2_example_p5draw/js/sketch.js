// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help to know if the message came from me or from others
let myUserID = Math.random().toString(36).substr(2, 9).toUpperCase();


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
    //console.log(mouseX, mouseY);

    // Sending an event 
    socket.emit('serverEvent', myUserID, mouseX, mouseY);
}

// Incoming events 
socket.on('serverEvent', function (user, x, y) {
    //console.log("Incoming event: ", user, x, y);
    
    if (user == myUserID) { 
      fill(128, 80);
    } else {
      fill(255, 128, 0, 100);
    }

    circle(x, y, 20);
});

