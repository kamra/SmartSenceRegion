let router = require('express').Router();


let wms = require('../lib/ows_cap/wms.js')


// Returning available layers to client.
router.route('/layers')
    .get((req, res) => {

    

        wms.getCapabilitiesLayers((data) => {
           
            res.status(200)
            res.send(data)
        })


    })
    

module.exports = router;