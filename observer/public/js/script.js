// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

let myUserID;
let myUserIndex;
let users = {};

let content = document.getElementById("content");


// Incoming events 
socket.on('serverEvent', function () {
    console.log("Incoming event: ", arguments);
    let id = arguments[0];
    let arr = [...arguments];
    arr.shift();
    //arguments.shift();
    users[id].lastMessage = JSON.stringify(arr);
    displayUsers();
});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    // console.log("New users event: ");
    // console.log("That's the new users: ");
    // console.log(userList);

    // add new users
    let newUsers = {};
    for (let i = 0; i < userList.length; i++) {
        let id = userList[i].id;
        if (!users[id]) {
            newUsers[id] = {since:userList[i].since, topic:userList[i].topic, lastMessage:""};   
        } else {
            newUsers[id] = users[id];   
        } 
    }
    users = newUsers;
    myUserID = myID;
    myUserIndex = myIndex;
    displayUsers();
});

function displayUsers() {
    let htmlText = "<h3>That's me: " + myUserID + "</h3>";

    userList = Object.entries(users);

    userList.sort((a, b) => a[1].topic > b[1].topic);

    if (userList.length > 0) {
        for (var i = 0; i < userList.length; i++) {
            let connectionDate = new Date(userList[i][1].since);
            htmlText += userList[i][0] + " | " + connectionDate.toLocaleString() + " | " + userList[i][1].topic + "<br>" + userList[i][1].lastMessage + "<br><br>";
        }
    
    } else {
        htmlText += "Nobody else is here :-("
    }

    content.innerHTML = htmlText;

}