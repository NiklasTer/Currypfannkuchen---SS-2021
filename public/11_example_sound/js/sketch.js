// Connecting to server. Don't touch this :-) 
let socket = io();

// In some cases it might be good to have a user name
let userName = "Hartmut";


// Your script starts here ------------------------------------------------------

let samples = [];
let keys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'z', 'h', 'u', 'j', 'k'];

function preload() {
  for (let i = 0; i < keys.length; i++) {
    samples.push(loadSound('assets/PatchArena_marimba-0' + (60 + i) + ".mp3"));
  }
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    colorMode(HSB, 360, 100, 100, 100);
    background(0);
    textSize(20);
    textAlign(CENTER, CENTER);

    for (var i = 0; i < samples.length; i++) {
        samples[i].setVolume(0.2);
    }
}

function draw() {
    fill(0, 5);
    rect(0, 0, width, height);

    fill(360, 5);
    noStroke();
    text("Type to play marimba", width/2, 50);


    for (let i = 0; i < keys.length; i++) {
        let hue = map((i*7) % 12, 0, 12, 0, 360);
        let x = map(i, 0, keys.length, 100, width - 100);
        let y = height / 2;
        if (isBlack(i)) y -= 90;

        noFill();
        stroke(hue, 80, 70, 20);
        ellipse(x, y, 80, 80);

        fill(360,10);
        noStroke();
        text(keys[i], x, y);
    }
    noStroke();
}


function keyPressed() {
    let index = keys.indexOf(key.toLowerCase());
    if (index >= 0) {
        socket.emit('serverEvent', {type:"playnote", index:index});
    }

    if (key == " ") {
        noLoop();
    }
}

// Event when connecting 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', {type:"reset"});
});


// Incoming events 
socket.on('serverEvent', function (message) {
    // console.log("Incoming event: ", user, x, y);


    if (message.type == "playnote") {
        let note = message.index;
        samples[note].play();

        let hue = map((note*7) % 12, 0, 12, 0, 360);
        let x = map(note, 0, keys.length, 100, width - 100);
        let y = height / 2;
        if (isBlack(note)) y -= 90;

        fill(hue, 80, 70);
        ellipse(x, y, 80, 80); 
    }
});


function isBlack(note) {
    let n = note % 12;
    if (n == 1 || n == 3 || n == 6 ||n == 8 ||n == 10) return true;
    return false;
}