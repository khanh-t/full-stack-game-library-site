const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Games = require('../models/game')
const uploadPath = path.join('public', Games.coverImageBasePath)
const Developers = require('../models/developers')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
router.post('/', upload.single('cover'), async ( req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const game = new Games({
        title: req.body.title,
        developer: req.body.developer,
        releaseDate: new Date(req.body.releaseDate),
        rating: req.body.rating,
        coverImageName: fileName, 
        description: req.body.description
    })

    try {
        const newGame = await game.save()
        // res.redirect('games/${newGame.id}')
        res.redirect('games')
    } catch {
        if (game.coverImageName != null) {
            removeGameCover(game.coverImageName)
        }
        removeGameCover(game.coverImageName)
        renderNewPage(res, game, true)
    }
})

function removeGameCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

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

module.exports = router