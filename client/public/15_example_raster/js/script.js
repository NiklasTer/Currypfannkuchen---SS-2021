// Connecting to server. Don't touch this :-) 
let socket = io();

//------------globale Variablen------------------


// let playerColors = ['#f80', '#08f', '#80f', '#0f8', '#8f0', '#f08']
let playerCount = 0;
let allI = ['#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08', '#0f8', '#8f0', '#f08'];
let playerColors = [
    ['#439E5F', '#7C0023', '#FFBC00'],
    ['#000200', '#E50000', '#FF8908'],
    ['#99C7F8', '#FF6600', '#910677'],
    ['#070496', '#FFFF04', '#BC0036']
];
let myPlayerIndex = 0;
let selectedColorIndex = 0;
let str = "!!!!!!!!"



//------------Div-Grid------------------
let gridSize = 55;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 14px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}


//------------Farb-Buttons------------------
$('#brush1').click(function() {
    selectedColorIndex = 0;
    $("#brush1").removeClass("transparent");
    $("#brush2").addClass("transparent");
    $("#brush3").addClass("transparent");

});
$('#brush1').css("fill", playerColors[myPlayerIndex][0]);

$('#brush2').click(function() {
    selectedColorIndex = 1;
    $("#brush2").removeClass("transparent");
    $("#brush1").addClass("transparent");
    $("#brush3").addClass("transparent");
});
$('#brush2').css("fill", playerColors[myPlayerIndex][1]);

$('#brush3').click(function() {
    selectedColorIndex = 2;
    $("#brush3").removeClass("transparent");
    $("#brush1").addClass("transparent");
    $("#brush2").addClass("transparent");  
});
$('#brush3').css("fill", playerColors[myPlayerIndex][2]);


// //------------RGBA zu HEX Konvertieren------------------
function rgbToHex(r, g, b) {

    if (r > 255 || g > 255 || b > 255)

        throw "Invalid color component";

    return ((r << 16) | (g << 8) | b).toString(16);
}


//------------Aufrufen des Bildes und Canvas------------------

function initContext(canvasID, contextType) {
    var canvas = document.getElementById(canvasID);
    var context = canvas.getContext(contextType);
    return context;
}

function loadImage(imageSource, context) {
    var imageObj = new Image();
    imageObj.onload = function () {
        context.imageSmoothingEnabled = false;
        context.drawImage(imageObj, 0, 0, 55, 55);
        var imageData = context.getImageData(0, 0, 55, 55);
        readImage(imageData);

    };
    imageObj.src = imageSource;
    return imageObj;
}

let pixelColors = [];

function readImage(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Iterationsnummer 4 inkorrekt - 3 besser?
        var red = imageData.data[i];
        var green = imageData.data[i + 1];
        var blue = imageData.data[i + 2];
        var hex = "#" + ("000000" + rgbToHex(red, green, blue)).slice(-6);
        pixelColors.push({hex:hex, str:str});
        

    }
    console.log(pixelColors);

    
    //------------If-Sortierung nach HEX-Codes------------------
    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#439e5f") {
            pixelColors[i].str = "A"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#000200") {
            pixelColors[i].str = "B"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#070496") {
            pixelColors[i].str = "C"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#99c7f8") {
            pixelColors[i].str = "D"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#e50000") {
            pixelColors[i].str = "E"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#ffff04") {
            pixelColors[i].str = "F"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#bc0036") {
            pixelColors[i].str = "G"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {      
        if (pixelColors[i].hex === "#ff6600") {
            pixelColors[i].str = "H"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        
        if (pixelColors[i].hex === "#910677") {
            pixelColors[i].str = "I"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {  
        if (pixelColors[i].hex === "#ff8908") {
            pixelColors[i].str = "J"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        if (pixelColors[i].hex === "#7c0023") {
            pixelColors[i].str = "K"
        }
    }

    for (let i = 0; i < pixelColors.length; i++) {
        if (pixelColors[i].hex === "#ffbc00") {
            pixelColors[i].str = "L"
        }
    }
}

var context = initContext('canvas', '2d');
var imageObj = loadImage('./assets/Schmetterling55x55px.png', context);




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
        //------------Abfrage ausgewählte Farbe und Abgleich mit Zellfarbe------------------
        //if (message.playerIndex ===0 && message.selectedColorIndex ===0) {
                // if (playerColors[myPlayerIndex][0] === message.cellIndex) {
                //     cell.css("background-color", playerColors[myPlayerIndex][0]);
                //}
            //     cell.css("background-color", playerColors[myPlayerIndex][0]);
            // }
            
        
     
    }
        if (whosTurn >= playerCount) {
            whosTurn = 1;
        }
        updateStatus();
    }
    // if (message.type == "played") {
    //     let cell = $('.wrapper').children()[message.cellIndex];
    //     cell = $(cell);
    //     cell.removeClass("empty");
    //     cell.css("background-color", playerColors[message.playerIndex][message.selectedColorIndex]);
    //     if (whosTurn >= playerCount) {
    //         whosTurn = 1;
    //     }
    //     updateStatus();
    // }
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

    // $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    // $('body').css("background-color", playerColors[myPlayerIndex] + "4");
}