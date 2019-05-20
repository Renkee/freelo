const express = require('express')
const axios = require('axios')
const path = require('path')
const Champion = require(path.join(__dirname, "/models/Champion.js"))

const router = express.Router()

//GET CHAMPIONS
router.get('/', (req, res) => {
	if (req.query.freelo != null) {
		Champion.find({freelo: req.query.freelo }).then(champions => {
			res.json(champions)
		})
	}
	else if (req.query.role != null) {
		Champion.find({ role: req.query.role }).then(champions => {
			res.json(champions)
		})
	} else if (req.query.name != null) {
		Champion.find({ api_name: req.query.name }).then(champion => {
			res.json(champion)
		})
	} else {
		Champion.find({})
			.sort({ name: 1 })
			.then(champions => {
				res.json(champions)
			})
	}
})
//CREATE CHAMPION CONTENT
router.put('/:_id/', async (req, res) => {
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
			res.json({msg: 'Successfully added new content with ID: ' + req.body.contentID})
		} catch (err) {
			res.json(err)
		}
	} else {
		res.json({msg: 'No content information in request.'})
	}

})


//CHANGE CHAMPIONS OR CHAMPION CONTENT
router.patch('/:_id/:contentID', async (req, res) => {
	if(req.body.content) {
		try {
			let champion = await Champion.findById(req.params._id)
			let contentToChange = champion.contents.find((content) => {return content.id == req.params.contentID});
			if(contentToChange) {
				let invalidRoles = [];
				let properties = Object.keys(req.body.content);
				const validProperties = ['title', 'text', 'span'];
				properties.forEach((property) => {
					if(validProperties.includes(property)) {
						contentToChange[property] = req.body.content[property]
					} else {
						invalidRoles.push(property)
					}
				});
				if(invalidRoles.length < properties.length) {
					champion.markModified('contents')
					await champion.save()
					res.json({msg: 'Request successfully fulfilled!', content: contentToChange})
				} else {
					res.json({msg: 'invalidRoles request', invalidRoles})
				}
			} else {
				res.json({msg: 'Content ID invalidRoles'})
			}
		} catch (err) {
			res.json(err)
		}
	} else {
		res.json({msg: 'No content in request body!'})
	}
})

router.delete('/:_id', async (req, res) => {
	if(req.body.contentID) {
		try {
			let champion = await Champion.findById(req.params._id)

			champion.contents = champion.contents.filter((content) => {return parseInt(content.id) !== parseInt(req.body.contentID)})
			champion.markModified('contents')
			await champion.save()
			res.json({msg: 'Content successfully deleted in ' + champion.api_name + ' with ID: ' + req.body.contentID})
		} catch (err) {
			res.json(err)
		}
	}
})

router.patch('/:_id', async (req, res) => {
	try {
		let champion = await Champion.findById(req.params._id)
		if (req.body.freelo !== undefined || req.body.power || req.body.runes || req.body.roles || req.body.swapContent) {
			let response = {};
			response['changed'] = {};
			const rollbackChampionRoles = champion.roles;
			if (typeof req.body.freelo === 'boolean') {
				champion.freelo = req.body.freelo
				response['changed']['freelo'] = req.body.freelo
			}
			if (req.body.power && typeof req.body.power === 'object') {
				champion.power[0] = req.body.power[0]
				champion.power[1] = req.body.power[1]
				champion.markModified('power')
				response['changed']['power'] = req.body.power
			}
			if (req.body.runes) {
				//?xd
			}
			if (req.body.roles) {
				champion.roles=[];
				let invalidRoles = [];
				const validRoles = ['top', 'jungle', 'middle', 'bottom', 'support'];
				req.body.roles.forEach((role) => {
					if (validRoles.includes(role)) {
						champion.roles.push(role)
					} else {
						invalidRoles.push(role)
					}
				})
				response['changed']['roles'] = champion.roles
				if(invalidRoles.length > 0) {
					response['changed']['invalidRoles'] = invalidRoles
				}
			}

			if(req.body.swapContent) {
				let temp = champion.contents[req.body.swapContent['index']]
				champion.contents[req.body.swapContent['index']] = champion.contents[req.body.swapContent['dir'] + req.body.swapContent['index']]
				champion.contents[req.body.swapContent['dir'] + req.body.swapContent['index']] = temp;
				champion.markModified('contents')
				response['changed']['swapContent'] = "Swapped position " + req.body.swapContent['index'] + " with " + req.body.swapContent['dir'] + req.body.swapContent['index'] + '.';
			}

			if(champion.roles.length === 0) {
				champion.roles = rollbackChampionRoles
			}

			await champion.save()
			response['msg'] = 'Request fulfilled'
			res.json(response)
		} else {
			res.json({ msg: 'Nothing to change!' })
		}
	} catch (err) {
		res.json(err)
	}
})

module.exports = router
