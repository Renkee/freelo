const express = require('express')
const path = require('path')
const {isAuthenticated} = require(path.join(__dirname, "/helpers.js"))
const Changelog = require(path.join(__dirname, "/models/Changelog.js"))

const router = express.Router()

// Get last 'amount' changes
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

// Add new change
router.post('/', isAuthenticated, (req, res) => {
	const test = {subject, changed_element, action} = req.body
	if(test) {
		new Changelog(test).save()
		res.status(200).json({message: 'Successfully added change'})
	} else {
		res.status(400).json({message: 'Bad arguments'})
	}
})

module.exports = router
