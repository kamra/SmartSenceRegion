
let router = require('express').Router()

let simulate = require('../lib/simulate.js')
let wfs = require('../lib/ows_cap/wfs.js')
let socket = require('../socket/connections.js')
let pub = require('../lib/publicSensors.js')

router.route('/v2/*')
    .patch((req, res) => {
        simulate.updateValue(req, res);
    })

router.route('/update')
    .post((req, res) => {
       
        console.log("updateReceived!")
        // Update client osv

        wfs.updateFeature(req.body);

        socket.updateSensor(req.body);

        pub.updateEntitesInClient();

        res.status(200)
       
    })

module.exports = router;