
let FIWARE_URL = process.env.FIWARE_ORION;

exports.getDBConnectionString = function () {
    return 'mongodb://admin:admin@ds119028.mlab.com:19028/ssr'
}

exports.getDefaultOptions = function () {
    return {

        uri: FIWARE_URL +  '/v2/entities/',
        json: true


    }
}