const express = require('express')
const router = express.Router()
const Games = require('../models/game')
const Developers = require('../models/developers')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Games Route
router.get('/', async (req, res) => {
    let query = Games.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.releasedBefore != null && req.query.releasedBefore != '') {
        query = query.lte('releaseDate', req.query.releasedBefore)
    }
    if (req.query.releasedAfter != null && req.query.releasedAfter != '') {
        query = query.gte('releaseDate', req.query.releasedAfter)
    }
    try {
        const games = await query.exec()
        res.render('games/index', {
            games: games,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Game Route Form
router.get('/new', async ( req, res) => {
    renderNewPage(res, new Games())
})

// Create Game Route
router.post('/', async ( req, res) => {
    const game = new Games({
        title: req.body.title,
        developer: req.body.developer,
        releaseDate: new Date(req.body.releaseDate),
        rating: req.body.rating,
        description: req.body.description
    })
    saveCover(game, req.body.cover)

    try {
        const newGame = await game.save()
        // res.redirect('games/${newGame.id}')
        res.redirect('games')
    } catch {
        renderNewPage(res, game, true)
    }
})

async function renderNewPage(res, game, hasError = false) {
    try {
        const developers = await Developers.find({})
        const params = {
            developers: developers,
            game: game
        }
        if (hasError) params.errorMessage = 'Error Creating Game'
        res.render('games/new', params)
    } catch {
        res.redirect('/games')
    }
}

function saveCover(game, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        game.coverImage = new Buffer.from(cover.data, 'base64')
        game.coverImageType = cover.type
    }
}

module.exports = router