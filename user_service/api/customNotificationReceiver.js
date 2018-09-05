
let router = require('express').Router()

let mail = require('../lib/mailHandler.js')



router.route('/notification')
    .post((req, res) => {
       

        mail.sendMailOnSensorUpdate(req.body, req.query.email);


        res.status(200)
    })





module.exports = router;