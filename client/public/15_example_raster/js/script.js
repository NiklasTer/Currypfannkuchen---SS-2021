
// Connecting to server. Don't touch this :-) 
let socket = io();

//------------globale Variablen------------------

// 
// let playerColors = ['#f80', '#08f', '#80f', '#0f8', '#8f0', '#f08']
let playerCount = 0;
let allI = ['#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08'];
let playerColors = [['yellow', 'blue', `black`], ['red', 'green', `pink`], ['lime', 'tomato', 'orange'],['purple', 'grey', 'turquoise']];
let myPlayerIndex = 1;
let selectedColorIndex = 0;


//------------Div-Grid------------------
let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 14px)");
for (let i = 0; i < gridSize*gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}
//------------Farb-Buttons------------------
$('#brush1').click(function() {
    selectedColorIndex = 0;
    $("#brush1").toggleClass("transparent");
});
$('#brush1').css("fill", playerColors[myPlayerIndex][0]);

$('#brush2').click(function() {
    selectedColorIndex = 1;
    $("#brush2").toggleClass("transparent");
});
$('#brush2').css("fill", playerColors[myPlayerIndex][1]);

$('#brush3').click(function() {
    selectedColorIndex = 2;
    $("#brush3").toggleClass("transparent");
});
$('#brush3').css("fill", playerColors[myPlayerIndex][2]);


// //------------RGBA zu HEX Konvertieren------------------
function rgbToHex(r, g, b) {
    
    if (r > 255 || g > 255 || b > 255)
    
    throw "Invalid color component";
    
    return ((r << 16) | (g << 8) | b).toString(16);
    }

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
        context.imageSmoothingEnabled = false;
        context.drawImage(imageObj, 0, 0,770,770);
        var imageData = context.getImageData(0,0,770,770);
        readImage(imageData);
        
    };
    imageObj.src = imageSource;
    return imageObj;
}

let pixelColors = [];

function readImage(imageData)
{
          for (let i = 0; i < imageData.data.length; i += 4) {
              // Iterationsnummer 4 inkorrekt - 3 besser?
            var red = imageData.data[i];
            var green = imageData.data[i+1];
            var blue = imageData.data[i+2];
            var string = "/y"
            var hex = "#" + ("000000" + rgbToHex(red, green, blue)).slice(-6) + string;
            pixelColors.push(hex);
            // pixelColors.push(string);
            
        }
        console.log(pixelColors);
      
//         console.log(imageData);
//     console.log(rgbToHex);
//     //console.log(hex);
//     console.log(imageData.data[0]);
 }

var context = initContext('canvas','2d');
var imageObj = loadImage('./assets/Schmetterling55x55px.png',context);

//------------If-Sortierung nach HEX-Codes------------------
// for (let i = 0; i < pixelColors.length; i++) {
// if (pixelColors[i] =) {
    
// }
    
// }
    


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
    $('#player-status').html("Es sind " + playerCount + " Spieler verbunden");

    $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    $('body').css("background-color", playerColors[myPlayerIndex] + "4"); 
}
