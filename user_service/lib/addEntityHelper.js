let rp = require('request-promise')

let User = require('../models/user.js')

const url = 'http://smartregion.sokigo.com/fiwareproxy/local/v2/entities'

exports.addEntity = function (req, res) {

    let options = {
        uri: url,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: req.body,
        json: true


    }


    User.findOne({ username: req.body.owner.value }, (err, user) => {
        if (err) {
            res.status(500)
            console.log(err)
            console.log('Something went wrong')
            res.send('Something went wrong')
        } else {

            user.entities.push({type: req.body.type, id: req.body.id})

           

            user.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.status(500)
                    res.send('Something went wrong')
                }

            })
                
        }
    })

    return rp(options)
        .then(r => {

            res.status(201)
            res.send('success')

            
        }).catch(err => {
            console.log(err)
            res.status(500)
            
        })

}

