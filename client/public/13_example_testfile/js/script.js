// Connecting to server. Don't touch this :-) 
let socket = io();


let myPlayerIndex = 0;
let playerColors = ['#f80', '#08f', '#80f', '#0f8', '#8f0', '#f08']
let playerCount = 0;
// let whosTurn = 0;

let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 18px)");
for (let i = 0; i < gridSize*gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}

$('.cell').click(function() {
    console.log(myPlayerIndex)
    if (whosTurn == myPlayerIndex && $(this).hasClass("empty")) {
        // console.log(this);
        socket.emit('serverEvent', {type:"played", playerIndex:myPlayerIndex, cellIndex:$(this).index()});
    }
});


// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', {type:"reset"});
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "reset") {
        whosTurn = 0;
        $('.cell').addClass("empty");
        $('.cell').css("background-color", "white");
    }

    if (message.type == "played") {
        let cell = $('.wrapper').children()[message.cellIndex];
        cell = $(cell);
        cell.removeClass("empty");
        cell.css("background-color", playerColors[message.playerIndex]);
        whosTurn++;
        if (whosTurn >= playerCount) {
            whosTurn = 0;
        }
        updateStatus();
    }

});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    console.log("New users event: ");
    console.log("That's me: " + myID);
    console.log("My index in the list: " + myIndex);
    console.log("That's the new users: ");
    console.log(userList);

    playerCount = userList.length;
    myPlayerIndex = myIndex;

    updateStatus();
});



function updateStatus() {
    $('#player-status').html("There are " + playerCount + " players connected");

    $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    $('body').css("background-color", playerColors[myPlayerIndex]+"4"); // background color like playing color but less opacity

    // if (whosTurn == myPlayerIndex) {
    //     $('#turn-status').html("It's your turn.");
    // } else {
    //     $('#turn-status').html("Waiting for player " + (whosTurn+1) + ".");        
    // }
}
