// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
  console.log(msg);
});
// Sending a userID will help to know if the message came from me or from others
let myUserID = Math.random().toString(36).substr(2, 9).toUpperCase();
// Aufrufen des Bildes
var img = new Image();
img.crossOrigin = 'anonymous';
img.src = './assets/Schmetterling.png';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};


socket.on('connected', function (msg) {
    console.log(msg);
});

// Incoming events 
socket.on('serverEvent', function (message) {});
// Pixel-Farb-Erkenner
var hoveredColor = document.getElementById('hovered-color');
var selectedColor = document.getElementById('selected-color');


function pick(event, destination) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;

	const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
	destination.style.background = rgba;
	destination.textContent = rgba;

	return rgba;
}

canvas.addEventListener('mousemove', function(event) {
	pick(event, hoveredColor);
});
canvas.addEventListener('click', function(event) {
	pick(event, selectedColor);
});