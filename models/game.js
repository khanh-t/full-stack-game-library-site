const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/gameCovers'

const gamesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    releaseDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    rating: {
        type: Number,
        required: true
    },
    coverImageName: {
        type: String,
        require: true
    },
    developer: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Developers'
    }
})

gamesSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Games', gamesSchema)
module.exports.coverImageBasePath = coverImageBasePath