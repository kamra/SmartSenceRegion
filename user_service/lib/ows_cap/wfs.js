var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');
let rp = require('request-promise')

let wms = require('./wms.js')
let xmlInsert = require('./xmlFactory/wfs_Insert.js')
let xmlUpdate = require('./xmlFactory/wfs_Update.js')
let xmlDelete = require('./xmlFactory/wfs_Delete.js')
let fid = require('./xmlFactory/getFid.js')

let OWS_URL_WFS = process.env.OWS_SERVICE_WFS;


/*
    Adding a new feature when a new sensor is added. See layer structure in ows for details.
*/
exports.addFeatureToLayer = function (body) {
    let id = body.contextElements[0].id;
    let coords;
    body.contextElements[0].attributes.forEach((e) => {
        if (e.name === 'position') {
            coords =  e.value;
        }
    });
 
    let attrs = body.contextElements[0].attributes.map((e) => {
        if (e.name) {
            return e.name
        }
    })

   

    wms.getCapabilitiesLayers((e) => {
       
        for (let i = 0; i < attrs.length; i++) {
            for (let j = 0; j < e.length; j++) {
                if (e[j] === attrs[i]) {
                    
                    xmlInsert.makeWFS_Insert(e[j], id, coords)
                }
            }
        }
    })

}

exports.updateFeature = function (data) {

    
    let id = data.data[0].id;
    
    let attrs = Object.keys(data.data[0])
    

    wms.getCapabilitiesLayers((e) => {
        for (let i = 0; i < attrs.length; i++) {
            for (let j = 0; j < e.length; j++) {
                if (e[j] === attrs[i]) {


                    let path = 'lib/ows_cap/wfs_templates/filter_getFeature.xml';

                    let attributeValue = data.data[0][attrs[i]].value

                    fs.readFile(path, 'utf-8', function (err, data) {

                        if (err) console.log(err);

                        parseString(data, function (err, result) {

                            if (err) console.log(err);
                            let json = result;

                            json["wfs:GetFeature"]["wfs:Query"][0].$.typeName = "tows:" + attrs[i] + "view";

                            json["wfs:GetFeature"]["wfs:Query"][0]["ogc:Filter"][0]["ogc:PropertyIsEqualTo"][0]["ogc:Literal"][0] = id;




                            var builder = new xml2js.Builder();
                            var xml = builder.buildObject(json);
                            //console.log(xml)

                            let options = {
                                uri: OWS_URL_WFS + 'service=wfs&request=getfeature&version=1.0.0',
                                headers: {
                                    'Content-Type': 'application/xml'
                                },
                                method: "post",
                                body: xml
                            }

 
                            rp(options)
                                .then((r) => {
                                    fid.getFid(r,attrs[i], function (fid, attr) {
                                        xmlUpdate.makeWFS_Update(fid, attr, attributeValue)
                                    })
                                    //console.log(r)
                                }).catch((err) => {
                                    console.log(err)
                                })

                        });
                    });



                }
            }
        }
    })

    
}
exports.deleteFeature = function (data, callback) {

    //console.log(data)

    let id = data.id;

    let attrs = Object.keys(data)

    //console.log(attrs)

    wms.getCapabilitiesLayers((e) => {
        for (let i = 0; i < attrs.length; i++) {
            for (let j = 0; j < e.length; j++) {
                if (e[j] === attrs[i]) {


                    let path = 'lib/ows_cap/wfs_templates/filter_getFeature.xml';

                   

                    fs.readFile(path, 'utf-8', function (err, data) {

                        if (err) console.log(err);

                        parseString(data, function (err, result) {

                            if (err) console.log(err);
                            let json = result;

                            json["wfs:GetFeature"]["wfs:Query"][0].$.typeName = "tows:" + attrs[i] + "view";

                            json["wfs:GetFeature"]["wfs:Query"][0]["ogc:Filter"][0]["ogc:PropertyIsEqualTo"][0]["ogc:Literal"][0] = id;




                            var builder = new xml2js.Builder();
                            var xml = builder.buildObject(json);
                            //console.log(xml)

                            let options = {
                                uri: OWS_URL_WFS + 'service=wfs&request=getfeature&version=1.0.0',
                                headers: {
                                    'Content-Type': 'application/xml'
                                },
                                method: "post",
                                body: xml
                            }

                           
                            rp(options)
                                .then((r) => {
                                    fid.getFid(r, attrs[i], function (fid, attr) {
                                        
                                        xmlDelete.makeWFS_Delete(fid, attr)
                                    })
                                    //console.log(r)
                                }).catch((err) => {
                                    console.log(err)
                                })

                        });
                    });



                }
            }
        }
        callback();
       
    })
   

}








