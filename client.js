let express = require('express');
let app = express();

// get port number from arguments
let port = process.argv[2] || 3001;
app.set('port', port);
app.use('/', express.static(__dirname + '/public'));

// get topic from arguments
let myTopic = process.argv[3] || "teamplayer";
console.log("You'll listen to topic: " + myTopic);

let mqtt = require('mqtt');
let client = mqtt.connect("mqtt://mqtt.hfg.design:1883/");

let userID = Math.random().toString(36).substr(2, 9).toUpperCase();
console.log("You are user: " + userID);
let userIndex;
let connectionTimestamp = Date.now();

let usersConnected = [];
let userPings = [];


client.on('connect', function () {
    console.log("mqtt client connected");
    client.subscribe(myTopic + '/serverEvent', function (err) {});
    client.subscribe(myTopic + '/imHereEvent', function (err) {});

    // every second tell everybody (in the same topic) that i'm still here
    setInterval(function() {
        if (process.argv[4] != "invisible") {
            client.publish(myTopic + '/imHereEvent', JSON.stringify({id:userID, since:connectionTimestamp}));
        }
    }, 1000);
})



// Incoming messages from mqtt broker
client.on('message', function (topic, message) {
        
    if (topic.endsWith('/serverEvent')) {
        console.log("Incoming from mqtt: " + topic + ", " + message);
        // parse message to array
        let args = JSON.parse(message);
        // first argument of the message is the sender id
        let senderID = args.shift();
        // Sending message to browser script, no matter if the sender was me or someone else
        io.emit('serverEvent', ...args);
        // Additionally create different events for messages from me and others
        if (senderID == userID) {
            io.emit('localEvent', ...args);
        } else {
            io.emit('remoteEvent', ...args);
        }
    }

    if (topic.endsWith('/imHereEvent')) {
        // console.log("Incoming from mqtt: " + topic + ", " + message);
        message = JSON.parse(message);
        // console.log('**** user ' + message.id + ' is here since ' + message.since);

        // add a timestamp to the incoming message and store it
        message.timestamp = Date.now();
        userPings.push(message);

        // remove old pings from the list
        userPings = userPings.filter(el => el.timestamp > Date.now() - 2000);
        
        // make a new user list from the actual ping list
        let newUsersConnected = [];
        for (let i = 0; i < userPings.length; i++) {
            const ping = userPings[i];
            let foundUser = newUsersConnected.find(el => el.id == ping.id);
            if (!foundUser) newUsersConnected.push({id:ping.id, since:ping.since});
        }
        
        // sort the new list on 'since' timestamp
        newUsersConnected.sort(function(a, b) {return (a.since < b.since) ? -1 : (a.since > b.since) ? 1 : 0});

        // if the new list is different from the old one, send it out to everybody
        if (JSON.stringify(usersConnected) != JSON.stringify(newUsersConnected)) {
            console.log('Users changed!!');
            usersConnected = [...newUsersConnected];
            console.log('**** new users list:');
            for (var i = 0; i < usersConnected.length; i++) {
                console.log(usersConnected[i]);
            }
            userIndex = usersConnected.findIndex(el => el.id == userID);
            io.emit('newUsersEvent', userID, userIndex, usersConnected);
        }
    }

})

// Listen for requests
let server = app.listen(app.get('port'), function () {
    let port = server.address().port;
    console.log('Magic happens on port ' + port);
});

// Loading socket.io
let io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    // When the client connects, they are sent a message
    socket.emit('connected', 'You are connected!'); 
    console.log("User connected!");

    // as soon as the browser script is connected, ask for other connected users...
    // client.publish(myTopic + '/whosThereEvent', userID);
    // ... and send the actual list (useful if just the browser script was relaoded)
    io.emit('newUsersEvent', userID, userIndex, usersConnected);

    // Receiving message from browser script 
    socket.on('serverEvent', function () {
        // Put userID and all arguments in an array and stringify it
        let args = JSON.stringify([userID, ...arguments]);
        // Publish to mqtt
        console.log('Publishing to mqtt:', args);
        client.publish(myTopic + '/serverEvent', args);
    }); 

});
//Kommentar rqhiorfewhgiewilrughrwiul