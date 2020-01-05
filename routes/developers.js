const express = require('express')
const router = express.Router()
const Developers = require('../models/developers')
const Games = require('../models/game')

// All Developers Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const developers = await Developers.find(searchOptions)
        res.render('developers/index', {
            developers: developers, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Developer Route Form
router.get('/new', ( req, res) => {
    res.render('developers/new', { developer: new Developers() })
})

// Create Developer Route
router.post('/', async ( req, res) => {
    const developer = new Developers({
        name: req.body.name
    })
    try {
        const newDeveloper = await developer.save()
        res.redirect(`developers/${newDeveloper.id}`)
    } catch {
        res.render('developers/new', {
            developer: developer,
            errorMessage: 'Error creating developer'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const developer = await Developers.findById(req.params.id)
        const games = await Games.find({ developer: developer.id }).limit(6).exec()
        res.render('developers/show', {
            developer: developer,
            gamesByDeveloper: games
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const developer = await Developers.findById(req.params.id)
        res.render('developers/edit', { developer: developer })
    } catch {
        res.redirect('/developers')
    }
})

router.put('/:id', async (req, res) => {
    let developer
    try {
        developer = await Developers.findById(req.params.id)
        developer.name = req.body.name
        await developer.save()
        res.redirect(`/developers/${developer.id}`)
    } catch {
        if (developer == null) {
            res.redirect('/')
        } else {
            res.render('developers/edit', {
                developer: developer,
                errorMessage: 'Error updating developer'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let developer
    try {
        developer = await Developers.findById(req.params.id)
        await developer.remove()
        res.redirect('/developers')
    } catch {
        if (developer == null) {
            res.redirect('/')
        } else {
            res.redirect(`/developers/${developer.id}`)
        }
    }
})

module.exports = router