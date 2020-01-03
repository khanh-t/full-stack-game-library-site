const mongoose = require('mongoose')

const developersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Developers', developersSchema)