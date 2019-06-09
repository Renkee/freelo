const express = require('express')
const path = require('path')
const {isAuthenticated} = require(path.join(__dirname, "/helpers.js"))
const Post = require(path.join(__dirname, "/models/Post.js"))

const router = express.Router()


// Get posts
router.get('/', async (req, res) => {
	try {
		res.status(200).json(await Post.find())
	} catch(err) {
		res.status(500).json({message: err})
	}
})

// Create post
router.put('/', (req,res) => {
	const {title, text, patch, tags, enabled} = req.body;

	try {
		if(title && text && patch && tags) {
			const post = new Post({title, text, patch, tags, enabled: enabled || false})
			post.save()
			res.status(200).json({message: 'Request successfully fulfilled', postID: post._id})
		} else {
			res.status(400).json({message: 'No title / text / patch / tags given in request body'})
		}
	} catch(err) {
		res.status(500).json({message: err})
	}
})

// Update post
router.patch('/:postID', async (req, res) => {
	try {
		let post = await Post.findById(req.params.postID)

		let properties = Object.keys(req.body)
		properties.forEach((property) => {
			if(['title', 'text', 'patch', 'tags', 'enabled'].includes(property)) {
				post[property] = req.body[property]
			}
		})
		await post.save()
		res.status(200).json({message: 'Request successfully fulfilled'})
	} catch(err) {
		res.status(500).json({message: err})
	}
})

// Delete post
router.delete('/:postID', async (req, res) => {
	try {
		await Post.deleteOne({_id: req.params.postID})
		res.status(200).json({message: 'Request successfully fulfilled'})
	} catch(err) {
		res.status(500).json({message: err})
	}
})

module.exports = router