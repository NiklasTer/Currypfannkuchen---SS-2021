
// Connecting to server. Don't touch this :-) 
let socket = io();

//------------globale Variablen------------------

let playerCount = 0;
let imageColors = ['#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08'];
let playerColors = [['yellow', 'blue', `black`], ['red', 'green', `pink`], ['lime', 'tomato', 'orange'],['purple', 'grey', 'turquoise']];
let myPlayerIndex = 1;
let selectedColorIndex = 0;


//------------Div-Grid------------------
let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 14px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}
//------------Farb-Buttons------------------
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

//------------Aufrufen des Bildes und Canvas------------------

var img = new Image();
img.crossOrigin = 'anonymous';
img.src = './assets/Schmetterling770x770.png';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};

//------------Farb-Ausleser------------------

var hoveredColor = document.getElementById('hovered-color');
var selectedColor = document.getElementById('selected-color');


// function pick(event, destination) {
//   var x = event.layerX;
//   var y = event.layerY;
//   var pixel = ctx.getImageData(0, 0, length, width);
//   var data = pixel.data;
// 	const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
// }

//------------RGBA zu HEX Konvertieren------------------

//hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);

//------------Klicken&Senden------------------

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

//------------Eingehende Aktionen------------------

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

//------------Reset/Neuer Nutzer kommt hinzu------------------

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

//------------Update-Funktion------------------

function updateStatus() {
    $('#player-status').html("There are " + playerCount + " players connected");

    $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    $('body').css("background-color", playerColors[myPlayerIndex] + "4"); 
}