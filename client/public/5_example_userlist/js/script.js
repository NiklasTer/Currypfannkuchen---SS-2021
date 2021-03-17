// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

let content = document.getElementById("content");


// Incoming events 
socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);
});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    console.log("New users event: ");
    console.log("That's me: " + myID);
    console.log("My index in the list: " + myIndex);
    console.log("That's the new users: ");
    console.log(userList);

    let htmlText = "That's me: " + myID + "<br><br>";
    for (var i = 0; i < userList.length; i++) {
        let connectionDate = new Date(userList[i].since);
        htmlText += userList[i].id + " is connected since " + connectionDate.toLocaleString() + "<br>";
    }

    content.innerHTML = htmlText;
});

