const express = require('express')
const path = require('path')
const {isAuthenticated} = require(path.join(__dirname, "/helpers.js"))
const Champion = require(path.join(__dirname, "/models/Champion.js"))

const router = express.Router()


// Get champions (by freelo OR role OR name)
router.get('/', async (req, res) => {
	const possibleFilters = ['freelo', 'role', 'name']
	const chosenFilter = null
	const queryKeys = Object.keys(req.query)

	for(let i = 0; i < queryKeys; i++) {
		if(possibleFilters.includes(queryKeys[i])) {
			chosenFilter = queryKeys[i]
			break
		}
	}
	try {
		if(chosenFilter) {
			res.status(200).json({champions: await Champion.find({
				[chosenFilter === 'name' ? 'api_name' : chosenFilter]: req.query[chosenFilter]
			})})
		} else {
			res.status(200).json({champions: await Champion.find({}).sort({ name: 1 })})
		}
	} catch(err) {
		res.status(500).json({message: err})
	}
})

// Create champion content
router.put('/:_id/', isAuthenticated, async (req, res) => {
	if(req.body.content) {
		try {
			let champion = await Champion.findById(req.params._id)
			champion.contents.push({
				id: parseInt(req.body.content.contentID),
				title: req.body.content.title,
				text: req.body.content.text,
				span: 2
			})
			champion.markModified('contents')
			champion.save()
			res.status(201).json({message: 'Successfully added new content with ID: ' + req.body.contentID})
		} catch (err) {
			res.status(500).json({message: err})
		}
	} else {
		res.status(400).json({message: 'No content information in request'})
	}

})


// Change champion content
router.patch('/:_id/:contentID', isAuthenticated, async (req, res) => {
	if(req.body.content) {
		try {
			let champion = await Champion.findById(req.params._id)
			let contentToChange = champion.contents.find((content) => {return content.id == req.params.contentID});
			if(contentToChange) {
				let invalidProperties = [];
				let properties = Object.keys(req.body.content);
				const validProperties = ['title', 'text', 'span'];
				properties.forEach((property) => {
					if(validProperties.includes(property)) {
						contentToChange[property] = req.body.content[property]
					} else {
						invalidProperties.push(property)
					}
				});
				if(invalidProperties.length < properties.length) { // If any content was changed
					champion.markModified('contents')
					await champion.save()
					res.status(200).json({message: 'Content successfully changed!', content: contentToChange})
				} else {
					res.status(400).json({message: 'No valid argument found', invalidArguments: invalidProperties})
				}
			} else {
				res.status(400).json({message: 'Invalid content ID'})
			}
		} catch (err) {
			res.status(500).json({message: err})
		}
	} else {
		res.status(400).json({message: 'No content in request body!'})
	}
})

// Delete champion content
router.delete('/:_id', isAuthenticated, async (req, res) => {
	if(req.body.contentID !== undefined) {
		try {
			let champion = await Champion.findById(req.params._id)

			champion.contents = champion.contents.filter((content) => {return parseInt(content.id) !== parseInt(req.body.contentID)})
			champion.markModified('contents')
			await champion.save()
			res.status(200).json({message: 'Content successfully deleted in ' + champion.api_name + ' with ID: ' + req.body.contentID})
		} catch (err) {
			res.status(500).json({message: err})
		}
	} else {
		res.status(400).json({message: 'Invalid content ID'})
	}
})

// Change champion information
router.patch('/:_id', isAuthenticated, async (req, res) => {
	try {
		let champion = await Champion.findById(req.params._id)
		if (req.body.freelo !== undefined || req.body.power || req.body.runes || req.body.roles || req.body.swapContent) {
			let response = {};
			response['changed'] = {};

			if (typeof req.body.freelo === 'boolean') {
				champion.freelo = req.body.freelo
				response['changed']['freelo'] = req.body.freelo
			}

			if (req.body.power && req.body.power[0] && req.body.power[1]) {
				champion.power[0] = req.body.power[0]
				champion.power[1] = req.body.power[1]
				champion.markModified('power')
				response['changed']['power'] = req.body.power
			}

			if (req.body.runes) {
				// Runes are not yet implemented
			}

			if (req.body.roles) {
				const rollbackChampionRoles = champion.roles;
				champion.roles = [];
				let invalidProperties = [];
				const validRoles = ['top', 'jungle', 'middle', 'bottom', 'support'];

				req.body.roles.forEach((role) => {
					if (validRoles.includes(role)) {
						champion.roles.push(role)
					} else {
						invalidProperties.push(role)
					}
				})

				if(champion.roles.length > 0) {
					response['changed']['roles'] = champion.roles
				} else {
					champion.roles = rollbackChampionRoles
				}

				if(invalidProperties.length > 0) {
					response['changed']['invalidProperties'] = invalidProperties
				}
			}

			if(req.body.swapContent) {
				const {index, dir} = req.body.swapContent
				let temp = champion.contents[index]
				champion.contents[index] = champion.contents[index + dir]
				champion.contents[index + dir] = temp;
				champion.markModified('contents')
				response['changed']['swapContent'] = "Swapped position " + index + " with " + (index + dir) + '.';
			}

			await champion.save()
			response['msg'] = 'Request fulfilled'
			res.status(200).json({message: response})
		} else {
			res.status(400).json({ message: 'Invalid arguments' })
		}
	} catch (err) {
		res.status(500).json({message: err})
	}
})

module.exports = router
