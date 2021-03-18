
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

function initContext(canvasID, contextType)
{
   var canvas = document.getElementById(canvasID);
   var context = canvas.getContext(contextType);
   return context;
}

function loadImage(imageSource, context)
{
    var imageObj = new Image();
    imageObj.onload = function()
    {
        context.drawImage(imageObj, 0, 0);
        var imageData = context.getImageData(0,0,770,770);
        readImage(imageData);
    };
    imageObj.src = imageSource;
    return imageObj;
}

function readImage(imageData)
{
    

        for (var i = 0; i < imageData.length; i += 4) {
            var red = imageData[i];
            green = imageData[i + 1];
            blue = imageData[i + 2];
            alpha = imageData[i + 3];
        }
        console.log(imageData);
    console.log();
    console.log(imageData.data[0]);
}

var context = initContext('canvas','2d');
var imageObj = loadImage('./assets/Schmetterling770x770.png',context);


// //------------RGBA zu HEX Konvertieren------------------

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