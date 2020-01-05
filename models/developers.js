const mongoose = require('mongoose')
const Games = require('./game')

const developersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

developersSchema.pre('remove', function(next) {
    Games.find({ developer: this.id }, (err, games) => {
        if (err) {
            next(err)
        } else if (games.length > 0) {
            next(new Error('This developer has games still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Developers', developersSchema)