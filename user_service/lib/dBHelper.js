let mongo = require('mongoose')

let config = require('../config/config.js')
let Attribute = require('../models/Attribute.js')

exports.initialize = function () {
    mongo.connect(config.getDBConnectionString())



    // Populating DB with attributes below
   

    //let tempAtt = new Attribute({
    //    name: 'Temperature',
    //    units: ['C', 'F'],
    //    type: ['Water', 'Oil', 'Air'],
    //    color: "#ff0000"
            
        
    //})

    //let humAtt = new Attribute({
    //    name: 'Humidity',
    //    units: ['%'],
    //    type: ['Air'],
    //    color: "#fffe00"
        
    //})

    //let nO2Att = new Attribute({
    //    name: 'No2',
    //    units: ['%'],
    //    type: ['Air', 'Water'],
    //    color: "#00beff"
        
    //})

    //tempAtt.save()
    //    .then((res) => {
    //        console.log(res)
    //    }).catch((err) => {
    //        console.log(err)
    //    })
    //humAtt.save()
    //    .then((res) => {
    //        console.log(res)
    //    }).catch((err) => {
    //        console.log(err)
    //    })
    //nO2Att.save()
    //    .then((res) => {
    //        console.log(res)
    //    }).catch((err) => {
    //        console.log(err)
    //    })

   

}