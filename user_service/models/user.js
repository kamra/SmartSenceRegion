let mongo = require('mongoose')

// Not used when keyrock is used. Saving anyway.
let ent = new mongo.Schema({
    type: String, 
    id: String
})



let userSchema = new mongo.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    entities: [ent]
})




let User = mongo.model('User', userSchema)

module.exports = User;