let mongoose = require('mongoose')



let attrSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    units: [String],
    type: [String],
    color: {type: String, required:true, unique: true}
    
})

let Attribute = mongoose.model('Attribute', attrSchema);

module.exports = Attribute;