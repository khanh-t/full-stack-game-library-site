const express = require('express')
const router = express.Router()
const Games = require('../models/game')

router.get('/', async (req, res) => {
    let games
    try {
        games = await Games.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        games = []
    }
    res.render('index', { games: games })
})

module.exports = router