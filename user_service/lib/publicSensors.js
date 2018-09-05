let rp = require('request-promise')

let config = require('../config/config.js')
let socket = require('../socket/connections.js')

let sensors = []

let URL = process.env.FIWARE_ORION;

// Keep the public in memory for easier access. Is this retarded or can it work?
exports.getUserSensors = function (req, callback) {

    // Getting sensors that are set to public
    
    let options = {
        uri: URL + '/v2/entities?options=dateModified&limit=1000',
        headers: {
            
            'x-auth-token': req.session.OAuthToken

        },
        json: true,
        rejectUnauthorized: false
    }

    rp(options)
        .then(r => {
            let sensors = r.filter((e) => {
                if (e.visibility === undefined) {
                    return e
                } else {
                    if (e.visibility.value === "Public") {

                        return e
                    } else {
                        if (e.owner.value === req.session.username) {

                            return e;
                        }
                    }
                }
               
            })

              callback(sensors)
        })

}

exports.getSingleEntity = function (req, id, callback) {
    let options = {
        uri: URL + '/v2/entities/' + id + "?options=dateModified",
        headers: {
            
            'x-auth-token': req.session.OAuthToken

        },
        json: true,
        rejectUnauthorized: false
    }

    rp(options)
        .then(r => {

            callback(r)
        })
}

exports.updateEntitesInClient = function () {

    socket.notifyClientOnNewSensorData();
    

}