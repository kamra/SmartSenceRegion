let router = require('express').Router()
let rp = require('request-promise')

let simulate = require('../lib/simulate.js')

router.route('/simulate')
    .get((req, res) => {

        simulate.simulate(req, res);

    })

router.route('/simulate/getEntities')
    .get((req, res) => {
        simulate.getEntities(req, res);
    })

router.route('/simupdate')
    .patch((req, res) => {


        // Just resolving the xhr update
        res.status(200)
        res.send(true)

     


        let options = {
            uri: process.env.FIWARE_ORION + '/v2/entities/' + req.query.id + '/attrs' ,
            method: 'PATCH',
            body: req.body,
            json: true
        }

        // Updated the client with the new value

        //socket.updateSensor(req.body)


        return rp(options)
            .then(r => {
                //console.log(r)
            })

    })

module.exports = router;