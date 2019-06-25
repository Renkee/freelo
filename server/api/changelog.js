const express = require('express')
const path = require('path')
const {isAuthenticated, genLogMessage} = require(path.join(__dirname, "/helpers.js"))
const Changelog = require(path.join(__dirname, "/models/Changelog.js"))
const winston = require('winston')

const router = express.Router()

// Get last 'amount' of changes
router.get('/', async (req, res) => {
	try {
		const limit = parseInt(req.query.amount) || 0 // 0 = no limit
		const changes = await Changelog.find().limit(limit)
		res.status(200).json({changes})
	}
	catch(err) {
		winston.error(genLogMessage('/api/changelog', req, {error: err}))
		res.status(500).json(err)
	}

})

// Create new change
router.put('/', isAuthenticated, (req, res) => {
	const requiredProperties = ['subject', 'changed_element', 'action']
	const missingProperties = []
	const changelogObject = {}
	requiredProperties.forEach((property) => {
		if(req.body[property]) {
			changelogObject[property] = req.body[property]
		} else {
			missingProperties.push(property)
		}
	})
	try {
		if(! missingProperties.length > 0) {
			new Changelog(changelogObject).save()

			const message = 'Successfully added change'
			winston.info(genLogMessage('/api/posts', req, {message, changelog: changelogObject}))
			res.status(201).json({message})
		} else {
			const error = 'Missing arguments'
			winston.warn(genLogMessage('/api/posts', req, {error, missingArguments: missingProperties}))
			res.status(400).json({message: error, missingArguments: missingProperties})
		}
	} catch(err) {
		winston.error(genLogMessage('/api/changelog', req, {error: err}))
		res.status(500).json(err)
	}
})

module.exports = router
