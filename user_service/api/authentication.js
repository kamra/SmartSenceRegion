let router = require('express').Router();
let rp = require('request-promise')

let User = require('../models/user.js')
let socket = require('../socket/connections.js')


//let url = process.env.FIWARE_AUTH_SKELL;
//let url = process.env.FIWARE_AUTH_ACCOUNT;


let url = process.env.FIWARE_AUTH_NEWKEYROCK;
let client_id = process.env.FIWARE_AUTH_ID_NEWKEYROCK; 
let client_secret = process.env.FIWARE_AUTH_SECRET_NEWKEYROCK;

//let url = process.env.FIWARE_AUTH_DEV;
//let client_id = process.env.FIWARE_AUTH_ID_DEV;
//let client_secret = process.env.FIWARE_AUTH_SECRET_DEV;



//let client_id = process.env.FIWARE_AUTH_ID_SKELL; // skell
//let client_id = process.env.FIWARE_AUTH_ID_ACCOUNT; // skell



//let client_secret = process.env.FIWARE_AUTH_SECRET_SKELL; // skell
//let client_secret = process.env.FIWARE_AUTH_SECRET_ACCOUNT; // skell

let OAUTH2CALLBACK = process.env.OAUTH2_CALLBACK;


router.route('/login')

    .get((req, res) => {

        res.redirect(url + '/oauth2/authorize?response_type=code&state=xyz&client_id=' + client_id + '&' +
            'redirect_uri=' + OAUTH2CALLBACK );


    })
    .post((req, res) => {

        let username = req.body.username;
        let password = req.body.password;
     
        let options = {
            uri: url + '/v1/auth/tokens',
            method: 'POST',
            body: {
                "name": username,
                "password": password 
            },
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            resolveWithFullResponse: true
        }
      
      
        rp(options)
            .then((result) => {
                let headers = result.headers;
               
                req.session.token = result.headers['x-subject-token'];
                req.session.username = username;
                req.session.authenticated = true;

                let options1 = {
                    uri: url + '/oauth2/token',
                    method: 'post',
                    headers: {
                        'Authorization': createBase(),

                        'Host': 'idm-portal',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        grant_type: 'password',
                        username: username,
                        password: password
                    },
                    json: true,
                    jar: true

                }
                rp(options1)
                    .then((ra) => {
                        req.session.OAuthToken = ra.access_token        
                        console.log(req.session)
                        res.status(200)
                        res.send("ok")

                    })

            }).catch((e) => {
                console.log(e)
                res.status(404)
                res.send(e.message)
             
            })

       
        

    })


router.route('/callbackOauth')
    .get((req, res) => {
        let code = req.query.code;
      
        let options = {
            uri: url + '/oauth2/token',
            method: 'post',
            headers: {
                'Authorization': createBase(),
              
                'Host': 'idm-portal'
            },
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: OAUTH2CALLBACK


            },
            json: true,
            jar: true

        }



        rp(options)
            .then((result) => {

                console.log(result)

                rp(url +'/user?access_token=' + result.access_token)
                    .then((user) => {
                        let u = JSON.parse(user)
                        console.log(user)
                        req.session.token = result.access_token

                        req.session.authenticated = true;
                        req.session.username = u.displayName
                        // email
                        // id
                        
                        res.status(200)
                      
                        res.redirect('/')
                    })



            })
    })



function createBase() {


    let key = client_id + ':' + client_secret;
    let base = (new Buffer(key)).toString('base64')

    return 'Basic ' + base;
}

// This was used before the keyrock was implemented.
//router.route('/register')

//    .post((req, res) => {
//        let user = new User({
//            username: req.body.username,
//            password: req.body.password,
//            email: req.body.email
//        })

//        user.save()
//            .then((e) => {
//                res.status(201)
//                res.send('success, user created')
//            }).catch((err) => {
//                res.status(500)
//                res.send('Something went wrong')
//                console.log(err)
//            })
//    })

router.route('/logout')
    .post((req, res) => {

        socket.logout(req.session.username)
        req.session.destroy();


        res.status(200)
        
        res.redirect('/')

    })

module.exports = router;