var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');
let rp = require('request-promise')

let wms = require('../wms.js')

let OWS_URL_WFS = process.env.OWS_SERVICE_WFS;



exports.makeWFS_Insert = function(attr, id, coords) {

    let path = 'lib/ows_cap/wfs_templates/insert_' + attr + '.xml';


    fs.readFile(path, 'utf-8', function (err, data) {

        if (err) console.log(err);

        parseString(data, function (err, result) {

            if (err) console.log(err);
            let json = result;



            let temp = json["wfs:Transaction"]["wfs:Insert"][0]["tows:" + attr + "view"][0];

            temp["tows:id"] = id;
            temp["tows:geom"][0]["gml:Point"][0]["gml:coordinates"][0] = coords;


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
                    //console.log("This is from insertion")
                    //console.log(r)
                }).catch((err) => {
                    console.log(err)
                })

        });
    });

}