// Connecting to server. Don't touch this :-) 
let socket = io();


// Your script starts here ------------------------------------------------------

let userNameElement = document.querySelector("#username");
let userColorElement = document.querySelector("#usercolor");
let chatMessagesElement = document.querySelector(".chat-messages");
let newMessageElement = document.querySelector("textarea#newmessage");

// Get the stored username so you don't have to type it in when reloading
userNameElement.value = localStorage.getItem('simpleChatUserName');
let userColor = textToColor(userNameElement.value);
userColorElement.style.backgroundColor = userColor;

// listen to changes in the textfield to send the message if a return happens
newMessageElement.addEventListener("input", function(e) {
    // in Chrome, a return does NOT give "insertLineBreak" but "insertText" with data = null
    if(e.inputType == "insertLineBreak" || (e.inputType == "insertText" && e.data == null)) {
        // Get text from textarea and remove spaces and return at the end
        let messageText = newMessageElement.value.trim();
        // Clear textarea
        newMessageElement.value = "";

        if (messageText != "") {
            // Get the name of the user from the input field
            let name = userNameElement.value;
            // Send the message out
            socket.emit('serverEvent', {type:"message", from:name, text:messageText, color:userColor});
        }

    }
 
});

// listen to changes of the username to store it locally
userNameElement.addEventListener("input", function(e) {
    userColor = textToColor(userNameElement.value);
    userColorElement.style.backgroundColor = userColor;
    localStorage.setItem('simpleChatUserName', username.value);
});


// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "message") {
        let now = new Date();
        now = now.toLocaleTimeString().slice(0,-3);
        let newDiv = document.createElement("div");
        newDiv.className = "message";
        newDiv.style.backgroundColor = message.color;
        // Add class "own", if the sending user was me
        if (message.from == userNameElement.value) {
            newDiv.className += " own";
            newDiv.innerHTML = "<div class='header'>" + now + "</div>"
        } else {
            newDiv.innerHTML = "<div class='header'>" + message.from + " – " + now + "</div>"
        }
        newDiv.innerHTML += "<div class='text'>" + message.text + "</div>";

        chatMessagesElement.prepend(newDiv);
        chatMessagesElement.scrollTo(0, 0);
    }

});


function textToColor(text) {
    // Remove all letters that are not 0-9, a-z or A-Z
    text = text.replaceAll(/[^0-9a-zA-Z]/g, "");
    // Parse the string as a number to base 36
    let val = parseInt(text, 36);
    // Calculate hue as a number from 0 to 359
    let hue = val % 360;
    // Use the LCH color model which tries to produce equally bright colors for every hue value
    let color = chroma.lch(70, 90, hue).hex();
    
    return color;
}