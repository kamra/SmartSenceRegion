let rp = require('request-promise')

let sens = require('../lib/publicSensors.js')

let sockets = []
let io = null;
let url = process.env.FIWARE_AUTH_NEWKEYROCK;

let publicSensors = [];

// Initializing and loggin in a user if needed.
exports.socketInitializer = function (server) {

    io = require('socket.io')(server);

    io.on('connection', (client) => {
        sockets.push(client)
        console.log("new connection detected")
        if (client.request.session.authenticated === true) {
            login(client)
        }

        
        

        client.on('disconnect', () => {

            let temp = sockets.indexOf(client)
            sockets.splice(temp, 1)

            console.log('user disconnected')
        })

    })

    

    return io;


}


// Notifying client in entity update
exports.updateSensor = function (val) {

    io.emit('updateSensorValue', val);
}

// Tell client to re fetch the entity data
exports.notifyClientOnNewSensorData = function () {

    io.emit('getNewSensorData');
}

function login(client) {
    
    client.emit('login', client.request.session.username)
}

// Logging out the user.
exports.logout = function (user) {
    let sockets = Object.values(io.sockets.sockets)

    sockets.forEach((e) => {

        if (e.request.session.username === user) {
            console.log('Loggar ut en socket')
            delete e.request.session

        }
    })


}










