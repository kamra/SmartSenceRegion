let router = require('express').Router();
let rp = require('request-promise')


let addEntity = require('../lib/addEntityHelper.js')
let auth = require('../lib/authMiddleware.js');
let config = require('../config/config.js')
let Attribute = require('../models/Attribute.js')
let builder = require('../lib/objectBuilder.js')
let WFS = require('../lib/ows_cap/wfs.js')
let pub = require('../lib/publicSensors.js')
let socket = require('../socket/connections.js')

let URL = process.env.FIWARE_ORION;
let URL_KEYROCK = process.env.FIWARE_AUTH_NEWKEYROCK;
let CLIENT_ID = process.env.FIWARE_AUTH_ID_NEWKEYROCK;



/**
 * 
 * 
 * 
 * There are two different tokes used. One if for keyrock actions and one is for orion and actuator actions. 
 * 
 * @req.session.token = This is the auth_token from keyrock and is used to add and delete iot agents in keyrock. Retreived upon login.
 * 
 * @req.session.OAuthToken = This is the OAuth2 token received when loggin in to keyrock and is used to validate against the actuator and orion.
 * 
 * This is due to the PEP Proxy only validating oauth2 tokens but the keyrock only validates auth_tokens for its own actions for some reason. Keep this
 * in mind when adding more features. 
 * I found the easiest why to debug this was to download the source code and trace the calls to see how the app handles the tokens.
 * 
 * 
 * 
 * */


// Insert auth middleware here 
router.use(auth.isAuthenticated)


// Adding a sensor and adding a feature in the corresponding layer in the ows
router.route('/addentity')

    .post((req, res) => {
        let username = req.session.username;
        WFS.addFeatureToLayer(req.body)

        let options = {
            uri: URL_KEYROCK + '/v1/applications/' + CLIENT_ID + '/iot_agents',
            headers: {
                'x-auth-token': req.session.token,
                'content-type': 'application/json'
            },
            json: true,
            method: 'POST'

        }

        rp(options)
            .then((r) => {

               
                if (req.body.provApp != undefined) {

                    let options = {
                        uri: 'http://130.240.134.131:3090/SSRPActuator/registry/registerContext',
                        headers: {
                            'x-auth-token': req.session.OAuthToken, 
                            'content-type': 'application/json'
                        },
                        body: builder.registerContext(req.body.contextElements[0], r.iot.id, r.iot.password, req.body.provApp),
                        json: true,
                        method: 'POST'

                    }

                    console.log(options.body.contextRegistrations[0].credential)
                    console.log(req.session)
                    

                    rp(options)
                        .then((result) => {
                            console.log("Register Response")
                            console.log(result)
                        }).catch((e) => {
                            console.log(e.message)
                        })


                }


                req.body.contextElements[0].attributes.push({ "name": "keyrock_id", "type": "String", "value": r.iot.id })
                req.body.contextElements[0].attributes.push({ "name": "keyrock_password", "type": "String", "value": r.iot.password })


                let options = {
                    uri: URL + '/v1/updateContext',

                    headers: {
                        'content-type': 'application/json',
                        'x-auth-token': req.session.OAuthToken

                    },
                    json: true,
                    body: builder.updateContext(req.body, username),
                    method: 'POST',
                    rejectUnauthorized: false

                }

                

                rp(options)
                    .then((r) => {

                        let resBody = r;


                        console.log(r)
                        let options = {
                            uri: URL + '/v2/subscriptions',

                            headers: {
                                'content-type': 'application/json',
                                'x-auth-token': req.session.OAuthToken

                            },
                            json: true,
                            body: builder.subscriptionContext(req.body),
                            method: 'POST',
                            rejectUnauthorized: false

                        }

                        rp(options)
                            .then((r) => {

                                pub.updateEntitesInClient()
                                res.status(200)
                                res.send(resBody)

                            }).catch((e) => {
                                console.log(e)
                            })



                    }).catch((e) => {
                        console.log(e)
                    })


            }).catch((e) => {
                console.log(e)
            })
    })



router.route('/keyrockadd')
    .post((req, res) => {
        console.log("Add agent in keyrock")


    })

router.route('/changeentity')
    .post((req, res) => {

        let user = req.session.username;

        pub.getSingleEntity(req, req.body.contextElements[0].id, function (delObj) {
            let obj = {};
            obj.id = req.body.contextElements[0].id;

            req.body.contextElements[0].attributes.forEach((e) => {
                obj[e.name] = e.value;
            })





            WFS.deleteFeature(delObj, () => {

                WFS.addFeatureToLayer(req.body)
            })



            let options = {
                uri: URL + '/v1/updateContext',

                headers: {
                    'content-type': 'application/json',
                    'x-auth-token': req.session.OAuthToken

                },
                json: true,
                body: builder.updateContext(req.body, username),
                method: 'POST'

            }


            rp(options)
                .then((r) => {


                    pub.updateEntitesInClient()
                    res.status(200)
                    res.send(r)


                })

        });


    })

// Removes feature both in fiware and OWS
router.route('/deleteentity')
    .post((req, res) => {

        req.body.forEach((e) => {

            WFS.deleteFeature(e, () => {

            });


            let options = {
                uri: URL + '/v2/entities/' + e.id,
                headers: {

                    'x-auth-token': req.session.OAuthToken

                },
                method: 'DELETE',
                json: true
            }


            rp(options)
                .then((r) => {

                    pub.updateEntitesInClient()
                    res.status(200)
                    res.send('deleted')

                    
                    if (e.keyrock_id === undefined) {
                        return
                    }
                   
                   
                    let options = {
                        uri: URL_KEYROCK + '/v1/applications/' + CLIENT_ID + '/iot_agents/' + e.keyrock_id.value,
                        headers: {
                            'x-auth-token': req.session.token
                        },
                        method: 'DELETE',
                        json: true
                    }

                    rp(options)
                        .then((r) => {
                            

                        })
                   

                }).catch((e) => {
                    console.log(e)
                })

        })
        

    })
router.route('/customnotification')
    .post((req, res) => {


        res.status(200)


        let options = {
            uri: URL + '/v2/subscriptions',

            headers: {
                'content-type': 'application/json',
                'x-auth-token': req.session.OAuthToken

            },
            json: true,
            body: builder.customNotificationObject(req.body),
            method: 'POST'

        }

        rp(options)
            .then((r) => {


                res.send(r)
                res.status(200)

            }).catch((e) => {
                console.log(e)
            })



    })




module.exports = router;



