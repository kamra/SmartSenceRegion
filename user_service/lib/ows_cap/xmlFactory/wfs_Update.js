var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');
let rp = require('request-promise')

let wms = require('../wms.js')

let OWS_URL_WFS = process.env.OWS_SERVICE_WFS;

exports.makeWFS_Update = function (fid, attr, value) {

    
   
    let path = 'lib/ows_cap/wfs_templates/update_' + attr + '.xml';


    fs.readFile(path, 'utf-8', function (err, data) {

        if (err) console.log(err);

        parseString(data, function (err, result) {

            if (err) console.log(err);
            let json = result;

            json["wfs:Transaction"]["wfs:Update"][0]["wfs:Property"][0]["wfs:Value"] = value

            json["wfs:Transaction"]["wfs:Update"][0]["ogc:Filter"][0]["ogc:FeatureId"][0].$.fid = fid

 
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(json);
           
            let options = {
                uri: OWS_URL_WFS + 'service=wfs',
                headers: {
                    'Content-Type': 'application/xml'
                },
                method: "post",
                body: xml
            }



            rp(options)
                .then((r) => {
                    //console.log(r)
                }).catch((err) => {
                    console.log(err)
                })

        });
    });

}