// Connecting to server. Don't touch this :-) 
let socket = io();

let imageColors = ['#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08'];
// TODO: generate playerColors from imageColors
let playerColors = [['yellow', 'blue', `black`], ['red', 'green', `pink`], ['lime', 'tomato', 'orange'],['purple', 'grey', 'turquoise']];
let myPlayerIndex = 1;
let selectedColorIndex = 0;

let playerCount = 0;


let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 18px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}

$('#button1').click(function() {
    selectedColorIndex = 0;
});
$('#button1').css("background-color", playerColors[myPlayerIndex][0]);

$('#button2').click(function() {
    selectedColorIndex = 1;
});
$('#button2').css("background-color", playerColors[myPlayerIndex][1]);

$('#button3').click(function() {
    selectedColorIndex = 2;
});
$('#button3').css("background-color", playerColors[myPlayerIndex][2]);

$('.cell').click(function () {
    console.log(myPlayerIndex)
    socket.emit('serverEvent', {
        type: "played",
        playerIndex: myPlayerIndex,
        selectedColorIndex: selectedColorIndex,
        cellIndex: $(this).index()
    });
    if (whosTurn == myPlayerIndex && $(this).hasClass("empty")) {

    }
});




// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', {
        type: "reset"
    });
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
        cell.css("background-color", playerColors[message.playerIndex][message.selectedColorIndex]);
        if (whosTurn >= playerCount) {
            whosTurn = 1;
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
    $('body').css("background-color", playerColors[myPlayerIndex] + "4"); // background color like playing color but less opacity

}