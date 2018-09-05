
const express = require('express')
const app = express();
const server  = require('http').Server(app)
const PORT = process.env.PORT || 8050;
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')

require('dotenv').config()

let socket = require('./socket/connections.js')
let pubSens = require('./lib/publicSensors.js')
let db = require('./lib/dBHelper.js')


// Init db connection
db.initialize()

// Body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Enabling CORS and Cookie allowance

//app.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//    res.header("Access-Control-Allow-Credentials", "true")
//    next();
//});


// Removing X-powered by header
app.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});


// Initialize socket connection
let sio = socket.socketInitializer(server);

let sessionMiddleware =session({
    name: process.env.SESSION_NAME,  // Don't use default session cookie name.
    secret: process.env.SESSION_SECRET, // should be kept secret
    saveUninitialized: true, // save/or not save a created but not modified session
    resave: true, // resave even if a request is not changing the session
    cookie: {
        secure: false, // should be true to check that we´re using HTTPS - Im not in this case
        httpOnly: true, // dont allow client script messing with the cookie
        maxAge: 1000 * 60 * 60 * 24 // will live for 1 day
    }
})


// Session socket middleware, sharing socket and session object
sio.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
})

// Session middleware
app.use(sessionMiddleware)


// Set the ENV_DEV var in .env to be logged in automatically when debugging.
app.use((req, res, next) => {
    
    if (process.env.ENV_DEV === 'true' && req.session.authenticated === undefined) {
        console.log('I dev mode')
        req.session.authenticated = true;
        req.session.username = 'test_dev'
        
        next();
    } else {
        next();
    }

})

app.use((req, res, next) => {
    
    if (req.session.authenticated === undefined ) {
        req.session.authenticated = false;
    }
    next()
})


    


// Static files
app.use(express.static('utils'))
app.use(express.static('./public/ssr_v1.0'))


app.get('/', (req, res) => {

   
    res.sendFile(path.join(__dirname + '/public/ssr_v1.0/index.html'))
    //res.sendFile(path.join(__dirname + '/public/ssr_v1.0/build/default/index.html'))
    
})


// Loading routes
app.use('/', require('./api/authentication.js'))
app.use('/map', require('./api/mapserver.js'))
app.use('/entity', require('./api/home.js'))
app.use('/', require('./api/simulation.js'))
app.use('/', require('./api/updatingSensor'))
app.use('/entity', require('./api/sensorAuthActions.js'))
app.use('/orion', require('./api/customNotificationReceiver.js'))




// Showing 404
app.use(function (request, res, next) {
    res.status(404)
    res.send('Not found')
})

// Showing 500
app.use(function (err, req, res, next) {
    console.error(err.message)
    res.status(500)
    res.send('Something went wrong')
})




server.listen(PORT, function () {
    console.log('App is listening on port: ' + PORT);
});




