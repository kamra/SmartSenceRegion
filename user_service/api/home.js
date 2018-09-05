let router = require('express').Router()
let rp = require('request-promise')

let config = require('../config/config.js')
let Attribute = require('../models/Attribute.js')
let builder = require('../lib/objectBuilder.js')
let WFS = require('../lib/ows_cap/wfs.js')
let pub = require('../lib/publicSensors.js')
let mail = require('../lib/mailHandler.js')

let URL = process.env.FIWARE_ORION;


router.route('/entities')
    .get((req, res) => {
      

   
        pub.getUserSensors(req, function (e) {
            
            res.status(200)
            res.send(e);
        })
        

    })

router.route('/entity')
    .get((req, res) => {

        let sensor = pub.getSingleEntity(req, req.query.sensor, function (e) {
            res.status(200)
            res.send(e)
        })
        
    })

router.route('/attributes')
    .get((req, res) => {
        
        Attribute.find({}, (err, data) => {
            if (err) {
                console.log(err)
            } else {

                let resArray = data.map((e) => {
                    return {
                        name: e.name,
                        units: e.units,
                        type: e.type,
                        color: e.color
                    }
                })
                res.status(200)
                res.send(resArray)

            }
        })
    })




    

module.exports = router;