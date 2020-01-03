const express = require('express')
const router = express.Router()
const Developers = require('../models/developers')

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
        // res.redirect(`developers/${newDeveloper.id}`)
        res.redirect('developers')
    } catch {
        res.render('developers/new', {
            developer: developer,
            errorMessage: 'Error creating developer'
        })
    }
})

module.exports = router