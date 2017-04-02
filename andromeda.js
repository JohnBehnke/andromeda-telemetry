/*global require,process,console*/
var SerialPort = require('serialport');


var CONFIG = {
    port: 8081,
    dictionary: "dictionary.json",
};

var timeStamp = 0;
var startTime = 0;


////////////////////////////////////////////////////////
//// YOU WILL NEED TO CHANCE WHERE THE SERIAL PORT IS
//// USE SOMETHING LIKE THE ARDUINO TOOLS TO FIND IT
////////////////////////////////////////////////////////
var port = new SerialPort('/dev/cu.usbserial-DA00SS8O', {
    parser: SerialPort.parsers.readline('\n')
});

port.on('data', function(data) {

    updateSpacecraft(data);
    generateTelemetry();
});


var WebSocketServer = require('ws').Server,
    fs = require('fs'),
    wss = new WebSocketServer({
        port: 8081
    }),

    dictionary = JSON.parse(fs.readFileSync(CONFIG.dictionary, "utf8")),
    spacecraft = {
        "debug.message": "",
        "debug.error": "",
        "debug.phase": "",
        "sci.atg": 0,
        "sci.acclx": 0.0,
        "sci.accly": 0.0,
        "sci.acclz": 0.0,
        "sci.magx": 0.0,
        "sci.magy": 0.0,
        "sci.magz": 0.0,
        "sci.gyrox": 0.0,
        "sci.gyroy": 0.0,
        "sci.gyroz": 0.0,
        "sci.gpsHour": 0.0,
        "sci.gpsMin": 0.0,
        "sci.gpsSec": 0.0,
        "sci.gpsDay": 0.0,
        "sci.gpsMonth": 0.0,
        "sci.gpsYear": 0.0,
        "sci.gpsfix": 0.0,
        "sci.gpsFixQuality": 0.0,
        "sci.gpsLatitude": 0.0,
        "sci.gpsLongitude": 0.0,
        "sci.gpsSpeed": 0.0,
        "sci.gpsAngle": 0.0,
        "sci.gpsSatelites": 0.0,
        "sci.motora": 0.0,
        "sci.motorb": 0.0
    },
    histories = {},
    listeners = [];

function updateSpacecraft(data) {

    data = data.split(',')

    if (startTime == 0) {
        startTime = parseInt(data[1])
    } else {
        timeStamp = parseInt(data[1]) - startTime
    }

    console.log(timeStamp)
    if (data[0] == 'MESSAGE') {
        spacecraft["debug.message"] = data[2]
    }

    if (data[0] == 'ERROR') {
        spacecraft["debug.error"] = data[2]
    }

    if (data[0] == 'ALT') {

        spacecraft["sci.atg"] = parseInt(data[2])
    }

    if (data[0] == 'ACCEL') {
        // timeStamp = parseInt(data[1])
        spacecraft["sci.acclx"] = parseFloat(data[2])
        spacecraft["sci.accly"] = parseFloat(data[3])
        spacecraft["sci.acclz"] = parseFloat(data[4])
    }

    if (data[0] == 'MAG') {
        // timeStamp = parseInt(data[1])
        spacecraft["sci.magx"] = parseFloat(data[2])
        spacecraft["sci.magy"] = parseFloat(data[3])
        spacecraft["sci.magz"] = parseFloat(data[4])
    }

    if (data[0] == 'GYRO') {
        // timeStamp = parseInt(data[1])
        spacecraft["sci.gyroX"] = parseFloat(data[2])
        spacecraft["sci.gyroY"] = parseFloat(data[3])
        spacecraft["sci.gyroZ"] = parseFloat(data[4])
    }

    if (data[0] == 'GPS') {
        // timeStamp = parseInt(data[1])

        spacecraft["sci.gpsHour"] = parseFloat(data[2])
        spacecraft["sci.gpsMin"] = parseFloat(data[3])
        spacecraft["sci.gpsSec"] = parseFloat(data[4])
        spacecraft["sci.gpsDay"] = parseFloat(data[5])
        spacecraft["sci.gpsMonth"] = parseFloat(data[6])
        spacecraft["sci.gpsYear"] = parseFloat(data[7])
        spacecraft["sci.gpsFix"] = parseFloat(data[8])
        spacecraft["sci.gpsFixQuality"] = parseFloat(data[9])
        spacecraft["sci.gpsLatitude"] = parseFloat(data[10])
        spacecraft["sci.gpsLongitude"] = parseFloat(data[11])
        spacecraft["sci.gpsSpeed"] = parseFloat(data[12])
        spacecraft["sci.gpsAngle"] = parseFloat(data[13])
        spacecraft["sci.gpsLe"] = parseFloat(data[14])
        spacecraft["sci.gpsSatelites"] = parseFloat(data[15])
    }
    if (data[0] == 'MOTORA') {
        spacecraft["motora"] = parseFloat(data[2])
    }
    if (data[0] == 'MOTORB') {
        spacecraft["motorb"] = parseFloat(data[2])
    }
    if (data[0] == 'PHASE') {
        spacecraft["debug.phase"] = data[2]
    }
}

/////////////////////////////////////////////////////////
//// YOU PROBABLY DON'T NEED TO TOUCH ANYTHING DOWN HERE
////////////////////////////////////////////////////////
function generateTelemetry() {

    Object.keys(spacecraft).forEach(function(id) {
        if (true) {}
        var state = {
            timestamp: timeStamp,
            value: spacecraft[id]
        };
        histories[id] = histories[id] || []; // Initialize
        histories[id].push(state);
    });
    listeners.forEach(function(listener) {
        listener();
    });
}

function handleConnection(ws) {
    var subscriptions = {}, // Active subscriptions for this connection
        handlers = { // Handlers for specific requests
            dictionary: function() {
                ws.send(JSON.stringify({
                    type: "dictionary",
                    value: dictionary
                }));
            },
            subscribe: function(id) {
                subscriptions[id] = true;
            },
            unsubscribe: function(id) {
                delete subscriptions[id];
            },
            history: function(id) {
                ws.send(JSON.stringify({
                    type: "history",
                    id: id,
                    value: histories[id]
                }));
            }
        };

    function notifySubscribers() {
        Object.keys(subscriptions).forEach(function(id) {
            var history = histories[id];
            if (history) {
                ws.send(JSON.stringify({
                    type: "data",
                    id: id,
                    value: history[history.length - 1]
                }));
            }
        });
    }

    // Listen for requests
    ws.on('message', function(message) {
        var parts = message.split(' '),
            handler = handlers[parts[0]];
        if (handler) {
            handler.apply(handlers, parts.slice(1));
        }
    });

    // Stop sending telemetry updates for this connection when closed
    ws.on('close', function() {
        listeners = listeners.filter(function(listener) {
            return listener !== notifySubscribers;
        });
    });

    // Notify subscribers when telemetry is updated
    listeners.push(notifySubscribers);
}

wss.on('connection', handleConnection);