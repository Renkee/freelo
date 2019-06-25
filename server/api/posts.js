const express = require('express')
const path = require('path')
const {isAuthenticated, genLogMessage} = require(path.join(__dirname, "/helpers.js"))
const Post = require(path.join(__dirname, "/models/Post.js"))
const winston = require('winston')
const router = express.Router()

// Get posts
router.get('/', async (req, res) => {
	try {
		res.status(200).json(await Post.find())
	} catch(err) {
		winston.error(genLogMessage('/api/posts', req, {error: err}))
		res.status(500).json({message: err})
	}
})

// Create post
router.put('/', isAuthenticated, (req,res) => {
	const {title, text, patch, tags, enabled} = req.body;

	try {
		if(title && text && patch && tags) {
			const post = new Post({title, text, patch, tags, enabled: enabled || false})
			post.save()

			const message = 'Post successfully created'
			winston.info(genLogMessage('/api/posts', req, {message, post}))
			res.status(201).json({message, postID: post._id})
		} else {
			let error = 'Invalid arguments'
			winston.warn(genLogMessage('/api/posts', req, {error, arguments: req.body}))
			res.status(400).json({message: error})
		}
	} catch(err) {
		winston.error(genLogMessage('/api/posts', req, {error: err}))
		res.status(500).json({message: err})
	}
})

// Update post
router.patch('/:postID', isAuthenticated, async (req, res) => {
	try {
		let post = await Post.findById(req.params.postID)
		const validProperties = ['title', 'text', 'patch', 'tags', 'enabled'];

		Object.keys(req.body).forEach((property) => {
			if(validProperties.includes(property)) {
				post[property] = req.body[property]
			}
		})
		await post.save()

		const message = 'Post successfully changed'
		winston.info(genLogMessage('/api/posts', req, {message, post}))
		res.status(200).json({message})
	} catch(err) {
		winston.error(genLogMessage('/api/posts', req, {error: err}))
		res.status(500).json({message: err})
	}
})

// Delete post
router.delete('/:postID', isAuthenticated, async (req, res) => {
	try {
		await Post.deleteOne({_id: req.params.postID})

		const message = 'Post successfully deleted'
		winston.info(genLogMessage('/api/posts', req, {message, postID: req.params.postID}))
		res.status(200).json({message})
	} catch(err) {
		winston.error(genLogMessage('/api/posts', req, {error: err}))
		res.status(500).json({message: err})
	}
})

module.exports = router