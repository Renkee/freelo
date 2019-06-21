const express = require('express')
const path = require('path')
const {isAuthenticated} = require(path.join(__dirname, "/helpers.js"))
const Changelog = require(path.join(__dirname, "/models/Changelog.js"))

const router = express.Router()

// Get last 'amount' of changes
router.get('/', async (req, res) => {
	try {
		const limit = parseInt(req.query.amount) || 0 // 0 = no limit
		const changes = await Changelog.find().limit(limit)
		res.status(200).json({changes})
	}
	catch(err) {
		console.log(err)
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
	if(! missingProperties.length > 0) {
		new Changelog(changelogObject).save()
		res.status(201).json({message: 'Successfully added change'})
	} else {
		res.status(400).json({message: 'Missing arguments', missingArguments: missingProperties})
	}
})

module.exports = router
