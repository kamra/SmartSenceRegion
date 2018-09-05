let rp = require('request-promise')
let xml = require('xml2js').parseString

let OWS_URL_WMS = process.env.OWS_SERVICE_WMS;


// Returning getCapabilities request
exports.getCapabilitiesLayers = function (callback) {

   

    let options = {
        uri: OWS_URL_WMS + 'service=wms&request=GetCapabilities&version=1.3.0'
    }

    

    rp(options)
        .then((r) => {
          

            xml(r, { charKey: 'textContent' }, function (err, result) {
                let temp = result.WMS_Capabilities.Capability[0].Layer[0].Layer;
                //console.log(temp.length)
                let layers = []
                temp.forEach((e) => {
                    layers.push(e.Name[0])
                })

                callback(layers)

            })

        })


}