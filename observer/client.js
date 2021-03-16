var express = require('express');
var app = express();

// get port number from arguments
var port = process.argv[2] || 3001;
app.set('port', port);
app.use('/', express.static(__dirname + '/public'));

// get topic from arguments
var myTopic = process.argv[3] || "#";
console.log("You'll listen to topic: " + myTopic);

var mqtt = require('mqtt');
var client = mqtt.connect("mqtt://mqtt.hfg.design:1883/");

var userID = Math.random().toString(36).substr(2, 9).toUpperCase();
console.log("You are user: " + userID);
var userIndex;
var connectionTimestamp = Date.now();

var usersConnected = [];
// For collecting users through whosThereEvent and imHereEvent
var usersCollect = [];

client.on('connect', function () {
    console.log("mqtt client connected");
    client.subscribe(myTopic, function (err) {});

    // start constant collecting of connected users 
    setInterval(function() {
        usersCollect = [];

        // after some time, all connected users must have sent an "imHereEvent"
        setTimeout(function() {
            // Sort users on connectionTimestamp to keep order of users constant
            usersCollect.sort(function(a, b) {return (a.since < b.since) ? -1 : (a.since > b.since) ? 1 : 0});
            if (JSON.stringify(usersConnected) != JSON.stringify(usersCollect)) {
                console.log('Users changed!!');
                usersConnected = [...usersCollect];

                console.log('**** new users list:');
                //sort on topic, just for logging:
                usersCollect.sort(function(a, b) {return (a.topic < b.topic) ? -1 : (a.topic > b.topic) ? 1 : 0});
                for (var i = 0; i < usersCollect.length; i++) {
                    console.log(usersCollect[i]);
                }
            }

            io.emit('newUsersEvent', userID, -1, usersConnected);

        }, 2000);

    }, 2500);

})



// Incoming messages from mqtt broker
client.on('message', function (topic, message) {

    if (topic.endsWith('/imHereEvent')) {
        // console.log("Incoming from mqtt: " + topic + ", " + message);
        message = JSON.parse(message);
        message.topic = topic.replace("/imHereEvent", "");
        var foundUser = usersCollect.find(function(el) {return el.id == message.id});
        if (!foundUser) usersCollect.push(message);

    } else {
        // just display "normal" messages
        console.log("Incoming from mqtt: " + topic + ", " + message);
    }

})

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});

// Loading socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    // When the client connects, they are sent a message
    socket.emit('connected', 'You are connected!'); 
    console.log("User connected!");

});