var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');
let rp = require('request-promise')

let wms = require('../wms.js')


// Getting the feature ID of feature in the ows.
exports.getFid = function (xml, attr, callback) {

    parseString(xml, function (err, result) {

        if (err) console.log(err);
        let json = result;

     
        
        // Make more dynamic later on.
        let fid = json["wfs:FeatureCollection"]["gml:featureMember"][0]["tows:" + attr + "view"][0].$["gml:id"];
        

        callback(fid, attr)


    });
}