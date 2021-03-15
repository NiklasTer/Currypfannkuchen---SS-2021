// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

let randomHue = Math.round(Math.random() * 360);
let myColor = "hsl(" + randomHue + ", 100%, 50%)";

let content = document.getElementById("content");

window.addEventListener("keydown", keydownHandler);


function keydownHandler(e) {
    // Prevent browser shortcuts like going back in browser history on backspace
    e.preventDefault();

    // Sending an event
    socket.emit('serverEvent', {key:e.key, color:myColor});
}


// Incoming events 
socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.key.length == 1) {
        // If it's a single letter -> create new span element and text

        let newSpan = document.createElement('span');
        newSpan.style.color = message.color;
        let newLetter = document.createTextNode(message.key);
        newSpan.appendChild(newLetter);
        content.appendChild(newSpan);
    
    } else {
        // Otherwise it's some kind of special letter like Enter or Backspace

        if (message.key == "Backspace") {
            let lastIndex = content.childNodes.length - 1;
            if (lastIndex >= 0) {
                content.childNodes[lastIndex].remove();
            }
        }
    }

});
