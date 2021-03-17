// Connecting to server. Don't touch this :-) 
let socket = io();
let player1color = `#f80`
let player1color2 = `#08f`
let player1color3 = '#80f'
let myPlayerIndex = 1;
let playerColors = [player1color, '#08f', '#80f', '#0f8', '#8f0', '#f08']

let playerCount = 0;
// let whosTurn = 0;

let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 18px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}

// function createButton(buttonText, color) {
//     let element = document.createElement("button");
//     element.appendChild(document.createTextNode(buttonText))
//     let page = document.getElementById("btn");
//     page.appendChild(element);

//     console.log(element);
// }


// player1color = `#f80`
// createButton("1", player1color);
// createButton("Hallo");

$('.button').click(handleButtonClick);

function handleButtonClick(ev) {
    socket.emit('serverEvent', "color2");
}


$('.cell').click(function () {
    console.log(myPlayerIndex)
    socket.emit('serverEvent', {
        type: "played",
        playerIndex: myPlayerIndex,
        cellIndex: $(this).index()
    });
    if (whosTurn == myPlayerIndex && $(this).hasClass("empty")) {
        // console.log(this);

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
        cell.css("background-color", playerColors[message.playerIndex]);
        // whosTurn++;
        if (whosTurn >= playerCount) {
            whosTurn = 1;
        }
        updateStatus();
    }

    if (message == "color2") {
        player1color=player1color2
        $('#button1').css("background-color",player1color2);
        myPlayerIndex++
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

    // if (whosTurn == myPlayerIndex) {
    //     $('#turn-status').html("It's your turn.");
    // } else {
    //     $('#turn-status').html("Waiting for player " + (whosTurn+1) + ".");        
    // }
}