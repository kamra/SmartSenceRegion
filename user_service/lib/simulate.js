
let path = require('path')
let rp = require('request-promise')


let config = require('../config/config.js')

let socket = require('../socket/connections.js')

let URL = process.env.FIWARE_ORION;

exports.simulate = function (req, res) {
    res.sendFile(path.join(__dirname + '/../utils/simulate/simulateSensor.html'));
}


exports.getEntities = function (req, res) {

    

    return rp(config.getDefaultOptions())
        .then(r => {
            res.send(r)
        })
}

exports.updateValue = function (req, res) {

    // Just resolving the xhr update
    res.status(200)
    res.send(true)


   
    let url = URL + '/v2/entities/' + req.body.id.id + '/attrs';
    

    let options = {
        uri: url,
        method: 'PATCH',
        body: {
            Temperature: {
                value: req.body.temperature.value
            }
        },
        json:true
    }

    // Updated the client with the new value
    
    socket.updateSensor(req.body)


    return rp(options)
        .then(r => {
            //console.log(r)
        })


}